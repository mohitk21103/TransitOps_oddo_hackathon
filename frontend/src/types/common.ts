/** Cross-cutting types shared across all feature modules. */

export type ID = string

/** ISO-8601 date string, e.g. "2026-07-12" or "2026-07-12T10:00:00Z". */
export type ISODateString = string

export interface Timestamps {
  createdAt: ISODateString
  updatedAt: ISODateString
}

/** Standard envelope returned by the backend for a single resource. */
export interface ApiResponse<T> {
  data: T
  message?: string
}

/** Envelope for a paginated collection. */
export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface QueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

/** A generic normalized error surfaced to the UI layer. */
export interface AppError {
  status: number
  message: string
  details?: Record<string, string[]>
}

/** Helper for building `<Select>` option lists from enums. */
export interface SelectOption<T extends string = string> {
  label: string
  value: T
}
