import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { OptionField } from "@/cards/types";
import { OptionFieldInput } from "./OptionFieldInput";

const multi: OptionField = {
  kind: "ordered-multi", key: "metrics", label: "Metrics", min: 1,
  options: [{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }, { value: "c", label: "Gamma" }],
  default: ["a", "b"],
};

describe("OptionFieldInput", () => {
  it("toggles a boolean", () => {
    const onChange = vi.fn();
    render(<OptionFieldInput field={{ kind: "toggle", key: "x", label: "Show it", default: true }} value={true} onChange={onChange} />);
    fireEvent.click(screen.getByRole("switch", { name: "Show it" }));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("changes a select and a number", () => {
    const onSelect = vi.fn();
    render(<OptionFieldInput field={{ kind: "select", key: "hours", label: "Hours", options: [{ value: "12", label: "12" }, { value: "24", label: "24" }], default: "24" }} value="24" onChange={onSelect} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Hours" }), { target: { value: "12" } });
    expect(onSelect).toHaveBeenCalledWith("12");

    const onNumber = vi.fn();
    render(<OptionFieldInput field={{ kind: "number", key: "n", label: "Count", min: 0, max: 4, step: 1, default: 4 }} value={4} onChange={onNumber} />);
    fireEvent.change(screen.getByRole("slider", { name: "Count" }), { target: { value: "2" } });
    expect(onNumber).toHaveBeenCalledWith(2);
    expect(screen.getByTestId("opt-n-value")).toHaveTextContent("4");
  });

  it("adds, removes, and reorders an ordered multi-select and respects min", () => {
    const onChange = vi.fn();
    render(<OptionFieldInput field={multi} value={["a", "b"]} onChange={onChange} />);
    expect(screen.getAllByTestId("multi-selected")).toHaveLength(2);
    expect(screen.getAllByTestId("multi-unselected")).toHaveLength(1);
    fireEvent.click(screen.getByRole("checkbox", { name: "Gamma" }));
    expect(onChange).toHaveBeenLastCalledWith(["a", "b", "c"]);
    fireEvent.click(screen.getByRole("checkbox", { name: "Beta" }));
    expect(onChange).toHaveBeenLastCalledWith(["a"]);
    fireEvent.click(screen.getByRole("button", { name: "Move Beta up" }));
    expect(onChange).toHaveBeenLastCalledWith(["b", "a"]);
    expect(screen.getByRole("button", { name: "Move Alpha up" })).toBeDisabled();
  });

  it("will not uncheck below the minimum", () => {
    const onChange = vi.fn();
    render(<OptionFieldInput field={multi} value={["a"]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Alpha" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
