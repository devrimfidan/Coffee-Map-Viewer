import { Link, useLocation } from "wouter";
import { Coffee, Search, MapPin, Building2, Sprout, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMap } from "@/context/MapContext";
import { getCountries, getFarms, getRoasters } from "@/lib/data";
import { useRef, useState, useEffect, useMemo } from "react";

const ALL_COUNTRIES = getCountries();
const ALL_FARMS = getFarms();
const ALL_ROASTERS = getRoasters();

type SuggestionType = "country" | "farm" | "roaster";
interface Suggestion {
  type: SuggestionType;
  id: string;
  label: string;
  sub: string;
  flag?: string;
}

function typeIcon(type: SuggestionType) {
  if (type === "country") return <MapPin className="w-3.5 h-3.5 text-primary" />;
  if (type === "farm") return <Sprout className="w-3.5 h-3.5 text-[#E8855A]" />;
  return <Building2 className="w-3.5 h-3.5 text-[#5B9BD5]" />;
}

function typeLabel(type: SuggestionType) {
  if (type === "country") return "Region";
  if (type === "farm") return "Farm";
  return "Roaster";
}

export default function TopNav() {
  const [location] = useLocation();
  const { setSelectedEntity } = useMap();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "/", label: "Map" },
    { href: "/encyclopedia", label: "Encyclopedia" },
    { href: "/compare", label: "Compare" },
  ];

  const suggestions = useMemo<Suggestion[]>(() => {
    if (query.trim().length < 1) return [];
    const q = query.toLowerCase();

    const countries: Suggestion[] = ALL_COUNTRIES
      .filter(c => c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q))
      .slice(0, 4)
      .map(c => ({ type: "country", id: c.id, label: c.name, sub: c.region, flag: c.flag }));

    const farms: Suggestion[] = ALL_FARMS
      .filter(f => f.name.toLowerCase().includes(q) || f.country.toLowerCase().includes(q) || f.region.toLowerCase().includes(q))
      .slice(0, 4)
      .map(f => ({ type: "farm", id: f.id, label: f.name, sub: `${f.region}, ${f.country}` }));

    const roasters: Suggestion[] = ALL_ROASTERS
      .filter(r => r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.country.toLowerCase().includes(q))
      .slice(0, 4)
      .map(r => ({ type: "roaster", id: r.id, label: r.name, sub: `${r.city}, ${r.country}` }));

    return [...countries, ...farms, ...roasters];
  }, [query]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleSelect(s: Suggestion) {
    setSelectedEntity({ type: s.type, id: s.id });
    setQuery("");
    setOpen(false);
  }

  return (
    <header className="h-[52px] bg-background border-b border-border flex items-center justify-between px-6 shrink-0 z-50 relative">
      <div className="flex items-center gap-3">
        <Coffee className="w-5 h-5 text-primary" />
        <span className="font-serif font-semibold text-lg text-primary tracking-wide">Coffee World</span>
      </div>

      <nav className="flex items-center gap-1 bg-card/50 p-1 rounded-md border border-border/50">
        {links.map((link) => {
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <span className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2" ref={containerRef}>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search farms, roasters, regions…"
            className="w-72 pl-9 pr-8 bg-card border-border/50 focus-visible:ring-primary/50 text-sm h-8"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setOpen(false); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {open && suggestions.length > 0 && (
            <div className="absolute top-[calc(100%+6px)] right-0 w-[400px] bg-card border border-border rounded-xl shadow-2xl z-[9999] overflow-hidden">
              {(["country", "farm", "roaster"] as SuggestionType[]).map(type => {
                const group = suggestions.filter(s => s.type === type);
                if (group.length === 0) return null;
                return (
                  <div key={type}>
                    <div className="px-3 py-1.5 flex items-center gap-1.5 border-b border-border/50 bg-background/60">
                      {typeIcon(type)}
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{typeLabel(type)}s</span>
                    </div>
                    {group.map(s => (
                      <button
                        key={s.id}
                        onMouseDown={() => handleSelect(s)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/10 transition-colors text-left group"
                      >
                        <span className="shrink-0">{typeIcon(s.type)}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {s.flag && <span className="mr-1.5">{s.flag}</span>}{s.label}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{s.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
              <div className="px-4 py-2 bg-background/40 border-t border-border/50 text-[10px] text-muted-foreground text-right">
                {suggestions.length} result{suggestions.length !== 1 ? "s" : ""} — click to locate on map
              </div>
            </div>
          )}

          {open && query.length >= 1 && suggestions.length === 0 && (
            <div className="absolute top-[calc(100%+6px)] right-0 w-[360px] bg-card border border-border rounded-xl shadow-2xl z-[9999] px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">No results for "<span className="text-foreground">{query}</span>"</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
