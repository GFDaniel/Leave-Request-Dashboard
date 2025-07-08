import { describe, it, expect, vi, beforeEach } from "vitest";
import { LeaveRequestService } from "../../services/leave-request.service";
import { LeaveStatus, LeaveType } from "../../types/leave-request";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("LeaveRequestService", () => {
  let service: LeaveRequestService;

  const mockApiResponse = [
    {
      id: "1",
      name: "John Doe",
      type_of_leave: "VACATION",
      date_from: "2025-04-09T04:37:16.219Z",
      date_to: "2025-04-15T04:37:16.219Z",
      status: "PENDING",
      reason: "Family vacation",
      createdAt: "2025-04-08T15:38:02.899Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      type_of_leave: "SICK",
      date_from: "2025-04-10T04:37:16.219Z",
      date_to: "2025-04-12T04:37:16.219Z",
      status: "APPROVED",
      reason: "Medical appointment",
      createdAt: "2025-04-07T15:38:02.899Z",
    },
  ];

  beforeEach(() => {
    service = new LeaveRequestService();
    vi.clearAllMocks();
  });

  describe("getLeaveRequests", () => {
    it("should fetch and transform leave requests successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await service.getLeaveRequests();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://67f551e6913986b16fa426fd.mockapi.io/api/v1/leave_requests"
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "1",
        employeeName: "John Doe",
        leaveType: LeaveType.VACATION,
        startDate: "2025-04-09",
        endDate: "2025-04-15",
        status: LeaveStatus.PENDING,
        reason: "Family vacation",
        dateRequested: "2025-04-08",
      });
    });

    it("should throw error when API request fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(service.getLeaveRequests()).rejects.toThrow(
        "Failed to fetch leave requests from API"
      );
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(service.getLeaveRequests()).rejects.toThrow(
        "Failed to fetch leave requests from API"
      );
    });
  });

  describe("createLeaveRequest", () => {
    it("should create a new leave request", async () => {
      const newRequest = {
        employeeName: "Bob Wilson",
        leaveType: LeaveType.PERSONAL,
        startDate: "2025-05-01",
        endDate: "2025-05-03",
        status: LeaveStatus.PENDING,
        reason: "Personal matters",
        dateRequested: "2025-04-20",
      };

      const mockCreatedResponse = {
        id: "3",
        name: "Bob Wilson",
        type_of_leave: "PERSONAL",
        date_from: "2025-05-01",
        date_to: "2025-05-03",
        status: "PENDING",
        reason: "Personal matters",
        createdAt: "2025-04-20T10:00:00.000Z",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatedResponse,
      });

      const result = await service.createLeaveRequest(newRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://67f551e6913986b16fa426fd.mockapi.io/api/v1/leave_requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Bob Wilson",
            type_of_leave: "PERSONAL",
            date_from: "2025-05-01",
            date_to: "2025-05-03",
            status: "PENDING",
            reason: "Personal matters",
          }),
        }
      );

      expect(result.id).toBe("3");
      expect(result.employeeName).toBe("Bob Wilson");
    });
  });

  describe("updateLeaveRequest", () => {
    it("should update a leave request", async () => {
      const updateData = {
        employeeName: "John Doe Updated",
        reason: "Updated reason",
      };

      const mockUpdatedResponse = {
        id: "1",
        name: "John Doe Updated",
        type_of_leave: "VACATION",
        date_from: "2025-04-09T04:37:16.219Z",
        date_to: "2025-04-15T04:37:16.219Z",
        status: "PENDING",
        reason: "Updated reason",
        createdAt: "2025-04-08T15:38:02.899Z",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedResponse,
      });

      const result = await service.updateLeaveRequest("1", updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://67f551e6913986b16fa426fd.mockapi.io/api/v1/leave_requests/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "John Doe Updated",
            reason: "Updated reason",
          }),
        }
      );

      expect(result.employeeName).toBe("John Doe Updated");
      expect(result.reason).toBe("Updated reason");
    });
  });

  describe("date formatting", () => {
    it("should handle timezone issues correctly", async () => {
      const mockResponse = [
        {
          id: "1",
          name: "Test User",
          type_of_leave: "VACATION",
          date_from: "2025-04-09T23:37:16.219Z", // Late UTC time
          date_to: "2025-04-10T01:37:16.219Z", // Early UTC time next day
          status: "PENDING",
          reason: "Test",
          createdAt: "2025-04-08T15:38:02.899Z",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.getLeaveRequests();

      // Dates should be formatted correctly without timezone shift
      expect(result[0].startDate).toBe("2025-04-09");
      expect(result[0].endDate).toBe("2025-04-10");
    });
  });
});
