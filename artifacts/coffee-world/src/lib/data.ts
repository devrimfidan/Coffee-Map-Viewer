import countriesData from "../data/countries.json";
import farmsData from "../data/farms.json";
import roastersData from "../data/roasters.json";
import varietiesData from "../data/varieties.json";
import processesData from "../data/processes.json";

export interface FlavorProfile {
  acidity: number;
  body: number;
  sweetness: number;
  fruity: number;
  earthy: number;
  roasted: number;
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
}

export interface Variety {
  id: string;
  name: string;
  origin: string;
  characteristics: string;
  flavor_profile: FlavorProfile;
  description: string;
  notable_origins: string[];
}

export interface Process {
  id: string;
  name: string;
  description: string;
  steps: string[];
  flavor_impact: string;
  common_in: string[];
}

export const getCountries = (): Country[] => countriesData as Country[];
export const getFarms = (): Farm[] => farmsData as Farm[];
export const getRoasters = (): Roaster[] => roastersData as Roaster[];
export const getVarieties = (): Variety[] => varietiesData as Variety[];
export const getProcesses = (): Process[] => processesData as Process[];
