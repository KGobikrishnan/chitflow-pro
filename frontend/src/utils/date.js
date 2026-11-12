import { format, parseISO, isValid, addMonths } from 'date-fns';

export const formatDate = (dateStr, formatPattern = 'dd MMM yyyy') => {
  if (!dateStr) return '-';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return isValid(date) ? format(date, formatPattern) : '-';
  } catch {
    return '-';
  }
};

export const formatMonthYear = (dateStr) => {
  return formatDate(dateStr, 'MMM yyyy');
};

export const calculateEndDate = (startDateStr, durationMonths) => {
  if (!startDateStr || !durationMonths) return '';
  try {
    const start = typeof startDateStr === 'string' ? parseISO(startDateStr) : startDateStr;
    if (!isValid(start)) return '';
    // duration in months, end date is (duration - 1) or duration months
    const end = addMonths(start, Number(durationMonths) - 1);
    return format(end, 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

