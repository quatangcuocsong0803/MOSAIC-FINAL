// Codes are persisted API identifiers. Labels may change without changing codes.
export const INTEREST_GROUPS = [
  {
    name: "Sách & học hỏi",
    items: [
      ["reading", "Đọc sách"],
      ["fiction", "Tiểu thuyết"],
      ["poetry", "Thơ"],
      ["philosophy", "Triết học"],
      ["psychology", "Tâm lý học"],
      ["history", "Lịch sử"],
      ["languages", "Ngoại ngữ"],
      ["science", "Khoa học"],
      ["astronomy", "Thiên văn"],
      ["economics", "Kinh tế"],
      ["politics", "Chính trị"],
      ["self-development", "Phát triển bản thân"],
    ],
  },
  {
    name: "Nghệ thuật & sáng tạo",
    items: [
      ["drawing", "Vẽ"],
      ["painting", "Hội họa"],
      ["photography", "Nhiếp ảnh"],
      ["design", "Thiết kế"],
      ["writing", "Viết lách"],
      ["journaling", "Viết nhật ký"],
      ["crafts", "Thủ công"],
      ["pottery", "Gốm"],
      ["knitting", "Đan len"],
      ["calligraphy", "Thư pháp"],
      ["architecture", "Kiến trúc"],
      ["fashion", "Thời trang"],
    ],
  },
  {
    name: "Âm nhạc & sân khấu",
    items: [
      ["music", "Âm nhạc"],
      ["classical-music", "Nhạc cổ điển"],
      ["jazz", "Jazz"],
      ["rock", "Rock"],
      ["pop", "Pop"],
      ["singing", "Ca hát"],
      ["piano", "Piano"],
      ["guitar", "Guitar"],
      ["dance", "Nhảy múa"],
      ["theatre", "Sân khấu"],
      ["concerts", "Hòa nhạc"],
      ["composing", "Sáng tác nhạc"],
    ],
  },
  {
    name: "Phim & giải trí",
    items: [
      ["cinema", "Điện ảnh"],
      ["documentaries", "Phim tài liệu"],
      ["anime", "Anime"],
      ["manga", "Manga"],
      ["podcasts", "Podcast"],
      ["comics", "Truyện tranh"],
      ["board-games", "Board game"],
      ["chess", "Cờ vua"],
      ["video-games", "Trò chơi điện tử"],
      ["puzzles", "Giải đố"],
      ["role-playing", "Nhập vai"],
      ["collecting", "Sưu tầm"],
    ],
  },
  {
    name: "Thể thao & vận động",
    items: [
      ["running", "Chạy bộ"],
      ["walking", "Đi bộ"],
      ["swimming", "Bơi"],
      ["cycling", "Đạp xe"],
      ["yoga", "Yoga"],
      ["fitness", "Tập gym"],
      ["football", "Bóng đá"],
      ["basketball", "Bóng rổ"],
      ["badminton", "Cầu lông"],
      ["tennis", "Tennis"],
      ["martial-arts", "Võ thuật"],
      ["climbing", "Leo núi thể thao"],
    ],
  },
  {
    name: "Thiên nhiên & khám phá",
    items: [
      ["travel", "Du lịch"],
      ["hiking", "Đi bộ đường dài"],
      ["camping", "Cắm trại"],
      ["gardening", "Làm vườn"],
      ["plants", "Cây cảnh"],
      ["animals", "Động vật"],
      ["birdwatching", "Ngắm chim"],
      ["ecology", "Sinh thái"],
      ["beaches", "Biển"],
      ["mountains", "Núi"],
      ["stargazing", "Ngắm sao"],
      ["backpacking", "Du lịch bụi"],
    ],
  },
  {
    name: "Ẩm thực & đời sống",
    items: [
      ["cooking", "Nấu ăn"],
      ["baking", "Làm bánh"],
      ["coffee", "Cà phê"],
      ["tea", "Trà"],
      ["food-discovery", "Khám phá ẩm thực"],
      ["nutrition", "Dinh dưỡng"],
      ["meditation", "Thiền"],
      ["minimalism", "Lối sống tối giản"],
      ["home-decor", "Trang trí nhà"],
      ["wellness", "Chăm sóc sức khỏe"],
      ["pets", "Chăm sóc thú cưng"],
      ["sustainability", "Sống bền vững"],
    ],
  },
  {
    name: "Công nghệ & cộng đồng",
    items: [
      ["programming", "Lập trình"],
      ["ai", "Trí tuệ nhân tạo"],
      ["robotics", "Robot"],
      ["technology", "Công nghệ"],
      ["entrepreneurship", "Khởi nghiệp"],
      ["volunteering", "Tình nguyện"],
      ["mentoring", "Hướng dẫn người khác"],
      ["education", "Giáo dục"],
      ["debate", "Tranh biện"],
      ["typology", "Typology"],
      ["astrology", "Chiêm tinh"],
      ["community", "Hoạt động cộng đồng"],
    ],
  },
] as const;
export const INTERESTS = INTEREST_GROUPS.flatMap((group) =>
  group.items.map(([code, label]) => ({ code, label, group: group.name })),
);
export const INTEREST_CODES = new Set<string>(
  INTERESTS.map((item) => item.code),
);
export function interestLabels(codes: string[]) {
  return codes
    .map((code) => INTERESTS.find((item) => item.code === code)?.label)
    .filter(Boolean)
    .join(", ");
}
export function interestSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d");
}
