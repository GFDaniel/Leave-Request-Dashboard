"use client";

import type React from "react";

import { useState } from "react";
import {
  LeaveType,
  LeaveStatus,
  type LeaveRequest,
} from "../types/leave-request";
import { useTranslation } from "../hooks/useTranslation";
import { Input, Button } from "@ui5/webcomponents-react";

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<LeaveRequest, "id">) => Promise<void>;
}

export function CreateRequestModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateRequestModalProps) {
  const [formData, setFormData] = useState({
    employeeName: "",
    leaveType: LeaveType.VACATION,
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useTranslation();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newRequest: Omit<LeaveRequest, "id"> = {
        employeeName: formData.employeeName.trim(),
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: LeaveStatus.PENDING,
        reason: formData.reason.trim(),
        dateRequested: new Date().toISOString().split("T")[0],
      };

      await onSubmit(newRequest);
      handleClose();
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      employeeName: "",
      leaveType: LeaveType.VACATION,
      startDate: "",
      endDate: "",
      reason: "",
    });
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

  if (!isOpen) return null;

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

      {/* Modal Content */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "32px",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          zIndex: 9999,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "600",
              color: "#1a1a1a",
            }}
          >
            {t("createModal.title")}
          </h2>
          <p
            style={{ margin: "8px 0 0 0", color: "#6c757d", fontSize: "14px" }}
          >
            {t("createModal.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="employeeName"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#1a1a1a",
              }}
            >
              {t("createModal.employeeName")} *
            </label>
            <Input
              id="employeeName"
              value={formData.employeeName}
              onInput={(e) => handleInputChange("employeeName", e.target.value)}
              placeholder={t("createModal.employeeName")}
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

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="leaveType"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#1a1a1a",
              }}
            >
              {t("createModal.leaveType")} *
            </label>
            <select
              id="leaveType"
              value={formData.leaveType}
              onChange={(e) => handleInputChange("leaveType", e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e9ecef",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label
                htmlFor="startDate"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                }}
              >
                {t("createModal.startDate")} *
              </label>
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: errors.startDate
                    ? "1px solid #dc3545"
                    : "1px solid #e9ecef",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
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
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                }}
              >
                {t("createModal.endDate")} *
              </label>
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: errors.endDate
                    ? "1px solid #dc3545"
                    : "1px solid #e9ecef",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
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

          <div style={{ marginBottom: "32px" }}>
            <label
              htmlFor="reason"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#1a1a1a",
              }}
            >
              {t("createModal.reason")}
            </label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e9ecef",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box",
                resize: "vertical",
              }}
              placeholder={t("createModal.reasonPlaceholder")}
            />
          </div>

          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
          >
            <Button
              onClick={handleClose}
              disabled={isSubmitting}
              design="Transparent"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={() => handleSubmit}
              disabled={isSubmitting}
              design="Emphasized"
            >
              {isSubmitting
                ? t("createModal.creating")
                : t("createModal.createRequest")}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
