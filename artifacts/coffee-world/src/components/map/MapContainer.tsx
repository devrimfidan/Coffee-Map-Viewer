import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Tooltip, Rectangle, CircleMarker, Marker, GeoJSON } from "react-leaflet";
import { useMap } from "@/context/MapContext";
import "@/lib/leaflet-icons";
import L from "leaflet";
import type { GeoJsonObject, Feature, Polygon } from "geojson";
import { Farm, Roaster, Country, getRegions } from "@/lib/data";
import { createRoasterIcon } from "@/lib/leaflet-icons";
import { regionsToGeoJSON, circleToRing, type RegionProperties } from "@/lib/geoUtils";
import { useCoffeeRegionsGeoJSON } from "@/hooks/useCoffeeRegionsGeoJSON";

const MAP_CENTER: [number, number] = [10, 20];
const MAP_ZOOM = 3;
const COFFEE_BELT_BOUNDS: L.LatLngBoundsExpression = [[-23.5, -180], [23.5, 180]];

// Circle-approximation fallback — built once at module level
const ALL_REGIONS      = getRegions();
const CIRCLE_GEOJSON   = regionsToGeoJSON(ALL_REGIONS, 72);

const ROBUSTA_CULTIVARS = ["Robusta", "Canephora"];

function getFarmSpecies(farm: Farm): "arabica" | "robusta" {
  if (farm.varieties.some(v => ROBUSTA_CULTIVARS.some(r => v.toLowerCase().includes(r.toLowerCase())))) {
    return "robusta";
  }
  return "arabica";
}

// ─── Tooltips ────────────────────────────────────────────────────────────────

