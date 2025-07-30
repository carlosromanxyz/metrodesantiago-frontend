import { z } from 'zod';

/**
 * Zod schemas for Metro domain types
 */

// Metro Line schema with validation
export const MetroLineSchema = z.object({
  number: z.number().int().positive(),
  name: z.string().min(1),
  color: z.string().min(1),
  colorHex: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color format"),
  stations: z.array(z.string().min(1)).min(1)
});

// Station schema with validation
export const StationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  line: z.string().min(1),
  lineNumber: z.number().int().positive(),
  lineColor: z.string().min(1),
  isTransfer: z.boolean().optional(),
  transferLines: z.array(z.number().int().positive()).optional()
});

// Station with lines information schema
export const StationLineInfoSchema = z.object({
  lineNumber: z.number().int().positive(),
  color: z.string().min(1),
  hexColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color format")
});

// Line indicator props schema
export const LineIndicatorDataSchema = z.object({
  lineNumber: z.number().int().positive(),
  hexColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color format")
});

// Network status schema
export const NetworkStatusSchema = z.enum([
  "available", 
  "partially-available", 
  "not-available", 
  "closed"
]);

/**
 * TypeScript types inferred from Zod schemas
 */

export type MetroLine = z.infer<typeof MetroLineSchema>;
export type Station = z.infer<typeof StationSchema>;
export type StationLineInfo = z.infer<typeof StationLineInfoSchema>;
export type LineIndicatorData = z.infer<typeof LineIndicatorDataSchema>;
export type NetworkStatusType = z.infer<typeof NetworkStatusSchema>;

/**
 * Additional derived types for specific use cases
 */

// Station with full line information
export interface StationWithLines {
  station: Station | undefined;
  lines: StationLineInfo[];
}

// Station option for comboboxes/dropdowns
export interface StationOption {
  value: string;
  label: string;
  lines: LineIndicatorData[];
}

// Trip planner data
export interface TripPlannerData {
  fromStation: string;
  toStation: string;
  departureTime?: Date;
  arrivalTime?: Date;
}

// Service disruption information
export interface ServiceDisruption {
  id: string;
  lineNumber: number;
  lineName: string;
  affectedStations: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  startTime: Date;
  expectedEndTime?: Date;
  isActive: boolean;
}

// Network event information
export interface NetworkEvent {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
  affectedLines?: number[];
}

/**
 * Validation functions
 */

export const validateMetroLine = (data: unknown): MetroLine => {
  return MetroLineSchema.parse(data);
};

export const validateStation = (data: unknown): Station => {
  return StationSchema.parse(data);
};

export const validateNetworkStatus = (data: unknown): NetworkStatusType => {
  return NetworkStatusSchema.parse(data);
};

/**
 * Type guards
 */

export const isMetroLine = (data: unknown): data is MetroLine => {
  return MetroLineSchema.safeParse(data).success;
};

export const isStation = (data: unknown): data is Station => {
  return StationSchema.safeParse(data).success;
};

export const isNetworkStatus = (data: unknown): data is NetworkStatusType => {
  return NetworkStatusSchema.safeParse(data).success;
};

/**
 * Constants and enums
 */

export const METRO_COLORS = {
  L1: '#E10E0E',  // Roja
  L2: '#FFD100',  // Amarilla
  L3: '#8B4513',  // Café
  L4: '#0066CC',  // Azul
  L4A: '#00A4E4', // Celeste
  L5: '#00B04F',  // Verde Claro
  L6: '#8B1FA9'   // Morada
} as const;

export const LINE_DISPLAY_NAMES = {
  1: 'L1',
  2: 'L2',
  3: 'L3',
  4: 'L4',
  41: 'L4A',
  5: 'L5',
  6: 'L6'
} as const;

// Helper function to format line number for display
export const formatLineNumber = (lineNumber: number): string => {
  return lineNumber === 41 ? '4A' : lineNumber.toString();
};

// Helper function to get line color by number
export const getLineColor = (lineNumber: number): string => {
  switch (lineNumber) {
    case 1: return METRO_COLORS.L1;
    case 2: return METRO_COLORS.L2;
    case 3: return METRO_COLORS.L3;
    case 4: return METRO_COLORS.L4;
    case 41: return METRO_COLORS.L4A;
    case 5: return METRO_COLORS.L5;
    case 6: return METRO_COLORS.L6;
    default: return '#666666';
  }
};