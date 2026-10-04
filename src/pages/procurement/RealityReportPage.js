import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getRealityReport } from "../../api/realityReportApi";
import { getApiError } from "../../utils/errors";
import {
  Page,
  Loading,
  Alert,
  Empty,
  Status,
} from "../../components/common/Page";

function value(value) {
  return value === null || value === undefined || value === "" ? "—" : value;
}

function severityClass(severity) {
  if (severity === "CRITICAL") return "danger";
  if (severity === "WARNING") return "warning";
  return "info";
}

export default function RealityReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getRealityReport(id)
      .then((data) => {
        if (mounted) setReport(data);
      })
      .catch((err) => {
        if (mounted) setError(getApiError(err, "Unable to generate the Reality Report."));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <Page title="Procurement Reality Report"><Loading /></Page>;
  }

  if (error || !report) {
    return (
      <Page title="Procurement Reality Report">
        <Alert>{error || "Report not available."}</Alert>
      </Page>
    );
  }

  const procurement = report.procurement || {};
  const fulfilment = report.fulfilment || {};
  const quality = report.quality || {};
  const completeness = report.report_completeness || {};
  const selection = report.selection;

  return (
    <Page
      title="Procurement Reality Report"
      subtitle={`${procurement.procurement_identifier || `Procurement #${procurement.id}`} · ${procurement.title || ""}`}
      actions={
        <Link
          className="btn btn-outline-dark"
          to={`/school/procurements/${procurement.id}`}
        >
          Back to procurement
        </Link>
      }
    >
      <div className="alert alert-light border mb-4">
        This report separates what was required, selected, promised, delivered,
        verified and evidenced. It does not treat a completed UI state as proof
        that the underlying procurement facts were fulfilled.
      </div>

      <div className="row g-3 mb-4">
        {[
          ["Required", fulfilment.required_quantity],
          ["Promised", fulfilment.promised_quantity],
          ["Delivered", fulfilment.delivered_quantity],
          ["Verified", fulfilment.verified_accepted_quantity],
          ["Inspections", quality.inspection_count],
          ["Evidence", report.evidence_summary?.count || 0],
        ].map(([label, number]) => (
          <div className="col-6 col-md-4 col-xl-2" key={label}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="small text-muted">{label}</div>
                <div className="fs-4 fw-bold mt-1">{value(number)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5>1. What was required?</h5>
              <p className="mb-2">{value(report.requirement?.description)}</p>
              <dl className="row mb-0">
                <dt className="col-sm-4">Item</dt>
                <dd className="col-sm-8">{report.requirement?.items?.map((item) => `${item.item_name} (${item.quantity} ${item.unit})`).join(", ") || "—"}</dd>
                <dt className="col-sm-4">Required by</dt>
                <dd className="col-sm-8">{value(report.requirement?.required_by_date)}</dd>
                <dt className="col-sm-4">Location</dt>
                <dd className="col-sm-8">{value(report.requirement?.location)}</dd>
                <dt className="col-sm-4">Method</dt>
                <dd className="col-sm-8">{value(report.requirement?.procurement_method)}</dd>
              </dl>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5>2. Who was selected and why?</h5>
              {selection ? (
                <>
                  <div className="fw-semibold">{selection.supplier_name || selection.supplier_code}</div>
                  <div className="small text-muted mb-2">Decision {selection.decision_sequence} · {selection.decision_type}</div>
                  <p className="mb-3">{selection.decision_reason}</p>
                </>
              ) : <Empty>No supplier selection decision is recorded.</Empty>}

              {report.evaluations?.length ? (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead><tr><th>Supplier</th><th>Eligibility</th><th>History</th><th>Explanation</th></tr></thead>
                    <tbody>
                      {report.evaluations.map((evaluation) => (
                        <tr key={evaluation.id}>
                          <td>{evaluation.supplier_name || evaluation.supplier_code}</td>
                          <td><Status value={evaluation.evaluation_status} /></td>
                          <td>{evaluation.historical_evidence_status}</td>
                          <td className="small">{evaluation.indicator_explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5>3. Promise → delivery → verification</h5>
              {report.fulfilment?.line_results?.length ? (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead><tr><th>Item</th><th>Ordered</th><th>Promised</th><th>Delivered</th><th>Variance</th></tr></thead>
                    <tbody>
                      {report.fulfilment.line_results.map((line) => (
                        <tr key={line.purchase_order_line_id}>
                          <td>{line.item_name}</td>
                          <td>{line.ordered_quantity} {line.unit}</td>
                          <td>{line.promised_quantity} {line.unit}</td>
                          <td>{line.delivered_quantity} {line.unit}</td>
                          <td>{line.variance_rate == null ? "—" : `${line.variance_rate}%`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <Empty>No purchase-order line facts are recorded yet.</Empty>}
              <div className="row g-3 mt-1">
                <div className="col-md-4"><div className="small text-muted">Promised vs required</div><strong>{value(fulfilment.promised_fulfilment_rate)}{fulfilment.promised_fulfilment_rate != null ? "%" : ""}</strong></div>
                <div className="col-md-4"><div className="small text-muted">Delivered vs promise</div><strong>{value(fulfilment.delivery_vs_promise_rate)}{fulfilment.delivery_vs_promise_rate != null ? "%" : ""}</strong></div>
                <div className="col-md-4"><div className="small text-muted">Verified vs promise</div><strong>{value(fulfilment.verified_vs_promise_rate)}{fulfilment.verified_vs_promise_rate != null ? "%" : ""}</strong></div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5>4. What was verified?</h5>
              {report.inspections?.length ? (
                report.inspections.map((inspection) => (
                  <div className="border rounded p-3 mb-2" key={inspection.id}>
                    <div className="d-flex justify-content-between">
                      <strong>Inspection #{inspection.id}</strong>
                      <Status value={inspection.result} />
                    </div>
                    <div className="small text-muted mt-1">
                      {inspection.received_qty} received · {inspection.quality_status} quality · {inspection.delay_status} · {inspection.inspected_by_name || "—"}
                    </div>
                    {inspection.rejection_reason && <div className="small text-danger mt-2">Reason: {inspection.rejection_reason}</div>}
                    {inspection.notes && <div className="small mt-2">{inspection.notes}</div>}
                  </div>
                ))
              ) : <Empty>No inspection has been recorded yet.</Empty>}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5>Reality findings</h5>
              {report.findings?.length ? report.findings.map((finding, index) => (
                <div className={`alert alert-${severityClass(finding.severity)} py-2`} key={`${finding.severity}-${index}`}>
                  {finding.message}
                </div>
              )) : <div className="alert alert-success">No material exception was detected from the recorded evidence.</div>}
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5>Evidence</h5>
              <div className="small text-muted mb-2">{report.evidence_summary?.count || 0} active document(s)</div>
              {report.evidence?.length ? (
                <ul className="list-group list-group-flush">
                  {report.evidence.map((document) => <li className="list-group-item px-0" key={document.id}>{document.document_type}<div className="small text-muted">{document.original_filename}</div></li>)}
                </ul>
              ) : <Empty>No evidence attached.</Empty>}
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5>Historical supplier evidence</h5>
              {report.historical_supplier_performance ? (
                <dl className="row mb-0 small">
                  <dt className="col-7">Observations</dt><dd className="col-5">{report.historical_supplier_performance.observation_count}</dd>
                  <dt className="col-7">Fulfilment</dt><dd className="col-5">{value(report.historical_supplier_performance.fulfilment_rate)}{report.historical_supplier_performance.fulfilment_rate != null ? "%" : ""}</dd>
                  <dt className="col-7">On time</dt><dd className="col-5">{value(report.historical_supplier_performance.on_time_delivery_rate)}{report.historical_supplier_performance.on_time_delivery_rate != null ? "%" : ""}</dd>
                  <dt className="col-7">Quality</dt><dd className="col-5">{value(report.historical_supplier_performance.quality_acceptance_rate)}{report.historical_supplier_performance.quality_acceptance_rate != null ? "%" : ""}</dd>
                  <dt className="col-7">Status</dt><dd className="col-5">{report.historical_supplier_performance.status}</dd>
                </dl>
              ) : <Empty>No historical supplier record exists.</Empty>}
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5>What should be considered next time?</h5>
              <ul className="mb-0">
                {(report.what_should_be_considered_next_time || []).map((item, index) => <li key={index} className="mb-2">{item}</li>)}
              </ul>
              <hr />
              <div className="small text-muted">Cycle completion</div>
              <div className="mt-2">
                {Object.entries(completeness).map(([key, done]) => (
                  <span className={`badge ${done ? "text-bg-success" : "text-bg-light"} me-1 mb-1`} key={key}>{key.replaceAll("_", " ")}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
