import { useEffect, useState } from "react";

import { getSupplierDashboard } from "../api/dashboardApi";
import { getSchoolDashboard } from "../api/dashboardApi";
import { getSystemDashboard } from "../api/dashboardApi";

/**
 * Type-C Hook:
 * Centralized dashboard state orchestration
 */
export default function useDashboard(type) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);

        let res;

        // ----------------------------
        // ROUTE DISPATCH (Type-C mapping layer)
        // ----------------------------
        if (type === "supplier") {
          res = await getSupplierDashboard();
        } else if (type === "school") {
          res = await getSchoolDashboard();
        } else if (type === "system") {
          res = await getSystemDashboard();
        } else {
          throw new Error("Invalid dashboard type");
        }

        if (mounted) {
          setData(res);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Dashboard load failed");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, [type]);

  return {
    data,
    loading,
    error,
  };
}