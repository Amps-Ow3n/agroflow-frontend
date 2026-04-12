import React, { useEffect, useState } from "react";
import api from "../../services/api";

import PageContainer from "../../components/layout/PageContainer";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/admin/users/${id}`);
      alert(res.data.message || "Deleted");
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || "Error deleting user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <LoadingSpinner message="Loading user registry..." />;
  if (!users.length) return <EmptyState message="No users found" />;

  return (
    <PageContainer title="User Management">

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-light">
                <tr>
                  <th className="px-3">ID</th>
                  <th>Role</th>
                  <th className="text-end px-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>

                    <td className="px-3 text-muted small">
                      {user.id}
                    </td>

                    <td className="fw-semibold">
                      {user.role}
                    </td>

                    <td className="text-end px-3">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
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

export default AdminUsersPage;