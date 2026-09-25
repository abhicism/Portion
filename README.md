# Calorie & Macronutrient Tracker

Full-stack app: FastAPI backend (proxies USDA FoodData Central) + React
(Vite + Tailwind + lucide-react) dark-mode dashboard frontend.

## 1. Backend setup

```bash
cd calorie-tracker-app/backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# Optional: edit .env and set USDA_API_KEY to your own key from
# https://fdc.nal.usda.gov/api-key-signup.html (DEMO_KEY works but is
# heavily rate-limited)

uvicorn main:app --reload --port 8000
```

Backend now runs at `http://localhost:8000`. Try it:
`http://localhost:8000/api/foods/search?query=chicken`

## 2. Frontend setup

In a second terminal:

```bash
cd calorie-tracker-app/frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and talks to the backend at
`http://localhost:8000` (see `API_BASE` in `src/App.jsx`).

## 3. Using the app

1. Type a food name in the search bar and hit Search.
2. Set a gram portion (defaults to 100g) on any result.
3. Click **Add** to append the scaled entry to today's log.
4. Watch the summary header update totals for Calories, Protein, Carbs,
   and Fat.
5. Remove any entry from the log with the trash icon.

## Notes

- The backend normalizes USDA's `foodNutrients` payload down to just the
  four macros the UI needs (calorie/protein/fat/carbs, nutrient IDs
  1008/1003/1004/1005), scoped to `Foundation`, `Survey (FNDDS)`, and
  `SR Legacy` data types, 6 results per search.
- **Indian dishes:** USDA has almost no coverage of Indian home-cooked
  food, so `backend/indian_foods.py` ships a small curated dataset (rice,
  dal, sabji, roti, biryani, paneer dishes, South Indian breakfast items,
  sweets, etc.) that's searched alongside USDA. Local matches are returned
  first and tagged `"source": "local"` in the API response; the frontend
  shows an "Indian dish" badge on those results. Values are per-100g
  household estimates — edit `INDIAN_FOODS` in that file to add more
  dishes or tune the numbers to your own recipes.
- **Custom foods:** if a dish isn't in USDA or the local dataset, the
  "Can't find it? Add a custom food" form on the search panel lets the
  user type a name plus their own per-100g calorie/protein/carb/fat
  estimate and log it directly — no backend round trip needed.
- All state (search results, daily log) is kept in React state only —
  refreshing the page clears the log. Swap in localStorage or a real
  backend-persisted log as a next step if you want it to survive reloads.
