import React from "react";

const PageContainer = ({
  children,
  title,
  interpretation,
  actions,
  density = "comfortable",
}) => {
  const padding = density === "compact" ? "p-3 p-md-3" : "p-3 p-md-4";

  return (
    <div
      className={`d-flex flex-column gap-4 ${padding}`}
      style={{
        width: "100%",
        minWidth: 0,
        overflowX: "hidden",
      }}
    >

      {(title || interpretation || actions) && (
        <div className="card border-0 shadow-sm">

          <div className="card-body">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

              <div>
                {title && (
                  <h4 className="mb-1 fw-bold">
                    {title}
                  </h4>
                )}

                {interpretation && (
                  <p className="text-muted small mb-0">
                    {interpretation}
                  </p>
                )}
              </div>

              {actions && (
                <div className="d-flex flex-wrap gap-2">
                  {actions}
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      <div
        className="d-flex flex-column gap-4"
        style={{
          minWidth: 0,
          width: "100%",
        }}
      >
        {children}
      </div>

    </div>
  );
};

export default PageContainer;