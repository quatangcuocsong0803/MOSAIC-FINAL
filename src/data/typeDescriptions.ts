import type { MbtiTypeCode } from "./mbtiTypeStacks";

export interface TypeDescription {
  type: MbtiTypeCode;
  overview: string;
  keywords: string[];
}

const typeDescriptions: Record<MbtiTypeCode, TypeDescription> = {
  INTJ: {
    type: "INTJ",
    overview:
      "Bạn thường có xu hướng tập trung vào các quy luật tiềm ẩn và định hướng dài hạn, đồng thời tổ chức các ý tưởng một cách chặt chẽ hướng tới những kết quả rõ ràng, thực tiễn.",
    keywords: [
      "Tầm nhìn dài hạn",
      "Hệ thống",
      "Chiến lược",
      "Độc lập",
      "Cấu trúc",
    ],
  },

  INTP: {
    type: "INTP",
    overview:
      "Bạn thường có xu hướng xây dựng hệ thống giải thích logic nhất quán từ nội tâm, say mê khám phá các khả năng mới và tìm hiểu cơ chế vận hành của ý tưởng ở tầng sâu nhất.",
    keywords: [
      "Phân tích",
      "Khuôn khổ logic",
      "Tiềm năng mở",
      "Tính tò mò",
      "Độ chính xác",
    ],
  },

  ENTJ: {
    type: "ENTJ",
    overview:
      "Bạn thường có xu hướng tổ chức nguồn lực và đưa ra các quyết định quyết đoán hướng tới kết quả thực tiễn, đồng thời nắm bắt các quy luật dài hạn để định hướng chiến lược.",
    keywords: [
      "Tổ chức",
      "Kết quả",
      "Chiến lược",
      "Kế hoạch",
      "Quyết đoán",
    ],
  },

  ENTP: {
    type: "ENTP",
    overview:
      "Bạn thường có xu hướng khám phá nhiều khả năng mới lạ, thử nghiệm ý tưởng qua lăng kính phân tích logic và không ngừng tìm kiếm các góc nhìn thay thế cho mọi vấn đề.",
    keywords: [
      "Khám phá",
      "Ý tưởng",
      "Phân tích",
      "Giải pháp thay thế",
      "Thử nghiệm",
    ],
  },

  INFJ: {
    type: "INFJ",
    overview:
      "Bạn thường có xu hướng kiếm tìm ý nghĩa sâu sắc và các quy luật dài hạn, đồng thời luôn thấu cảm và nhạy bén trước bối cảnh liên cá nhân cùng sự hòa hợp chung.",
    keywords: [
      "Ý nghĩa sâu sắc",
      "Quy luật",
      "Tuệ giác",
      "Thấu cảm con người",
      "Định hướng dài hạn",
    ],
  },

  INFP: {
    type: "INFP",
    overview:
      "Bạn thường có xu hướng cảm nhận và đánh giá trải nghiệm cuộc sống qua lăng kính giá trị cá nhân và tính chân thực, kết hợp với việc chiêm nghiệm các khả năng và ý nghĩa đa chiều.",
    keywords: [
      "Giá trị",
      "Tính chân thực",
      "Tiềm năng",
      "Chiêm nghiệm",
      "Ý nghĩa cá nhân",
    ],
  },

  ENFJ: {
    type: "ENFJ",
    overview:
      "Bạn thường có xu hướng quan tâm sâu sắc đến các giá trị chung và nhu cầu cảm xúc của mọi người xung quanh, vận dụng các quy luật rộng lớn để định hướng và truyền cảm hứng.",
    keywords: [
      "Giá trị chung",
      "Con người",
      "Ý nghĩa",
      "Gắn kết",
      "Định hướng",
    ],
  },

  ENFP: {
    type: "ENFP",
    overview:
      "Bạn thường có xu hướng mở rộng khám phá các khả năng và mối liên kết phong phú, đồng thời trân trọng các giá trị nội tâm sâu sắc và ý nghĩa nhân văn của từng ý tưởng.",
    keywords: [
      "Tiềm năng mở",
      "Mối liên kết",
      "Giá trị",
      "Sáng tạo",
      "Khám phá",
    ],
  },

  ISTJ: {
    type: "ISTJ",
    overview:
      "Bạn thường có xu hướng dựa vào kinh nghiệm thực chứng và dữ liệu chuẩn mực đã được xác lập, tổ chức các hành động một cách chuẩn xác, nhất quán và đáng tin cậy.",
    keywords: [
      "Kinh nghiệm",
      "Độ tin cậy",
      "Tổ chức",
      "Tính nhất quán",
      "Tính thực tiễn",
    ],
  },

  ISFJ: {
    type: "ISFJ",
    overview:
      "Bạn thường có xu hướng vận dụng kinh nghiệm quen thuộc và chu đáo chăm sóc nhu cầu thực tế của người khác, gìn giữ sự tin cậy và gắn kết lâu bền.",
    keywords: [
      "Kinh nghiệm",
      "Nâng đỡ",
      "Độ tin cậy",
      "Mối quan hệ",
      "Chăm sóc thực tế",
    ],
  },

  ESTJ: {
    type: "ESTJ",
    overview:
      "Bạn thường có xu hướng tổ chức con người, nguồn lực và tiến trình xung quanh các mục tiêu rõ ràng, dựa trên cơ sở kinh nghiệm và thông tin đã được kiểm chứng chuẩn mực.",
    keywords: [
      "Tổ chức",
      "Hiệu suất",
      "Mục tiêu thực tế",
      "Kinh nghiệm",
      "Điều phối",
    ],
  },

  ESFJ: {
    type: "ESFJ",
    overview:
      "Bạn thường có xu hướng chú trọng tới nhu cầu gắn kết và các mối quan hệ thực tế, tận tâm tổ chức hoạt động để mang lại sự an tâm và sẻ chia cho cộng đồng.",
    keywords: [
      "Mối quan hệ",
      "Điều phối",
      "Kinh nghiệm",
      "Kỳ vọng chung",
      "Sự sẻ chia",
    ],
  },

  ISTP: {
    type: "ISTP",
    overview:
      "Bạn thường có xu hướng phân tích logic cơ chế vận hành của sự vật, phản xạ nhanh nhạy trước tình huống thực tế và linh hoạt ứng biến khi hoàn cảnh biến chuyển.",
    keywords: [
      "Phân tích",
      "Phản xạ thực tế",
      "Giải quyết vấn đề",
      "Quan sát",
      "Khả năng thích ứng",
    ],
  },

  ISFP: {
    type: "ISFP",
    overview:
      "Bạn thường có xu hướng cảm nhận cuộc sống qua hệ giá trị cá nhân và tính chân thực sâu sắc, nhạy bén trước thực tại cụ thể và biểu đạt bản thân qua trải nghiệm hiện sinh.",
    keywords: [
      "Giá trị",
      "Tính chân thực",
      "Trải nghiệm hiện tại",
      "Quan sát",
      "Biểu đạt cá nhân",
    ],
  },

  ESTP: {
    type: "ESTP",
    overview:
      "Bạn thường có xu hướng tập trung vào hành động thực tế và thông tin trước mắt, sử dụng tư duy phân tích sắc bén để nắm bắt cách thức vận hành và hành động tức thời.",
    keywords: [
      "Hành động hiện tại",
      "Quan sát",
      "Giải quyết vấn đề",
      "Tính thực tiễn",
      "Ứng biến",
    ],
  },

  ESFP: {
    type: "ESFP",
    overview:
      "Bạn thường có xu hướng hòa mình trọn vẹn vào trải nghiệm hiện tại, trân trọng giá trị cảm xúc chân thực và tìm kiếm phương thức sinh động, thực tế để tương tác với thế giới xung quanh.",
    keywords: [
      "Trải nghiệm hiện tại",
      "Giá trị",
      "Sự dấn thân",
      "Quan sát",
      "Khả năng thích ứng",
    ],
  },
};

export default typeDescriptions;
