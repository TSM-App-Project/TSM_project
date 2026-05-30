export const formatId = (prefix, id, size = 3) => {
  if (id === null || id === undefined) return "";
  return `${prefix}-${String(id).padStart(size, "0")}`;
};

export const parseId = (value, prefix) => {
  if (!value) return null;
  const normalized = String(value).toUpperCase();
  if (normalized.startsWith(`${prefix}-`)) {
    const numeric = parseInt(normalized.replace(`${prefix}-`, ""), 10);
    return Number.isNaN(numeric) ? null : numeric;
  }
  const numeric = parseInt(normalized, 10);
  return Number.isNaN(numeric) ? null : numeric;
};

export const formatDate = (value) => {
  if (!value) return "";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).split("T")[0];
    return date.toISOString().split("T")[0];
  } catch {
    return String(value).split("T")[0];
  }
};

export const toLocalDateTime = (dateString) => {
  if (!dateString) return null;
  return `${dateString}T00:00:00`;
};
