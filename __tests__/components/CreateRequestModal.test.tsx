"use client";

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateRequestModal } from "../../components/CreateRequestModal";
import { LeaveType, LeaveStatus } from "../../types/leave-request";

// Mock the translation hook
vi.mock("../../hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: "en",
    setLanguage: vi.fn(),
    isLoading: false,
  }),
}));

describe("CreateRequestModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when closed", () => {
    render(
      <CreateRequestModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByText("createModal.title")).not.toBeInTheDocument();
  });

  it("should render when open", () => {
    render(
      <CreateRequestModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("createModal.title")).toBeInTheDocument();
    expect(screen.getByText("createModal.subtitle")).toBeInTheDocument();
  });

  it("should close modal when cancel is clicked", async () => {
    render(
      <CreateRequestModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByText("common.cancel");
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should close modal when backdrop is clicked", async () => {
    render(
      <CreateRequestModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Click on backdrop (the modal overlay)
    const backdrop = screen
      .getByText("createModal.title")
      .closest("div")?.previousSibling;
    if (backdrop) {
      await user.click(backdrop as Element);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });
});
