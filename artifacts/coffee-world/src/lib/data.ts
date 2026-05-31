import countriesData from "../data/countries.json";
import farmsData from "../data/farms.json";
import roastersData from "../data/roasters.json";
import varietiesData from "../data/varieties.json";
import processesData from "../data/processes.json";
import regionsData from "../data/regions.json";

export interface FlavorProfile {
  acidity: number;
  body: number;
  sweetness: number;
  fruity: number;
  earthy: number;
  roasted: number;
}

export interface FlavorArchetype {
  acidity: number;
  body: number;
  sweetness: number;
  fruity: number;
  earthy: number;
  complexity: number;
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  lat: number;
  lng: number;
  region: string;
  production_bags: number;
  harvest_season: string;
  altitude_range: string;
  varieties: string[];
  processes: string[];
  flavor_profile: FlavorProfile;
  sub_regions: string[];
  notable_farms: string[];
  fun_fact: string;
}

export interface Farm {
  id: string;
  name: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
  altitude: number;
  owner: string;
  varieties: string[];
  processes: string[];
  flavor_profile: FlavorProfile;
  tasting_notes: string;
  awards: string;
  // enriched fields
  region_id?: string;
  sourced_roasters?: string[];
  harvest_season?: string[];
  harvest_months?: string;
  sustainability?: string[];
}

export interface Roaster {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  founded: number;
  website: string;
  sourcing: string;
  signature_origins: string[];
  notable_coffees: string[];
  description: string;
  // enriched fields
  roast_styles?: string[];
  sourced_farms?: string[];
}

export interface Variety {
  id: string;
  name: string;
  aliases: string[];
  origin_country: string;
  origin_region: string;
  botanical_group: string;
  genetic_lineage: string;
  flavor_archetype: FlavorArchetype;
  flavor_notes: string[];
  known_for: string;
  cup_profile_summary: string;
  famous_examples: string[];
  best_countries: string[];
  altitude_preference_m: string;
  yield_potential: string;
  disease_resistance: string;
  specialty_market: string;
  first_cup_of_excellence: string;
}

export interface Process {
  id: string;
  name: string;
  description: string;
  steps: string[];
  flavor_impact: string;
  common_in: string[];
}

export interface Region {
  id: string;
  name: string;
  country_id: string;
  lat: number;
  lng: number;
  radius_km: number;
  // enriched fields
  description?: string;
  typical_altitude_m?: string;
  dominant_varieties?: string[];
  dominant_processes?: string[];
  harvest_months?: string;
  certifications?: string[];
}

export const getCountries = (): Country[] => countriesData as Country[];
export const getFarms = (): Farm[] => farmsData as Farm[];
export const getRoasters = (): Roaster[] => roastersData as Roaster[];
export const getVarieties = (): Variety[] => varietiesData as Variety[];
export const getProcesses = (): Process[] => processesData as Process[];
export const getRegions = (): Region[] => regionsData as Region[];
