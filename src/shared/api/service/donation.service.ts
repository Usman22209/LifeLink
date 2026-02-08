import HTTP_CLIENT from "../controller/HTTP_CLIENT";
import { API_CONFIG } from "../config";
import {
    DonationStatus,
    DonationResponse,
    DonationsForRequestResponse,
    AcceptRequestDto,
    UpdateDonationStatusDto,
} from "@shared/interfaces/models/blood-request.interface";

export const DONATION_SERVICE = {
    /**
     * Accept a blood request (offer to donate)
     * Creates a donation with "intent" status
     */
    acceptRequest: (requestId: string) => {
        const data: AcceptRequestDto = { request_id: requestId };
        return HTTP_CLIENT.post<DonationResponse>(
            API_CONFIG.DONATIONS.accept,
            data
        );
    },

    /**
     * Get all donations for a specific blood request
     * Only the requester can view donations for their request
     */
    getDonationsForRequest: (requestId: string) => {
        return HTTP_CLIENT.get<DonationsForRequestResponse>(
            `${API_CONFIG.DONATIONS.base}/request/${requestId}`
        );
    },

    /**
     * Update donation status
     * - Donors can cancel (intent -> cancelled)
     * - Requesters can mark as completed (intent -> completed)
     */
    updateDonationStatus: (donationId: string, status: DonationStatus) => {
        const data: UpdateDonationStatusDto = { status };
        return HTTP_CLIENT.patch<DonationResponse>(
            `${API_CONFIG.DONATIONS.base}/${donationId}/status`,
            data
        );
    },
};
