import { KPICategory, RatingLevel } from './types';

export const KPI_DATA: KPICategory[] = [
  {
    id: 'cat_1',
    name: '1. VẬN HÀNH',
    items: [
      {
        id: '1.1',
        code: '1.1',
        name: 'Quản lý vận hành toàn bộ hệ thống',
        maxPoints: 10,
        unit: '10đ',
        checklist: [
          'Quản lý tổng thể hoạt động vận hành của toàn kíp và các ca dưới quyền',
          'Đảm bảo hệ thống máy móc vận hành liên tục, ổn định theo yêu cầu sản xuất',
          'Phân tích rủi ro, ngăn ngừa sự cố và tối ưu hiệu suất toàn dây chuyền'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Hoàn thành ≥100% kế hoạch', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: '95–99% kế hoạch', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: '<95%', scorePercent: 0.5 },
        },
      },
      {
        id: '1.2',
        code: '1.2',
        name: 'Gián đoạn cấp hơi – xử lý sự cố cấp cao',
        maxPoints: 10,
        unit: '10đ',
        checklist: [
          'Theo dõi toàn bộ thông số hơi và điều phối xử lý khi có biến động',
          'Chỉ đạo trưởng ca/nhân viên xử lý kịp thời khi có dấu hiệu bất thường',
          'Đánh giá nguyên nhân gốc rễ và đưa ra giải pháp ngăn tái diễn'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Không gián đoạn / xử lý tốt', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Có sự cố nhưng xử lý đúng quy trình', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Sự cố do lỗi quản lý', scorePercent: 0.0 },
        },
      },
      {
        id: '1.3',
        code: '1.3',
        name: 'Chất lượng hơi – áp suất – độ ổn định',
        maxPoints: 8,
        unit: '8đ',
        checklist: [
          'Đảm bảo chất lượng hơi đạt chuẩn, không gây ảnh hưởng sản xuất',
          'Giám sát biến động áp suất và điều phối cân bằng phụ tải',
          'Không để xảy ra phản ánh từ khách hàng nội bộ về chất lượng hơi'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Ổn định, không khiếu nại', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Có biến động nhỏ', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Có khiếu nại', scorePercent: 0.5 },
        },
      },
      {
        id: '1.4',
        code: '1.4',
        name: 'Kiểm soát tiêu hao (Nhiên liệu – Điện – Nước)',
        maxPoints: 8,
        unit: '8đ',
        checklist: [
          'Giám sát chặt chẽ tiêu hao nhiên liệu theo từng ca/kíp',
          'Theo dõi định mức điện, nước, hóa chất và cảnh báo khi vượt ngưỡng',
          'Phối hợp các ca thực hiện tối ưu hiệu suất đốt và giảm lãng phí'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: '≤ định mức chuẩn', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Vượt +5–10%', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Vượt >10%', scorePercent: 0.0 },
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
        name: 'An toàn – PCCC – Môi trường (Quản lý cấp cao)',
        maxPoints: 10,
        unit: '10đ',
        checklist: [
          'Giám sát toàn bộ việc tuân thủ ATLD và PCCC của các ca',
          'Đảm bảo kiểm soát khí thải, nước thải theo tiêu chuẩn môi trường',
          'Chỉ đạo khắc phục các vi phạm và huấn luyện lại khi cần thiết'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Không vi phạm', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Vi phạm nhỏ được khắc phục', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Vi phạm lớn / lặp lại', scorePercent: 0.0 },
        },
      },
      {
        id: '2.2',
        code: '2.2',
        name: 'Kỷ luật – PPE – Giám sát nội quy',
        maxPoints: 8,
        unit: '8đ',
        checklist: [
          'Giám sát việc tuân thủ PPE của toàn kíp và các ca trực thuộc',
          'Kiểm soát vi phạm nội quy, thời gian ra vào, giờ làm việc',
          'Xử lý kỷ luật đúng quy định và báo cáo kịp thời cho cấp trên'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Tuân thủ đầy đủ', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Có vi phạm nhỏ', scorePercent: 0.6 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Vi phạm nghiêm trọng', scorePercent: 0.0 },
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
        name: 'Giám sát kiểm tra máy móc – hạ tầng',
        maxPoints: 8,
        unit: '8đ',
        checklist: [
          'Theo dõi kết quả kiểm tra thiết bị của các ca và đánh giá mức an toàn',
          'Kiểm tra định kỳ toàn bộ hạ tầng lò hơi – trạm bơm – nhiên liệu',
          'Phát hiện sớm dấu hiệu xuống cấp và đề xuất sửa chữa kịp thời'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: '≥100% kiểm tra đầy đủ', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: '80–99% đầy đủ', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: '<80%', scorePercent: 0.5 },
        },
      },
      {
        id: '3.2',
        code: '3.2',
        name: 'Tuân thủ PM/CM – quản lý bảo trì',
        maxPoints: 6,
        unit: '6đ',
        checklist: [
          'Giám sát việc thực hiện PM/CM của các ca theo đúng kế hoạch',
          'Chịu trách nhiệm nghiệm thu chất lượng bảo trì toàn kíp',
          'Đề xuất thay thế, nâng cấp thiết bị khi cần thiết'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: '≥98% hoàn thành', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: '90–97%', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: '<90%', scorePercent: 0.5 },
        },
      },
      {
        id: '3.3',
        code: '3.3',
        name: 'Kiểm soát sai phạm – chấn chỉnh – phòng ngừa',
        maxPoints: 6,
        unit: '6đ',
        checklist: [
          'Phát hiện nhanh sai phạm SOP/5S của các ca',
          'Xử lý và báo cáo sai phạm kịp thời, đúng mức độ',
          'Huấn luyện, đào tạo lại khi sai phạm lặp lại',
          'Đề xuất cải tiến SOP nhằm giảm lỗi tái diễn'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Kiểm soát tốt – không tái diễn', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Lỗi tái diễn nhẹ', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Lỗi nặng / tái diễn nhiều lần', scorePercent: 0.0 },
        },
      },
    ],
  },

  {
    id: 'cat_4',
    name: '4. NHÂN SỰ',
    items: [
      {
        id: '4.1',
        code: '4.1',
        name: 'Quản lý nhân sự – phân ca – kỷ luật',
        maxPoints: 10,
        unit: '10đ',
        checklist: [
          'Sắp xếp, điều phối nhân sự nhiều ca đảm bảo đủ quân số',
          'Xử lý sự cố nhân sự (nghỉ đột xuất, thiếu ca) mà không ảnh hưởng vận hành',
          'Đánh giá thái độ, năng lực nhân viên và báo cáo kịp thời'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Không thiếu ca', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Thiếu nhưng xử lý được', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Thiếu gây gián đoạn', scorePercent: 0.4 },
        },
      },
      {
        id: '4.2',
        code: '4.2',
        name: 'Đào tạo – truyền đạt – đánh giá nhân sự',
        maxPoints: 6,
        unit: '6đ',
        checklist: [
          'Đào tạo nhân viên mới và nhân viên luân chuyển vị trí',
          'Truyền đạt kịp thời các quy định, quy trình, SOP mới',
          'Đánh giá tay nghề và kiểm tra năng lực định kỳ',
          'Huấn luyện sau mỗi sự cố để ngăn tái diễn'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: '≥95% đạt yêu cầu', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: '70–94%', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: '<70%', scorePercent: 0.0 },
        },
      },
    ],
  },

  {
    id: 'cat_5',
    name: '5. BÁO CÁO',
    items: [
      {
        id: '5.1',
        code: '5.1',
        name: 'Báo cáo tổng hợp – phân tích – đúng hạn',
        maxPoints: 6,
        unit: '6đ',
        checklist: [
          'Gửi báo cáo tổng hợp kíp cho cấp trên đúng hạn',
          'Cập nhật số liệu tiêu hao, sự cố, vận hành chính xác',
          'Phân tích xu hướng vận hành và cảnh báo rủi ro'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Đủ, đúng hạn, số liệu chuẩn', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Trễ nhẹ / sai số nhỏ', scorePercent: 0.8 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Thiếu báo cáo / sai nhiều', scorePercent: 0.0 },
        },
      },
      {
        id: '5.2',
        code: '5.2',
        name: 'Phối hợp: Ca – Bộ phận – Khách hàng nội bộ',
        maxPoints: 4,
        unit: '4đ',
        checklist: [
          'Điều phối nhịp nhàng giữa các ca để tránh đứt quãng vận hành',
          'Phối hợp tốt với Kho, Xe, Sản xuất, Kỹ thuật khi phát sinh sự cố',
          'Giao tiếp lịch sự, giải quyết xung đột trên tinh thần hợp tác'
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Hỗ trợ tốt, không xung đột', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Có xung đột nhưng giải quyết được', scorePercent: 0.6 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Phối hợp kém / gây hậu quả', scorePercent: 0.0 },
        },
      },
    ],
  },
];