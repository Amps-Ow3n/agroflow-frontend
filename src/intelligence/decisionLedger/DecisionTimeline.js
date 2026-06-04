import React from "react";
import { formatDate } from "../../shared/utils/dateHelpers";

const eventColor = (type) => {
  switch (type) {
    case "RISK":
      return "danger";
    case "COMMITMENT":
      return "warning";
    case "SUPPLY":
      return "primary";
    case "DELIVERY":
      return "success";
    default:
      return "secondary";
  }
};

const DecisionTimeline = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-muted small">
        No decision history available.
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">

      {events.map((event, idx) => (
        <div key={idx} className="d-flex gap-3">

          {/* DOT */}
          <div className="d-flex flex-column align-items-center">
            <div
              className={`rounded-circle bg-${eventColor(event.type)}`}
              style={{ width: 10, height: 10 }}
            />
            {idx !== events.length - 1 && (
              <div style={{ width: 2, flex: 1, background: "#ddd" }} />
            )}
          </div>

          {/* CONTENT */}
          <div className="flex-grow-1 pb-3">

            <div className="d-flex justify-content-between flex-wrap">

              <div className="fw-semibold">
                {event.title || event.type}
              </div>

              <small className="text-muted">
                {formatDate(event.timestamp)}
              </small>

            </div>

            <div className="text-muted small mt-1">
              Farmer: {event.farmer || "System"}
            </div>

            <div className="small mt-1">
              {event.description}
            </div>

            {event.metadata && (
              <div className="small text-muted mt-1">
                Impact: {event.metadata.impact || "N/A"} | Score change:{" "}
                {event.metadata.score_delta || 0}
              </div>
            )}

          </div>

        </div>
      ))}

    </div>
  );
};

export default DecisionTimeline;