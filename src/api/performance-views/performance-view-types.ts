export interface PerformanceView {
  viewId: number;
  performanceId: number;
  performanceName: string;
  posterUrl: string;
  startDate: string;
  venueName: string;
  analysisId: number;
  viewedAt: string;
}

export interface PerformanceViewPage {
  content: PerformanceView[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface GetPerformanceViewsParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface CreatePerformanceViewRequest {
  performanceId: number;
  analysisId: number;
}

export interface CreatePerformanceViewResult {
  viewId: number;
  created: boolean;
  viewedAt: string;
}
