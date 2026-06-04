import React, { useEffect, useState } from "react";
import SupplyForm from "./SupplyForm";
import SupplyTable from "./SupplyTable";

import { createSupply, getSupplies, deleteSupply } from "./supplyService";

const CapacityCenter = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getSupplies();
    setSupplies(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (payload) => {
    await createSupply(payload);
    load();
  };

  const handleDelete = async (id) => {
    await deleteSupply(id);
    load();
  };

  return (
    <div>
      <h3>Supply Capacity Center</h3>

      <SupplyForm onSubmit={handleCreate} loading={loading} />

      <SupplyTable
        supplies={supplies}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CapacityCenter;