export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface EnneagramQuestion {
  id: string;
  pairId: string;
  agreeType: EnneagramType;
  disagreeType: EnneagramType;
  text: string;
}

export type EnneagramRawAnswers = Record<string, number>;

const coreItems: Omit<EnneagramQuestion, "id">[] = [
  {
    pairId: "1-2-01",
    agreeType: 1,
    disagreeType: 2,
    text: "Khi một người bạn đang gặp khó khăn, tôi thích giúp họ theo cách mà tôi cho là đúng và hợp lý hơn là giúp theo cách khiến họ cảm thấy tôi là người họ có thể dựa vào.",
  },
  {
    pairId: "1-3-01",
    agreeType: 1,
    disagreeType: 3,
    text: "Khi hoàn thành một công việc, tôi thích biết mình đã làm đúng theo tiêu chuẩn của mình hơn là có một kết quả đẹp khiến người khác đánh giá cao.",
  },
  {
    pairId: "1-4-01",
    agreeType: 1,
    disagreeType: 4,
    text: "Khi làm một việc sáng tạo, tôi thích tuân theo một tiêu chuẩn mà tôi tin là đúng hơn là biến nó thành một thứ mang dấu ấn rất riêng của mình.",
  },
  {
    pairId: "1-5-01",
    agreeType: 1,
    disagreeType: 5,
    text: "Khi gặp một vấn đề khó, tôi thích tìm ra cách làm đúng rồi bắt tay vào làm hơn là dành thêm thời gian để hiểu thật sâu vì sao mọi thứ lại vận hành như vậy.",
  },
  {
    pairId: "1-6-01",
    agreeType: 1,
    disagreeType: 6,
    text: "Khi một quy định chưa rõ, tôi thích tự xác định mình nên làm gì dựa trên nguyên tắc hơn là tìm một người đáng tin để hỏi.",
  },
  {
    pairId: "1-7-01",
    agreeType: 1,
    disagreeType: 7,
    text: "Khi một việc còn dang dở nhưng không thú vị, tôi thích hoàn thành nó cho tử tế hơn là bỏ sang một việc khác hấp dẫn hơn.",
  },
  {
    pairId: "1-8-01",
    agreeType: 1,
    disagreeType: 8,
    text: "Khi cách làm của tôi bị phản đối, tôi thích làm rõ vì sao cách đó đúng hơn là tìm cách giữ quyền quyết định cuối cùng.",
  },
  {
    pairId: "1-9-01",
    agreeType: 1,
    disagreeType: 9,
    text: "Khi cả nhóm chọn một phương án dễ chịu nhưng tôi cho rằng nó chưa đúng, tôi thích nói ra vấn đề hơn là giữ không khí yên ổn.",
  },

  {
    pairId: "2-3-01",
    agreeType: 2,
    disagreeType: 3,
    text: "Khi chọn một công việc, tôi thích một nơi mà mọi người thật sự cần đến mình hơn là một nơi có thành tích khiến mình nổi bật.",
  },
  {
    pairId: "2-4-01",
    agreeType: 2,
    disagreeType: 4,
    text: "Trong một mối quan hệ yêu đương, tôi thích cảm giác người kia thật sự cần mình hơn là cảm giác họ nhìn thấy và trân trọng con người rất riêng của mình.",
  },
  {
    pairId: "2-5-01",
    agreeType: 2,
    disagreeType: 5,
    text: "Khi có một buổi tối rảnh, tôi thích dùng thời gian đó để ở bên một người đang cần sự quan tâm của mình hơn là giữ trọn buổi tối cho việc riêng.",
  },
  {
    pairId: "2-6-01",
    agreeType: 2,
    disagreeType: 6,
    text: "Khi mới thân với một người, tôi thích cảm giác họ tìm đến mình khi có chuyện hơn là cảm giác mình đã biết chắc họ là người đáng tin.",
  },
  {
    pairId: "2-7-01",
    agreeType: 2,
    disagreeType: 7,
    text: "Khi lên kế hoạch cho một chuyến đi với người mình rất quý, tôi thích làm cho người đó cảm thấy được chăm sóc hơn là dành phần lớn thời gian để tự do khám phá những thứ mình thích.",
  },
  {
    pairId: "2-8-01",
    agreeType: 2,
    disagreeType: 8,
    text: "Khi giúp một người đang gặp khó khăn, tôi thích cảm giác mình có một vị trí quan trọng trong việc họ vượt qua chuyện đó hơn là cảm giác họ có thể tự đứng vững mà không cần đến tôi.",
  },
  {
    pairId: "2-9-01",
    agreeType: 2,
    disagreeType: 9,
    text: "Khi một mối quan hệ đang có vấn đề, tôi thích biết rằng người kia vẫn thật sự muốn tôi ở bên hơn là chỉ cần hai người nhanh chóng trở lại bình yên.",
  },

  {
    pairId: "3-4-01",
    agreeType: 3,
    disagreeType: 4,
    text: "Khi chọn một con đường nghề nghiệp, tôi thích một con đường có thể đưa mình tới thành công rõ ràng hơn là một con đường rất đúng với con người riêng của mình.",
  },
  {
    pairId: "3-5-01",
    agreeType: 3,
    disagreeType: 5,
    text: "Khi học một kỹ năng, tôi thích biến nó thành một thành tích rõ ràng hơn là dành nhiều thời gian đào thật sâu vào một phần khó mà có thể chẳng ai biết đến.",
  },
  {
    pairId: "3-6-01",
    agreeType: 3,
    disagreeType: 6,
    text: "Khi được chọn giữa một công việc đầy tham vọng nhưng nhiều bất ổn và một công việc ổn định nhưng ít cơ hội tiến xa, tôi thường nghiêng về công việc đầu tiên.",
  },
  {
    pairId: "3-7-01",
    agreeType: 3,
    disagreeType: 7,
    text: "Khi nhìn về một năm sắp tới, tôi thích đặt mục tiêu lớn và cố đạt được nó hơn là để năm đó có thật nhiều trải nghiệm mới.",
  },
  {
    pairId: "3-8-01",
    agreeType: 3,
    disagreeType: 8,
    text: "Khi dẫn dắt một nhóm, tôi thích trở thành người tạo ra một kết quả mà mọi người công nhận hơn là trở thành người có quyền quyết định cách nhóm đó vận hành.",
  },
  {
    pairId: "3-9-01",
    agreeType: 3,
    disagreeType: 9,
    text: "Tôi thích có một tình yêu rực rỡ tới mức người khác phải ngưỡng mộ tôi hơn là một tình yêu trầm lặng nhưng cả hai đều biết đối phương yêu mình.",
  },

  {
    pairId: "4-5-01",
    agreeType: 4,
    disagreeType: 5,
    text: "Khi đọc một cuốn sách làm tôi thấy rất đồng cảm với chính mình, tôi thích cảm giác đó hơn là cảm giác mình vừa hiểu được một hệ thống rất phức tạp.",
  },
  {
    pairId: "4-6-01",
    agreeType: 4,
    disagreeType: 6,
    text: "Khi bắt đầu một mối quan hệ quan trọng, tôi thích một mối quan hệ khiến mình cảm thấy có một kết nối rất riêng hơn là một mối quan hệ mà mình biết chắc có thể dựa vào lâu dài.",
  },
  {
    pairId: "4-7-01",
    agreeType: 4,
    disagreeType: 7,
    text: "Khi một chuyện buồn đang chiếm rất nhiều tâm trí, tôi thích ngồi lại để hiểu mình thực sự cảm thấy gì hơn là tìm ngay một điều mới để đầu óc chuyển sang chuyện khác.",
  },
  {
    pairId: "4-8-01",
    agreeType: 4,
    disagreeType: 8,
    text: "Khi xảy ra xung đột với một người rất quan trọng, tôi thích để họ hiểu thật rõ tôi đã trải qua chuyện đó như thế nào hơn là chỉ cần nói thẳng mình muốn chuyện gì xảy ra tiếp theo.",
  },
  {
    pairId: "4-9-01",
    agreeType: 4,
    disagreeType: 9,
    text: "Khi chọn nơi để sống, tôi thích một nơi mang dấu ấn rất rõ của mình dù không phải ai cũng thấy dễ sống ở đó hơn là một nơi đơn giản mà hầu như ai cũng thấy dễ chịu.",
  },

  {
    pairId: "5-6-01",
    agreeType: 5,
    disagreeType: 6,
    text: "Khi chuyển đến một nơi hoàn toàn mới, tôi thích tự tìm hiểu cách mọi thứ vận hành hơn là tìm trước một người hoặc hệ thống mà mình có thể dựa vào khi gặp chuyện.",
  },
  {
    pairId: "5-7-01",
    agreeType: 5,
    disagreeType: 7,
    text: "Nếu có cả một ngày hoàn toàn rảnh, tôi thích dành phần lớn ngày đó để đào sâu một thứ mình rất tò mò hơn là chia thời gian cho nhiều trải nghiệm khác nhau.",
  },
  {
    pairId: "5-8-01",
    agreeType: 5,
    disagreeType: 8,
    text: "Khi được giao quyền xử lý một vấn đề, tôi thích trở thành người hiểu rõ mọi chi tiết hơn là người có tiếng nói quyết định cuối cùng.",
  },
  {
    pairId: "5-9-01",
    agreeType: 5,
    disagreeType: 9,
    text: "Khi một buổi tụ họp kéo dài hơn dự định, tôi thích rời đi để có thời gian riêng hơn là ở lại chỉ vì mọi người vẫn đang vui.",
  },

  {
    pairId: "6-7-01",
    agreeType: 6,
    disagreeType: 7,
    text: "Khi đi du lịch, tôi thích có kế hoạch rõ ràng và phương án dự phòng hơn là để lịch trình mở để có thể đổi ý bất cứ lúc nào.",
  },
  {
    pairId: "6-8-01",
    agreeType: 6,
    disagreeType: 8,
    text: "Khi phải quyết định một chuyện lớn mà chưa biết chắc chuyện gì sẽ xảy ra, tôi thích có thêm một người hoặc nguồn đáng tin để kiểm chứng hơn là tự quyết định và chấp nhận tự chịu trách nhiệm.",
  },
  {
    pairId: "6-9-01",
    agreeType: 6,
    disagreeType: 9,
    text: "Khi cả nhóm chưa thống nhất được một quyết định, tôi thích chốt một phương án rõ ràng để mọi người biết mình đang dựa vào đâu hơn là để quyết định mở thêm một thời gian cho tới khi không khí bớt căng.",
  },

  {
    pairId: "7-8-01",
    agreeType: 7,
    disagreeType: 8,
    text: "Khi chọn một công việc, tôi thích một công việc cho phép mình thường xuyên đổi dự án và thử điều mới dù quyền quyết định hạn chế hơn là một công việc cho mình toàn quyền quyết định một lĩnh vực nhưng phải gắn bó lâu dài với nó.",
  },
  {
    pairId: "7-9-01",
    agreeType: 7,
    disagreeType: 9,
    text: "Trong một ngày nghỉ, tôi thích có nhiều thứ mới để làm và nhiều nơi để đi hơn là giữ một nhịp sinh hoạt chậm và quen thuộc.",
  },

  {
    pairId: "8-9-01",
    agreeType: 8,
    disagreeType: 9,
    text: "Khi có bất đồng quan trọng với một người, tôi thích nói thẳng và xử lý chuyện đó ngay hơn là chờ mọi người bình tĩnh lại để giữ mối quan hệ dễ chịu.",
  },

  {
    pairId: "1-2-02",
    agreeType: 2,
    disagreeType: 1,
    text: "Khi một người tôi quý gặp khó khăn, tôi thích họ chủ động tìm đến tôi hơn là biết rằng họ vẫn tự giải quyết mọi thứ theo cách mình cho là đúng.",
  },
  {
    pairId: "1-3-02",
    agreeType: 3,
    disagreeType: 1,
    text: "Khi được giao một việc, tôi thích biết rõ mình sẽ đạt được kết quả gì và được công nhận ra sao hơn là dành thời gian hoàn thiện từng chi tiết theo tiêu chuẩn riêng.",
  },
  {
    pairId: "1-4-02",
    agreeType: 4,
    disagreeType: 1,
    text: "Khi chọn một món đồ cho không gian riêng, tôi thích nó có dấu ấn rất riêng của mình hơn là nó được sắp xếp đúng cách theo một chuẩn cố định.",
  },
  {
    pairId: "1-5-02",
    agreeType: 5,
    disagreeType: 1,
    text: "Khi ai đó hỏi tôi giải thích một vấn đề phức tạp, tôi thích có thời gian tự tìm hiểu thật kỹ hơn là trả lời ngay theo điều mình cho là đúng.",
  },
  {
    pairId: "2-6-02",
    agreeType: 6,
    disagreeType: 2,
    text: "Khi thân với một người, tôi thích biết rằng mình có thể tin họ khi có chuyện hơn là biết rằng họ thường tìm đến mình khi cần.",
  },
  {
    pairId: "2-7-02",
    agreeType: 7,
    disagreeType: 2,
    text: "Khi một buổi cuối tuần đã được lên kế hoạch, tôi thích vẫn còn khoảng trống để đổi ý và làm điều bất ngờ hơn là dùng thời gian đó để chăm lo chu đáo cho những người đi cùng.",
  },
  {
    pairId: "2-8-02",
    agreeType: 8,
    disagreeType: 2,
    text: "Khi giúp một người vượt qua khó khăn, tôi thích thấy họ tự đứng vững bằng chính sức mình hơn là biết rằng họ cần tôi ở bên lâu dài.",
  },
  {
    pairId: "2-9-02",
    agreeType: 9,
    disagreeType: 2,
    text: "Khi một mối quan hệ đang yên ổn, tôi thích giữ nhịp bình thường đó hơn là thường xuyên làm những điều mới để người kia cảm thấy mình đặc biệt với họ.",
  },
  {
    pairId: "3-4-02",
    agreeType: 4,
    disagreeType: 3,
    text: "Khi kể về một dự án mình đã làm, tôi thích nói về điều nó nói lên về con người mình hơn là nói về thành tích mà nó mang lại.",
  },
  {
    pairId: "3-5-02",
    agreeType: 5,
    disagreeType: 3,
    text: "Khi được khen vì mình giỏi một việc, điều tôi thích nhất là biết mình thực sự hiểu nó hơn là được nhiều người biết đến vì mình giỏi.",
  },
  {
    pairId: "3-6-02",
    agreeType: 6,
    disagreeType: 3,
    text: "Khi nhận một cơ hội rất lớn nhưng chưa chắc chắn, tôi thích biết trước những rủi ro chính hơn là nghĩ đến việc cơ hội đó có thể đưa mình tiến xa thế nào.",
  },
  {
    pairId: "3-7-02",
    agreeType: 7,
    disagreeType: 3,
    text: "Khi có hai lựa chọn cho công việc, tôi thích công việc cho phép mình thử nhiều thứ hơn là công việc có lộ trình thăng tiến rõ ràng.",
  },
  {
    pairId: "4-5-02",
    agreeType: 5,
    disagreeType: 4,
    text: "Khi phải chọn một khóa học, tôi thích một khóa cho mình kiến thức có thể dùng được hơn là một khóa khiến mình thấy bản thân được truyền cảm hứng mạnh.",
  },
  {
    pairId: "6-8-02",
    agreeType: 8,
    disagreeType: 6,
    text: "Khi không chắc một người đang nói đúng hay không, tôi thích tự đưa ra quyết định và chịu trách nhiệm hơn là chờ thêm người khác xác nhận.",
  },
  {
    pairId: "7-9-02",
    agreeType: 9,
    disagreeType: 7,
    text: "Khi một nhóm bạn đang có kế hoạch quen thuộc, tôi thích giữ nguyên kế hoạch để mọi người dễ chịu hơn là đổi sang một điều mới chỉ vì tôi vừa nghĩ ra nó.",
  },
  {
    pairId: "8-9-02",
    agreeType: 8,
    disagreeType: 9,
    text: "Khi có chuyện khiến tôi bực với một người, tôi thích nói thẳng để giải quyết hơn là bỏ qua để mối quan hệ tiếp tục bình thường.",
  },
];

export const enneagramQuestions: EnneagramQuestion[] =
  coreItems.map((item, index) => ({
    ...item,
    id: `E${String(index + 1).padStart(3, "0")}`,
  }));

export const ENNEAGRAM_CORE_QUESTION_COUNT =
  enneagramQuestions.length;
