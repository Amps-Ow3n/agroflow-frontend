import React from "react";

const PageNav = ({ sections = [] }) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div
      className="bg-white border-bottom sticky-top"
      style={{ zIndex: 1020 }}
    >
      <div className="container-fluid py-2">

        <div
          className="d-flex gap-2 overflow-auto px-1"
          style={{ scrollbarWidth: "none" }}
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="btn btn-sm btn-outline-success rounded-pill flex-shrink-0"
              style={{
                whiteSpace: "nowrap",
              }}
            >
              {section.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PageNav;