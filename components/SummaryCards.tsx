"use client";

import type { LeaveRequest } from "../types/leave-request";
import { LeaveStatus } from "../types/leave-request";
import { useTranslation } from "../hooks/useTranslation";

interface SummaryCardsProps {
  requests: LeaveRequest[];
}

export function SummaryCards({ requests }: SummaryCardsProps) {
  const { t } = useTranslation();

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(
    (r) => r.status === LeaveStatus.PENDING
  ).length;
  const approvedRequests = requests.filter(
    (r) => r.status === LeaveStatus.APPROVED
  ).length;
  const rejectedRequests = requests.filter(
    (r) => r.status === LeaveStatus.REJECTED
  ).length;

  const cards = [
    {
      title: t("summary.totalRequests"),
      value: totalRequests,
      color: "#007bff",
      bgColor: "#e3f2fd",
    },
    {
      title: t("summary.pending"),
      value: pendingRequests,
      color: "#ffc107",
      bgColor: "#fff8e1",
    },
    {
      title: t("summary.approved"),
      value: approvedRequests,
      color: "#28a745",
      bgColor: "#e8f5e8",
    },
    {
      title: t("summary.rejected"),
      value: rejectedRequests,
      color: "#dc3545",
      bgColor: "#ffeaea",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "32px",
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "60px",
              height: "60px",
              backgroundColor: card.bgColor,
              borderRadius: "0 8px 0 60px",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                margin: "0 0 8px 0",
                color: "#6c757d",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {card.title}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: "700",
                color: card.color,
              }}
            >
              {card.value}
            </p>
          </div>
          {/* Simple trend line */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              width: "40px",
              height: "20px",
            }}
          >
            <svg width="40" height="20" viewBox="0 0 40 20">
              <path
                d="M2,18 Q10,8 20,12 T38,6"
                stroke={card.color}
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
