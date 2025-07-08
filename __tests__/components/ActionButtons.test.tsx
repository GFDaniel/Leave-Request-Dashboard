import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActionButtons } from "../../components/ActionButtons";
import { LeaveStatus } from "../../types/leave-request";

// Mock the translation hook
vi.mock("../../hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: "en",
    setLanguage: vi.fn(),
    isLoading: false,
  }),
}));

describe("ActionButtons", () => {
  const mockOnApprove = vi.fn();
  const mockOnReject = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render approve and reject buttons for pending requests", () => {
    render(
      <ActionButtons
        requestId="1"
        currentStatus={LeaveStatus.PENDING}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    expect(screen.getByText("common.approve")).toBeInTheDocument();
    expect(screen.getByText("common.reject")).toBeInTheDocument();
  });

  it("should not render buttons for approved requests", () => {
    render(
      <ActionButtons
        requestId="1"
        currentStatus={LeaveStatus.APPROVED}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    expect(screen.queryByText("common.approve")).not.toBeInTheDocument();
    expect(screen.queryByText("common.reject")).not.toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should not render buttons for rejected requests", () => {
    render(
      <ActionButtons
        requestId="1"
        currentStatus={LeaveStatus.REJECTED}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    expect(screen.queryByText("common.approve")).not.toBeInTheDocument();
    expect(screen.queryByText("common.reject")).not.toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should call onApprove when approve button is clicked", async () => {
    render(
      <ActionButtons
        requestId="test-id"
        currentStatus={LeaveStatus.PENDING}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const approveButton = screen.getByText("common.approve");
    await user.click(approveButton);

    expect(mockOnApprove).toHaveBeenCalledWith("test-id");
    expect(mockOnApprove).toHaveBeenCalledTimes(1);
  });

  it("should call onReject when reject button is clicked", async () => {
    render(
      <ActionButtons
        requestId="test-id"
        currentStatus={LeaveStatus.PENDING}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const rejectButton = screen.getByText("common.reject");
    await user.click(rejectButton);

    expect(mockOnReject).toHaveBeenCalledWith("test-id");
    expect(mockOnReject).toHaveBeenCalledTimes(1);
  });

  it("should disable buttons when disabled prop is true", () => {
    render(
      <ActionButtons
        requestId="1"
        currentStatus={LeaveStatus.PENDING}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        disabled={true}
      />
    );

    const approveButton = screen.getByText("common.approve");
    const rejectButton = screen.getByText("common.reject");

    expect(approveButton).toBeDisabled();
    expect(rejectButton).toBeDisabled();
  });

  it("should enable buttons when disabled prop is false", () => {
    render(
      <ActionButtons
        requestId="1"
        currentStatus={LeaveStatus.PENDING}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        disabled={false}
      />
    );

    const approveButton = screen.getByText("common.approve");
    const rejectButton = screen.getByText("common.reject");

    expect(approveButton).not.toBeDisabled();
    expect(rejectButton).not.toBeDisabled();
  });

  it("should not call handlers when buttons are disabled", async () => {
    render(
      <ActionButtons
        requestId="1"
        currentStatus={LeaveStatus.PENDING}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        disabled={true}
      />
    );

    const approveButton = screen.getByText("common.approve");
    const rejectButton = screen.getByText("common.reject");

    // Try to click disabled buttons
    await user.click(approveButton);
    await user.click(rejectButton);

    expect(mockOnApprove).not.toHaveBeenCalled();
    expect(mockOnReject).not.toHaveBeenCalled();
  });

  it("should handle multiple rapid clicks correctly", async () => {
    render(
      <ActionButtons
        requestId="1"
        currentStatus={LeaveStatus.PENDING}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const approveButton = screen.getByText("common.approve");

    // Click multiple times rapidly
    await user.click(approveButton);
    await user.click(approveButton);
    await user.click(approveButton);

    expect(mockOnApprove).toHaveBeenCalledTimes(3);
    expect(mockOnApprove).toHaveBeenCalledWith("1");
  });
});
