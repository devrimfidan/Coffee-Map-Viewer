import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Rectangle, CircleMarker } from "react-leaflet";
import { useMap } from "@/context/MapContext";
import "@/lib/leaflet-icons";
import { createFarmIcon, createRoasterIcon } from "@/lib/leaflet-icons";
import L from "leaflet";

const MAP_CENTER: [number, number] = [10, 20];
const MAP_ZOOM = 3;
const COFFEE_BELT_BOUNDS: L.LatLngBoundsExpression = [[-23.5, -180], [23.5, 180]];

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

      <Rectangle 
        bounds={COFFEE_BELT_BOUNDS} 
        pathOptions={{ color: 'transparent', fillColor: '#00704A', fillOpacity: 0.12 }} 
      />

      {filters.layers.growingRegions && filteredCountries.map(country => (
        <CircleMarker
          key={country.id}
          center={[country.lat, country.lng]}
          radius={35}
          pathOptions={{ 
            color: '#C8A96E', 
            fillColor: '#C8A96E', 
            fillOpacity: 0.1, 
            weight: 1 
          }}
          eventHandlers={{
            click: () => setSelectedEntity({ type: 'country', id: country.id }),
            mouseover: (e) => {
              e.target.setStyle({ fillOpacity: 0.3 });
            },
            mouseout: (e) => {
              e.target.setStyle({ fillOpacity: 0.1 });
            }
          }}
        >
          <Tooltip direction="top" offset={[0, -20]} className="bg-card border-border text-foreground rounded shadow-xl">
            <div className="p-1">
              <p className="font-serif font-bold text-lg text-primary">{country.name}</p>
              <p className="text-xs text-muted-foreground mt-1">Prod: {(country.production_bags / 1000000).toFixed(1)}M bags</p>
              <p className="text-xs text-muted-foreground">Varieties: {country.varieties.join(", ")}</p>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}

      {filters.layers.farms && filteredFarms.map(farm => (
        <Marker 
          key={farm.id} 
          position={[farm.lat, farm.lng]} 
          icon={createFarmIcon()}
          eventHandlers={{
            click: () => setSelectedEntity({ type: 'farm', id: farm.id })
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} className="bg-card border-border text-foreground rounded shadow-xl">
            <span className="font-medium text-sm">{farm.name}</span>
          </Tooltip>
        </Marker>
      ))}

      {filters.layers.roasters && filteredRoasters.map(roaster => (
        <Marker 
          key={roaster.id} 
          position={[roaster.lat, roaster.lng]} 
          icon={createRoasterIcon()}
          eventHandlers={{
            click: () => setSelectedEntity({ type: 'roaster', id: roaster.id })
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} className="bg-card border-border text-foreground rounded shadow-xl">
            <span className="font-medium text-sm">{roaster.name}</span>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
