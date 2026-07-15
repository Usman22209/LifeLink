import HTTP_CLIENT from "../controller/HTTP_CLIENT";
import { API_CONFIG } from "../config";
import {
  BloodRequest,
  CreateBloodRequestDto,
  UpdateBloodRequestDto,
  PaginationParams,
  BloodRequestFeedResponse,
  MyBloodRequestsResponse,
  BloodRequestDetailsResponse,
} from "@shared/interfaces/models/blood-request.interface";

export const BLOOD_REQUEST_SERVICE = {
  /**
   * Create a new blood request
   */
  createRequest: (data: CreateBloodRequestDto) => {
    return HTTP_CLIENT.post<BloodRequestDetailsResponse>(
      API_CONFIG.BLOOD_REQUESTS.create,
      data,
    );
  },

  /**
   * Get public blood request feed with pagination
   * No authentication required
   */
  getFeed: (params?: PaginationParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_CONFIG.BLOOD_REQUESTS.feed}?${queryString}`
      : API_CONFIG.BLOOD_REQUESTS.feed;

    return HTTP_CLIENT.get<BloodRequestFeedResponse>(url);
  },

  /**
   * Get user's own blood requests with pagination
   * Requires authentication
   */
  getMyRequests: (params?: PaginationParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_CONFIG.BLOOD_REQUESTS.myRequests}?${queryString}`
      : API_CONFIG.BLOOD_REQUESTS.myRequests;

    return HTTP_CLIENT.get<MyBloodRequestsResponse>(url);
  },

  /**
   * Get details of a single blood request by ID
   * No authentication required
   */
  getRequestById: (requestId: string) => {
    return HTTP_CLIENT.get<BloodRequestDetailsResponse>(
      `${API_CONFIG.BLOOD_REQUESTS.base}/${requestId}`,
    );
  },

  /**
   * Update a blood request (cancel, modify details)
   * Only the requester can update their own requests
   */
  updateRequest: (requestId: string, data: UpdateBloodRequestDto) => {
    return HTTP_CLIENT.patch<BloodRequestDetailsResponse>(
      `${API_CONFIG.BLOOD_REQUESTS.base}/${requestId}`,
      data,
    );
  },
};
