import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BLOOD_REQUEST_SERVICE } from "@shared/api/service/blood-request.service";
import {
    CreateBloodRequestDto,
    UpdateBloodRequestDto,
    PaginationParams,
    BloodRequest,
} from "@shared/interfaces/models/blood-request.interface";

/**
 * Query Keys for Blood Requests
 * Centralized for easy cache invalidation
 */
export const bloodRequestKeys = {
    all: ["blood-requests"] as const,
    feed: (params?: PaginationParams) =>
        [...bloodRequestKeys.all, "feed", params] as const,
    myRequests: (params?: PaginationParams) =>
        [...bloodRequestKeys.all, "my", params] as const,
    detail: (id: string) => [...bloodRequestKeys.all, "detail", id] as const,
};

/**
 * Get public blood request feed with pagination
 * No authentication required
 */
export const useBloodRequestFeed = (params?: PaginationParams) => {
    return useQuery({
        queryKey: bloodRequestKeys.feed(params),
        queryFn: async () => {
            const response = await BLOOD_REQUEST_SERVICE.getFeed(params);
            return response.data;
        },
    });
};

/**
 * Get user's own blood requests with pagination
 * Requires authentication
 */
export const useMyBloodRequests = (params?: PaginationParams) => {
    return useQuery({
        queryKey: bloodRequestKeys.myRequests(params),
        queryFn: async () => {
            const response = await BLOOD_REQUEST_SERVICE.getMyRequests(params);
            return response.data;
        },
    });
};

/**
 * Get details of a single blood request
 * No authentication required
 */
export const useBloodRequestDetails = (requestId: string, enabled = true) => {
    return useQuery({
        queryKey: bloodRequestKeys.detail(requestId),
        queryFn: async () => {
            const response = await BLOOD_REQUEST_SERVICE.getRequestById(requestId);
            return response.data;
        },
        enabled: !!requestId && enabled,
    });
};

/**
 * Create a new blood request
 * Invalidates feed and myRequests cache on success
 */
export const useCreateBloodRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateBloodRequestDto) => {
            const response = await BLOOD_REQUEST_SERVICE.createRequest(data);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate all blood request queries (all pages, all filters)
            queryClient.invalidateQueries({ queryKey: bloodRequestKeys.all });
        },
    });
};

/**
 * Update an existing blood request
 * Invalidates detail, myRequests, and feed cache on success
 */
export const useUpdateBloodRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: UpdateBloodRequestDto;
        }) => {
            const response = await BLOOD_REQUEST_SERVICE.updateRequest(id, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            // Invalidate specific request detail
            queryClient.invalidateQueries({
                queryKey: bloodRequestKeys.detail(variables.id),
            });
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: bloodRequestKeys.myRequests() });
            queryClient.invalidateQueries({ queryKey: bloodRequestKeys.feed() });
        },
    });
};
