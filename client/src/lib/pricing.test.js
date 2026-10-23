import { describe, expect, it } from "vitest";
import { quote, validateGuests } from "./pricing";

describe("booking pricing", () => {
  it("charges price x nights x rooms", () => {
    expect(quote({ price: 100, checkIn: "2026-01-01", checkOut: "2026-01-04", rooms: 2 }).total).toBe(600);
  });
  it("WELCOME15 takes 15% off", () => {
    expect(quote({ price: 100, checkIn: "2026-01-01", checkOut: "2026-01-02", coupon: "welcome15" }).total).toBe(85);
  });
  it("WEEKEND10 needs at least 2 nights", () => {
    expect(quote({ price: 100, checkIn: "2026-01-01", checkOut: "2026-01-02", coupon: "WEEKEND10" }).discount).toBe(0);
    expect(quote({ price: 100, checkIn: "2026-01-01", checkOut: "2026-01-03", coupon: "WEEKEND10" }).discount).toBe(20);
  });
  it("requires an age for every child", () => {
    expect(validateGuests({ adults: 2, children: [5, ""] })).not.toBeNull();
    expect(validateGuests({ adults: 2, children: [5, 8] })).toBeNull();
  });
});
