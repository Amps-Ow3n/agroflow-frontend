import React from "react";

const PageNav = ({ sections=[] }) => {
  return (

    <div className="card border-0 shadow-sm mb-4">

      <div className="card-body py-2">

        <div className="d-flex flex-wrap gap-2">

          {sections.map(section => (

            <a
              key={section.id}
              href={`#${section.id}`}
              className="btn btn-sm btn-outline-success"
            >
              {section.label}
            </a>

          ))}

        </div>

      </div>

    </div>

  );
};

export default PageNav;