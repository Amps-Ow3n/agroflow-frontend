import { useEffect, useState, useCallback } from "react";
import {
  getSupplies,
  createSupply,
  updateSupply,
  deleteSupply,
} from "./supplyService";

export function useSupplies() {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSupplies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getSupplies();
      setSupplies(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error fetching supplies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupplies();
  }, [fetchSupplies]);

  const addSupply = async (payload) => {
    await createSupply(payload);
    await fetchSupplies();
  };

  const editSupply = async (id, payload) => {
    await updateSupply(id, payload);
    await fetchSupplies();
  };

  const removeSupply = async (id) => {
    await deleteSupply(id);
    await fetchSupplies();
  };

  return {
    supplies,
    loading,
    error,
    refetch: fetchSupplies,
    addSupply,
    editSupply,
    removeSupply,
  };
}