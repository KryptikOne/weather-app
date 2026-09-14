import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UnlockForm } from "./UnlockForm";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

describe("UnlockForm", () => {
  afterEach(() => { vi.restoreAllMocks(); replace.mockClear(); });

  it("posts the PIN and goes home on success", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
    render(<UnlockForm />);
    const input = screen.getByLabelText("PIN");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("inputmode", "numeric");
    fireEvent.change(input, { target: { value: "12345678901234567890" } });
    fireEvent.submit(input.closest("form")!);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
    expect(fetchMock.mock.calls[0][0]).toBe("/api/unlock");
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({ pin: "12345678901234567890" });
  });

  it("shows a generic error on a wrong PIN and clears the field", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ error: "wrong" }), { status: 401 }));
    render(<UnlockForm />);
    const input = screen.getByLabelText("PIN");
    fireEvent.change(input, { target: { value: "000000" } });
    fireEvent.submit(input.closest("form")!);
    expect(await screen.findByText(/that.s not it/i)).toBeInTheDocument();
    expect(input).toHaveValue("");
    expect(replace).not.toHaveBeenCalled();
  });

  it("explains a server that has no PIN configured", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ error: "not configured" }), { status: 500 }));
    render(<UnlockForm />);
    fireEvent.change(screen.getByLabelText("PIN"), { target: { value: "123456" } });
    fireEvent.submit(screen.getByLabelText("PIN").closest("form")!);
    expect(await screen.findByText(/no PIN configured/i)).toBeInTheDocument();
  });
});
