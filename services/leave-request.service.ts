import {
  type LeaveRequest,
  LeaveStatus,
  LeaveType,
} from "../types/leave-request";

export interface ILeaveRequestService {
  getLeaveRequests(): Promise<LeaveRequest[]>;
  getLeaveRequestById(id: string): Promise<LeaveRequest>;
  createLeaveRequest(request: Omit<LeaveRequest, "id">): Promise<LeaveRequest>;
  updateLeaveRequestStatus(
    id: string,
    status: LeaveStatus
  ): Promise<LeaveRequest>;
  updateLeaveRequest(
    id: string,
    request: Partial<LeaveRequest>
  ): Promise<LeaveRequest>;
}

export class LeaveRequestService implements ILeaveRequestService {
  private readonly baseUrl =
    "https://67f551e6913986b16fa426fd.mockapi.io/api/v1";

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    console.log("Service: Getting all leave requests...");

    try {
      const response = await fetch(`${this.baseUrl}/leave_requests`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API data received:", data);
      return this.transformApiData(data);
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error("Failed to fetch leave requests from API");
    }
  }

  async getLeaveRequestById(id: string): Promise<LeaveRequest> {
    console.log(`Service: Getting leave request by ID: ${id}`);

    try {
      const response = await fetch(`${this.baseUrl}/leave_requests/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch leave request with ID: ${id}`);
      }
      const data = await response.json();
      console.log("API data received for ID:", data);
      return this.transformSingleApiData(data);
    } catch (error) {
      console.error("Error fetching leave request by ID:", error);
      throw new Error(`Failed to fetch leave request with ID ${id}`);
    }
  }

  async createLeaveRequest(
    request: Omit<LeaveRequest, "id">
  ): Promise<LeaveRequest> {
    console.log("Service: Creating new leave request:", request);

    try {
      const response = await fetch(`${this.baseUrl}/leave_requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: request.employeeName,
          type_of_leave: this.mapToApiLeaveType(request.leaveType),
          date_from: request.startDate,
          date_to: request.endDate,
          status: this.mapToApiStatus(request.status),
          reason: request.reason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create leave request");
      }

      const data = await response.json();
      console.log("Created leave request:", data);
      return this.transformSingleApiData(data);
    } catch (error) {
      console.error("Error creating leave request:", error);
      throw new Error("Failed to create leave request");
    }
  }

  async updateLeaveRequest(
    id: string,
    request: Partial<LeaveRequest>
  ): Promise<LeaveRequest> {
    console.log(`Service: Updating leave request ${id}:`, request);

    try {
      const updateData: any = {};

      if (request.employeeName !== undefined)
        updateData.name = request.employeeName;
      if (request.leaveType !== undefined)
        updateData.type_of_leave = this.mapToApiLeaveType(request.leaveType);
      if (request.startDate !== undefined)
        updateData.date_from = request.startDate;
      if (request.endDate !== undefined) updateData.date_to = request.endDate;
      if (request.status !== undefined)
        updateData.status = this.mapToApiStatus(request.status);
      if (request.reason !== undefined) updateData.reason = request.reason;

      const response = await fetch(`${this.baseUrl}/leave_requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update leave request with ID: ${id}`);
      }

      const data = await response.json();
      console.log("Service: Updated leave request:", data);
      return this.transformSingleApiData(data);
    } catch (error) {
      console.error("Service: Error updating leave request:", error);
      throw new Error("Failed to update leave request");
    }
  }

  async updateLeaveRequestStatus(
    id: string,
    status: LeaveStatus
  ): Promise<LeaveRequest> {
    console.log(`Service: Updating request ${id} status to ${status}`);
    return this.updateLeaveRequest(id, { status });
  }

  private transformApiData(data: any[]): LeaveRequest[] {
    console.log("Service: Transforming API data:", data);
    return data.map((item) => this.transformSingleApiData(item));
  }

  private transformSingleApiData(item: any): LeaveRequest {
    return {
      id: item.id || Math.random().toString(),
      employeeName: item.name || item.employeeName || "Unknown Employee",
      leaveType: this.mapLeaveType(item.type_of_leave || item.leaveType),
      startDate: this.formatDate(item.date_from || item.startDate),
      endDate: this.formatDate(item.date_to || item.endDate),
      status: this.mapStatus(item.status),
      reason: item.reason || "",
      dateRequested: this.formatDate(
        item.createdAt || item.date_requested || item.dateRequested
      ),
    };
  }

  private formatDate(dateString: string): string {
    if (!dateString) return new Date().toISOString().split("T")[0];

    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.warn("Invalid date format:", dateString);
      return new Date().toISOString().split("T")[0];
    }
  }

  private mapLeaveType(type: string): LeaveType {
    if (!type) return LeaveType.VACATION;

    const typeMap: Record<string, LeaveType> = {
      // API values
      VACATION: LeaveType.VACATION,
      SICK: LeaveType.SICK,
      PERSONAL: LeaveType.PERSONAL,
      BEREAVEMENT: LeaveType.PERSONAL, // Map to personal since we don't have bereavement
      REMOTE: LeaveType.PERSONAL, // Map to personal
      PARENTAL: LeaveType.MATERNITY, // Map parental to maternity
      UNPAID: LeaveType.PERSONAL, // Map to personal
      MILITARY: LeaveType.PERSONAL, // Map to personal
      STUDY: LeaveType.PERSONAL, // Map to personal
      EMERGENCY: LeaveType.PERSONAL, // Map to personal
      // Legacy values (lowercase)
      vacation: LeaveType.VACATION,
      sick: LeaveType.SICK,
      personal: LeaveType.PERSONAL,
      maternity: LeaveType.MATERNITY,
      paternity: LeaveType.PATERNITY,
    };

    return typeMap[type] || LeaveType.VACATION;
  }

  private mapStatus(status: string): LeaveStatus {
    if (!status) return LeaveStatus.PENDING;

    const statusMap: Record<string, LeaveStatus> = {
      // API values (various cases)
      PENDING: LeaveStatus.PENDING,
      Pending: LeaveStatus.PENDING,
      pending: LeaveStatus.PENDING,
      APPROVED: LeaveStatus.APPROVED,
      Approved: LeaveStatus.APPROVED,
      approved: LeaveStatus.APPROVED,
      REJECTED: LeaveStatus.REJECTED,
      Rejected: LeaveStatus.REJECTED,
      rejected: LeaveStatus.REJECTED,
    };

    return statusMap[status] || LeaveStatus.PENDING;
  }

  private mapToApiLeaveType(leaveType: LeaveType): string {
    const typeMap: Record<LeaveType, string> = {
      [LeaveType.VACATION]: "VACATION",
      [LeaveType.SICK]: "SICK",
      [LeaveType.PERSONAL]: "PERSONAL",
      [LeaveType.MATERNITY]: "PARENTAL",
      [LeaveType.PATERNITY]: "PARENTAL",
    };

    return typeMap[leaveType] || "VACATION";
  }

  private mapToApiStatus(status: LeaveStatus): string {
    const statusMap: Record<LeaveStatus, string> = {
      [LeaveStatus.PENDING]: "PENDING",
      [LeaveStatus.APPROVED]: "APPROVED",
      [LeaveStatus.REJECTED]: "REJECTED",
    };

    return statusMap[status] || "PENDING";
  }
}
