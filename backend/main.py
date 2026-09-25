"""
Calorie and Macronutrient Tracker - Backend
FastAPI service that proxies food-search requests to the USDA FoodData
Central API and normalizes the response into a clean, minimal shape for
the frontend.
"""

import os
from typing import Any, Dict, List, Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from indian_foods import search_indian_foods

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

load_dotenv()

USDA_API_KEY = os.getenv("USDA_API_KEY", "DEMO_KEY")
USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"

# USDA nutrient IDs we care about (per 100g base values)
NUTRIENT_IDS = {
    "calories": 1008,
    "protein": 1003,
    "fat": 1004,
    "carbs": 1005,
}

DATA_TYPES = ["Foundation", "Survey (FNDDS)", "SR Legacy"]
PAGE_SIZE = 6

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Calorie & Macronutrient Tracker API",
    description="Proxies and normalizes USDA FoodData Central search results.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _extract_nutrient_value(food_nutrients: List[Dict[str, Any]], nutrient_id: int) -> float:
    """
    Pull a specific nutrient's value out of a USDA `foodNutrients` list.

    USDA responses aren't perfectly consistent about the key name used for
    the nutrient's numeric id across dataTypes, so we check the common
    variants defensively. Returns 0.0 if the nutrient isn't present.
    """
    for nutrient in food_nutrients:
        nid = (
            nutrient.get("nutrientId")
            or nutrient.get("nutrient", {}).get("id")
            or nutrient.get("nutrientNumber")
        )
        try:
            nid = int(nid) if nid is not None else None
        except (ValueError, TypeError):
            nid = None

        if nid == nutrient_id:
            value = nutrient.get("value")
            if value is None:
                value = nutrient.get("amount")
            try:
                return round(float(value), 1)
            except (ValueError, TypeError):
                return 0.0
    return 0.0


def _normalize_food(item: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Convert one raw USDA food record into our clean response shape."""
    food_nutrients = item.get("foodNutrients", [])
    if not food_nutrients:
        return None

    name = item.get("description")
    fdc_id = item.get("fdcId")
    if not name or fdc_id is None:
        return None

    return {
        "id": fdc_id,
        "name": name.title() if name.isupper() else name,
        "serving_size_g": 100,
        "calories": _extract_nutrient_value(food_nutrients, NUTRIENT_IDS["calories"]),
        "protein": _extract_nutrient_value(food_nutrients, NUTRIENT_IDS["protein"]),
        "fat": _extract_nutrient_value(food_nutrients, NUTRIENT_IDS["fat"]),
        "carbs": _extract_nutrient_value(food_nutrients, NUTRIENT_IDS["carbs"]),
        "source": "usda",
    }


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/api/foods/search")
async def search_foods(query: str = Query(..., min_length=1, description="Food name to search for")):
    """
    Search for foods matching `query` and return a normalized list of
    results with per-100g macro values.

    Two sources are combined:
      1. A small local dataset of common Indian dishes (dal, sabji, roti,
         biryani, etc.) that USDA barely covers.
      2. USDA FoodData Central, for everything else.

    Local matches are returned first since they're usually the more
    relevant hit for a home-cooked dish name. If USDA itself fails (rate
    limit, network issue, etc.) we don't fail the whole request as long as
    we have at least some local matches to show — we only raise if there's
    nothing to return at all.
    """
    local_results = search_indian_foods(query, limit=PAGE_SIZE)

    params = {
        "api_key": USDA_API_KEY,
        "query": query,
        "dataType": DATA_TYPES,
        "pageSize": PAGE_SIZE,
    }

    usda_error: Optional[HTTPException] = None
    usda_results: List[Dict[str, Any]] = []

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(USDA_SEARCH_URL, params=params)

        if response.status_code != 200:
            detail = response.text
            try:
                detail = response.json().get("error", {}).get("message", detail)
            except Exception:
                pass
            usda_error = HTTPException(
                status_code=response.status_code,
                detail=f"USDA API error: {detail}",
            )
        else:
            try:
                payload = response.json()
            except ValueError as exc:
                usda_error = HTTPException(
                    status_code=502, detail="USDA API returned an invalid response."
                )
            else:
                raw_foods = payload.get("foods", [])
                usda_results = [
                    normalized
                    for f in raw_foods
                    if (normalized := _normalize_food(f)) is not None
                ]
    except httpx.RequestError as exc:
        usda_error = HTTPException(
            status_code=502,
            detail=f"Could not reach USDA FoodData Central: {exc}",
        )

    combined = local_results + usda_results

    if not combined and usda_error is not None:
        # Nothing local, and USDA itself failed — surface the real error.
        raise usda_error

    return {"results": combined}


@app.get("/api/health")
async def health_check():
    """Simple health-check endpoint."""
    return {"status": "ok"}
