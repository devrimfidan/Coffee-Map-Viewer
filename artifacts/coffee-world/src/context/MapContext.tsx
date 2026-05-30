import React, { createContext, useContext, useState, useMemo } from 'react';
import { Country, Farm, Roaster, getCountries, getFarms, getRoasters } from '../lib/data';

interface FilterState {
  search: string;
  layers: {
    growingRegions: boolean;
    farms: boolean;
    roasters: boolean;
    tradeRoutes: boolean;
  };
  varieties: string[];
  processes: string[];
  flavors: string[];
  altitude: [number, number];
  region: string;
}

interface SelectedEntity {
  type: 'country' | 'farm' | 'roaster';
  id: string;
}

interface MapContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedEntity: SelectedEntity | null;
  setSelectedEntity: React.Dispatch<React.SetStateAction<SelectedEntity | null>>;
  filteredCountries: Country[];
  filteredFarms: Farm[];
  filteredRoasters: Roaster[];
}

const defaultFilters: FilterState = {
  search: '',
  layers: {
    growingRegions: true,
    farms: true,
    roasters: true,
    tradeRoutes: false,
  },
  varieties: [],
  processes: [],
  flavors: [],
  altitude: [0, 3000],
  region: 'All Regions'
};

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);

  const countries = useMemo(() => getCountries(), []);
  const farms = useMemo(() => getFarms(), []);
  const roasters = useMemo(() => getRoasters(), []);

  // Simple filtering logic
  const filteredCountries = useMemo(() => {
    let result = countries;
    if (filters.region !== 'All Regions') {
      result = result.filter(c => c.region === filters.region);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q));
    }
    return result;
  }, [countries, filters]);

  const filteredFarms = useMemo(() => {
    let result = farms;
    if (filters.varieties.length > 0) {
      result = result.filter(f => f.varieties.some(v => filters.varieties.includes(v)));
    }
    if (filters.processes.length > 0) {
      result = result.filter(f => f.processes.some(p => filters.processes.includes(p)));
    }
    if (filters.altitude[0] > 0 || filters.altitude[1] < 3000) {
      result = result.filter(f => f.altitude >= filters.altitude[0] && f.altitude <= filters.altitude[1]);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(f => f.name.toLowerCase().includes(q) || f.country.toLowerCase().includes(q));
    }
    return result;
  }, [farms, filters]);

  const filteredRoasters = useMemo(() => {
    let result = roasters;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q));
    }
    return result;
  }, [roasters, filters]);

  return (
    <MapContext.Provider value={{
      filters, setFilters,
      selectedEntity, setSelectedEntity,
      filteredCountries, filteredFarms, filteredRoasters
    }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}
