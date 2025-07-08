"use client";

import type { LeaveStatus } from "../types/leave-request";
import { useTranslation } from "../hooks/useTranslation";

interface StatusBadgeProps {
  status: LeaveStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();

  const getStatusStyle = (status: LeaveStatus) => {
    switch (status) {
      case "Approved":
        return {
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: "6px 12px",
          borderRadius: "16px",
          fontSize: "12px",
          fontWeight: "500",
          border: "1px solid #c3e6cb",
        };
      case "Rejected":
        return {
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "6px 12px",
          borderRadius: "16px",
          fontSize: "12px",
          fontWeight: "500",
          border: "1px solid #f5c6cb",
        };
      case "Pending":
      default:
        return {
          backgroundColor: "#fff3cd",
          color: "#856404",
          padding: "6px 12px",
          borderRadius: "16px",
          fontSize: "12px",
          fontWeight: "500",
          border: "1px solid #ffeaa7",
        };
    }
  };

  return (
    <span style={getStatusStyle(status)}>
      {t(`status.${status.toLowerCase()}`)}
    </span>
  );
}
