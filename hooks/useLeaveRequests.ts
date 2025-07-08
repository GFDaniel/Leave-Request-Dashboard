"use client";

import { useState, useEffect, useCallback } from "react";
import {
  type LeaveRequest,
  LeaveStatus,
  type FilterOptions,
  type SortOptions,
} from "../types/leave-request";
import type { ILeaveRequestService } from "../services/leave-request.service";
import { LeaveRequestUtils } from "../utils/leave-request.utils";

export interface UseLeaveRequestsReturn {
  requests: LeaveRequest[];
  filteredRequests: LeaveRequest[];
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  sortOptions: SortOptions;
  setFilters: (filters: FilterOptions) => void;
  setSortOptions: (sortOptions: SortOptions) => void;
  approveRequest: (id: string) => Promise<void>;
  rejectRequest: (id: string) => Promise<void>;
  refreshRequests: () => Promise<void>;
  createRequest: (request: Omit<LeaveRequest, "id">) => Promise<void>;
  updateRequest: (
    id: string,
    updatedData: Partial<LeaveRequest>
  ) => Promise<void>;
}

export function useLeaveRequests(
  service: ILeaveRequestService
): UseLeaveRequestsReturn {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "dateRequested",
    direction: "desc",
  });

  const loadRequests = useCallback(async () => {
    console.log("Hook: Loading requests...");
    try {
      setLoading(true);
      setError(null);
      const data = await service.getLeaveRequests();
      console.log("Hook: Received data:", data);
      setRequests(data);
    } catch (err) {
      console.error("Hook: Error loading requests:", err);
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [service]);

  const approveRequest = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const updatedRequest = await service.updateLeaveRequestStatus(
          id,
          LeaveStatus.APPROVED
        );
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? updatedRequest : req))
        );
      } catch (err) {
        console.error("Hook: Error approving request:", err);
        setError(
          err instanceof Error ? err.message : "Failed to approve request"
        );
      }
    },
    [service]
  );

  const rejectRequest = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const updatedRequest = await service.updateLeaveRequestStatus(
          id,
          LeaveStatus.REJECTED
        );
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? updatedRequest : req))
        );
      } catch (err) {
        console.error("Hook: Error rejecting request:", err);
        setError(
          err instanceof Error ? err.message : "Failed to reject request"
        );
      }
    },
    [service]
  );

  const createRequest = useCallback(
    async (request: Omit<LeaveRequest, "id">) => {
      try {
        setError(null);
        const newRequest = await service.createLeaveRequest(request);
        setRequests((prev) => [newRequest, ...prev]);
      } catch (err) {
        console.error("Hook: Error creating request:", err);
        setError(
          err instanceof Error ? err.message : "Failed to create request"
        );
        throw err; // Re-throw to handle in the modal
      }
    },
    [service]
  );

  const updateRequest = useCallback(
    async (id: string, updatedData: Partial<LeaveRequest>) => {
      try {
        setError(null);
        console.log(`Hook: Updating request ${id} with data:`, updatedData);

        // Call the service to update the request
        const updatedRequest = await service.updateLeaveRequest(
          id,
          updatedData
        );

        console.log("Hook: Request updated successfully:", updatedRequest);

        // Update the local state with the updated request
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? updatedRequest : req))
        );
      } catch (err) {
        console.error("Hook: Error updating request:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update request"
        );
        throw err; // Re-throw to handle in the modal
      }
    },
    [service]
  );

  const filteredRequests = LeaveRequestUtils.sortRequests(
    LeaveRequestUtils.filterRequests(requests, filters),
    sortOptions
  );

  console.log("Hook: Current state:", {
    requestsLength: requests.length,
    filteredRequestsLength: filteredRequests.length,
    loading,
    error,
    filters,
  });

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return {
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
    refreshRequests: loadRequests,
    createRequest,
    updateRequest,
  };
}
