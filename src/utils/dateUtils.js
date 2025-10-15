import { format, startOfMonth, endOfMonth, subMonths, parseISO } from "date-fns";

export const formatDate = (date, formatStr = "MMM dd, yyyy") => {
  if (!date || date === "" || date === null || date === undefined) {
    return format(new Date(), formatStr);
  }
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const getCurrentMonthKey = () => {
  return format(new Date(), "yyyy-MM");
};

export const getMonthKey = (date) => {
  if (!date || date === "" || date === null || date === undefined) {
    return format(new Date(), "yyyy-MM");
  }
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "yyyy-MM");
};

export const getMonthName = (monthKey) => {
  if (!monthKey || typeof monthKey !== "string" || !monthKey.includes("-")) {
    return format(new Date(), "MMMM yyyy");
  }
  const [year, month] = monthKey.split("-");
  return format(new Date(year, month - 1, 1), "MMMM yyyy");
};

export const getLastSixMonths = () => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push({
      key: format(date, "yyyy-MM"),
      label: format(date, "MMM yyyy"),
      short: format(date, "MMM"),
    });
  }
  return months;
};

export const getMonthStartEnd = (monthKey) => {
  const [year, month] = monthKey.split("-");
  const date = new Date(year, month - 1, 1);
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};