import { useEffect, useState } from "react";

import { getSystemFailureMap } from "../../api/dashboardApi";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import Table from "../../components/common/Table";
import StatusBadge from "../../components/common/StatusBadge";

export default function TruthAuditPage() {
  const [failures, setFailures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFailures();
  }, []);

  async function loadFailures() {
    try {
      const data = await getSystemFailureMap();
      console.log("TRUTH AUDIT DATA:",data);
      setFailures(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  if (!failures.length) {
    return <EmptyState message="No failure records found." />;
  }

  const columns=[

{
header:"Commitment ID",
accessor:"commitment_id"
},

{
header:"Failure Type",
render:(row)=>(
<StatusBadge status={row.failure_type}/>
)
},

{
header:"Severity",
accessor:"severity"
},

{
header:"Supplier",
accessor:"supplier"
},

{
header:"School",
accessor:"school"
}

];

  return (
    <div>
      <h2 className="mb-4">Truth Audit</h2>
      <Table
columns={columns}
data={failures}
/>
    </div>
  );
}