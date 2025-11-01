import { useState, useEffect } from 'react';
import { cakesAPI } from '../services/api';

export const useCakes = () => {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const response = await cakesAPI.getAll();
      setCakes(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedCakes = async () => {
    try {
      const response = await cakesAPI.getFeatured();
      return response.data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  return {
    cakes,
    loading,
    error,
    refetch: fetchCakes,
    fetchFeaturedCakes
  };
};