function FarmTooltipContent({ farm }: { farm: Farm }) {
  const shortNotes = farm.tasting_notes
    ? farm.tasting_notes.length > 80 ? farm.tasting_notes.substring(0, 80) + "…" : farm.tasting_notes
    : null;
  return (
    <div style={{ width: 220, overflow: "hidden" }} className="p-2">
      <p className="font-bold text-sm text-primary leading-tight truncate">{farm.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5 truncate">{farm.region}, {farm.country}</p>
      <div className="flex items-center gap-2 mt-1.5 text-xs text-foreground">
        <span>↑ {farm.altitude}m</span>
        <span className="text-muted-foreground">·</span>
        <span className="truncate">{farm.processes.slice(0, 2).join(", ")}</span>
      </div>
      {farm.varieties.length > 0 && (
        <p className="text-xs text-primary/80 mt-1 truncate">{farm.varieties.slice(0, 3).join(", ")}</p>
      )}
      {shortNotes && (
        <p
          className="text-xs text-muted-foreground mt-1.5 italic leading-relaxed border-t border-border/50 pt-1.5"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          "{shortNotes}"
        </p>
      )}
    </div>
  );
}

function RoasterTooltipContent({ roaster }: { roaster: Roaster }) {
  const shortSourcing = roaster.sourcing
    ? roaster.sourcing.length > 70 ? roaster.sourcing.substring(0, 70) + "…" : roaster.sourcing
    : null;
  return (
    <div style={{ width: 220, overflow: "hidden" }} className="p-2">
      <p className="font-bold text-sm text-primary leading-tight truncate">{roaster.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5 truncate">{roaster.city}, {roaster.country} · est. {roaster.founded}</p>
      {shortSourcing && (
        <p
          className="text-xs text-foreground mt-1.5 leading-relaxed"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {shortSourcing}
        </p>
      )}
      {roaster.signature_origins.length > 0 && (
        <p className="text-xs text-primary/80 mt-1.5 border-t border-border/50 pt-1.5 truncate">
          {roaster.signature_origins.slice(0, 5).join(" · ")}
        </p>
      )}
      {roaster.notable_coffees.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1 truncate">{roaster.notable_coffees.slice(0, 2).join(", ")}</p>
      )}
    </div>
  );
}

// ─── Region polygon layer ─────────────────────────────────────────────────────

interface GrowingRegionLayerProps {
  filteredCountries: Country[];
  onCountryClick: (countryId: string) => void;
}

function GrowingRegionLayer({ filteredCountries, onCountryClick }: GrowingRegionLayerProps) {
  // Real irregular polygons loaded from public/data/coffee_regions.geojson
  const { data: realGeoJSON, loading } = useCoffeeRegionsGeoJSON();

  const visibleIds = useMemo(
    () => new Set(filteredCountries.map(c => c.id)),
    [filteredCountries]
  );

  const countryById = useMemo(() => {
    const m: Record<string, Country> = {};
    filteredCountries.forEach(c => { m[c.id] = c; });
    return m;
  }, [filteredCountries]);

  /**
   * Build the final FeatureCollection:
   *   • Prefer real irregular polygon from coffee_regions.geojson when available.
   *   • Fall back to the Haversine circle approximation for any missing region.
   *   • Always filter to only the currently-visible country set.
   */
  const mergedGeoJSON = useMemo(() => {
    // Index real features by region id
    const realById = new Map<string, GeoJSON.Feature>();
    if (realGeoJSON) {
      realGeoJSON.features.forEach(f => {
        if (f.properties?.id) realById.set(f.properties.id as string, f);
      });
    }

    const features: Feature<Polygon, RegionProperties>[] = ALL_REGIONS
      .filter(r => visibleIds.has(r.country_id))
      .map(r => {
        const real = realById.get(r.id);
        const enrichedProps: RegionProperties = {
          id: r.id,
          name: r.name,
          country_id: r.country_id,
          radius_km: r.radius_km,
          // prefer enriched fields from the real GeoJSON, fall back to regions.json
          description:         (real?.properties as RegionProperties | undefined)?.description         ?? r.description,
          typical_altitude_m:  (real?.properties as RegionProperties | undefined)?.typical_altitude_m  ?? r.typical_altitude_m,
          dominant_varieties:  (real?.properties as RegionProperties | undefined)?.dominant_varieties  ?? r.dominant_varieties,
          dominant_processes:  (real?.properties as RegionProperties | undefined)?.dominant_processes  ?? r.dominant_processes,
          harvest_months:      (real?.properties as RegionProperties | undefined)?.harvest_months      ?? r.harvest_months,
          certifications:      (real?.properties as RegionProperties | undefined)?.certifications      ?? r.certifications,
        };
        if (real && real.geometry.type === "Polygon") {
          return {
            type: "Feature",
            properties: enrichedProps,
            geometry: real.geometry as GeoJSON.Polygon,
          } as Feature<Polygon, RegionProperties>;
        }
        return {
          type: "Feature",
          properties: enrichedProps,
          geometry: { type: "Polygon", coordinates: [circleToRing(r.lat, r.lng, r.radius_km, 72)] },
        } as Feature<Polygon, RegionProperties>;
      });

    return { type: "FeatureCollection" as const, features };
  }, [realGeoJSON, visibleIds]);

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    const props = feature.properties as RegionProperties;
    const { name, country_id, description, typical_altitude_m, dominant_varieties, dominant_processes, harvest_months } = props;
    const country = countryById[country_id];

    const descTrunc = description && description.length > 110
      ? description.substring(0, 110) + "…"
      : description ?? "";

    const html = `
      <div style="width:240px;overflow:hidden;padding:10px 10px 8px">
        <p style="font-weight:700;font-size:13px;color:#C8A96E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px">
          ${name}
        </p>
        ${country ? `
          <p style="font-size:11px;color:#A89880;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:6px">
            ${country.flag} ${country.name}
          </p>` : ""}
        ${descTrunc ? `
          <p style="font-size:11px;color:#d1cec9;line-height:1.4;margin-bottom:6px">
            ${descTrunc}
          </p>` : ""}
        ${typical_altitude_m ? `
          <p style="font-size:10px;color:#A89880;margin-bottom:3px">
            <span style="color:#C8A96E;font-weight:600">↑ Altitude</span> &nbsp;${typical_altitude_m} m
          </p>` : ""}
        ${harvest_months ? `
          <p style="font-size:10px;color:#A89880;margin-bottom:3px">
            <span style="color:#C8A96E;font-weight:600">⌛ Harvest</span> &nbsp;${harvest_months}
          </p>` : ""}
        ${(dominant_varieties ?? []).length > 0 ? `
          <p style="font-size:10px;color:#A89880;margin-bottom:2px">
            <span style="color:#C8A96E;font-weight:600">Varieties</span> &nbsp;${(dominant_varieties ?? []).slice(0, 4).join(", ")}
          </p>` : ""}
        ${(dominant_processes ?? []).length > 0 ? `
          <p style="font-size:10px;color:#A89880">
            <span style="color:#C8A96E;font-weight:600">Process</span> &nbsp;${(dominant_processes ?? []).join(", ")}
          </p>` : ""}
      </div>`;

    layer.bindTooltip(html, {
      sticky: false,
      direction: "top",
      className: "leaflet-tooltip-dark",
    });

    layer.on({
      mouseover(e: L.LeafletMouseEvent) {
        (e.target as L.Path).setStyle({ fillOpacity: 0.42, weight: 1.5 });
      },
      mouseout(e: L.LeafletMouseEvent) {
        (e.target as L.Path).setStyle({ fillOpacity: 0.18, weight: 0.6 });
      },
      click() {
        onCountryClick(country_id);
      },
    });
  };

  const layerKey = useMemo(
    () => `${loading ? "loading" : "ready"}:${mergedGeoJSON.features.map(f => f.properties.id).join(",")}`,
    [loading, mergedGeoJSON]
  );

  return (
    <GeoJSON
      key={layerKey}
      data={mergedGeoJSON as GeoJsonObject}
      style={() => ({
        color: "#C8A96E",
        weight: 0.6,
        fillColor: "#C8A96E",
        fillOpacity: 0.18,
      })}
      onEachFeature={onEachFeature}
    />
  );
}

