export interface IParams {
  search?: string;
  page: number;
  limit: number;
}

export interface IPagination {
  currentPage: number;
  limit: number;
  pagesCount: number;
  resultCount: number;
  totalCount: number;
}

export interface IPaginatedResponse<T> extends IPagination {
  data: T[];
}
