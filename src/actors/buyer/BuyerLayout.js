import { Outlet } from "react-router-dom";
import Sidebar from "../../shared/navigation/Sidebar";
import Navbar from "../../shared/navigation/Navbar";

const BuyerLayout = () => {

  return (

    <div
      className="d-flex"
      style={{
        background:"#F5F7F4",
        minHeight:"100vh"
      }}
    >

      <Sidebar/>

      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft:"260px"
        }}
      >

        <Navbar
          moduleTitle="Buyer Operations"
          interpretation="Demand monitoring and supplier intelligence."
          systemStatus="stable"
        />

        <main className="p-4 flex-grow-1">

          <Outlet/>

        </main>

      </div>

    </div>

  );
};

export default BuyerLayout;