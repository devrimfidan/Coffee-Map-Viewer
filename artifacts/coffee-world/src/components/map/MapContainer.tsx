import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Rectangle, CircleMarker, Circle } from "react-leaflet";
import { useMap } from "@/context/MapContext";
import "@/lib/leaflet-icons";
import { createFarmIcon, createRoasterIcon } from "@/lib/leaflet-icons";
import L from "leaflet";
import { Farm, Roaster } from "@/lib/data";

const MAP_CENTER: [number, number] = [10, 20];
const MAP_ZOOM = 3;
const COFFEE_BELT_BOUNDS: L.LatLngBoundsExpression = [[-23.5, -180], [23.5, 180]];

function FarmHeatmap({ farms }: { farms: Farm[] }) {
  const renderer = useMemo(() => L.canvas({ padding: 0.5 }), []);
  return (
    <>
      {farms.map(farm => (
        <Circle
          key={`heat-outer-${farm.id}`}
          center={[farm.lat, farm.lng]}
          radius={180000}
          renderer={renderer}
          pathOptions={{ color: "transparent", fillColor: "#C8A96E", fillOpacity: 0.018, weight: 0 }}
        />
      ))}
      {farms.map(farm => (
        <Circle
          key={`heat-mid-${farm.id}`}
          center={[farm.lat, farm.lng]}
          radius={70000}
          renderer={renderer}
          pathOptions={{ color: "transparent", fillColor: "#C8A96E", fillOpacity: 0.032, weight: 0 }}
        />
      ))}
      {farms.map(farm => (
        <Circle
          key={`heat-inner-${farm.id}`}
          center={[farm.lat, farm.lng]}
          radius={20000}
          renderer={renderer}
          pathOptions={{ color: "transparent", fillColor: "#ff9d3b", fillOpacity: 0.06, weight: 0 }}
        />
      ))}
    </>
  );
}

function FarmTooltipContent({ farm }: { farm: Farm }) {
  return (
    <div className="p-1.5 min-w-[180px] max-w-[240px]">
      <p className="font-bold text-sm text-primary leading-tight">{farm.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{farm.region}, {farm.country}</p>
      <div className="flex items-center gap-3 mt-1.5 text-xs text-foreground">
        <span className="flex items-center gap-1">
          <span className="text-muted-foreground">↑</span> {farm.altitude}m
        </span>
        <span className="text-muted-foreground">·</span>
        <span>{farm.processes.slice(0, 2).join(", ")}</span>
      </div>
      {farm.varieties.length > 0 && (
        <p className="text-xs text-primary/80 mt-1">{farm.varieties.slice(0, 3).join(", ")}</p>
      )}
      {farm.tasting_notes && (
        <p className="text-xs text-muted-foreground mt-1.5 italic leading-relaxed border-t border-border/50 pt-1.5">
          "{farm.tasting_notes.length > 90 ? farm.tasting_notes.substring(0, 90) + "…" : farm.tasting_notes}"
        </p>
      )}
    </div>
  );
}

function RoasterTooltipContent({ roaster }: { roaster: Roaster }) {
  return (
    <div className="p-1.5 min-w-[180px] max-w-[240px]">
      <p className="font-bold text-sm text-primary leading-tight">{roaster.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{roaster.city}, {roaster.country} · est. {roaster.founded}</p>
      {roaster.sourcing && (
        <p className="text-xs text-foreground mt-1.5 leading-relaxed">
          {roaster.sourcing.length > 80 ? roaster.sourcing.substring(0, 80) + "…" : roaster.sourcing}
        </p>
      )}
      {roaster.signature_origins.length > 0 && (
        <p className="text-xs text-primary/80 mt-1.5 border-t border-border/50 pt-1.5">
          {roaster.signature_origins.slice(0, 5).join(" · ")}
        </p>
      )}
      {roaster.notable_coffees.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          {roaster.notable_coffees.slice(0, 2).join(", ")}
        </p>
      )}
    </div>
  );
}

export default function CoffeeMap() {
  const {
    filters,
    filteredCountries,
    filteredFarms,
    filteredRoasters,
    selectedEntity,
    setSelectedEntity
  } = useMap();

  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (selectedEntity && mapRef.current) {
      let entity;
      if (selectedEntity.type === 'country') {
        entity = filteredCountries.find(c => c.id === selectedEntity.id);
      } else if (selectedEntity.type === 'farm') {
        entity = filteredFarms.find(f => f.id === selectedEntity.id);
      } else if (selectedEntity.type === 'roaster') {
        entity = filteredRoasters.find(r => r.id === selectedEntity.id);
      }

      if (entity) {
        mapRef.current.flyTo([entity.lat, entity.lng], 6, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    }
  }, [selectedEntity, filteredCountries, filteredFarms, filteredRoasters]);

  return (
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

      {/* Coffee Belt */}
      <Rectangle
        bounds={COFFEE_BELT_BOUNDS}
        pathOptions={{ color: 'transparent', fillColor: '#00704A', fillOpacity: 0.12 }}
      />

      {/* Farm heatmap — canvas circles showing production density */}
      {filters.layers.farms && <FarmHeatmap farms={filteredFarms} />}

      {/* Growing Region country markers */}
      {filters.layers.growingRegions && filteredCountries.map(country => (
        <CircleMarker
          key={country.id}
          center={[country.lat, country.lng]}
          radius={Math.max(12, Math.min(36, country.production_bags / 350000))}
          pathOptions={{
            color: '#C8A96E',
            fillColor: '#C8A96E',
            fillOpacity: 0.12,
            weight: 1
          }}
          eventHandlers={{
            click: () => setSelectedEntity({ type: 'country', id: country.id }),
            mouseover: (e) => { e.target.setStyle({ fillOpacity: 0.35, weight: 2 }); },
            mouseout: (e) => { e.target.setStyle({ fillOpacity: 0.12, weight: 1 }); }
          }}
        >
          <Tooltip direction="top" offset={[0, -20]} className="bg-card border-border text-foreground rounded shadow-xl">
            <div className="p-1">
              <p className="font-bold text-base text-primary">{country.flag} {country.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{(country.production_bags / 1000000).toFixed(1)}M bags/yr · {country.altitude_range}</p>
              <p className="text-xs text-foreground mt-1">{country.varieties.slice(0, 3).join(", ")}</p>
              <p className="text-xs text-muted-foreground">{country.processes.join(", ")}</p>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}

      {/* Farm pins */}
      {filters.layers.farms && filteredFarms.map(farm => (
        <Marker
          key={farm.id}
          position={[farm.lat, farm.lng]}
          icon={createFarmIcon()}
          eventHandlers={{
            click: () => setSelectedEntity({ type: 'farm', id: farm.id })
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} className="bg-card border-border text-foreground rounded-lg shadow-xl p-0">
            <FarmTooltipContent farm={farm} />
          </Tooltip>
        </Marker>
      ))}

      {/* Roaster pins */}
      {filters.layers.roasters && filteredRoasters.map(roaster => (
        <Marker
          key={roaster.id}
          position={[roaster.lat, roaster.lng]}
          icon={createRoasterIcon()}
          eventHandlers={{
            click: () => setSelectedEntity({ type: 'roaster', id: roaster.id })
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} className="bg-card border-border text-foreground rounded-lg shadow-xl p-0">
            <RoasterTooltipContent roaster={roaster} />
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
