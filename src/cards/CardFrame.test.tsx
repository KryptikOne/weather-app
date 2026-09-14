import { render, screen } from "@testing-library/react";
import { Sun } from "lucide-react";
import { describe, expect, it } from "vitest";
import { CardFrame } from "./CardFrame";

describe("CardFrame", () => {
  it("renders the title and body when ready", () => {
    render(<CardFrame title="Sun" icon={Sun} status="ready"><p>body</p></CardFrame>);
    expect(screen.getByRole("heading", { name: "Sun" })).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });
  it("shows a skeleton while loading", () => {
    render(<CardFrame title="Sun" icon={Sun} status="loading"><p>body</p></CardFrame>);
    expect(screen.queryByText("body")).not.toBeInTheDocument();
    expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
  });
  it("shows an error body", () => {
    render(<CardFrame title="Sun" icon={Sun} status="error"><p>body</p></CardFrame>);
    expect(screen.getByText(/couldn.t load/i)).toBeInTheDocument();
  });
  it("keeps the body and adds a pill when stale", () => {
    render(<CardFrame title="Sun" icon={Sun} status="stale"><p>body</p></CardFrame>);
    expect(screen.getByText("body")).toBeInTheDocument();
    expect(screen.getByText(/older data/i)).toBeInTheDocument();
  });
});
