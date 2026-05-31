import type { Feature, Polygon, FeatureCollection } from "geojson";
import type { Region } from "./data";

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function toDeg(rad: number) { return (rad * 180) / Math.PI; }

/**
 * Converts a centre point + radius into a GeoJSON ring of `numPoints` vertices
 * using spherical-Earth (Haversine) maths so the radius is accurate in km.
 * Returns coordinates in GeoJSON order: [longitude, latitude].
 */
function circleToRing(lat: number, lng: number, radiusKm: number, numPoints = 72): [number, number][] {
  const latR = toRad(lat);
  const lngR = toRad(lng);
  const d = radiusKm / EARTH_RADIUS_KM; // angular distance in radians

  const ring: [number, number][] = [];
  for (let i = 0; i < numPoints; i++) {
    const bearing = toRad((360 / numPoints) * i);
    const lat2 = Math.asin(
      Math.sin(latR) * Math.cos(d) +
      Math.cos(latR) * Math.sin(d) * Math.cos(bearing)
    );
    const lng2 =
      lngR +
      Math.atan2(
        Math.sin(bearing) * Math.sin(d) * Math.cos(latR),
        Math.cos(d) - Math.sin(latR) * Math.sin(lat2)
      );
    ring.push([toDeg(lng2), toDeg(lat2)]);
  }
  // Close the ring (first point repeated at the end)
  ring.push(ring[0]);
  return ring;
}

export interface RegionProperties {
  id: string;
  name: string;
  country_id: string;
  radius_km: number;
}

/**
 * Builds a GeoJSON FeatureCollection of filled Polygons from the regions array.
 * Each polygon approximates the circle described by lat/lng/radius_km.
 * Pass `numPoints` to control polygon smoothness (64–96 is a good range).
 */
export function regionsToGeoJSON(
  regions: Region[],
  numPoints = 72
): FeatureCollection<Polygon, RegionProperties> {
  const features: Feature<Polygon, RegionProperties>[] = regions.map((r) => ({
    type: "Feature",
    properties: { id: r.id, name: r.name, country_id: r.country_id, radius_km: r.radius_km },
    geometry: {
      type: "Polygon",
      coordinates: [circleToRing(r.lat, r.lng, r.radius_km, numPoints)],
    },
  }));

  return { type: "FeatureCollection", features };
}
