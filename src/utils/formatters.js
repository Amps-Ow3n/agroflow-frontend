// src/utils/formatters.js

export function formatRole(role) {
  if (!role) return "";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function formatPercentage(value) {
  return `${Number(value || 0).toFixed(2)}%`;
}

export function formatQuantity(value) {
  return `${Number(value || 0)} kg`;
}