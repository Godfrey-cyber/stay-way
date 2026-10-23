export const COUPONS = {
  WELCOME15: { percent: 15, minNights: 1, title: "15% off your first stay", note: "Valid on any property" },
  WEEKEND10: { percent: 10, minNights: 2, title: "10% off weekend escapes", note: "Minimum 2 nights" },
};

export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(ms / 86400000));
}

export function quote({ price, checkIn, checkOut, rooms = 1, coupon = "" }) {
  const nights = nightsBetween(checkIn, checkOut);
  const subtotal = price * nights * rooms;
  const c = COUPONS[coupon.trim().toUpperCase()];
  const valid = !!c && nights >= c.minNights;
  const discount = valid ? Math.round((subtotal * c.percent) / 100) : 0;
  return { nights, subtotal, discount, total: subtotal - discount, couponValid: valid };
}

export function validateGuests({ adults, children }) {
  if (adults < 1) return "At least one adult is required.";
  if (children.some((a) => a === "" || a === null || a === undefined)) return "Please select the age of each child.";
  return null;
}

export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const money = (n) => `Ksh.${Number(n).toLocaleString()}`;
