import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LeaveRequestDashboard } from "../../components/LeaveRequestDashboard";
import type { ILeaveRequestService } from "../../services/leave-request.service";
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

const mockRequests = [
  {
    id: "1",
    employeeName: "John Doe",
    leaveType: LeaveType.VACATION,
    startDate: "2025-04-09",
    endDate: "2025-04-15",
    status: LeaveStatus.PENDING,
    reason: "Family vacation",
    dateRequested: "2025-04-08",
  },
  {
    id: "2",
    employeeName: "Jane Smith",
    leaveType: LeaveType.SICK,
    startDate: "2025-04-10",
    endDate: "2025-04-12",
    status: LeaveStatus.APPROVED,
    reason: "Medical appointment",
    dateRequested: "2025-04-07",
  },
];

const mockService: ILeaveRequestService = {
  getLeaveRequests: vi.fn().mockResolvedValue(mockRequests),
  getLeaveRequestById: vi.fn(),
  createLeaveRequest: vi.fn(),
  updateLeaveRequestStatus: vi.fn(),
  updateLeaveRequest: vi.fn(),
};

describe("LeaveRequestDashboard", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state initially", () => {
    render(<LeaveRequestDashboard service={mockService} />);

    expect(screen.getByText("dashboard.loadingRequests")).toBeInTheDocument();
  });

  it("should handle error state", async () => {
    const errorService = {
      ...mockService,
      getLeaveRequests: vi.fn().mockRejectedValue(new Error("API Error")),
    };

    render(<LeaveRequestDashboard service={errorService} />);

    await waitFor(() => {
      expect(screen.getByText(/common.error/)).toBeInTheDocument();
    });
  });

  it("should open create modal when create button is clicked", async () => {
    render(<LeaveRequestDashboard service={mockService} />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const createButton = screen.getByText("dashboard.createRequest");
    await user.click(createButton);

    expect(screen.getByText("createModal.title")).toBeInTheDocument();
  });

  it("should open details modal when row is clicked", async () => {
    render(<LeaveRequestDashboard service={mockService} />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Click on a table row
    const johnDoeRow = screen.getByText("John Doe").closest("tr");
    await user.click(johnDoeRow!);

    expect(screen.getByText("detailsModal.title")).toBeInTheDocument();
  });

  it("should handle approve/reject actions", async () => {
    const mockUpdateStatus = vi.fn().mockResolvedValue({
      ...mockRequests[0],
      status: LeaveStatus.APPROVED,
    });

    const serviceWithMockUpdate = {
      ...mockService,
      updateLeaveRequestStatus: mockUpdateStatus,
    };

    render(<LeaveRequestDashboard service={serviceWithMockUpdate} />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Find and click approve button
    const approveButtons = screen.getAllByText("common.approve");
    await user.click(approveButtons[0]);

    expect(mockUpdateStatus).toHaveBeenCalledWith("1", LeaveStatus.APPROVED);
  });

  it("should show empty state when no requests", async () => {
    const emptyService = {
      ...mockService,
      getLeaveRequests: vi.fn().mockResolvedValue([]),
    };

    render(<LeaveRequestDashboard service={emptyService} />);

    await waitFor(() => {
      expect(screen.getByText("dashboard.noRequests")).toBeInTheDocument();
      expect(
        screen.getByText("dashboard.createFirstRequest")
      ).toBeInTheDocument();
    });
  });
});
