import { EvaluationState, KPICategory } from '../types';

// This service is disabled for offline/desktop version
export const generateKPIReport = async (
  kpiData: KPICategory[],
  ratings: EvaluationState
): Promise<string> => {
  return "Tính năng AI đã bị vô hiệu hóa trong phiên bản Offline.";
};