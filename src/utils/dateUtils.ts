/**
 * Date and time helper utilities
 */

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * Returns formatted Day + Date + Time string
 * e.g. "Thu, Sep 24, 2026, 07:05 AM"
 */
export function formatDayDateStamp(date: Date = new Date()): string {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const weekday = weekdays[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const hoursStr = String(hours).padStart(2, '0');

  return `${weekday}, ${month} ${day}, ${year}, ${hoursStr}:${minutes} ${ampm}`;
}

/**
 * Returns friendly human date representation e.g. "Today, Sep 24" or "Yesterday, Sep 23"
 */
export function formatFriendlyDate(dateKey: string, todayKey: string): string {
  if (dateKey === todayKey) return `Today (${dateKey})`;
  
  const today = parseDateKey(todayKey);
  const target = parseDateKey(dateKey);
  const diffDays = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return `Yesterday (${dateKey})`;
  if (diffDays === -1) return `Tomorrow (${dateKey})`;
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${weekdays[target.getDay()]}, ${months[target.getMonth()]} ${target.getDate()}`;
}

/**
 * Get days for month grid (including leading/trailing padding for calendar view)
 */
export function getMonthDays(year: number, month: number) {
  // month is 0-indexed (0 = Jan, 11 = Dec)
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Starting day of week (0 = Sunday, 1 = Monday, etc.)
  // Let's use Monday as 0 or Sunday as 0. Sunday as 0 is standard.
  const startDayOfWeek = firstDay.getDay(); // 0 to 6
  const totalDaysInMonth = lastDay.getDate();

  const days: {
    date: Date;
    dateKey: string;
    isCurrentMonth: boolean;
    dayNumber: number;
  }[] = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      date: d,
      dateKey: formatDateKey(d),
      isCurrentMonth: false,
      dayNumber: prevMonthLastDay - i,
    });
  }

  // Current month days
  for (let i = 1; i <= totalDaysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({
      date: d,
      dateKey: formatDateKey(d),
      isCurrentMonth: true,
      dayNumber: i,
    });
  }

  // Next month padding to fill grid to multiple of 7
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push({
      date: d,
      dateKey: formatDateKey(d),
      isCurrentMonth: false,
      dayNumber: i,
    });
  }

  return days;
}
