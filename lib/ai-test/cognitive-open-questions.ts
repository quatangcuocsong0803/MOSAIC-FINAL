export type CognitiveFunction =
  | "Ni"
  | "Ne"
  | "Ti"
  | "Te"
  | "Fi"
  | "Fe"
  | "Si"
  | "Se";

export type CognitiveOpenQuestion = {
  id: string;
  prompt: string;
};

export const cognitiveOpenQuestions: CognitiveOpenQuestion[] = [
  {
    id: "cf-open-01",
    prompt:
      "Khi gặp một vấn đề phức tạp mà chưa có đủ thông tin, bạn thường bắt đầu xử lý nó như thế nào? Hãy mô tả cách suy nghĩ của bạn.",
  },
  {
    id: "cf-open-02",
    prompt:
      "Khi có nhiều cách giải thích khác nhau cho cùng một vấn đề, bạn thường làm gì để quyết định cách hiểu nào đáng tin hoặc hữu ích nhất?",
  },
  {
    id: "cf-open-03",
    prompt:
      "Khi phải đưa ra một quyết định khó, điều gì thường khiến bạn cảm thấy quyết định đó hợp lý? Hãy mô tả quá trình bạn cân nhắc.",
  },
  {
    id: "cf-open-04",
    prompt:
      "Nếu một quy tắc hoặc cách làm đang được mọi người sử dụng nhưng bạn cảm thấy nó không hợp lý, bạn thường phản ứng và đánh giá nó như thế nào?",
  },
  {
    id: "cf-open-05",
    prompt:
      "Khi phải lựa chọn giữa điều bạn cho là đúng với bản thân và điều có thể giữ sự hài hòa với những người xung quanh, bạn thường cân nhắc những yếu tố nào?",
  },
  {
    id: "cf-open-06",
    prompt:
      "Khi bước vào một tình huống mới, bạn thường dựa vào những thông tin nào và chú ý điều gì đầu tiên? Hãy mô tả cách bạn phản ứng.",
  },
];