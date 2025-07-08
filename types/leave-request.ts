export interface LeaveRequest {
  id: string
  employeeName: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  status: LeaveStatus
  reason?: string
  dateRequested: string
}

export enum LeaveStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export enum LeaveType {
  VACATION = "Vacation",
  SICK = "Sick Leave",
  PERSONAL = "Personal",
  MATERNITY = "Maternity",
  PATERNITY = "Paternity",
}

export interface FilterOptions {
  status?: LeaveStatus
}

export interface SortOptions {
  field: "dateRequested" | "startDate"
  direction: "asc" | "desc"
}
