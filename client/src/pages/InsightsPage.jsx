import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleDot,
  FileText,
  MapPin,
  RefreshCcw,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import IssueDensityMap from "../components/insights/IssueDensityMap";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getAllReports } from "../services/api";

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_CATEGORIES = 6;

function validDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function percent(numerator, denominator) {
  return denominator ? Math.round((numerator / denominator) * 100) : 0;
}

function countBy(reports, getKey) {
  const counts = new Map();
  for (const report of reports) {
    const key = getKey(report);
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function getHotspots(reports) {
  const cells = new Map();
  const gridSize = 0.012; // approximate local grid; not a precise distance calculation
  for (const report of reports) {
    const lat = Number(report.lat);
    const lng = Number(report.lng);
    if (
      report.lat === null || report.lat === undefined ||
      report.lng === null || report.lng === undefined ||
      !Number.isFinite(lat) || !Number.isFinite(lng) ||
      lat < -90 || lat > 90 || lng < -180 || lng > 180
    ) continue;

    const key = `${Math.floor(lat / gridSize)}:${Math.floor(lng / gridSize)}`;
    let cell = cells.get(key);
    if (!cell) {
      cell = { key, count: 0, latitudeSum: 0, longitudeSum: 0, locations: [], categories: [] };
      cells.set(key, cell);
    }
    cell.count += 1;
    cell.latitudeSum += lat;
    cell.longitudeSum += lng;
    if (report.location) cell.locations.push({ location: report.location });
    if (report.category) cell.categories.push({ category: report.category });
  }

  return [...cells.values()]
    .map((cell) => ({
      key: cell.key,
      count: cell.count,
      lat: cell.latitudeSum / cell.count,
      lng: cell.longitudeSum / cell.count,
      label: countBy(cell.locations, (item) => item.location)[0]?.label || "Unnamed location",
      dominantCategory: countBy(cell.categories, (item) => item.category)[0]?.label || "Other issue",
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function getMonthlyTrend(reports) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const entries = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(start.getFullYear(), start.getMonth() + i, 1);
    return {
      key: `${month.getFullYear()}-${month.getMonth()}`,
      label: month.toLocaleString("en", { month: "short" }),
      year: month.getFullYear(),
      count: 0,
    };
  });
  const lookup = new Map(entries.map((entry) => [entry.key, entry]));
  for (const report of reports) {
    const date = validDate(report.createdAt);
    if (!date) continue;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const entry = lookup.get(key);
    if (entry) entry.count += 1;
  }
  return entries;
}

function StatTile({ icon: Icon, label, value, detail, accent = false }) {
  return (
    <div className={`rounded-[22px] border p-5 sm:p-6 ${accent ? "border-[#D6E500] bg-[#E8FF00]" : "border-zinc-200 bg-white"}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-zinc-600">{label}</p>
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${accent ? "bg-black/10" : "bg-zinc-100"}`}>
          <Icon size={18} aria-hidden="true" />
        </div>
      </div>
      <div className="mt-4 text-4xl font-black tracking-tight text-zinc-950">{value}</div>
      <p className="mt-1 text-xs text-zinc-600">{detail}</p>
    </div>
  );
}

function ActivityChart({ points }) {
  const width = 620;
  const height = 210;
  const left = 28;
  const right = 18;
  const top = 28;
  const bottom = 32;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const max = Math.max(1, ...points.map((point) => point.count));
  const coords = points.map((point, index) => ({
    ...point,
    x: left + (index / Math.max(points.length - 1, 1)) * chartWidth,
    y: top + chartHeight - (point.count / max) * chartHeight,
  }));
  const line = coords.map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${line} L ${coords[coords.length - 1].x} ${top + chartHeight} L ${coords[0].x} ${top + chartHeight} Z`;

  return (
    <div className="w-full">
      <svg role="img" aria-label="Monthly report trend for the last six months" viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="insightsAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DFF400" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#DFF400" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((fraction) => (
          <line key={fraction} x1={left} x2={width - right} y1={top + chartHeight * fraction} y2={top + chartHeight * fraction} stroke="#E4E4E7" strokeDasharray="4 6" />
        ))}
        <path d={area} fill="url(#insightsAreaFill)" />
        <path d={line} fill="none" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((point) => (
          <g key={point.key}>
            <circle cx={point.x} cy={point.y} r="5.5" fill="#E8FF00" stroke="#18181B" strokeWidth="2" />
            <text x={point.x} y={height - 4} textAnchor="middle" fontSize="13" fontWeight="600" fill="#71717A">{point.label}</text>
            <title>{`${point.label} ${point.year}: ${point.count} reports`}</title>
          </g>
        ))}
      </svg>
      <p className="mt-2 text-xs text-zinc-500">Last 6 calendar months. Hover or focus on bars elsewhere for details.</p>
    </div>
  );
}

function Breakdown({ entries, total, onCategoryClick, selectedCategory }) {
  const display = entries.slice(0, MAX_CATEGORIES);
  if (!display.length) {
    return <p className="py-10 text-center text-sm text-zinc-500">No category data for this selection.</p>;
  }
  return (
    <div className="space-y-5">
      {display.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onCategoryClick(selectedCategory === item.label ? "All" : item.label)}
          className="group block w-full text-left"
          title={`Filter by ${item.label}`}
        >
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-zinc-700 group-hover:text-black">{item.label}</span>
            <span className="font-black tabular-nums text-zinc-950">{item.count} <span className="font-normal text-zinc-400">({percent(item.count, total)}%)</span></span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full rounded-full bg-[#CADD00] transition-all" style={{ width: `${percent(item.count, total)}%` }} />
          </div>
        </button>
      ))}
    </div>
  );
}

export default function InsightsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [truncated, setTruncated] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [timeRange, setTimeRange] = useState("All");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedHotspotKey, setSelectedHotspotKey] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const result = await getAllReports();
        if (!mounted) return;
        setReports(result.reports);
        setTruncated(result.truncated);
        setError("");
      } catch (err) {
        if (mounted) setError(err.message || "Unable to load civic insights.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [reloadKey]);

  const categories = useMemo(() => countBy(reports, (report) => report.category).map((item) => item.label), [reports]);
  const statuses = useMemo(() => countBy(reports, (report) => report.status).map((item) => item.label), [reports]);

  const filteredReports = useMemo(() => {
    const cutoff = timeRange === "All" ? null : Date.now() - Number(timeRange) * DAY_MS;
    return reports.filter((report) => {
      if (category !== "All" && report.category !== category) return false;
      if (status !== "All" && report.status !== status) return false;
      if (cutoff !== null) {
        const createdAt = validDate(report.createdAt);
        if (!createdAt || createdAt.getTime() < cutoff) return false;
      }
      return true;
    });
  }, [reports, category, status, timeRange]);

  const open = filteredReports.filter((report) => report.status === "Open").length;
  const resolved = filteredReports.filter((report) => report.status === "Resolved").length;
  const categoriesBreakdown = useMemo(() => countBy(filteredReports, (report) => report.category || "Other"), [filteredReports]);
  const authorities = useMemo(() => countBy(filteredReports, (report) => report.authority || "Needs review"), [filteredReports]);
  const hotspots = useMemo(() => getHotspots(filteredReports), [filteredReports]);
  const trend = useMemo(() => getMonthlyTrend(filteredReports), [filteredReports]);
  const activeHotspot = hotspots.find((spot) => spot.key === selectedHotspotKey) || null;

  function resetFilters() {
    setTimeRange("All");
    setCategory("All");
    setStatus("All");
    setSelectedHotspotKey(null);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#F7F7F4] text-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-5 pb-20 pt-9 sm:px-7 lg:px-10">
        <section className="flex flex-col gap-5 border-b border-zinc-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-[#BBD000] ring-4 ring-[#E8FF00]/40" />
              Public data explorer
            </div>
            <h1 className="text-4xl font-black tracking-[-0.055em] sm:text-6xl">City <span className="text-[#93A600]">Insights.</span></h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
              Explore where civic issues are being reported across Dhaka, which problems are common, and how reports are progressing.
            </p>
          </div>
          <Link to="/report" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white transition hover:bg-zinc-800">
            <FileText size={17} /> Report an issue <ArrowRight size={16} />
          </Link>
        </section>

        <section aria-label="Report filters" className="mt-6 flex flex-wrap items-end gap-3 rounded-[22px] border border-zinc-200 bg-white p-4 sm:p-5">
          <SlidersHorizontal size={18} className="mb-3 hidden text-zinc-500 sm:block" />
          <label className="min-w-[145px] flex-1 text-xs font-bold text-zinc-500 sm:flex-none">
            Time range
            <select value={timeRange} onChange={(event) => setTimeRange(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-3 text-sm font-semibold text-zinc-900 outline-none focus:border-[#A9BE00]">
              <option value="All">All time</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 12 months</option>
            </select>
          </label>
          <label className="min-w-[175px] flex-1 text-xs font-bold text-zinc-500 sm:flex-none">
            Issue category
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-3 text-sm font-semibold text-zinc-900 outline-none focus:border-[#A9BE00]">
              <option value="All">All categories</option>
              {categories.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label className="min-w-[145px] flex-1 text-xs font-bold text-zinc-500 sm:flex-none">
            Issue status
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-3 text-sm font-semibold text-zinc-900 outline-none focus:border-[#A9BE00]">
              <option value="All">All statuses</option>
              {statuses.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <button type="button" onClick={resetFilters} className="h-11 rounded-xl px-4 text-sm font-bold text-zinc-500 hover:bg-zinc-100 hover:text-black">Reset</button>
          <button type="button" onClick={() => { setLoading(true); setReloadKey((value) => value + 1); }} className="flex h-11 items-center gap-2 rounded-xl border border-zinc-200 px-4 text-sm font-semibold hover:bg-zinc-50" aria-label="Refresh insights">
            <RefreshCcw size={15} /> Refresh
          </button>
        </section>

        {error && (
          <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error} Check that the FastAPI server is running and try Refresh.
          </div>
        )}
        {truncated && !loading && (
          <div role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            This overview includes the latest 5,000 reports only; results may not represent the full archive.
          </div>
        )}
        {loading ? (
          <div role="status" className="mt-8 rounded-2xl border border-zinc-200 bg-white p-14 text-center text-sm font-medium text-zinc-500">Loading city insights…</div>
        ) : (
          <>
            <section aria-label="Key metrics" className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatTile icon={FileText} label="Reports in view" value={filteredReports.length.toLocaleString()} detail="Matching your filters" accent />
              <StatTile icon={CircleDot} label="Open issues" value={open.toLocaleString()} detail={`${percent(open, filteredReports.length)}% of selected reports`} />
              <StatTile icon={CheckCircle2} label="Resolved reports" value={resolved.toLocaleString()} detail={`${percent(resolved, filteredReports.length)}% marked resolved`} />
              <StatTile icon={MapPin} label="Report hotspots" value={hotspots.length.toLocaleString()} detail="Approximate location clusters" />
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.9fr)]">
              <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2"><MapPin size={20} /><h2 className="text-xl font-black tracking-tight">Issue hotspot map</h2></div>
                    <p className="mt-1 text-xs text-zinc-500">Grouped by approximate geographic grid • Click a circle to explore</p>
                  </div>
                  <span className="rounded-full bg-[#F1F5D3] px-3 py-1 text-xs font-bold text-[#606E00]">Geospatial overview</span>
                </div>
                <div className="h-[350px] sm:h-[460px]">
                  <IssueDensityMap hotspots={hotspots} selectedKey={activeHotspot?.key} onSelectHotspot={setSelectedHotspotKey} />
                </div>
                {activeHotspot && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E1E7A6] bg-[#F8FBE5] px-4 py-3">
                    <div>
                      <p className="text-sm font-black text-zinc-900">{activeHotspot.label}</p>
                      <p className="mt-1 text-xs text-zinc-600">{activeHotspot.count} report(s) nearby · Main issue: {activeHotspot.dominantCategory}</p>
                    </div>
                    <button type="button" onClick={() => setSelectedHotspotKey(null)} className="text-xs font-bold text-zinc-500 hover:text-black">Clear selection</button>
                  </div>
                )}
              </div>

              <div className="rounded-[24px] border border-zinc-200 bg-white p-5 sm:p-6">
                <div className="flex items-center gap-2"><TrendingUp size={20} /><h2 className="text-xl font-black tracking-tight">Top hotspots</h2></div>
                <p className="mt-1 text-xs text-zinc-500">Approximate clusters with the most reports</p>
                {hotspots.length === 0 ? (
                  <div className="py-12 text-center text-sm text-zinc-500">No hotspot data yet.</div>
                ) : (
                  <div className="mt-5 divide-y divide-zinc-100">
                    {hotspots.slice(0, 6).map((spot, index) => (
                      <button type="button" key={spot.key} onClick={() => setSelectedHotspotKey(spot.key)} className={`flex w-full items-center gap-3 py-4 text-left transition hover:opacity-75 ${spot.key === activeHotspot?.key ? "bg-[#F7FBE1]" : ""}`}>
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-zinc-100 text-xs font-black text-zinc-500">{String(index + 1).padStart(2, "0")}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-zinc-900">{spot.label}</span>
                          <span className="mt-1 block truncate text-xs text-zinc-500">{spot.dominantCategory}</span>
                        </span>
                        <span className="rounded-full bg-[#F0F6BA] px-3 py-1 text-sm font-black tabular-nums text-zinc-900">{spot.count}</span>
                      </button>
                    ))}
                  </div>
                )}
                <p className="mt-5 text-[11px] leading-relaxed text-zinc-500">Hotspots reflect reports submitted through FixMyDhaka, not all civic issues in the city.</p>
              </div>
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-[24px] border border-zinc-200 bg-white p-5 sm:p-7">
                <div className="mb-7 flex items-center gap-2"><BarChart3 size={20} /><h2 className="text-xl font-black tracking-tight">Issue categories</h2></div>
                <p className="mb-6 text-xs text-zinc-500">Select a category to filter the entire dashboard.</p>
                <Breakdown entries={categoriesBreakdown} total={filteredReports.length} onCategoryClick={setCategory} selectedCategory={category} />
              </div>
              <div className="rounded-[24px] border border-zinc-200 bg-white p-5 sm:p-7">
                <div className="mb-7 flex items-center gap-2"><Activity size={20} /><h2 className="text-xl font-black tracking-tight">Reporting activity</h2></div>
                <p className="mb-5 text-xs text-zinc-500">Monthly totals among reports matching the current filters.</p>
                <ActivityChart points={trend} />
              </div>
            </section>

            <section className="mt-6 rounded-[24px] border border-zinc-200 bg-white p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h2 className="text-xl font-black tracking-tight">Authority routing overview</h2><p className="mt-1 text-xs text-zinc-500">Where reports have been assigned or flagged for review; not a measure of authority performance.</p></div>
                <Link to="/reports" className="inline-flex items-center gap-2 text-xs font-extrabold text-zinc-800 hover:underline">Browse all reports <ArrowRight size={15} /></Link>
              </div>
              {authorities.length === 0 ? (
                <p className="mt-8 text-sm text-zinc-500">No authority information is available for these reports.</p>
              ) : (
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {authorities.slice(0, 6).map((authority) => (
                    <div key={authority.label} className="rounded-xl border border-zinc-100 bg-[#FAFAF8] p-5">
                      <p className="truncate text-sm font-bold text-zinc-700" title={authority.label}>{authority.label}</p>
                      <p className="mt-3 text-3xl font-black text-black">{authority.count}</p>
                      <p className="mt-1 text-xs text-zinc-500">{percent(authority.count, filteredReports.length)}% of reports in view</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <p className="mt-6 text-center text-xs text-zinc-500">Data is derived from FixMyDhaka's publicly listed reports. Location clusters are approximate. Statistics update on refresh.</p>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
