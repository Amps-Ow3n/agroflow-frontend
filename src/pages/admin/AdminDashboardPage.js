import useDashboard from "../../hooks/useDashboard";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";

import SystemDashboard from "../../components/dashboards/SystemDashboard";

export default function AdminDashboardPage() {
  const { data, loading, error } = useDashboard("system");

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <h2 className="mb-4">Admin System Dashboard</h2>

      <SystemDashboard data={data} />
    </div>
  );
}