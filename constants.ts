
// KPI_GiamDoc_PhanXuong.ts
// Full TypeScript module to assess performance of a Giám đốc phân xưởng
// - Includes types, RatingLevel enum, KPI_DATA (structure you provided, refined),
// - Validation utilities
// - Calculation functions: item, category, total score
// - Report generation (breakdown)

export enum RatingLevel {
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  WEAK = 'WEAK',
}

export interface Criterion {
  label: string;
  description: string;
  scorePercent: number; // fraction of maxPoints (0..1)
}

export interface KPIItem {
  id: string;
  code: string;
  name: string;
  maxPoints: number;
  unit?: string;
  checklist: string[];
  criteria: Record<RatingLevel, Criterion>;
}

export interface KPICategory {
  id: string;
  name: string;
  items: KPIItem[];
}

// -----------------------
// KPI DATA (your provided structure, refined for consistency)
// -----------------------

export const KPI_DATA: KPICategory[] = [
  {
    id: 'cat_1',
    name: '1. VẬN HÀNH',
    items: [
      {
        id: '1.1',
        code: '1.1',
        name: 'Quản lý nhà máy',
        maxPoints: 10,
        unit: '10đ',
        checklist: [
          'Điều hành toàn bộ hoạt động của nhà máy ổn định, hiệu quả và đúng kế hoạch',
          'Giám sát dây chuyền vận hành liên tục, xử lý kịp thời khi có biến động',
          'Phân tích rủi ro, triển khai biện pháp phòng ngừa và tối ưu hiệu suất',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Hoàn thành 100% kế hoạch', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: '95–99% kế hoạch', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: '<95% kế hoạch', scorePercent: 0.5 },
        },
      },
      {
        id: '1.2',
        code: '1.2',
        name: 'Kiểm soát sự cố',
        maxPoints: 10,
        unit: '10đ',
        checklist: [
          'Theo dõi các ca vận hành, chủ động điều chỉnh khi có dấu hiệu bất thường',
          'Chỉ đạo xử lý sự cố đúng quy trình, đảm bảo an toàn và hạn chế tổn thất',
          'Phân tích nguyên nhân gốc rễ và triển khai biện pháp ngăn ngừa tái diễn',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Không có gián đoạn cấp hơi', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Có sự cố, nhưng không phải bồi thường', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Để xảy ra sự gián đoạn cấp hơi phải bồi thường', scorePercent: 0.0 },
        },
      },
      {
        id: '1.3',
        code: '1.3',
        name: 'Chất lượng dịch vụ',
        maxPoints: 8,
        unit: '8đ',
        checklist: [
          'Đảm bảo chất lượng hơi đầu ra ổn định theo tiêu chuẩn khách hàng',
          'Giám sát áp suất, nhiệt độ, chất lượng đạt chuẩn',
          'Không để phát sinh khiếu nại hoặc phản ánh tiêu cực từ khách hàng',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Ổn định, không có khiếu nại của khách hàng', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Có chênh lệch nhỏ so với tiêu chuẩn', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Bị khách hàng phản ánh về chất lượng', scorePercent: 0 },
        },
      },
      {
        id: '1.4',
        code: '1.4',
        name: 'Kiểm soát tiêu hao',
        maxPoints: 8,
        unit: '8đ',
        checklist: [
          'Giám sát tiêu hao nhiên liệu theo ca/kíp và phát hiện chênh lệch bất thường',
          'Theo dõi tiêu hao điện, nước, hóa chất và cảnh báo khi vượt định mức',
          'Triển khai giải pháp tối ưu hóa hiệu suất đốt để giảm lãng phí',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Tiêu hao nhiên liệu ≤ định mức', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Vượt định mức cho phép (+1–5%)', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Vượt quá định mức cho phép (>10%)', scorePercent: 0.0 },
        },
      },
    ],
  },

  {
    id: 'cat_2',
    name: '2. AN TOÀN',
    items: [
      {
        id: '2.1',
        code: '2.1',
        name: 'An toàn – PCCC – Môi trường',
        maxPoints: 10,
        unit: '10đ',
        checklist: [
          'Giám sát tuân thủ đầy đủ quy định ATLĐ và PCCC theo ca/kíp',
          'Kiểm soát khí thải, nước thải đảm bảo đạt chuẩn môi trường',
          'Chỉ đạo khắc phục ngay khi có vi phạm và tổ chức huấn luyện lại',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Không có sự cố Khí Thải, ATLĐ & PCCC', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Có vi phạm nhỏ, đã khắc phục ngay', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Vi phạm nghiêm trọng hoặc tái diễn nhiều lần', scorePercent: 0.0 },
        },
      },
      {
        id: '2.2',
        code: '2.2',
        name: 'Kỷ luật – BHLĐ – Giám sát nội quy',
        maxPoints: 8,
        unit: '8đ',
        checklist: [
          'Giám sát việc sử dụng đầy đủ PPE/BHLĐ trong toàn bộ thời gian làm việc',
          'Kiểm soát tuân thủ nội quy, thời gian làm việc và khu vực hạn chế',
          'Xử lý vi phạm đúng thẩm quyền và báo cáo kịp thời cho cấp trên',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Đảm bảo 100% nhân sự tuân thủ nội quy', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Nhắc nhở một số trường hợp vi phạm nhỏ', scorePercent: 0.6 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Có nhân sự vi phạm kỷ luật nghiêm trọng', scorePercent: 0.0 },
        },
      },
    ],
  },

  {
    id: 'cat_3',
    name: '3. THIẾT BỊ',
    items: [
      {
        id: '3.1',
        code: '3.1',
        name: 'Giám sát kiểm tra máy móc, hạ tầng',
        maxPoints: 8,
        unit: '8đ',
        checklist: [
          'Thực hiện kiểm tra – đánh giá hạ tầng nhà máy theo tần suất định kỳ',
          'Kiểm tra tình trạng thiết bị lò hàng ngày và ghi nhận đầy đủ',
          'Phát hiện sớm hư hỏng và đề xuất sửa chữa kịp thời',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Thực hiện kiểm tra đầy đủ 100% theo lịch tháng', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Thực hiện kiểm tra đạt 70–80% kế hoạch', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Thực hiện kiểm tra dưới 70% kế hoạch', scorePercent: 0.3 },
        },
      },
      {
        id: '3.2',
        code: '3.2',
        name: 'Tuân thủ PM/CM – quản lý bảo trì',
        maxPoints: 6,
        unit: '6đ',
        checklist: [
          'Tổ chức và tuân thủ bảo trì định kỳ theo kế hoạch (ngưng 24 giờ theo HĐ)',
          'Nghiệm thu chất lượng bảo trì theo tiêu chuẩn kỹ thuật',
          'Đề xuất thay thế hoặc nâng cấp thiết bị khi có dấu hiệu suy giảm',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Hoàn thành ≥98% hạng mục bảo trì', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Hoàn thành 70–80% hạng mục bảo trì', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Không ngừng máy bảo trì đúng HĐ', scorePercent: 0 },
        },
      },
      {
        id: '3.3',
        code: '3.3',
        name: 'Kiểm soát 5S',
        maxPoints: 6,
        unit: '6đ',
        checklist: [
          'Phát hiện và ghi nhận sai phạm 5S của các ca/kíp',
          'Xử lý báo cáo đúng mức độ và đúng thời gian yêu cầu',
          'Huấn luyện lại và đề xuất cải tiến khi lỗi tái diễn',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Kiểm soát tốt 5S, không lỗi tái diễn', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Còn lỗi vi phạm nhẹ, ít tái diễn', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: '5S không đạt, lỗi tái diễn thường xuyên', scorePercent: 0.0 },
        },
      },
      {
        id: '3.4',
        code: '3.4',
        name: 'Báo cáo bảo trì, thiết bị định kỳ và đột xuất',
        maxPoints: 10,
        unit: '10đ',
        checklist: [
          'Gửi đầy đủ báo cáo tổng hợp tuần/tháng đúng thời hạn',
          'Báo cáo chi tiết tình trạng thiết bị – bảo trì định kỳ và đột xuất',
          'Phân tích xu hướng hư hỏng và cảnh báo nguy cơ trước khi xảy ra',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Báo cáo đầy đủ, chính xác và đúng thời hạn', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Báo cáo trễ nhẹ hoặc phải nhắc nhở', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Không gửi báo cáo hoặc báo cáo không đúng', scorePercent: 0.0 },
        },
      },
    ],
  },

  {
    id: 'cat_4',
    name: '4.  NHÂN SỰ',
    items: [
      {
        id: '4.1',
        code: '4.1',
        name: 'Quản lý nhân sự',
        maxPoints: 10,
        unit: '10đ',
        checklist: [
          'Sắp xếp – điều phối nhân sự đảm bảo đủ quân số cho mọi ca',
          'Xử lý nghỉ đột xuất hoặc thiếu người mà không ảnh hưởng vận hành',
          'Đánh giá năng lực – thái độ và đề xuất luân chuyển phù hợp',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Đảm bảo đủ nhân sự, không trống ca', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Thiếu hụt nhân sự nhưng đã xử lý ổn thỏa', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Thiếu nhân sự gây ảnh hưởng vận hành', scorePercent: 0.4 },
        },
      },
      {
        id: '4.2',
        code: '4.2',
        name: 'Đào tạo',
        maxPoints: 6,
        unit: '6đ',
        checklist: [
          'Đào tạo nhân viên mới và nhân viên chuyển vị trí (có hồ sơ đào tạo)',
          'Truyền đạt đầy đủ quy trình và các thay đổi mới',
          'Đánh giá năng lực định kỳ và huấn luyện sau sự cố',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: '100% nhân viên mới được đào tạo đạt yêu cầu', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Đào tạo đạt yêu cầu ở mức khá (70-94%)', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Công tác đào tạo chưa đạt yêu cầu (<70%)', scorePercent: 0.0 },
        },
      },
    ],
  },
];

