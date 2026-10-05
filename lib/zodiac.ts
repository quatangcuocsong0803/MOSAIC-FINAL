export const ZODIAC_SIGNS = [
  "Bạch Dương",
  "Kim Ngưu",
  "Song Tử",
  "Cự Giải",
  "Sư Tử",
  "Xử Nữ",
  "Thiên Bình",
  "Bọ Cạp",
  "Nhân Mã",
  "Ma Kết",
  "Bảo Bình",
  "Song Ngư",
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

export const ZODIAC_ICONS: Record<string, string> = {
  "Bạch Dương": "♈\uFE0E",
  "Kim Ngưu": "♉\uFE0E",
  "Song Tử": "♊\uFE0E",
  "Cự Giải": "♋\uFE0E",
  "Sư Tử": "♌\uFE0E",
  "Xử Nữ": "♍\uFE0E",
  "Thiên Bình": "♎\uFE0E",
  "Bọ Cạp": "♏\uFE0E",
  "Nhân Mã": "♐\uFE0E",
  "Ma Kết": "♑\uFE0E",
  "Bảo Bình": "♒\uFE0E",
  "Song Ngư": "♓\uFE0E",
};
