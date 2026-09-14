import { describe, expect, it } from "vitest";
import { tempColor } from "./tempColor";

describe("tempColor", () => {
  it("hits the exact stop colors", () => {
    expect(tempColor(20)).toBe("rgb(242, 214, 75)");
    expect(tempColor(40)).toBe("rgb(229, 72, 77)");
  });
  it("clamps outside the scale", () => {
    expect(tempColor(-30)).toBe(tempColor(-10));
    expect(tempColor(55)).toBe(tempColor(40));
  });
  it("interpolates between stops", () => {
    expect(tempColor(25)).not.toBe(tempColor(20));
    expect(tempColor(25)).not.toBe(tempColor(30));
  });
});
