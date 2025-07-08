import { describe, it, expect } from "vitest";
import { LeaveRequestUtils } from "../../utils/leave-request.utils";
import {
  type LeaveRequest,
  LeaveStatus,
  LeaveType,
} from "../../types/leave-request";

const mockRequests: LeaveRequest[] = [
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
  {
    id: "3",
    employeeName: "Mike Johnson",
    leaveType: LeaveType.PERSONAL,
    startDate: "2025-05-01",
    endDate: "2025-05-03",
    status: LeaveStatus.REJECTED,
    reason: "Personal matters",
    dateRequested: "2025-04-06",
  },
];

describe("LeaveRequestUtils", () => {
  describe("filterRequests", () => {
    it("should return all requests when no filters are applied", () => {
      const result = LeaveRequestUtils.filterRequests(mockRequests, {});
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockRequests);
    });

    it("should filter by pending status correctly", () => {
      const result = LeaveRequestUtils.filterRequests(mockRequests, {
        status: LeaveStatus.PENDING,
      });
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe(LeaveStatus.PENDING);
      expect(result[0].employeeName).toBe("John Doe");
    });

    it("should filter by approved status correctly", () => {
      const result = LeaveRequestUtils.filterRequests(mockRequests, {
        status: LeaveStatus.APPROVED,
      });
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe(LeaveStatus.APPROVED);
      expect(result[0].employeeName).toBe("Jane Smith");
    });

    it("should filter by rejected status correctly", () => {
      const result = LeaveRequestUtils.filterRequests(mockRequests, {
        status: LeaveStatus.REJECTED,
      });
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe(LeaveStatus.REJECTED);
      expect(result[0].employeeName).toBe("Mike Johnson");
    });

    it("should return empty array when no requests match filter", () => {
      const result = LeaveRequestUtils.filterRequests([], {
        status: LeaveStatus.APPROVED,
      });
      expect(result).toHaveLength(0);
    });

    it("should handle multiple filters correctly", () => {
      // Test with empty requests array
      const emptyResult = LeaveRequestUtils.filterRequests([], {
        status: LeaveStatus.PENDING,
      });
      expect(emptyResult).toHaveLength(0);

      // Test with requests that don't match
      const noMatchResult = LeaveRequestUtils.filterRequests(
        [mockRequests[1]], // Only approved request
        { status: LeaveStatus.PENDING }
      );
      expect(noMatchResult).toHaveLength(0);
    });
  });

  describe("sortRequests", () => {
    it("should sort by date requested in ascending order", () => {
      const result = LeaveRequestUtils.sortRequests(mockRequests, {
        field: "dateRequested",
        direction: "asc",
      });

      // Mike: 2025-04-06, Jane: 2025-04-07, John: 2025-04-08
      expect(result[0].employeeName).toBe("Mike Johnson"); // 2025-04-06
      expect(result[1].employeeName).toBe("Jane Smith"); // 2025-04-07
      expect(result[2].employeeName).toBe("John Doe"); // 2025-04-08
    });

    it("should sort by date requested in descending order", () => {
      const result = LeaveRequestUtils.sortRequests(mockRequests, {
        field: "dateRequested",
        direction: "desc",
      });

      // John: 2025-04-08, Jane: 2025-04-07, Mike: 2025-04-06
      expect(result[0].employeeName).toBe("John Doe"); // 2025-04-08
      expect(result[1].employeeName).toBe("Jane Smith"); // 2025-04-07
      expect(result[2].employeeName).toBe("Mike Johnson"); // 2025-04-06
    });

    it("should sort by start date in ascending order", () => {
      const result = LeaveRequestUtils.sortRequests(mockRequests, {
        field: "startDate",
        direction: "asc",
      });

      // John: 2025-04-09, Jane: 2025-04-10, Mike: 2025-05-01
      expect(result[0].employeeName).toBe("John Doe"); // 2025-04-09
      expect(result[1].employeeName).toBe("Jane Smith"); // 2025-04-10
      expect(result[2].employeeName).toBe("Mike Johnson"); // 2025-05-01
    });

    it("should not mutate original array", () => {
      const original = [...mockRequests];
      const result = LeaveRequestUtils.sortRequests(mockRequests, {
        field: "dateRequested",
        direction: "desc",
      });

      expect(mockRequests).toEqual(original);
      expect(result).not.toBe(mockRequests); // Different array reference
    });

    it("should handle empty array", () => {
      const result = LeaveRequestUtils.sortRequests([], {
        field: "dateRequested",
        direction: "asc",
      });
      expect(result).toEqual([]);
    });

    it("should handle single item array", () => {
      const singleRequest = [mockRequests[0]];
      const result = LeaveRequestUtils.sortRequests(singleRequest, {
        field: "dateRequested",
        direction: "desc",
      });
      expect(result).toEqual(singleRequest);
    });
  });

  describe("formatDateRange", () => {
    it("should format date range correctly", () => {
      const result = LeaveRequestUtils.formatDateRange(
        "2025-04-09",
        "2025-04-15"
      );
      expect(result).toMatch(
        /\d{1,2}\/\d{1,2}\/\d{4} - \d{1,2}\/\d{1,2}\/\d{4}/
      );
    });

    it("should handle same start and end date", () => {
      const result = LeaveRequestUtils.formatDateRange(
        "2025-04-09",
        "2025-04-09"
      );
      expect(result).toMatch(
        /\d{1,2}\/\d{1,2}\/\d{4} - \d{1,2}\/\d{1,2}\/\d{4}/
      );
    });

    it("should format different months correctly", () => {
      const result = LeaveRequestUtils.formatDateRange(
        "2025-04-30",
        "2025-05-01"
      );
      expect(result).toMatch(
        /\d{1,2}\/\d{1,2}\/\d{4} - \d{1,2}\/\d{1,2}\/\d{4}/
      );
    });

    it("should handle year boundaries", () => {
      const result = LeaveRequestUtils.formatDateRange(
        "2024-12-31",
        "2025-01-01"
      );
      expect(result).toMatch(
        /\d{1,2}\/\d{1,2}\/\d{4} - \d{1,2}\/\d{1,2}\/\d{4}/
      );
    });
  });

  describe("getStatusVariant", () => {
    it("should return correct variant for approved status", () => {
      const result = LeaveRequestUtils.getStatusVariant(LeaveStatus.APPROVED);
      expect(result).toBe("Success");
    });

    it("should return correct variant for rejected status", () => {
      const result = LeaveRequestUtils.getStatusVariant(LeaveStatus.REJECTED);
      expect(result).toBe("Error");
    });

    it("should return correct variant for pending status", () => {
      const result = LeaveRequestUtils.getStatusVariant(LeaveStatus.PENDING);
      expect(result).toBe("Warning");
    });

    it("should handle all status enum values", () => {
      // Test all enum values to ensure complete coverage
      Object.values(LeaveStatus).forEach((status) => {
        const result = LeaveRequestUtils.getStatusVariant(status);
        expect(["Success", "Error", "Warning"]).toContain(result);
      });
    });
  });

  describe("integration tests", () => {
    it("should filter and sort together correctly", () => {
      // Add more requests for better testing
      const extendedRequests = [
        ...mockRequests,
        {
          id: "4",
          employeeName: "Alice Brown",
          leaveType: LeaveType.VACATION,
          startDate: "2025-04-05",
          endDate: "2025-04-07",
          status: LeaveStatus.PENDING,
          reason: "Early vacation",
          dateRequested: "2025-04-01",
        },
      ];

      // Filter for pending requests
      const filtered = LeaveRequestUtils.filterRequests(extendedRequests, {
        status: LeaveStatus.PENDING,
      });

      // Then sort by date requested ascending
      const sorted = LeaveRequestUtils.sortRequests(filtered, {
        field: "dateRequested",
        direction: "asc",
      });

      expect(sorted).toHaveLength(2);
      expect(sorted[0].employeeName).toBe("Alice Brown"); // 2025-04-01
      expect(sorted[1].employeeName).toBe("John Doe"); // 2025-04-08
    });
  });
});
