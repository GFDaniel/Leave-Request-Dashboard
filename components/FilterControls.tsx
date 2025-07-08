"use client";
import {
  LeaveStatus,
  type FilterOptions,
  type SortOptions,
} from "../types/leave-request";
import { useTranslation } from "../hooks/useTranslation";
import { Button } from "@ui5/webcomponents-react";

interface FilterControlsProps {
  filters: FilterOptions;
  sortOptions: SortOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onSortChange: (sortOptions: SortOptions) => void;
}

export function FilterControls({
  filters,
  sortOptions,
  onFiltersChange,
  onSortChange,
}: FilterControlsProps) {
  const { t } = useTranslation();

  const tabs = [
    { label: t("filters.allRequests"), value: undefined },
    { label: t("summary.pending"), value: LeaveStatus.PENDING },
    { label: t("summary.approved"), value: LeaveStatus.APPROVED },
    { label: t("summary.rejected"), value: LeaveStatus.REJECTED },
  ];

  const handleTabClick = (value: LeaveStatus | undefined) => {
    onFiltersChange({ ...filters, status: value });
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          gap: "0",
          borderBottom: "1px solid #e9ecef",
          marginBottom: "24px",
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(tab.value)}
            style={{
              padding: "12px 24px",
              border: "none",
              backgroundColor: "transparent",
              color: filters.status === tab.value ? "#007bff" : "#6c757d",
              borderBottom:
                filters.status === tab.value
                  ? "2px solid #007bff"
                  : "2px solid transparent",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (filters.status !== tab.value) {
                e.currentTarget.style.color = "#495057";
              }
            }}
            onMouseLeave={(e) => {
              if (filters.status !== tab.value) {
                e.currentTarget.style.color = "#6c757d";
              }
            }}
          >
            {tab.label}
          </button>
        ))}

        <div
          style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
        >
          <Button
            onClick={() =>
              onSortChange({
                ...sortOptions,
                direction: sortOptions.direction === "asc" ? "desc" : "asc",
              })
            }
            design="Transparent"
            icon="sort"
          >
            {t("filters.sortByDate")}{" "}
            {sortOptions.direction === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>
    </div>
  );
}
