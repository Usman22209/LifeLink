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
  getFeed: (
    params?: PaginationParams & {
      blood_group?: string;
      urgency?: string;
      city_id?: string;
      search?: string;
      sort_by?: string;
      lat?: number;
      lng?: number;
    },
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.blood_group && params.blood_group !== "All")
      queryParams.append("blood_group", params.blood_group);
    if (params?.urgency && params.urgency !== "All")
      queryParams.append("urgency", params.urgency);
    if (params?.city_id && params.city_id !== "All")
      queryParams.append("city_id", params.city_id);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params?.lat) queryParams.append("lat", params.lat.toString());
    if (params?.lng) queryParams.append("lng", params.lng.toString());

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

  /**
   * Get urgent blood requests for HomeScreen
   */
  getUrgentRequests: (params?: {
    limit?: number;
    lat?: number;
    lng?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.lat) queryParams.append("lat", params.lat.toString());
    if (params?.lng) queryParams.append("lng", params.lng.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_CONFIG.BLOOD_REQUESTS.urgent}?${queryString}`
      : API_CONFIG.BLOOD_REQUESTS.urgent;

    return HTTP_CLIENT.get(url);
  },
};
