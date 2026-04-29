export const PAGINATED_MARKER = "__paginated" as const;

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
}

export class PaginatedResponseDto<T> {
  readonly data: T[];
  readonly meta: PaginationMeta;
  readonly [PAGINATED_MARKER] = true;

  constructor(data: T[], meta: PaginationMeta) {
    this.data = data;
    this.meta = meta;
  }
}
