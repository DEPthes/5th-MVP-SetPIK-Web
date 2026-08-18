import { apiRequest } from "@/api/api-client";
import type {
  CreatePerformanceViewRequest,
  CreatePerformanceViewResult,
  GetPerformanceViewsParams,
  PerformanceViewPage,
} from "@/api/performance-views/performance-view-types";

const PERFORMANCE_VIEWS_PATH = "/api/v1/performance-views";

export function getPerformanceViews({
  page = 0,
  size = 20,
  sort = "viewedAt,desc",
}: GetPerformanceViewsParams = {}) {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });

  return apiRequest<PerformanceViewPage>(`${PERFORMANCE_VIEWS_PATH}?${searchParams}`);
}

export function createPerformanceView(body: CreatePerformanceViewRequest) {
  return apiRequest<CreatePerformanceViewResult>(PERFORMANCE_VIEWS_PATH, {
    method: "POST",
    body,
  });
}
