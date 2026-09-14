import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UnlockForm } from "./UnlockForm";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

describe("UnlockForm", () => {
  afterEach(() => { vi.restoreAllMocks(); replace.mockClear(); });

  it("posts the passcode unchanged and goes home on success", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
    render(<UnlockForm />);
    const input = screen.getByLabelText("Passcode");
    expect(input).toHaveAttribute("type", "password");
    fireEvent.change(input, { target: { value: "Xk9-qL2vB7mN4pQ8sT1w" } });
    fireEvent.submit(input.closest("form")!);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
    expect(fetchMock.mock.calls[0][0]).toBe("/api/unlock");
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({ pin: "Xk9-qL2vB7mN4pQ8sT1w" });
  });

  it("shows a generic error on a wrong passcode and clears the field", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ error: "wrong" }), { status: 401 }));
    render(<UnlockForm />);
    const input = screen.getByLabelText("Passcode");
    fireEvent.change(input, { target: { value: "000000" } });
    fireEvent.submit(input.closest("form")!);
    expect(await screen.findByText(/that.s not it/i)).toBeInTheDocument();
    expect(input).toHaveValue("");
    expect(replace).not.toHaveBeenCalled();
  });

  it("explains a server that has no passcode configured", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ error: "not configured" }), { status: 500 }));
    render(<UnlockForm />);
    fireEvent.change(screen.getByLabelText("Passcode"), { target: { value: "123456" } });
    fireEvent.submit(screen.getByLabelText("Passcode").closest("form")!);
    expect(await screen.findByText(/no passcode configured/i)).toBeInTheDocument();
  });
});
