import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DONATION_SERVICE } from "@shared/api/service/donation.service";
import {
  DonationStatus,
  Donation,
} from "@shared/interfaces/models/blood-request.interface";
import { bloodRequestKeys } from "../blood-requests/useBloodRequests";
import { notificationKeys } from "../notifications/useNotifications";

/**
 * Accept a blood request (offer to donate)
 * Creates a donation with "intent" status
 * Invalidates request details and feed on success
 */
export const useAcceptBloodRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await DONATION_SERVICE.acceptRequest(requestId);
      return response.data;
    },
    onSuccess: (_, requestId) => {
      // Invalidate request detail to show updated donation count
      queryClient.invalidateQueries({
        queryKey: bloodRequestKeys.detail(requestId),
      });
      // Invalidate feed to show updated status
      queryClient.invalidateQueries({ queryKey: bloodRequestKeys.feed() });
      // Invalidate my donations and all donation queries so pledged state updates immediately
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      // Invalidate chat threads so a new thread is visible
      queryClient.invalidateQueries({ queryKey: ["chat"] });
      // Invalidate notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

/**
 * Get all donations for a specific blood request
 * Only the requester can view donations for their request
 */
export const useDonationsForRequest = (requestId: string, enabled = true) => {
  return useQuery({
    queryKey: ["donations", "request", requestId],
    queryFn: async () => {
      const response = await DONATION_SERVICE.getDonationsForRequest(requestId);
      return response.data;
    },
    enabled: !!requestId && enabled,
  });
};

/**
 * Update donation status
 * - Donors can cancel (intent -> cancelled)
 * - Requesters can mark as completed (intent -> completed)
 * Invalidates donations and blood request queries on success
 */
export const useUpdateDonationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      donationId,
      status,
    }: {
      donationId: string;
      status: DonationStatus;
    }) => {
      const response = await DONATION_SERVICE.updateDonationStatus(
        donationId,
        status,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all donation queries
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      // Invalidate blood request queries to reflect updated fulfilled_units
      queryClient.invalidateQueries({ queryKey: bloodRequestKeys.all });
    },
  });
};

/**
 * Get logged-in donor's historical donations and stats
 */
export const useMyDonations = (enabled = true) => {
  return useQuery({
    queryKey: ["donations", "my"],
    queryFn: async () => {
      const response = await DONATION_SERVICE.getMyDonations();
      return response.data?.data || response.data;
    },
    enabled,
  });
};
