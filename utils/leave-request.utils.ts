import {
  type LeaveRequest,
  type FilterOptions,
  type SortOptions,
  LeaveStatus,
} from "../types/leave-request";

export class LeaveRequestUtils {
  static filterRequests(
    requests: LeaveRequest[],
    filters: FilterOptions
  ): LeaveRequest[] {
    return requests.filter((request) => {
      if (filters.status && request.status !== filters.status) {
        return false;
      }
      return true;
    });
  }

  static sortRequests(
    requests: LeaveRequest[],
    sortOptions: SortOptions
  ): LeaveRequest[] {
    return [...requests].sort((a, b) => {
      const aValue = new Date(a[sortOptions.field]).getTime();
      const bValue = new Date(b[sortOptions.field]).getTime();

      if (sortOptions.direction === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }

  static formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  }

  static getStatusVariant(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.APPROVED:
        return "Success";
      case LeaveStatus.REJECTED:
        return "Error";
      case LeaveStatus.PENDING:
      default:
        return "Warning";
    }
  }
}
