import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFarmers } from "../../services/farmerService";
import { useAuth } from "../../context/AuthContext";

import PageContainer from "../../components/layout/PageContainer";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

const AdminFarmersListPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const data = await getFarmers(token);
      setFarmers(data);
    } catch (err) {
      setError(err.message || "Failed to load farmers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  if (loading) return <LoadingSpinner message="Loading farmer network..." />;
  if (error) return <EmptyState message={error} />;
  if (!farmers.length) return <EmptyState message="No farmers found" />;

  return (
    <PageContainer title="Farmer Network Intelligence">

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-light">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th>Name</th>
                  <th className="d-none d-md-table-cell">Email</th>
                  <th className="text-end px-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {farmers.map((f) => (
                  <tr key={f.id}>
                    <td className="px-3 text-muted small">{f.id}</td>

                    <td className="fw-semibold">{f.name}</td>

                    <td className="d-none d-md-table-cell text-muted small">
                      {f.email}
                    </td>

                    <td className="text-end px-3">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => navigate(`/admin/farmer/${f.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>
      </div>

    </PageContainer>
  );
};

export default AdminFarmersListPage;