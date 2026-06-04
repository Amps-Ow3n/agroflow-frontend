import { Outlet } from "react-router-dom";
import AppLayout from "../../shared/layout/AppLayout";

const AdminLayout = () => {
  return (
    <AppLayout
      title="AgroFlow Intelligence Control Center"
      interpretation="
      Monitor system stability, risk behavior,
      feasibility and decision signals.
      "
    >
      <Outlet />
    </AppLayout>
  );
};

export default AdminLayout;