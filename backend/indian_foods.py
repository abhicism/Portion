"""
Curated local dataset of common Indian dishes and staples.

USDA FoodData Central is built around US ingredients/packaged foods and has
very little coverage of Indian home-cooked dishes (dal, sabji, roti, etc.).
This local dataset fills that gap so a search like "dal" or "aloo sabji"
returns something useful instead of nothing.

Values are per 100g, approximate, and meant as reasonable household
estimates (home recipes vary a lot with oil/ghee quantity, so treat these
as a starting point, not lab-grade figures). IDs are negative to avoid
ever colliding with a real USDA fdcId.
"""

from typing import Any, Dict, List

INDIAN_FOODS: List[Dict[str, Any]] = [
    # -- Rice & grains --------------------------------------------------
    {"id": -1, "name": "Rice, plain, cooked (white)", "calories": 130, "protein": 2.7, "fat": 0.3, "carbs": 28.2},
    {"id": -2, "name": "Jeera rice", "calories": 165, "protein": 2.9, "fat": 4.5, "carbs": 28.0},
    {"id": -3, "name": "Chicken biryani", "calories": 200, "protein": 9.5, "fat": 8.0, "carbs": 22.0},
    {"id": -4, "name": "Vegetable biryani", "calories": 165, "protein": 3.8, "fat": 6.5, "carbs": 23.5},
    {"id": -5, "name": "Curd rice", "calories": 140, "protein": 3.5, "fat": 4.0, "carbs": 21.0},

    # -- Dal / lentils ----------------------------------------------------
    {"id": -10, "name": "Dal tadka (toor/arhar dal)", "calories": 115, "protein": 6.5, "fat": 4.0, "carbs": 13.0},
    {"id": -11, "name": "Dal fry", "calories": 130, "protein": 6.8, "fat": 5.5, "carbs": 13.5},
    {"id": -12, "name": "Dal makhani", "calories": 165, "protein": 7.0, "fat": 9.5, "carbs": 14.5},
    {"id": -13, "name": "Moong dal, cooked", "calories": 105, "protein": 7.0, "fat": 2.0, "carbs": 15.0},
    {"id": -14, "name": "Chana dal, cooked", "calories": 120, "protein": 7.5, "fat": 2.5, "carbs": 18.0},
    {"id": -15, "name": "Sambar", "calories": 75, "protein": 3.5, "fat": 2.5, "carbs": 9.5},
    {"id": -16, "name": "Rasam", "calories": 35, "protein": 1.5, "fat": 1.0, "carbs": 5.0},

    # -- Sabji / vegetable curries ---------------------------------------
    {"id": -20, "name": "Aloo sabji (potato curry)", "calories": 130, "protein": 2.2, "fat": 6.5, "carbs": 16.0},
    {"id": -21, "name": "Mixed vegetable curry (mixed sabji)", "calories": 100, "protein": 2.5, "fat": 5.5, "carbs": 10.5},
    {"id": -22, "name": "Bhindi masala (okra)", "calories": 115, "protein": 2.3, "fat": 7.5, "carbs": 9.5},
    {"id": -23, "name": "Baingan bharta (eggplant)", "calories": 95, "protein": 1.8, "fat": 6.0, "carbs": 9.0},
    {"id": -24, "name": "Palak (spinach) sabji, no paneer", "calories": 90, "protein": 3.0, "fat": 6.0, "carbs": 6.5},
    {"id": -25, "name": "Cauliflower sabji (gobi)", "calories": 110, "protein": 2.5, "fat": 6.5, "carbs": 9.5},
    {"id": -26, "name": "Chole (chickpea curry)", "calories": 150, "protein": 6.5, "fat": 6.5, "carbs": 17.5},
    {"id": -27, "name": "Rajma (kidney bean curry)", "calories": 140, "protein": 6.8, "fat": 5.5, "carbs": 17.0},

    # -- Paneer & dairy dishes ---------------------------------------------
    {"id": -30, "name": "Palak paneer", "calories": 180, "protein": 8.5, "fat": 13.5, "carbs": 7.0},
    {"id": -31, "name": "Paneer butter masala", "calories": 235, "protein": 9.0, "fat": 18.0, "carbs": 8.5},
    {"id": -32, "name": "Paneer tikka", "calories": 210, "protein": 14.0, "fat": 15.0, "carbs": 5.5},
    {"id": -33, "name": "Curd / dahi, plain", "calories": 60, "protein": 3.5, "fat": 3.3, "carbs": 4.7},
    {"id": -34, "name": "Paneer, raw", "calories": 265, "protein": 18.3, "fat": 20.8, "carbs": 1.2},

    # -- Meat / non-veg curries ---------------------------------------------
    {"id": -40, "name": "Butter chicken (murgh makhani)", "calories": 220, "protein": 14.5, "fat": 16.0, "carbs": 6.5},
    {"id": -41, "name": "Chicken curry", "calories": 175, "protein": 15.5, "fat": 10.5, "carbs": 4.5},
    {"id": -42, "name": "Mutton curry", "calories": 210, "protein": 17.0, "fat": 14.0, "carbs": 4.0},
    {"id": -43, "name": "Egg curry", "calories": 150, "protein": 8.5, "fat": 11.0, "carbs": 4.5},
    {"id": -44, "name": "Tandoori chicken", "calories": 165, "protein": 24.0, "fat": 6.5, "carbs": 2.0},

    # -- Breads --------------------------------------------------------------
    {"id": -50, "name": "Roti / chapati (whole wheat)", "calories": 280, "protein": 9.0, "fat": 5.5, "carbs": 50.0},
    {"id": -51, "name": "Naan, plain", "calories": 310, "protein": 8.5, "fat": 6.5, "carbs": 55.0},
    {"id": -52, "name": "Paratha, plain (with oil/ghee)", "calories": 330, "protein": 6.5, "fat": 16.0, "carbs": 40.0},
    {"id": -53, "name": "Puri (fried bread)", "calories": 375, "protein": 6.5, "fat": 20.0, "carbs": 42.0},

    # -- South Indian breakfast items ----------------------------------------
    {"id": -60, "name": "Idli (steamed rice cake)", "calories": 130, "protein": 4.0, "fat": 0.5, "carbs": 27.0},
    {"id": -61, "name": "Dosa, plain", "calories": 165, "protein": 3.5, "fat": 5.5, "carbs": 26.0},
    {"id": -62, "name": "Masala dosa", "calories": 190, "protein": 4.0, "fat": 7.5, "carbs": 27.0},
    {"id": -63, "name": "Upma", "calories": 150, "protein": 3.5, "fat": 6.0, "carbs": 20.5},
    {"id": -64, "name": "Poha", "calories": 130, "protein": 2.5, "fat": 3.5, "carbs": 22.5},

    # -- Snacks & sides -------------------------------------------------------
    {"id": -70, "name": "Samosa (fried, vegetable)", "calories": 260, "protein": 4.5, "fat": 15.0, "carbs": 27.0},
    {"id": -71, "name": "Pakora / bhaji (fried fritters)", "calories": 290, "protein": 6.0, "fat": 19.0, "carbs": 24.0},
    {"id": -72, "name": "Raita (plain yogurt salad)", "calories": 65, "protein": 2.5, "fat": 3.5, "carbs": 5.5},
    {"id": -73, "name": "Papad, roasted", "calories": 300, "protein": 20.0, "fat": 3.0, "carbs": 45.0},

    # -- Sweets -----------------------------------------------------------
    {"id": -80, "name": "Gulab jamun", "calories": 330, "protein": 4.5, "fat": 13.0, "carbs": 50.0},
    {"id": -81, "name": "Kheer (rice pudding)", "calories": 150, "protein": 4.0, "fat": 4.5, "carbs": 24.0},
    {"id": -82, "name": "Halwa (gajar/carrot halwa)", "calories": 250, "protein": 3.5, "fat": 13.0, "carbs": 30.0},
    {"id": -83, "name": "Ladoo (besan)", "calories": 435, "protein": 8.0, "fat": 22.0, "carbs": 50.0},
]


def search_indian_foods(query: str, limit: int = 6) -> List[Dict[str, Any]]:
    """
    Case-insensitive substring match against the local Indian foods
    dataset, then shape each hit into the same response format the USDA
    search returns (serving_size_g: 100, source flag for the UI).
    """
    q = query.strip().lower()
    if not q:
        return []

    matches = [food for food in INDIAN_FOODS if q in food["name"].lower()]

    return [
        {
            "id": food["id"],
            "name": food["name"],
            "serving_size_g": 100,
            "calories": float(food["calories"]),
            "protein": float(food["protein"]),
            "fat": float(food["fat"]),
            "carbs": float(food["carbs"]),
            "source": "local",
        }
        for food in matches[:limit]
    ]