// -----------------------
// Validation utilities
// -----------------------

export function validateKPIData(data: KPICategory[]): string[] {
  const errors: string[] = [];
  if (!Array.isArray(data) || data.length === 0) {
    errors.push('KPI data must be a non-empty array');
    return errors;
  }

  for (const cat of data) {
    if (!cat.id || !cat.name) errors.push(`Category missing id/name: ${JSON.stringify(cat)}`);
    if (!Array.isArray(cat.items) || cat.items.length === 0) errors.push(`Category ${cat.id} has no items`);
    for (const item of cat.items) {
      if (!item.id || !item.code || !item.name) errors.push(`Item missing core fields: ${JSON.stringify(item)}`);
      if (typeof item.maxPoints !== 'number' || item.maxPoints <= 0) errors.push(`Item ${item.id} invalid maxPoints`);
      // criteria completeness
      const keys = Object.keys(item.criteria || {});
      const missing = [RatingLevel.GOOD, RatingLevel.AVERAGE, RatingLevel.WEAK].filter(k => !keys.includes(k));
      if (missing.length) errors.push(`Item ${item.id} missing criteria keys: ${missing.join(',')}`);
    }
  }
  return errors;
}

// -----------------------
// Scoring engine
// -----------------------

/**
 * Calculate score (points) for one item given a rating level.
 * Returns a number between 0 and item.maxPoints
 */
