import { useState, useEffect } from "react";
import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";
import type { RegionProperties } from "@/lib/geoUtils";

export type RealRegionFC = FeatureCollection<Polygon | MultiPolygon, RegionProperties>;

/**
 * Fetches /data/coffee_regions.geojson at runtime.
 * Returns null (with loading=false) if the fetch fails, so callers can
 * fall back to the circle-to-polygon approximations gracefully.
 */
export function useCoffeeRegionsGeoJSON() {
  const [data, setData]       = useState<RealRegionFC | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
    fetch(`${base}/data/coffee_regions.geojson`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((fc: RealRegionFC) => setData(fc))
      .catch(() => setData(null))          // silently fall back on any error
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
