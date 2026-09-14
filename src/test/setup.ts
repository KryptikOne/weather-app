import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// RTL only auto-cleans when test globals are on; we keep them off so tsconfig stays untouched.
afterEach(() => cleanup());
