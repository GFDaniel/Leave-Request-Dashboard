"use client";

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LeaveRequestDetailsModal } from "../../components/LeaveRequestDetailsModal";
import { LeaveStatus, LeaveType } from "../../types/leave-request";

// Mock the translation hook
vi.mock("../../hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: "en",
    setLanguage: vi.fn(),
    isLoading: false,
  }),
}));

const mockRequest = {
  id: "1",
  employeeName: "John Doe",
  leaveType: LeaveType.VACATION,
  startDate: "2025-04-09",
  endDate: "2025-04-15",
  status: LeaveStatus.PENDING,
  reason: "Family vacation",
  dateRequested: "2025-04-08",
};

describe("LeaveRequestDetailsModal", () => {
  const mockOnClose = vi.fn();
  const mockOnUpdate = vi.fn();
  const mockOnApprove = vi.fn();
  const mockOnReject = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when closed", () => {
    render(
      <LeaveRequestDetailsModal
        isOpen={false}
        request={mockRequest}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    expect(screen.queryByText("detailsModal.title")).not.toBeInTheDocument();
  });

  it("should show approve/reject buttons for pending requests", () => {
    render(
      <LeaveRequestDetailsModal
        isOpen={true}
        request={mockRequest}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    expect(screen.getByText("common.approve")).toBeInTheDocument();
    expect(screen.getByText("common.reject")).toBeInTheDocument();
  });

  it("should not show approve/reject buttons for approved requests", () => {
    const approvedRequest = { ...mockRequest, status: LeaveStatus.APPROVED };

    render(
      <LeaveRequestDetailsModal
        isOpen={true}
        request={approvedRequest}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    expect(screen.queryByText("common.approve")).not.toBeInTheDocument();
    expect(screen.queryByText("common.reject")).not.toBeInTheDocument();
  });

  it("should enable editing mode when edit button is clicked", async () => {
    render(
      <LeaveRequestDetailsModal
        isOpen={true}
        request={mockRequest}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const editButton = screen.getByText("detailsModal.editRequest");
    await user.click(editButton);

    // Should show save/cancel buttons
    expect(screen.getByText("detailsModal.saveChanges")).toBeInTheDocument();
    expect(screen.getByText("common.cancel")).toBeInTheDocument();

    // Edit button should be hidden
    expect(
      screen.queryByText("detailsModal.editRequest")
    ).not.toBeInTheDocument();
  });

  it("should save changes when save button is clicked", async () => {
    mockOnUpdate.mockResolvedValue(undefined);

    render(
      <LeaveRequestDetailsModal
        isOpen={true}
        request={mockRequest}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Enter edit mode
    const editButton = screen.getByText("detailsModal.editRequest");
    await user.click(editButton);

    // Modify the reason field
    const reasonInput = screen.getByDisplayValue("Family vacation");
    await user.clear(reasonInput);
    await user.type(reasonInput, "Updated vacation reason");

    // Save changes
    const saveButton = screen.getByText("detailsModal.saveChanges");
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith("1", {
        employeeName: "John Doe",
        leaveType: LeaveType.VACATION,
        startDate: "2025-04-09",
        endDate: "2025-04-15",
        reason: "Updated vacation reason",
        status: LeaveStatus.PENDING,
      });
    });
  });

  it("should cancel editing when cancel button is clicked", async () => {
    render(
      <LeaveRequestDetailsModal
        isOpen={true}
        request={mockRequest}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Enter edit mode
    const editButton = screen.getByText("detailsModal.editRequest");
    await user.click(editButton);

    // Modify a field
    const reasonInput = screen.getByDisplayValue("Family vacation");
    await user.clear(reasonInput);
    await user.type(reasonInput, "Changed reason");

    // Cancel editing
    const cancelButton = screen.getByText("common.cancel");
    await user.click(cancelButton);

    // Should revert to original value
    expect(screen.getByDisplayValue("Family vacation")).toBeInTheDocument();
    expect(screen.getByText("detailsModal.editRequest")).toBeInTheDocument();
  });

  it("should call approve function when approve button is clicked", async () => {
    mockOnApprove.mockResolvedValue(undefined);

    render(
      <LeaveRequestDetailsModal
        isOpen={true}
        request={mockRequest}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const approveButton = screen.getByText("common.approve");
    await user.click(approveButton);

    expect(mockOnApprove).toHaveBeenCalledWith("1");
  });

  it("should call reject function when reject button is clicked", async () => {
    mockOnReject.mockResolvedValue(undefined);

    render(
      <LeaveRequestDetailsModal
        isOpen={true}
        request={mockRequest}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const rejectButton = screen.getByText("common.reject");
    await user.click(rejectButton);

    expect(mockOnReject).toHaveBeenCalledWith("1");
  });
});
