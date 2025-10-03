import { format, startOfMonth, endOfMonth, subMonths, parseISO } from "date-fns";

export const formatDate = (date, formatStr = "MMM dd, yyyy") => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const getCurrentMonthKey = () => {
  return format(new Date(), "yyyy-MM");
};

export const getMonthKey = (date) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "yyyy-MM");
};

export const getMonthName = (monthKey) => {
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