import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Tooltip, Rectangle, CircleMarker } from "react-leaflet";
import { useMap } from "@/context/MapContext";
import "@/lib/leaflet-icons";
import L from "leaflet";
import { Farm, Roaster } from "@/lib/data";
import { createRoasterIcon } from "@/lib/leaflet-icons";
import { Marker } from "react-leaflet";

const MAP_CENTER: [number, number] = [10, 20];
const MAP_ZOOM = 3;
const COFFEE_BELT_BOUNDS: L.LatLngBoundsExpression = [[-23.5, -180], [23.5, 180]];

const ARABICA_CULTIVARS = [
  'Heirloom', 'Bourbon', 'Red Bourbon', 'Yellow Bourbon', 'Pink Bourbon',
  'Typica', 'Caturra', 'Catuai', 'Yellow Catuai', 'SL28', 'SL34', 'SL14',
  'Pacamara', 'Gesha', 'Geisha', 'Mundo Novo', 'Castillo', 'Colombia',
  'Kent', '74110', '74112', 'Arabica',
];
const ROBUSTA_CULTIVARS = ['Robusta', 'Canephora'];

function getFarmSpecies(farm: Farm): 'arabica' | 'robusta' {
  if (farm.varieties.some(v => ROBUSTA_CULTIVARS.some(r => v.toLowerCase().includes(r.toLowerCase())))) {
    return 'robusta';
  }
  return 'arabica';
}

function FarmTooltipContent({ farm }: { farm: Farm }) {
  const shortNotes = farm.tasting_notes
    ? farm.tasting_notes.length > 80
      ? farm.tasting_notes.substring(0, 80) + "…"
      : farm.tasting_notes
    : null;

  return (
    <div style={{ width: 220, overflow: 'hidden' }} className="p-2">
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
        <p className="text-xs text-muted-foreground mt-1.5 italic leading-relaxed border-t border-border/50 pt-1.5"
           style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          "{shortNotes}"
        </p>
      )}
    </div>
  );
}

function RoasterTooltipContent({ roaster }: { roaster: Roaster }) {
  const shortSourcing = roaster.sourcing
    ? roaster.sourcing.length > 70
      ? roaster.sourcing.substring(0, 70) + "…"
      : roaster.sourcing
    : null;

  return (
    <div style={{ width: 220, overflow: 'hidden' }} className="p-2">
      <p className="font-bold text-sm text-primary leading-tight truncate">{roaster.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5 truncate">
        {roaster.city}, {roaster.country} · est. {roaster.founded}
      </p>
      {shortSourcing && (
        <p className="text-xs text-foreground mt-1.5 leading-relaxed"
           style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {shortSourcing}
        </p>
      )}
      {roaster.signature_origins.length > 0 && (
        <p className="text-xs text-primary/80 mt-1.5 border-t border-border/50 pt-1.5 truncate">
          {roaster.signature_origins.slice(0, 5).join(" · ")}
        </p>
      )}
      {roaster.notable_coffees.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1 truncate">
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
      let entity: { lat: number; lng: number } | undefined;
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

        {/* Coffee Belt */}
        <Rectangle
          bounds={COFFEE_BELT_BOUNDS}
          pathOptions={{ color: 'transparent', fillColor: '#00704A', fillOpacity: 0.12 }}
        />

        {/* Growing Region country markers — scaled by production volume */}
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
              <div style={{ width: 190, overflow: 'hidden' }} className="p-1.5">
                <p className="font-bold text-sm text-primary truncate">{country.flag} {country.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {(country.production_bags / 1000000).toFixed(1)}M bags/yr · {country.altitude_range}
                </p>
                <p className="text-xs text-foreground mt-1 truncate">{country.varieties.slice(0, 3).join(", ")}</p>
                <p className="text-xs text-muted-foreground truncate">{country.processes.join(", ")}</p>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

        {/* Farm dot density map — orange = Arabica, blue = Robusta */}
        {filters.layers.farms && filteredFarms.map(farm => {
          const species = getFarmSpecies(farm);
          const color = species === 'arabica' ? '#E8855A' : '#5B9BD5';
          const borderColor = species === 'arabica' ? '#C8622A' : '#2E6FA8';
          return (
            <CircleMarker
              key={farm.id}
              center={[farm.lat, farm.lng]}
              radius={5}
              pathOptions={{
                color: borderColor,
                fillColor: color,
                fillOpacity: 0.85,
                weight: 1
              }}
              eventHandlers={{
                click: () => setSelectedEntity({ type: 'farm', id: farm.id }),
                mouseover: (e) => { e.target.setStyle({ radius: 8, fillOpacity: 1 }); },
                mouseout: (e) => { e.target.setStyle({ radius: 5, fillOpacity: 0.85 }); }
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

      {/* Legend */}
      {filters.layers.farms && (
        <div className="absolute bottom-6 right-4 z-[1000] bg-sidebar/90 border border-border rounded-lg px-3 py-2.5 text-xs space-y-1.5 shadow-xl backdrop-blur-sm">
          <p className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px] mb-1">Farm Varieties</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full inline-block flex-shrink-0" style={{ background: '#E8855A', border: '1px solid #C8622A' }} />
            <span className="text-foreground">C. arabica</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full inline-block flex-shrink-0" style={{ background: '#5B9BD5', border: '1px solid #2E6FA8' }} />
            <span className="text-foreground">C. canephora (Robusta)</span>
          </div>
        </div>
      )}
    </div>
  );
}
