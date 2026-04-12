import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const FarmerLayout = () => {
  return (
    <div className="d-flex" style={{ background: "#F5F7F4", minHeight: "100vh" }}>

      <Sidebar />

      {/* MAIN AREA */}
      <div
        className="d-flex flex-column flex-grow-1"
        style={{
          marginLeft: "260px",
          width: "100%",
        }}
      >

        <Navbar
          moduleTitle="Farmer Operations"
          interpretation="Track supply commitments, delivery reliability and crop feasibility signals."
          systemStatus="stable"
        />

        <main className="flex-grow-1 p-3 p-md-4" style={{ minWidth: 0 }}>
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default FarmerLayout;