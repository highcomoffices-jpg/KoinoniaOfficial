import { useState, useEffect, useCallback } from 'react';
import { geoService } from '../services/geoService';

export const useGeoData = () => {
  const [continents, setContinents] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [confessions, setConfessions] = useState<any[]>([]);
  const [parishes, setParishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState({
    continents: true,
    countries: true,
    cities: false,
    confessions: true,
    parishes: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Load continents
  useEffect(() => {
    const loadContinents = async () => {
      try {
        const data = await geoService.getContinents();
        setContinents(data);
      } catch (err: any) {
        console.error('Error loading continents:', err);
        setError(err.message || 'Erreur de chargement des continents');
      } finally {
        setIsLoading(prev => ({ ...prev, continents: false }));
      }
    };

    loadContinents();
  }, []);

  // Load countries
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await geoService.getCountries();
        setCountries(data);
      } catch (err: any) {
        console.error('Error loading countries:', err);
        setError(err.message || 'Erreur de chargement des pays');
      } finally {
        setIsLoading(prev => ({ ...prev, countries: false }));
      }
    };

    loadCountries();
  }, []);

  // Load confessions
  useEffect(() => {
    const loadConfessions = async () => {
      try {
        const data = await geoService.getConfessions();
        setConfessions(data);
      } catch (err: any) {
        console.error('Error loading confessions:', err);
        setError(err.message || 'Erreur de chargement des confessions');
      } finally {
        setIsLoading(prev => ({ ...prev, confessions: false }));
      }
    };

    loadConfessions();
  }, []);

  // Load parishes
  useEffect(() => {
    const loadParishes = async () => {
      try {
        const data = await geoService.getParishes();
        setParishes(data);
      } catch (err: any) {
        console.error('Error loading parishes:', err);
        setError(err.message || 'Erreur de chargement des paroisses');
      } finally {
        setIsLoading(prev => ({ ...prev, parishes: false }));
      }
    };

    loadParishes();
  }, []);

  // Function to load cities for a specific country
  const loadCitiesByCountry = useCallback(async (countryId: string) => {
    if (!countryId) return;
    
    try {
      setIsLoading(prev => ({ ...prev, cities: true }));
      const data = await geoService.getCities(countryId);
      setCities(data);
      setError(null);
    } catch (err: any) {
      console.error('Error loading cities:', err);
      setError(err.message || 'Erreur de chargement des villes');
    } finally {
      setIsLoading(prev => ({ ...prev, cities: false }));
    }
  }, []);

  // Function to load parishes for a specific city and confession
  const loadParishesByCityAndConfession = useCallback(async (cityId?: string, confessionId?: string) => {
    try {
      setIsLoading(prev => ({ ...prev, parishes: true }));
      const data = await geoService.getParishes(cityId, confessionId);
      setParishes(data);
      setError(null);
    } catch (err: any) {
      console.error('Error loading parishes:', err);
      setError(err.message || 'Erreur de chargement des paroisses');
    } finally {
      setIsLoading(prev => ({ ...prev, parishes: false }));
    }
  }, []);

  const allLoading = Object.values(isLoading).some(value => value);

  return {
    // Data
    continents,
    countries,
    cities,
    confessions,
    parishes,
    
    // Loading states
    isLoading: allLoading,
    isLoadingContinents: isLoading.continents,
    isLoadingCountries: isLoading.countries,
    isLoadingCities: isLoading.cities,
    isLoadingConfessions: isLoading.confessions,
    isLoadingParishes: isLoading.parishes,
    
    // Error
    error,
    
    // Methods
    loadCitiesByCountry,
    loadParishesByCityAndConfession,
    
    // Helper functions
    getCountryById: (id: string) => countries.find(c => c.id === id),
    getCityById: (id: string) => cities.find(c => c.id === id),
    getConfessionById: (id: string) => confessions.find(c => c.id === id),
    getParishById: (id: string) => parishes.find(p => p.id === id),
  };
};