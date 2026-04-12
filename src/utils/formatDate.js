// src/utils/formatDate.js

export const formatDate = (dateInput) => {
  if (!dateInput) return "-";

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return dateInput;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};


// show date + time (for decision logs, timestamps)
export const formatDateTime = (dateInput) => {
  if (!dateInput) return "-";

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return dateInput;

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
