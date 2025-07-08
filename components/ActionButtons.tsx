"use client";

import { LeaveStatus } from "../types/leave-request";
import { useTranslation } from "../hooks/useTranslation";
import { Button } from "@ui5/webcomponents-react";

interface ActionButtonsProps {
  requestId: string;
  currentStatus: LeaveStatus;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  disabled?: boolean;
}

export function ActionButtons({
  requestId,
  currentStatus,
  onApprove,
  onReject,
  disabled = false,
}: ActionButtonsProps) {
  const { t } = useTranslation();

  if (currentStatus !== LeaveStatus.PENDING) {
    return <span style={{ color: "#6c757d", fontSize: "14px" }}>-</span>;
  }

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button
        onClick={() => onApprove(requestId)}
        disabled={disabled}
        design="Positive"
      >
        {t("common.approve")}
      </Button>
      <Button
        onClick={() => onReject(requestId)}
        disabled={disabled}
        design="Negative"
      >
        {t("common.reject")}
      </Button>
    </div>
  );
}