// ─── Main map component ───────────────────────────────────────────────────────

export default function CoffeeMap() {
  const { filters, filteredCountries, filteredFarms, filteredRoasters, selectedEntity, setSelectedEntity } = useMap();
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (!selectedEntity || !mapRef.current) return;
    let entity: { lat: number; lng: number } | undefined;
    if (selectedEntity.type === "country") entity = filteredCountries.find(c => c.id === selectedEntity.id);
    else if (selectedEntity.type === "farm")    entity = filteredFarms.find(f => f.id === selectedEntity.id);
    else if (selectedEntity.type === "roaster") entity = filteredRoasters.find(r => r.id === selectedEntity.id);
    if (entity) mapRef.current.flyTo([entity.lat, entity.lng], 6, { duration: 1.5, easeLinearity: 0.25 });
  }, [selectedEntity, filteredCountries, filteredFarms, filteredRoasters]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        className="w-full h-full bg-[#1E1E1E]"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Coffee Belt band */}
        <Rectangle
          bounds={COFFEE_BELT_BOUNDS}
          pathOptions={{ color: "transparent", fillColor: "#00704A", fillOpacity: 0.10 }}
        />

        {/* Growing region polygons — real GeoJSON where available, circle fallback otherwise */}
        {filters.layers.growingRegions && (
          <GrowingRegionLayer
            filteredCountries={filteredCountries}
            onCountryClick={id => setSelectedEntity({ type: "country", id })}
          />
        )}

        {/* Farm dot density — orange = Arabica, blue = Robusta */}
        {filters.layers.farms && filteredFarms.map(farm => {
          const species = getFarmSpecies(farm);
          const color  = species === "arabica" ? "#E8855A" : "#5B9BD5";
          const border = species === "arabica" ? "#C8622A" : "#2E6FA8";
          return (
            <CircleMarker
              key={farm.id}
              center={[farm.lat, farm.lng]}
              radius={5}
              pathOptions={{ color: border, fillColor: color, fillOpacity: 0.85, weight: 1 }}
              eventHandlers={{
                click:     () => setSelectedEntity({ type: "farm", id: farm.id }),
                mouseover: e => { e.target.setStyle({ radius: 8, fillOpacity: 1 }); },
                mouseout:  e => { e.target.setStyle({ radius: 5, fillOpacity: 0.85 }); },
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} className="bg-card border-border text-foreground rounded-lg shadow-xl p-0">
                <FarmTooltipContent farm={farm} />
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* Roaster pins */}
        {filters.layers.roasters && filteredRoasters.map(roaster => (
          <Marker
            key={roaster.id}
            position={[roaster.lat, roaster.lng]}
            icon={createRoasterIcon()}
            eventHandlers={{ click: () => setSelectedEntity({ type: "roaster", id: roaster.id }) }}
          >
            <Tooltip direction="top" offset={[0, -10]} className="bg-card border-border text-foreground rounded-lg shadow-xl p-0">
              <RoasterTooltipContent roaster={roaster} />
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Farm legend */}
      {filters.layers.farms && (
        <div className="absolute bottom-6 left-4 z-[1000] bg-sidebar/90 border border-border rounded-lg px-3 py-2.5 text-xs space-y-1.5 shadow-xl backdrop-blur-sm">
          <p className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px] mb-1">Farm Varieties</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full inline-block shrink-0" style={{ background: "#E8855A", border: "1px solid #C8622A" }} />
            <span className="text-foreground">C. arabica</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full inline-block shrink-0" style={{ background: "#5B9BD5", border: "1px solid #2E6FA8" }} />
            <span className="text-foreground">C. canephora (Robusta)</span>
          </div>
        </div>
      )}
    </div>
  );
}
