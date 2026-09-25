import { Flame, Loader2, Plus, Search, Trash2, Utensils, PackagePlus } from "lucide-react";
import { useMemo, useState } from "react";

const API_BASE = "https://portion.onrender.com/";

/** Round to 1 decimal place for display. */
const round1 = (n) => Math.round(n * 10) / 10;

/**
 * Macro summary header — aggregated totals across every logged entry.
 */
function MacroSummary({ totals }) {
  const stats = [
    { label: "Calories", value: totals.calories, unit: "kcal", accent: "text-orange-400" },
    { label: "Protein", value: totals.protein, unit: "g", accent: "text-sky-400" },
    { label: "Carbs", value: totals.carbs, unit: "g", accent: "text-amber-400" },
    { label: "Fat", value: totals.fat, unit: "g", accent: "text-rose-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {stat.label}
          </p>
          <p className={`mt-1 text-2xl font-bold ${stat.accent}`}>
            {round1(stat.value)}
            <span className="ml-1 text-sm font-medium text-slate-500">{stat.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * A single search result: base per-100g macros, a gram-portion input,
 * and a button to scale + add it to the daily log.
 */
function SearchResultCard({ food, onAdd }) {
  const [grams, setGrams] = useState(100);

  const scale = (grams || 0) / 100;
  const preview = {
    calories: food.calories * scale,
    protein: food.protein * scale,
    carbs: food.carbs * scale,
    fat: food.fat * scale,
  };

  const handleAdd = () => {
    const safeGrams = Number(grams) > 0 ? Number(grams) : 100;
    onAdd(food, safeGrams);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate font-semibold text-slate-100">
          <span className="truncate">{food.name}</span>
          {food.source === "local" && (
            <span className="flex-shrink-0 rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
              Indian dish
            </span>
          )}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Per 100g &middot; {round1(food.calories)} kcal &middot; P {round1(food.protein)}g &middot;{" "}
          C {round1(food.carbs)}g &middot; F {round1(food.fat)}g
        </p>
        <p className="mt-1 text-xs text-slate-500">
          This portion:{" "}
          <span className="text-slate-300">
            {round1(preview.calories)} kcal, P {round1(preview.protein)}g, C {round1(preview.carbs)}g,
            F {round1(preview.fat)}g
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2 sm:flex-shrink-0">
        <input
          type="number"
          min="1"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          className="w-20 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          aria-label={`Grams of ${food.name}`}
        />
        <span className="text-xs text-slate-500">g</span>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-500 active:bg-emerald-700"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </div>
  );
}

/**
 * One row in the daily meal log with its scaled macro contribution
 * and a delete affordance.
 */
function LogEntryRow({ entry, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-100">{entry.name}</p>
        <p className="text-xs text-slate-400">
          {entry.grams}g &middot; {round1(entry.calories)} kcal &middot; P {round1(entry.protein)}g &middot;{" "}
          C {round1(entry.carbs)}g &middot; F {round1(entry.fat)}g
        </p>
      </div>
      <button
        onClick={() => onDelete(entry.logId)}
        className="flex-shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-rose-400"
        aria-label={`Remove ${entry.name} from log`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

/**
 * Fallback for dishes that aren't in USDA or the local Indian-food list
 * at all — lets the user type in their own per-100g macro estimate and
 * add it to today's log directly.
 */
function CustomFoodForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    grams: 100,
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const food = {
      id: `custom-${Date.now()}`,
      name: form.name.trim(),
      calories: Number(form.calories) || 0,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
    };
    const grams = Number(form.grams) > 0 ? Number(form.grams) : 100;

    onAdd(food, grams);
    setForm({ name: "", grams: 100, calories: "", protein: "", carbs: "", fat: "" });
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-800/40 px-4 py-3 text-sm font-medium text-slate-400 transition hover:border-emerald-600 hover:text-emerald-400"
      >
        <PackagePlus size={16} />
        Can&apos;t find it? Add a custom food
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-800 p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-100">Add a custom food</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-slate-500 hover:text-slate-300"
        >
          Cancel
        </button>
      </div>

      <input
        type="text"
        required
        value={form.name}
        onChange={update("name")}
        placeholder="Dish name (e.g. Home-style aloo gobi)"
        className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Calories/100g
          <input
            type="number"
            min="0"
            step="any"
            value={form.calories}
            onChange={update("calories")}
            className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Protein/100g
          <input
            type="number"
            min="0"
            step="any"
            value={form.protein}
            onChange={update("protein")}
            className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Carbs/100g
          <input
            type="number"
            min="0"
            step="any"
            value={form.carbs}
            onChange={update("carbs")}
            className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Fat/100g
          <input
            type="number"
            min="0"
            step="any"
            value={form.fat}
            onChange={update("fat")}
            className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Portion (g)
          <input
            type="number"
            min="1"
            value={form.grams}
            onChange={update("grams")}
            className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
          />
        </label>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
      >
        <Plus size={16} />
        Add to log
      </button>
    </form>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [log, setLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const totals = useMemo(
    () =>
      log.reduce(
        (acc, entry) => ({
          calories: acc.calories + entry.calories,
          protein: acc.protein + entry.protein,
          carbs: acc.carbs + entry.carbs,
          fat: acc.fat + entry.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [log]
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/foods/search?query=${encodeURIComponent(trimmed)}`
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Search failed (${res.status})`);
      }
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || "Something went wrong while searching.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToLog = (food, grams) => {
    const scale = grams / 100;
    const entry = {
      logId: `${food.id}-${Date.now()}`,
      name: food.name,
      grams,
      calories: food.calories * scale,
      protein: food.protein * scale,
      carbs: food.carbs * scale,
      fat: food.fat * scale,
    };
    setLog((prev) => [entry, ...prev]);
  };

  const handleDeleteEntry = (logId) => {
    setLog((prev) => prev.filter((entry) => entry.logId !== logId));
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-16">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
          <div className="flex items-center gap-2">
            <Utensils className="text-emerald-500" size={22} />
            <h1 className="text-xl font-bold text-slate-100">Calorie & Macro Tracker</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* Macro Summary */}
        <section className="mb-6">
          <MacroSummary totals={totals} />
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Search + Results */}
          <section>
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={16}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search foods (e.g. chicken breast)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                Search
              </button>
            </form>

            {error && (
              <div className="mb-4 rounded-lg border border-rose-800 bg-rose-950/50 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {isLoading && (
                <div className="flex items-center justify-center gap-2 py-8 text-slate-500">
                  <Loader2 className="animate-spin" size={18} />
                  <span className="text-sm">Searching USDA FoodData Central&hellip;</span>
                </div>
              )}

              {!isLoading && hasSearched && results.length === 0 && !error && (
                <p className="py-8 text-center text-sm text-slate-500">
                  No matches found. Try a different search term.
                </p>
              )}

              {!isLoading &&
                results.map((food) => (
                  <SearchResultCard key={food.id} food={food} onAdd={handleAddToLog} />
                ))}

              <CustomFoodForm onAdd={handleAddToLog} />
            </div>
          </section>

          {/* Daily Log */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Flame className="text-orange-400" size={18} />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                Daily Log
              </h2>
              <span className="text-xs text-slate-500">
                ({log.length} {log.length === 1 ? "item" : "items"})
              </span>
            </div>

            {log.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/40 px-4 py-10 text-center">
                <p className="text-sm text-slate-500">
                  Nothing logged yet. Search for a food and add it here.
                </p>
              </div>
            ) : (
              <div className="log-scroll flex max-h-[32rem] flex-col gap-2 overflow-y-auto pr-1">
                {log.map((entry) => (
                  <LogEntryRow key={entry.logId} entry={entry} onDelete={handleDeleteEntry} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
