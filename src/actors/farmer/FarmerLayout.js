import { Outlet } from "react-router-dom";
import AppLayout from "../../shared/layout/AppLayout";

const FarmerLayout = () => {
  return (
    <AppLayout
      title="Farmer Operations"
      interpretation="
      Manage capacity, commitments, delivery execution,
      and reliability intelligence.
      "
    >
      <Outlet />
    </AppLayout>
  );
};

export default FarmerLayout;