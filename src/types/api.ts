import { z } from 'zod';
import { StationSchema, MetroLineSchema, NetworkStatusSchema } from './metro';

/**
 * Common API response schemas
 */

// Base API response schema
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  timestamp: z.string().datetime(),
  version: z.string().optional()
});

// Paginated response schema
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  ApiResponseSchema.extend({
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      total: z.number().int().nonnegative(),
      totalPages: z.number().int().nonnegative(),
      hasNext: z.boolean(),
      hasPrev: z.boolean()
    })
  });

// Single item response schema
export const SingleItemResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  ApiResponseSchema.extend({
    data: dataSchema
  });

// Error response schema
export const ErrorResponseSchema = ApiResponseSchema.extend({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.any()).optional()
  })
});

/**
 * Metro-specific API schemas
 */

// Station API response
export const StationApiResponseSchema = SingleItemResponseSchema(StationSchema);
export const StationsApiResponseSchema = PaginatedResponseSchema(StationSchema);

// Metro line API response  
export const MetroLineApiResponseSchema = SingleItemResponseSchema(MetroLineSchema);
export const MetroLinesApiResponseSchema = PaginatedResponseSchema(MetroLineSchema);

// Network status API response
export const NetworkStatusApiResponseSchema = ApiResponseSchema.extend({
  data: z.object({
    status: NetworkStatusSchema,
    lastUpdated: z.string().datetime(),
    events: z.array(z.object({
      id: z.string(),
      type: z.enum(['info', 'warning', 'error', 'success']),
      message: z.string(),
      timestamp: z.string().datetime(),
      affectedLines: z.array(z.number().int().positive()).optional()
    }))
  })
});

// Trip planning request schema
export const TripPlanningRequestSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  departureTime: z.string().datetime().optional(),
  arrivalTime: z.string().datetime().optional(),
  preferences: z.object({
    accessibleOnly: z.boolean().optional(),
    minimizeTransfers: z.boolean().optional(),
    preferExpress: z.boolean().optional()
  }).optional()
});

// Trip planning response schema
export const TripOptionSchema = z.object({
  id: z.string(),
  duration: z.number().int().positive(), // in minutes
  transfers: z.number().int().nonnegative(),
  walkingDistance: z.number().nonnegative(), // in meters
  cost: z.number().nonnegative(), // in CLP
  accessibility: z.object({
    wheelchairAccessible: z.boolean(),
    elevatorRequired: z.boolean()
  }),
  legs: z.array(z.object({
    id: z.string(),
    mode: z.enum(['walk', 'metro']),
    from: z.object({
      stationId: z.string().optional(),
      stationName: z.string().optional(),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number()
      }).optional()
    }),
    to: z.object({
      stationId: z.string().optional(),
      stationName: z.string().optional(),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number()
      }).optional()
    }),
    lineNumber: z.number().int().positive().optional(),
    lineName: z.string().optional(),
    departureTime: z.string().datetime(),
    arrivalTime: z.string().datetime(),
    duration: z.number().int().positive(),
    distance: z.number().nonnegative().optional()
  }))
});

export const TripPlanningResponseSchema = ApiResponseSchema.extend({
  data: z.object({
    options: z.array(TripOptionSchema),
    metadata: z.object({
      searchTime: z.number().nonnegative(),
      currency: z.string().default('CLP'),
      disclaimer: z.string().optional()
    })
  })
});

// Service disruption API schema
export const ServiceDisruptionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  lineNumber: z.number().int().positive(),
  lineName: z.string(),
  affectedStations: z.array(z.string()),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.enum(['planned', 'unplanned', 'emergency']),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  estimatedEndTime: z.string().datetime().optional(),
  isActive: z.boolean(),
  alternativeTransport: z.array(z.string()).optional(),
  updates: z.array(z.object({
    id: z.string(),
    message: z.string(),
    timestamp: z.string().datetime()
  }))
});

export const ServiceDisruptionsResponseSchema = PaginatedResponseSchema(ServiceDisruptionSchema);

// Real-time arrivals schema
export const ArrivalInfoSchema = z.object({
  lineNumber: z.number().int().positive(),
  lineName: z.string(),
  direction: z.string(),
  destination: z.string(),
  estimatedArrival: z.number().int().nonnegative(), // in seconds
  scheduledArrival: z.string().datetime(),
  platform: z.string().optional(),
  trainId: z.string().optional(),
  crowdingLevel: z.enum(['low', 'medium', 'high']).optional()
});

