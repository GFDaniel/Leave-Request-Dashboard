import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLeaveRequests } from "../../hooks/useLeaveRequests";
import type { ILeaveRequestService } from "../../services/leave-request.service";
import { LeaveStatus, LeaveType } from "../../types/leave-request";

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
  getLeaveRequests: vi.fn(),
  getLeaveRequestById: vi.fn(),
  createLeaveRequest: vi.fn(),
  updateLeaveRequestStatus: vi.fn(),
  updateLeaveRequest: vi.fn(),
};

describe("useLeaveRequests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load requests on mount", async () => {
    (mockService.getLeaveRequests as any).mockResolvedValue(mockRequests);

    const { result } = renderHook(() => useLeaveRequests(mockService));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.requests).toEqual(mockRequests);
    expect(result.current.filteredRequests).toEqual(mockRequests);
    expect(mockService.getLeaveRequests).toHaveBeenCalledTimes(1);
  });

  it("should handle loading error", async () => {
    const errorMessage = "API Error";
    (mockService.getLeaveRequests as any).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useLeaveRequests(mockService));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.requests).toEqual([]);
  });

  it("should approve request successfully", async () => {
    (mockService.getLeaveRequests as any).mockResolvedValue(mockRequests);
    (mockService.updateLeaveRequestStatus as any).mockResolvedValue({
      ...mockRequests[0],
      status: LeaveStatus.APPROVED,
    });

    const { result } = renderHook(() => useLeaveRequests(mockService));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.approveRequest("1");
    });

    expect(mockService.updateLeaveRequestStatus).toHaveBeenCalledWith(
      "1",
      LeaveStatus.APPROVED
    );
    expect(result.current.requests[0].status).toBe(LeaveStatus.APPROVED);
  });

  it("should reject request successfully", async () => {
    (mockService.getLeaveRequests as any).mockResolvedValue(mockRequests);
    (mockService.updateLeaveRequestStatus as any).mockResolvedValue({
      ...mockRequests[0],
      status: LeaveStatus.REJECTED,
    });

    const { result } = renderHook(() => useLeaveRequests(mockService));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.rejectRequest("1");
    });

    expect(mockService.updateLeaveRequestStatus).toHaveBeenCalledWith(
      "1",
      LeaveStatus.REJECTED
    );
    expect(result.current.requests[0].status).toBe(LeaveStatus.REJECTED);
  });

  it("should handle approve/reject errors", async () => {
    (mockService.getLeaveRequests as any).mockResolvedValue(mockRequests);
    (mockService.updateLeaveRequestStatus as any).mockRejectedValue(
      new Error("Update failed")
    );

    const { result } = renderHook(() => useLeaveRequests(mockService));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.approveRequest("1");
    });

    expect(result.current.error).toBe("Update failed");
    expect(result.current.requests[0].status).toBe(LeaveStatus.PENDING); // Should remain unchanged
  });

  it("should filter requests by status", async () => {
    (mockService.getLeaveRequests as any).mockResolvedValue(mockRequests);

    const { result } = renderHook(() => useLeaveRequests(mockService));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.setFilters({ status: LeaveStatus.PENDING });
    });

    expect(result.current.filteredRequests).toHaveLength(1);
    expect(result.current.filteredRequests[0].status).toBe(LeaveStatus.PENDING);
  });

  it("should sort requests correctly", async () => {
    (mockService.getLeaveRequests as any).mockResolvedValue(mockRequests);

    const { result } = renderHook(() => useLeaveRequests(mockService));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.setSortOptions({
        field: "dateRequested",
        direction: "asc",
      });
    });

    // Jane Smith requested on 2025-04-07, John Doe on 2025-04-08
    expect(result.current.filteredRequests[0].employeeName).toBe("Jane Smith");
    expect(result.current.filteredRequests[1].employeeName).toBe("John Doe");
  });

  it("should create new request", async () => {
    (mockService.getLeaveRequests as any).mockResolvedValue(mockRequests);

    const newRequest = {
      employeeName: "Bob Wilson",
      leaveType: LeaveType.PERSONAL,
      startDate: "2025-05-01",
      endDate: "2025-05-03",
      status: LeaveStatus.PENDING,
      reason: "Personal matters",
      dateRequested: "2025-04-20",
    };

    const createdRequest = { ...newRequest, id: "3" };
    (mockService.createLeaveRequest as any).mockResolvedValue(createdRequest);

    const { result } = renderHook(() => useLeaveRequests(mockService));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.createRequest(newRequest);
    });

    expect(mockService.createLeaveRequest).toHaveBeenCalledWith(newRequest);
    expect(result.current.requests).toHaveLength(3);
    expect(result.current.requests[0]).toEqual(createdRequest); // Should be added to the beginning
  });

  it("should update existing request", async () => {
    (mockService.getLeaveRequests as any).mockResolvedValue(mockRequests);

    const updatedRequest = {
      ...mockRequests[0],
      reason: "Updated reason",
    };
    (mockService.updateLeaveRequest as any).mockResolvedValue(updatedRequest);

    const { result } = renderHook(() => useLeaveRequests(mockService));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.updateRequest("1", { reason: "Updated reason" });
    });

    expect(mockService.updateLeaveRequest).toHaveBeenCalledWith("1", {
      reason: "Updated reason",
    });
    expect(result.current.requests[0].reason).toBe("Updated reason");
  });
});
