import React from "react";

export default function EmptyState({
  title = "No data found",
  description = "",
}) {
  return (
    <div className="text-center py-10 text-gray-500">
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
}