export const StationArrivalsResponseSchema = ApiResponseSchema.extend({
  data: z.object({
    stationId: z.string(),
    stationName: z.string(),
    arrivals: z.array(ArrivalInfoSchema),
    lastUpdated: z.string().datetime()
  })
});

// News and announcements schema
export const NewsItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  category: z.enum(['news', 'announcement', 'service-update', 'emergency']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  publishedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  author: z.object({
    name: z.string(),
    department: z.string().optional()
  }),
  tags: z.array(z.string()),
  attachments: z.array(z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().url(),
    type: z.string(),
    size: z.number().int().nonnegative()
  })).optional(),
  relatedLines: z.array(z.number().int().positive()).optional()
});

export const NewsResponseSchema = PaginatedResponseSchema(NewsItemSchema);

/**
 * TypeScript types inferred from schemas
 */

export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type TripPlanningRequest = z.infer<typeof TripPlanningRequestSchema>;
export type TripOption = z.infer<typeof TripOptionSchema>;
export type TripPlanningResponse = z.infer<typeof TripPlanningResponseSchema>;
export type ServiceDisruption = z.infer<typeof ServiceDisruptionSchema>;
export type ArrivalInfo = z.infer<typeof ArrivalInfoSchema>;
export type NewsItem = z.infer<typeof NewsItemSchema>;

// Response types
export type StationApiResponse = z.infer<typeof StationApiResponseSchema>;
export type StationsApiResponse = z.infer<typeof StationsApiResponseSchema>;
export type MetroLineApiResponse = z.infer<typeof MetroLineApiResponseSchema>;
export type MetroLinesApiResponse = z.infer<typeof MetroLinesApiResponseSchema>;
export type NetworkStatusApiResponse = z.infer<typeof NetworkStatusApiResponseSchema>;
export type ServiceDisruptionsResponse = z.infer<typeof ServiceDisruptionsResponseSchema>;
export type StationArrivalsResponse = z.infer<typeof StationArrivalsResponseSchema>;
export type NewsResponse = z.infer<typeof NewsResponseSchema>;

/**
 * API client configuration
 */

export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  apiKey?: string;
  version: string;
  headers?: Record<string, string>;
}

export interface ApiRequestOptions {
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

/**
 * HTTP methods and status codes
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

/**
 * API endpoints configuration
 */

export const API_ENDPOINTS = {
  // Stations
  STATIONS: '/stations',
  STATION_DETAIL: '/stations/:id',
  STATION_ARRIVALS: '/stations/:id/arrivals',
  
  // Lines
  LINES: '/lines',
  LINE_DETAIL: '/lines/:number',
  LINE_STATIONS: '/lines/:number/stations',
  
  // Network
  NETWORK_STATUS: '/network/status',
  SERVICE_DISRUPTIONS: '/network/disruptions',
  
  // Trip planning
  TRIP_PLANNING: '/trips/plan',
  
  // News and announcements
  NEWS: '/news',
  NEWS_DETAIL: '/news/:id',
  ANNOUNCEMENTS: '/announcements',
  
  // User services
  USER_PREFERENCES: '/user/preferences',
  USER_FAVORITES: '/user/favorites'
} as const;

/**
 * Validation functions
 */

export const validateApiResponse = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> => {
  return schema.parse(data);
};

export const validateTripPlanningRequest = (data: unknown): TripPlanningRequest => {
  return TripPlanningRequestSchema.parse(data);
};

/**
 * Type guards
 */

export const isErrorResponse = (data: unknown): data is ErrorResponse => {
  return ErrorResponseSchema.safeParse(data).success;
};

export const isApiResponse = (data: unknown): data is ApiResponse => {
  return ApiResponseSchema.safeParse(data).success;
};

/**
 * Utility functions
 */

// Build URL with parameters
export const buildApiUrl = (
  endpoint: string,
  params: Record<string, string | number> = {},
  queryParams: Record<string, string | number | boolean> = {}
): string => {
  let url = endpoint;
  
  // Replace path parameters
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  
  // Add query parameters
  const searchParams = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  
  const queryString = searchParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  return url;
};

// Create paginated request parameters
export const createPaginationParams = (
  page = 1,
  limit = 20
): Record<string, number> => ({
  page,
  limit
});

// Format API error message
export const formatApiError = (error: ErrorResponse): string => {
  return error.error?.message || error.message || 'An unknown error occurred';
};