export function calculateItemScore(item: KPIItem, rating: RatingLevel): number {
  const criterion = item.criteria[rating];
  if (!criterion) throw new Error(`Criterion ${rating} not found for item ${item.id}`);
  // numerical score = maxPoints * scorePercent
  const raw = item.maxPoints * criterion.scorePercent;
  // round to 2 decimals for clarity
  return Math.round(raw * 100) / 100;
}

/**
 * Calculate category score (sum of item scores)
 */
export function calculateCategoryScore(category: KPICategory, ratings: Record<string, RatingLevel>): { points: number; maxPoints: number } {
  let points = 0;
  let maxPoints = 0;
  for (const item of category.items) {
    const rating = ratings[item.code] || RatingLevel.WEAK; // default if missing
    points += calculateItemScore(item, rating);
    maxPoints += item.maxPoints;
  }
  // round
  points = Math.round(points * 100) / 100;
  return { points, maxPoints };
}

/**
 * Calculate total score across all categories
 * ratings: map of item.code -> RatingLevel
 */
export function calculateTotalScore(data: KPICategory[], ratings: Record<string, RatingLevel>) {
  let totalPoints = 0;
  let totalMax = 0;
  const breakdown: { categoryId: string; categoryName: string; points: number; maxPoints: number }[] = [];

  for (const cat of data) {
    const catResult = calculateCategoryScore(cat, ratings);
    breakdown.push({ categoryId: cat.id, categoryName: cat.name, points: catResult.points, maxPoints: catResult.maxPoints });
    totalPoints += catResult.points;
    totalMax += catResult.maxPoints;
  }

  const percent = totalMax > 0 ? Math.round((totalPoints / totalMax) * 10000) / 100 : 0; // percent with 2 decimals

  return { totalPoints: Math.round(totalPoints * 100) / 100, totalMax, percent, breakdown };
}

// -----------------------
// Report helper
// -----------------------

export function generateTextReport(result: ReturnType<typeof calculateTotalScore>) {
  const lines: string[] = [];
  lines.push(`Tổng điểm: ${result.totalPoints}/${result.totalMax} (${result.percent}%)`);
  lines.push('Phân tích theo mục:');
  for (const b of result.breakdown) {
    lines.push(`- ${b.categoryName}: ${b.points}/${b.maxPoints}`);
  }
  return lines.join('\n');
}

// -----------------------
// Export default for convenience
// -----------------------
export default {
  KPI_DATA,
  validateKPIData,
  calculateItemScore,
  calculateCategoryScore,
  calculateTotalScore,
  generateTextReport,
};
