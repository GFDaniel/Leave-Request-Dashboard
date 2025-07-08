"use client";

import { useState } from "react";
import { Title, MessageStrip } from "@ui5/webcomponents-react";
import type { ILeaveRequestService } from "../services/leave-request.service";
import { useLeaveRequests } from "../hooks/useLeaveRequests";
import { LeaveRequestUtils } from "../utils/leave-request.utils";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import { FilterControls } from "./FilterControls";
import { SummaryCards } from "./SummaryCards";
import { CreateRequestModal } from "./CreateRequestModal";
import { LeaveRequestDetailsModal } from "./LeaveRequestDetailsModal";
import type { LeaveRequest } from "../types/leave-request";
import { useTranslation } from "../hooks/useTranslation";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "@ui5/webcomponents-react";

interface LeaveRequestDashboardProps {
  service: ILeaveRequestService;
}

export function LeaveRequestDashboard({ service }: LeaveRequestDashboardProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );

  const { t, language } = useTranslation();

  const {
    requests,
    filteredRequests,
    loading,
    error,
    filters,
    sortOptions,
    setFilters,
    setSortOptions,
    approveRequest,
    rejectRequest,
    createRequest,
    updateRequest,
  } = useLeaveRequests(service);

  const handleCreateRequest = async (requestData: any) => {
    await createRequest(requestData);
  };

  const handleRowClick = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateRequest = async (
    id: string,
    updatedData: Partial<LeaveRequest>
  ) => {
    await updateRequest(id, updatedData);
  };

  // Helper function to get leave type translation for display
  const getLeaveTypeDisplay = (leaveType: string) => {
    switch (leaveType) {
      case "Vacation":
        return t("leaveTypes.vacation");
      case "Sick Leave":
        return t("leaveTypes.sick");
      case "Personal":
        return t("leaveTypes.personal");
      case "Maternity":
        return t("leaveTypes.maternity");
      case "Paternity":
        return t("leaveTypes.paternity");
      default:
        return leaveType;
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "24px",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Title level="H2">{t("dashboard.loadingRequests")}</Title>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "24px",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <MessageStrip design="Negative" hideCloseButton>
            {t("common.error")}: {error}
          </MessageStrip>
        </div>
      </div>
    );
  }

  return (
    <div
      key={`dashboard-${language}`}
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Title
              level="H2"
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "600",
                color: "#1a1a1a",
              }}
            >
              {t("dashboard.title")}
            </Title>
            <LanguageSelector />
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            design="Emphasized"
          >
            {t("dashboard.createRequest")}
          </Button>
        </div>

        {/* Summary Cards */}
        <SummaryCards requests={requests} />

        {/* Filter Tabs */}
        <FilterControls
          filters={filters}
          sortOptions={sortOptions}
          onFiltersChange={setFilters}
          onSortChange={setSortOptions}
        />

        {/* Table */}
        {requests.length > 0 ? (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderBottom: "1px solid #e9ecef",
                    }}
                  >
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#6c757d",
                      }}
                    >
                      {t("table.employee")}
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#6c757d",
                      }}
                    >
                      {t("table.leaveType")}
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#6c757d",
                      }}
                    >
                      {t("table.dates")}
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#6c757d",
                      }}
                    >
                      {t("table.status")}
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#6c757d",
                      }}
                    >
                      {t("table.reason")}
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#6c757d",
                      }}
                    >
                      {t("table.requested")}
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#6c757d",
                      }}
                    >
                      {t("table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request, index) => (
                    <tr
                      key={request.id}
                      style={{
                        borderBottom: "1px solid #e9ecef",
                        transition: "background-color 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                      }}
                      onClick={() => handleRowClick(request)}
                    >
                      <td style={{ padding: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#007bff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                          >
                            {request.employeeName.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: "500", color: "#1a1a1a" }}>
                            {request.employeeName}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "16px", color: "#6c757d" }}>
                        {getLeaveTypeDisplay(request.leaveType)}
                      </td>
                      <td style={{ padding: "16px", color: "#6c757d" }}>
                        {LeaveRequestUtils.formatDateRange(
                          request.startDate,
                          request.endDate
                        )}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <StatusBadge status={request.status} />
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          color: "#6c757d",
                          maxWidth: "200px",
                        }}
                      >
                        <div
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={request.reason}
                        >
                          {request.reason || "-"}
                        </div>
                      </td>
                      <td style={{ padding: "16px", color: "#6c757d" }}>
                        {new Date(request.dateRequested).toLocaleDateString()}
                      </td>
                      <td
                        style={{ padding: "16px" }}
                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking action buttons
                      >
                        <ActionButtons
                          requestId={request.id}
                          currentStatus={request.status}
                          onApprove={approveRequest}
                          onReject={rejectRequest}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              padding: "48px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#6c757d", fontSize: "16px" }}>
              {t("dashboard.noRequests")}
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              design="Emphasized"
            >
              {t("dashboard.createFirstRequest")}
            </Button>
          </div>
        )}

        {requests.length > 0 && filteredRequests.length === 0 && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              padding: "48px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#6c757d", fontSize: "16px" }}>
              {t("dashboard.noFilteredRequests")}
            </p>
          </div>
        )}

        {/* Create Request Modal */}
        <CreateRequestModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateRequest}
        />

        {/* Details Modal */}
        <LeaveRequestDetailsModal
          isOpen={isDetailsModalOpen}
          request={selectedRequest}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedRequest(null);
          }}
          onUpdate={handleUpdateRequest}
          onApprove={approveRequest}
          onReject={rejectRequest}
        />
      </div>
    </div>
  );
}
