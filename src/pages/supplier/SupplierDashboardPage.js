import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getSupplierCommitments } from "../../api/commitmentApi";
import { getMySupplierPerformance } from "../../api/performanceApi";
import { getMySupplier } from "../../api/supplierApi";

import {
  Page,
  Loading,
  Empty,
  Status,
  Alert,
} from "../../components/common/Page";

import { getApiError } from "../../utils/errors";
import { useAuth } from "../../context/AuthContext";


export default function SupplierDashboardPage() {

  const { activeOrganization } = useAuth();

  const [d, setD] = useState([]);
  const [s, setS] = useState(null);
  const [p, setP] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    async function loadDashboard() {

      setLoading(true);
      setError("");

      const results = await Promise.allSettled([
        getSupplierCommitments(),
        getMySupplier(),
        getMySupplierPerformance(),
      ]);


      // --------------------------------------------------
      // COMMITMENTS
      // --------------------------------------------------

      const commitmentsResult = results[0];

      if (commitmentsResult.status === "fulfilled") {

        const value = commitmentsResult.value;

        setD(
          Array.isArray(value)
            ? value
            : value?.commitments || []
        );

      } else {

        setD([]);

        setError(
          getApiError(
            commitmentsResult.reason
          )
        );
      }


      // --------------------------------------------------
      // SUPPLIER PROFILE
      // --------------------------------------------------

      const supplierResult = results[1];

      if (supplierResult.status === "fulfilled") {

        setS(
          supplierResult.value
        );

      } else {

        setS(null);

        if (!error) {
          setError(
            getApiError(
              supplierResult.reason
            )
          );
        }
      }


      // --------------------------------------------------
      // PERFORMANCE
      // --------------------------------------------------

      const performanceResult = results[2];

      if (performanceResult.status === "fulfilled") {

        setP(
          performanceResult.value
        );

      } else {

        setP(null);

        // Performance failure should not prevent
        // commitments and supplier profile from rendering.

      }


      setLoading(false);
    }


    loadDashboard();

  }, []);


  return (
    <Page
      title="Supplier operations"
      subtitle={`Manage ${activeOrganization?.name || "your supplier organization"}, commitments and historical performance.`}
      actions={
        <Link
          className="btn btn-dark"
          to="/supplier/profile"
        >
          Supplier profile
        </Link>
      }
    >

      {loading ? (

        <Loading />

      ) : (

        <>

          {error && (
            <Alert>
              {error}
            </Alert>
          )}


          <div className="row g-3 mb-4">

            {/* SUPPLIER */}

            <div className="col-md-4">

              <div className="card border-0 shadow-sm p-3">

                <small className="text-muted">
                  Supplier
                </small>

                <strong>
                  {s?.supplier?.organization_name ||
                    s?.supplier?.supplier_code ||
                    "—"}
                </strong>

              </div>

            </div>


            {/* COMMITMENTS */}

            <div className="col-md-4">

              <div className="card border-0 shadow-sm p-3">

                <small className="text-muted">
                  Commitments
                </small>

                <strong className="fs-4">
                  {d.length}
                </strong>

              </div>

            </div>


            {/* PERFORMANCE */}

            <div className="col-md-4">

              <div className="card border-0 shadow-sm p-3">

                <small className="text-muted">
                  Performance
                </small>

                <strong>
                  {p?.performance?.status ||
                    "NO_HISTORY"}
                </strong>

              </div>

            </div>

          </div>


          {/* RECENT COMMITMENTS */}

          <div className="card border-0 shadow-sm p-4">

            <h5>
              Recent commitments
            </h5>


            {!d.length ? (

              <Empty>
                No commitments yet.
              </Empty>

            ) : (

              d
                .slice(0, 8)
                .map((c) => (

                  <div
                    className="d-flex justify-content-between border-bottom py-2"
                    key={c.id}
                  >

                    <div>

                      <strong>
                        {c.item_name ||
                          c.product ||
                          `Commitment #${c.id}`}
                      </strong>

                      <div className="small text-muted">

                        {c.order_number &&
                          `${c.order_number} · `}

                        {c.promised_qty != null &&
                          `${c.promised_qty} ${c.unit || ""}`}

                      </div>

                    </div>


                    <Status
                      value={c.status}
                    />

                  </div>

                ))

            )}

          </div>

        </>

      )}

    </Page>
  );
}