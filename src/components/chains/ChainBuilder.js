import React, { useState } from "react";
import { buildChain } from "../../api/chainApi";
import Button from "../common/Button";
import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";

export default function ChainBuilder({ commitmentId, onBuilt }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuild = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await buildChain(commitmentId);

      if (onBuilt) onBuilt(result);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to build chain"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 border rounded bg-white">
      <h3 className="font-bold mb-2">
        Build Procurement Chain
      </h3>

      {error && <ErrorState message={error} />}

      {loading ? (
        <Loader text="Building chain..." />
      ) : (
        <Button onClick={handleBuild}>
          Build Chain
        </Button>
      )}
    </div>
  );
}