"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  LeaveType,
  LeaveStatus,
  type LeaveRequest,
} from "../types/leave-request";
import { useTranslation } from "../hooks/useTranslation";
import { Input, Button } from "@ui5/webcomponents-react";

interface LeaveRequestDetailsModalProps {
  isOpen: boolean;
  request: LeaveRequest | null;
  onClose: () => void;
  onUpdate: (
    id: string,
    updatedRequest: Partial<LeaveRequest>
  ) => Promise<void>;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export function LeaveRequestDetailsModal({
  isOpen,
  request,
  onClose,
  onUpdate,
  onApprove,
  onReject,
}: LeaveRequestDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    leaveType: LeaveType.VACATION,
    startDate: "",
    endDate: "",
    reason: "",
    status: LeaveStatus.PENDING,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { t } = useTranslation();

  useEffect(() => {
    if (request) {
      setFormData({
        employeeName: request.employeeName,
        leaveType: request.leaveType,
        startDate: request.startDate,
        endDate: request.endDate,
        reason: request.reason || "",
        status: request.status,
      });
    }
  }, [request]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeName.trim()) {
      newErrors.employeeName = t("validation.employeeNameRequired");
    }

    if (!formData.startDate) {
      newErrors.startDate = t("validation.startDateRequired");
    }

    if (!formData.endDate) {
      newErrors.endDate = t("validation.endDateRequired");
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate = t("validation.endDateAfterStart");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm() || !request) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare all the updated data
      const updatedData: Partial<LeaveRequest> = {
        employeeName: formData.employeeName.trim(),
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason.trim(),
        status: formData.status,
      };

      console.log("Updating request with data:", updatedData);

      // Call the service to update the request
      await onUpdate(request.id, updatedData);

      console.log("Request updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating request:", error);
      // You could add error handling here to show a message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleApprove = async () => {
    if (!request) return;
    setIsSubmitting(true);
    try {
      await onApprove(request.id);
      handleClose();
    } catch (error) {
      console.error("Error approving request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!request) return;
    setIsSubmitting(true);
    try {
      await onReject(request.id);
      handleClose();
    } catch (error) {
      console.error("Error rejecting request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get leave type translation
  const getLeaveTypeTranslation = (leaveType: LeaveType) => {
    switch (leaveType) {
      case LeaveType.VACATION:
        return t("leaveTypes.vacation");
      case LeaveType.SICK:
        return t("leaveTypes.sick");
      case LeaveType.PERSONAL:
        return t("leaveTypes.personal");
      case LeaveType.MATERNITY:
        return t("leaveTypes.maternity");
      case LeaveType.PATERNITY:
        return t("leaveTypes.paternity");
      default:
        return leaveType;
    }
  };

  // Helper function to get status translation
  const getStatusTranslation = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED:
        return t("status.approved");
      case LeaveStatus.REJECTED:
        return t("status.rejected");
      case LeaveStatus.PENDING:
      default:
        return t("status.pending");
    }
  };

  // Make sure all form fields are properly enabled/disabled based on editing state
  const getFieldStyle = (hasError = false) => ({
    width: "100%",
    padding: "10px",
    border: hasError ? "1px solid #dc3545" : "1px solid #e9ecef",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
    backgroundColor: isEditing ? "white" : "#f8f9fa",
    cursor: isEditing ? "text" : "default",
    opacity: isEditing ? 1 : 0.7,
  });

  if (!isOpen || !request) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
        }}
        onClick={handleClose}
      />

      {/* Modal Content - Fixed height and no scroll */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          width: "90%",
          maxWidth: "600px",
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          zIndex: 9999,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "600",
                color: "#1a1a1a",
              }}
            >
              {t("detailsModal.title")}
            </h2>
            <p
              style={{
                margin: "8px 0 0 0",
                color: "#6c757d",
                fontSize: "14px",
              }}
            >
              {t("detailsModal.requestId")}: {request.id} •{" "}
              {t("detailsModal.requestedOn")}{" "}
              {new Date(request.dateRequested).toLocaleDateString()}
              {request.status !== LeaveStatus.PENDING && (
                <span style={{ color: "#856404", fontWeight: "500" }}>
                  {" • "}
                  {request.status === LeaveStatus.APPROVED ? "✓ " : "✗ "}
                  {t("common.readOnly")}
                </span>
              )}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "500",
                backgroundColor:
                  request.status === "Approved"
                    ? "#d4edda"
                    : request.status === "Rejected"
                    ? "#f8d7da"
                    : "#fff3cd",
                color:
                  request.status === "Approved"
                    ? "#155724"
                    : request.status === "Rejected"
                    ? "#721c24"
                    : "#856404",
              }}
            >
              {getStatusTranslation(request.status)}
            </span>
          </div>
        </div>

        {/* Employee Info - Fixed */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
            padding: "16px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#007bff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            {request.employeeName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "600",
                color: "#1a1a1a",
              }}
            >
              {request.employeeName}
            </h3>
            <p
              style={{
                margin: "4px 0 0 0",
                color: "#6c757d",
                fontSize: "14px",
              }}
            >
              {getLeaveTypeTranslation(request.leaveType)}
            </p>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
          <div>
            {" "}
            {/* Changed from <form> to <div> since we're handling submission manually */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label
                  htmlFor="employeeName"
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "500",
                    color: "#1a1a1a",
                    fontSize: "14px",
                  }}
                >
                  {t("detailsModal.employeeName")} *
                </label>
                <Input
                  id="employeeName"
                  value={formData.employeeName}
                  onInput={(e) =>
                    handleInputChange("employeeName", e.target.value)
                  }
                  disabled={!isEditing}
                  style={{ width: "100%" }}
                />
                {errors.employeeName && (
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      color: "#dc3545",
                      fontSize: "12px",
                    }}
                  >
                    {errors.employeeName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="leaveType"
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "500",
                    color: "#1a1a1a",
                    fontSize: "14px",
                  }}
                >
                  {t("detailsModal.leaveType")} *
                </label>
                <select
                  id="leaveType"
                  value={formData.leaveType}
                  onChange={(e) =>
                    handleInputChange("leaveType", e.target.value)
                  }
                  disabled={!isEditing}
                  style={getFieldStyle()}
                >
                  <option value={LeaveType.VACATION}>
                    {getLeaveTypeTranslation(LeaveType.VACATION)}
                  </option>
                  <option value={LeaveType.SICK}>
                    {getLeaveTypeTranslation(LeaveType.SICK)}
                  </option>
                  <option value={LeaveType.PERSONAL}>
                    {getLeaveTypeTranslation(LeaveType.PERSONAL)}
                  </option>
                  <option value={LeaveType.MATERNITY}>
                    {getLeaveTypeTranslation(LeaveType.MATERNITY)}
                  </option>
                  <option value={LeaveType.PATERNITY}>
                    {getLeaveTypeTranslation(LeaveType.PATERNITY)}
                  </option>
                </select>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label
                  htmlFor="startDate"
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "500",
                    color: "#1a1a1a",
                    fontSize: "14px",
                  }}
                >
                  {t("detailsModal.startDate")} *
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  disabled={!isEditing}
                  style={getFieldStyle(!!errors.startDate)}
                />
                {errors.startDate && (
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      color: "#dc3545",
                      fontSize: "12px",
                    }}
                  >
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "500",
                    color: "#1a1a1a",
                    fontSize: "14px",
                  }}
                >
                  {t("detailsModal.endDate")} *
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  disabled={!isEditing}
                  style={getFieldStyle(!!errors.endDate)}
                />
                {errors.endDate && (
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      color: "#dc3545",
                      fontSize: "12px",
                    }}
                  >
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="status"
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                  fontSize: "14px",
                }}
              >
                {t("detailsModal.status")}
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  handleInputChange("status", e.target.value as LeaveStatus)
                }
                disabled={!isEditing}
                style={getFieldStyle()}
              >
                <option value={LeaveStatus.PENDING}>
                  {getStatusTranslation(LeaveStatus.PENDING)}
                </option>
                <option value={LeaveStatus.APPROVED}>
                  {getStatusTranslation(LeaveStatus.APPROVED)}
                </option>
                <option value={LeaveStatus.REJECTED}>
                  {getStatusTranslation(LeaveStatus.REJECTED)}
                </option>
              </select>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="reason"
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                  fontSize: "14px",
                }}
              >
                {t("detailsModal.reason")}
              </label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                disabled={!isEditing}
                rows={3}
                style={{
                  ...getFieldStyle(),
                  resize: "vertical" as const,
                }}
                placeholder={t("detailsModal.reasonPlaceholder")}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "16px",
            borderTop: "1px solid #e9ecef",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            {request.status === LeaveStatus.PENDING && !isEditing && (
              <>
                <Button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  design="Positive"
                >
                  {t("common.approve")}
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isSubmitting}
                  design="Negative"
                >
                  {t("common.reject")}
                </Button>
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {isEditing ? (
              <>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setErrors({});
                    if (request) {
                      setFormData({
                        employeeName: request.employeeName,
                        leaveType: request.leaveType,
                        startDate: request.startDate,
                        endDate: request.endDate,
                        reason: request.reason || "",
                        status: request.status,
                      });
                    }
                  }}
                  disabled={isSubmitting}
                  design="Transparent"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                  design="Emphasized"
                >
                  {isSubmitting
                    ? t("detailsModal.saving")
                    : t("detailsModal.saveChanges")}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleClose} design="Transparent">
                  {t("common.close")}
                </Button>
                {/* Only show Edit button for pending requests */}
                {request.status === LeaveStatus.PENDING && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    design="Emphasized"
                  >
                    {t("detailsModal.editRequest")}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
