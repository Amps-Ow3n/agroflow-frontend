export function getErrorMessage(error) {
  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail.map(d => d.msg).join(", ");
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (error?.message) {
    return error.message;
  }

  return "Something went wrong";
}