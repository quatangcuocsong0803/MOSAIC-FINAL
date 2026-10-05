// ============================================================
// Cognitive Function Test — 72 Questions
// ============================================================
// 9 questions per function × 8 functions = 72 total.
//
// IMPORTANT — for consumers of this data:
//   - Do NOT display the `function` field to the user.
//   - Questions may be randomized before display.
//   - Keep IDs stable; never renumber them.
//   - Scoring: reverse === true  →  score = 6 − answer
//              reverse === false →  score = answer
//     (assumes a 1–5 Likert scale; adjust constant if scale changes)
// ============================================================

import type { CognitiveFunctionCode } from "./cognitiveFunctions";

export interface CognitiveFunctionQuestion {
  /** Stable unique identifier — never renumber. */
  id: string;
  /** Question text shown to the user (Vietnamese). */
  text: string;
  /**
   * The cognitive function this question measures.
   * NOT displayed to the user.
   */
  function: CognitiveFunctionCode;
  /**
   * When true, scoring must apply: score = 6 − answer.
   * Used for reverse-keyed items (low agreement → high function score).
   */
  reverse: boolean;
}

const cognitiveFunctionQuestions: CognitiveFunctionQuestion[] = [
  // ──────────────────────────────────────────────────────────
  // Ni — Introverted Intuition (9 questions)
  // ──────────────────────────────────────────────────────────
  {
    id: "NI01",
    text: "Khi một vấn đề có rất nhiều thông tin rời rạc, tôi thường cố tìm ra một ý tưởng hoặc pattern chung nằm phía sau chúng.",
    function: "Ni",
    reverse: false,
  },
  {
    id: "NI02",
    text: "Tôi thường suy nghĩ về việc một sự việc hiện tại có thể dẫn đến điều gì trong tương lai.",
    function: "Ni",
    reverse: false,
  },
  {
    id: "NI03",
    text: "Đôi khi tôi có một cảm giác khá rõ về hướng mà một vấn đề đang đi đến, dù chưa thể giải thích ngay bằng từng bước cụ thể.",
    function: "Ni",
    reverse: false,
  },
  {
    id: "NI04",
    text: "Tôi thích đào sâu một ý tưởng cho đến khi hiểu được ý nghĩa hoặc nguyên lý cốt lõi của nó.",
    function: "Ni",
    reverse: false,
  },
  {
    id: "NI05",
    text: "Khi một vấn đề chưa có đủ dữ kiện, tôi thường không muốn hình thành một bức tranh tổng thể và thích chỉ nhìn từng thông tin riêng lẻ.",
    function: "Ni",
    reverse: true,
  },
  {
    id: "NI06",
    text: "Tôi hiếm khi liên hệ một sự kiện hiện tại với những xu hướng hoặc ý nghĩa xa hơn của nó.",
    function: "Ni",
    reverse: true,
  },
  {
    id: "NI07",
    text: "Khi nghe một người bạn kể nhiều chuyện nhỏ xảy ra gần đây, tôi thường muốn hiểu xem tất cả những chuyện đó đang chỉ về vấn đề hoặc xu hướng nào.",
    function: "Ni",
    reverse: false,
  },
  {
    id: "NI08",
    text: "Khi xem một bộ phim hoặc đọc một câu chuyện, tôi thường chú ý đến thông điệp hoặc ý nghĩa ẩn phía sau các sự kiện hơn là chỉ nhớ từng chi tiết.",
    function: "Ni",
    reverse: false,
  },
  {
    id: "NI09",
    text: "Khi nhiều sự việc liên tiếp xảy ra, tôi thường xem chúng là những chuyện riêng biệt và ít tìm một chủ đề chung kết nối chúng.",
    function: "Ni",
    reverse: true,
  },

  // ──────────────────────────────────────────────────────────
  // Ne — Extraverted Intuition (9 questions)
  // ──────────────────────────────────────────────────────────
  {
    id: "NE01",
    text: "Một ý tưởng thường khiến tôi nghĩ ngay đến nhiều ý tưởng khác có thể phát triển từ nó.",
    function: "Ne",
    reverse: false,
  },
  {
    id: "NE02",
    text: "Khi gặp một vấn đề, tôi thường thích nghĩ ra nhiều cách giải thích thay vì nhanh chóng chọn một cách duy nhất.",
    function: "Ne",
    reverse: false,
  },
  {
    id: "NE03",
    text: "Tôi dễ bị thu hút bởi những khả năng mới, kể cả khi chúng chưa có kế hoạch rõ ràng.",
    function: "Ne",
    reverse: false,
  },
  {
    id: "NE04",
    text: "Khi nghe một khái niệm mới, tôi thường liên hệ nó với những lĩnh vực hoặc ý tưởng tưởng như không liên quan.",
    function: "Ne",
    reverse: false,
  },
  {
    id: "NE05",
    text: "Tôi thường cảm thấy có quá nhiều khả năng mới khiến việc suy nghĩ thêm trở nên không cần thiết.",
    function: "Ne",
    reverse: true,
  },
  {
    id: "NE06",
    text: "Khi đã tìm được một cách giải thích hợp lý, tôi thường không thấy cần phải khám phá thêm những khả năng khác.",
    function: "Ne",
    reverse: true,
  },
  {
    id: "NE07",
    text: "Trong một cuộc trò chuyện, một ý tưởng nhỏ có thể khiến tôi liên tưởng ngay đến nhiều chủ đề hoặc khả năng khác.",
    function: "Ne",
    reverse: false,
  },
  {
    id: "NE08",
    text: "Khi lên kế hoạch cho một chuyến đi cuối tuần, tôi thường thích nghĩ ra nhiều địa điểm hoặc cách trải nghiệm khác nhau trước khi quyết định.",
    function: "Ne",
    reverse: false,
  },
  {
    id: "NE09",
    text: "Khi một kế hoạch ban đầu đã khá ổn, tôi thường không thấy cần phải nghĩ thêm những khả năng khác.",
    function: "Ne",
    reverse: true,
  },

  // ──────────────────────────────────────────────────────────
  // Si — Introverted Sensing (9 questions)
  // ──────────────────────────────────────────────────────────
  {
    id: "SI01",
    text: "Khi đánh giá một tình huống, tôi thường nhớ lại những trải nghiệm trước đây để xem nó có điểm gì tương đồng hoặc khác biệt.",
    function: "Si",
    reverse: false,
  },
  {
    id: "SI02",
    text: "Tôi thường ghi nhớ khá lâu những chi tiết cụ thể của những trải nghiệm quan trọng đối với mình.",
    function: "Si",
    reverse: false,
  },
  {
    id: "SI03",
    text: "Tôi thích xây dựng hiểu biết dựa trên những gì mình đã trực tiếp trải qua hoặc đã được kiểm chứng.",
    function: "Si",
    reverse: false,
  },
  {
    id: "SI04",
    text: "Những thay đổi quá lớn hoặc quá đột ngột thường khiến tôi muốn có thời gian để làm quen.",
    function: "Si",
    reverse: false,
  },
  {
    id: "SI05",
    text: "Những kinh nghiệm trong quá khứ thường không ảnh hưởng nhiều đến cách tôi đánh giá một tình huống mới.",
    function: "Si",
    reverse: true,
  },
  {
    id: "SI06",
    text: "Tôi thường ít quan tâm đến việc một cách làm mới có khác với những gì trước đây từng hiệu quả hay không.",
    function: "Si",
    reverse: true,
  },
  {
    id: "SI07",
    text: "Khi làm lại một món ăn hoặc một việc quen thuộc, tôi thường nhớ những điều chỉnh nhỏ từ những lần trước và áp dụng lại chúng.",
    function: "Si",
    reverse: false,
  },
  {
    id: "SI08",
    text: "Khi quay lại một nơi mình từng đến, tôi thường dễ nhận ra những thay đổi vì tôi vẫn nhớ khá rõ nơi đó trước đây.",
    function: "Si",
    reverse: false,
  },
  {
    id: "SI09",
    text: "Khi gặp một tình huống quen thuộc, tôi thường ít nghĩ đến việc trước đây mình đã xử lý nó như thế nào.",
    function: "Si",
    reverse: true,
  },

  // ──────────────────────────────────────────────────────────
  // Se — Extraverted Sensing (9 questions)
  // ──────────────────────────────────────────────────────────
  {
    id: "SE01",
    text: "Tôi thường nhanh chóng nhận ra những thay đổi cụ thể đang diễn ra xung quanh mình.",
    function: "Se",
    reverse: false,
  },
  {
    id: "SE02",
    text: "Khi xử lý vấn đề, tôi thích bắt đầu từ những gì đang thực sự xảy ra thay vì chỉ suy đoán.",
    function: "Se",
    reverse: false,
  },
  {
    id: "SE03",
    text: "Tôi thường dễ bị thu hút bởi những trải nghiệm mới, trực tiếp và có tính thực tế.",
    function: "Se",
    reverse: false,
  },
  {
    id: "SE04",
    text: "Trong một tình huống bất ngờ, tôi có xu hướng phản ứng dựa trên những gì đang diễn ra ngay lúc đó.",
    function: "Se",
    reverse: false,
  },
  {
    id: "SE05",
    text: "Tôi thường quá tập trung vào những khả năng hoặc ý nghĩa phía sau mà bỏ qua những gì đang thực sự xảy ra trước mắt.",
    function: "Se",
    reverse: true,
  },
  {
    id: "SE06",
    text: "Khi có cơ hội trải nghiệm một điều mới trực tiếp, tôi thường thích đứng ngoài quan sát hơn là tham gia.",
    function: "Se",
    reverse: true,
  },
  {
    id: "SE07",
    text: "Khi đang ở một nơi đông người hoặc một sự kiện, tôi thường nhanh chóng nhận ra những thay đổi đang diễn ra ngay trước mắt mình.",
    function: "Se",
    reverse: false,
  },
  {
    id: "SE08",
    text: "Khi một kế hoạch bất ngờ thay đổi, tôi thường phản ứng dựa trên những người, vật hoặc thông tin đang có ngay lúc đó.",
    function: "Se",
    reverse: false,
  },
  {
    id: "SE09",
    text: "Khi thử một hoạt động mới, tôi thường dành nhiều thời gian tưởng tượng hoặc chuẩn bị trong đầu hơn là trực tiếp trải nghiệm nó.",
    function: "Se",
    reverse: true,
  },

  // ──────────────────────────────────────────────────────────
  // Ti — Introverted Thinking (9 questions)
  // ──────────────────────────────────────────────────────────
  {
    id: "TI01",
    text: "Khi học một vấn đề, tôi muốn hiểu vì sao nó hoạt động như vậy chứ không chỉ biết kết quả.",
    function: "Ti",
    reverse: false,
  },
  {
    id: "TI02",
    text: "Tôi thường tự kiểm tra xem các khái niệm trong một lập luận có thực sự nhất quán với nhau hay không.",
    function: "Ti",
    reverse: false,
  },
  {
    id: "TI03",
    text: "Nếu một cách giải thích phổ biến có vẻ chưa hợp lý, tôi sẵn sàng phân tích lại từ đầu.",
    function: "Ti",
    reverse: false,
  },
  {
    id: "TI04",
    text: "Tôi thích xây dựng một hệ thống hiểu biết của riêng mình thay vì chỉ ghi nhớ kết luận của người khác.",
    function: "Ti",
    reverse: false,
  },
  {
    id: "TI05",
    text: "Nếu một phương pháp đã được nhiều người sử dụng thành công, tôi thường không thấy cần phải phân tích logic phía sau nó.",
    function: "Ti",
    reverse: true,
  },
  {
    id: "TI06",
    text: "Tôi thường ưu tiên một kết luận rõ ràng hơn là dành thời gian kiểm tra xem toàn bộ lập luận có thực sự nhất quán hay không.",
    function: "Ti",
    reverse: true,
  },
  {
    id: "TI07",
    text: "Khi tranh luận với một người bạn, tôi thường cố lần lại từng bước trong lập luận để xem chính xác chỗ nào chưa hợp lý.",
    function: "Ti",
    reverse: false,
  },
  {
    id: "TI08",
    text: "Khi học luật của một trò chơi mới, tôi thường muốn hiểu cả những trường hợp ngoại lệ và vì sao luật lại được đặt ra như vậy.",
    function: "Ti",
    reverse: false,
  },
  {
    id: "TI09",
    text: "Nếu một lời khuyên nghe có vẻ rất hợp lý và được nhiều người tin tưởng, tôi thường ít quan tâm đến việc kiểm tra logic phía sau nó.",
    function: "Ti",
    reverse: true,
  },

  // ──────────────────────────────────────────────────────────
  // Te — Extraverted Thinking (9 questions)
  // ──────────────────────────────────────────────────────────
  {
    id: "TE01",
    text: "Khi cần hoàn thành một mục tiêu, tôi thường nghĩ đến cách tổ chức công việc sao cho hiệu quả và rõ ràng nhất.",
    function: "Te",
    reverse: false,
  },
  {
    id: "TE02",
    text: "Tôi có xu hướng đánh giá một kế hoạch dựa trên việc nó có thực sự tạo ra kết quả hay không.",
    function: "Te",
    reverse: false,
  },
  {
    id: "TE03",
    text: "Khi làm việc nhóm, tôi thường muốn xác định vai trò, quy trình và deadline tương đối rõ ràng.",
    function: "Te",
    reverse: false,
  },
  {
    id: "TE04",
    text: "Tôi thích biến một ý tưởng thành một kế hoạch cụ thể có thể triển khai được.",
    function: "Te",
    reverse: false,
  },
  {
    id: "TE05",
    text: "Tôi thường không quan tâm nhiều đến việc một kế hoạch có hiệu quả trong thực tế hay không nếu bản thân nó có vẻ hợp lý về mặt ý tưởng.",
    function: "Te",
    reverse: true,
  },
  {
    id: "TE06",
    text: "Khi một công việc gặp vấn đề, tôi thường muốn tiếp tục phân tích lý thuyết hơn là thay đổi ngay cách tổ chức hoặc thực hiện nó.",
    function: "Te",
    reverse: true,
  },
  {
    id: "TE07",
    text: "Khi tổ chức một chuyến đi với bạn bè, tôi thường muốn xác định ai làm gì, thời gian nào và cần chuẩn bị những gì để mọi việc diễn ra thuận lợi.",
    function: "Te",
    reverse: false,
  },
  {
    id: "TE08",
    text: "Nếu một kế hoạch không đem lại kết quả như mong muốn, tôi thường muốn thay đổi cách thực hiện càng sớm càng tốt thay vì tiếp tục giữ nguyên nó.",
    function: "Te",
    reverse: false,
  },
  {
    id: "TE09",
    text: "Khi một nhóm đã có một ý tưởng mà mọi người đều thích, tôi thường không thấy cần phải thống nhất rõ ai sẽ làm gì và khi nào.",
    function: "Te",
    reverse: true,
  },

  // ──────────────────────────────────────────────────────────
  // Fi — Introverted Feeling (9 questions)
  // ──────────────────────────────────────────────────────────
  {
    id: "FI01",
    text: "Khi đưa ra một quyết định quan trọng, tôi thường xem nó có thực sự phù hợp với những giá trị mà tôi coi trọng hay không.",
    function: "Fi",
    reverse: false,
  },
  {
    id: "FI02",
    text: "Tôi có thể không đồng ý với số đông nếu điều họ cho là đúng không phù hợp với nguyên tắc cá nhân của tôi.",
    function: "Fi",
    reverse: false,
  },
  {
    id: "FI03",
    text: "Tôi thường quan tâm đến việc mình có đang sống đúng với con người và giá trị thật của mình hay không.",
    function: "Fi",
    reverse: false,
  },
  {
    id: "FI04",
    text: "Những câu chuyện hoặc trải nghiệm mang ý nghĩa cá nhân sâu sắc có thể tác động mạnh đến tôi.",
    function: "Fi",
    reverse: false,
  },
  {
    id: "FI05",
    text: "Nếu hầu hết mọi người đều đồng ý về một điều, tôi thường cho rằng nó phù hợp với mình dù chưa tự xem xét giá trị cá nhân.",
    function: "Fi",
    reverse: true,
  },
  {
    id: "FI06",
    text: "Tôi thường dễ bỏ qua cảm nhận cá nhân của mình nếu một lựa chọn được xem là phù hợp với tập thể.",
    function: "Fi",
    reverse: true,
  },
  {
    id: "FI07",
    text: "Khi bạn bè đều thích một lựa chọn nhưng bản thân tôi cảm thấy nó không phù hợp với những gì mình coi trọng, tôi vẫn cân nhắc rất kỹ cảm nhận và nguyên tắc của mình.",
    function: "Fi",
    reverse: false,
  },
  {
    id: "FI08",
    text: "Khi xin lỗi một người, tôi thường quan tâm việc lời xin lỗi đó có thực sự phản ánh điều mình cảm thấy hay không, chứ không chỉ muốn làm cho tình hình êm đẹp.",
    function: "Fi",
    reverse: false,
  },
  {
    id: "FI09",
    text: "Khi lựa chọn cách hành xử, tôi thường ưu tiên điều khiến những người xung quanh hài lòng ngay cả khi nó không thực sự phù hợp với cảm nhận hoặc giá trị của mình.",
    function: "Fi",
    reverse: true,
  },

  // ──────────────────────────────────────────────────────────
  // Fe — Extraverted Feeling (9 questions)
  // ──────────────────────────────────────────────────────────
  {
    id: "FE01",
    text: "Khi ở cùng một nhóm, tôi thường chú ý đến việc mọi người đang cảm thấy thế nào và mối quan hệ giữa họ có ổn không.",
    function: "Fe",
    reverse: false,
  },
  {
    id: "FE02",
    text: "Khi giao tiếp, tôi thường điều chỉnh cách nói của mình dựa trên phản ứng của người đối diện.",
    function: "Fe",
    reverse: false,
  },
  {
    id: "FE03",
    text: "Tôi thường quan tâm đến việc một quyết định sẽ ảnh hưởng thế nào đến cảm xúc và sự hòa hợp của những người liên quan.",
    function: "Fe",
    reverse: false,
  },
  {
    id: "FE04",
    text: "Tôi có xu hướng muốn tạo ra một môi trường mà mọi người đều cảm thấy được tôn trọng và thuộc về.",
    function: "Fe",
    reverse: false,
  },
  {
    id: "FE05",
    text: "Khi một quyết định hợp lý với tôi, tôi thường không quan tâm nhiều đến việc người khác có cảm thấy thoải mái với nó hay không.",
    function: "Fe",
    reverse: true,
  },
  {
    id: "FE06",
    text: "Trong một cuộc tranh luận, cảm xúc và nhu cầu của những người liên quan thường không ảnh hưởng nhiều đến cách tôi giao tiếp.",
    function: "Fe",
    reverse: true,
  },
  {
    id: "FE07",
    text: "Khi hai người bạn xảy ra mâu thuẫn, tôi thường chú ý đến cảm xúc của cả hai và điều chỉnh cách nói để cuộc trò chuyện dễ tìm được tiếng nói chung hơn.",
    function: "Fe",
    reverse: false,
  },
  {
    id: "FE08",
    text: "Khi bước vào một nhóm mới, tôi thường nhanh chóng nhận ra ai đang cảm thấy thoải mái, ai đang bị đứng ngoài và bầu không khí giữa mọi người.",
    function: "Fe",
    reverse: false,
  },
  {
    id: "FE09",
    text: "Khi trong một nhóm có sự căng thẳng, tôi thường tập trung vào quan điểm của riêng mình mà không chú ý nhiều đến bầu không khí hoặc cảm xúc của những người khác.",
    function: "Fe",
    reverse: true,
  },
];

export default cognitiveFunctionQuestions;
