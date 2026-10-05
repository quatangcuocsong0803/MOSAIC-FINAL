export type InstinctualVariant = "sp" | "sx" | "so";

export interface InstinctQuestion {
  id: string;
  pairId: string;

  // Scoring metadata only. Never exposed in the UI.
  agreeInstinct: InstinctualVariant;
  disagreeInstinct: InstinctualVariant;

  text: string;
}

const instinctQuestions: InstinctQuestion[] = [
  {
    id: "I01",
    pairId: "SP_SO_01",
    agreeInstinct: "sp",
    disagreeInstinct: "so",
    text: "Khi chuyển đến nơi mới, tôi muốn ổn định sinh hoạt trước hay tìm cách hòa vào nơi đó trước?",
  },
  {
    id: "I02",
    pairId: "SP_SO_02",
    agreeInstinct: "sp",
    disagreeInstinct: "so",
    text: "Trong một nhóm mới, tôi chú ý mình cần chuẩn bị gì hay nên làm quen với những ai?",
  },
  {
    id: "I03",
    pairId: "SP_SO_03",
    agreeInstinct: "sp",
    disagreeInstinct: "so",
    text: "Khi có thêm tiền, tôi dễ nghĩ đến thứ mình đang cần hay một hoạt động có thể làm cùng người khác?",
  },
  {
    id: "I04",
    pairId: "SP_SO_04",
    agreeInstinct: "sp",
    disagreeInstinct: "so",
    text: "Khi nhận lời mời, tôi cân nhắc nó có hợp với cuộc sống hiện tại không hay nó đưa mình đến những người nào?",
  },
  {
    id: "I05",
    pairId: "SP_SO_05",
    agreeInstinct: "sp",
    disagreeInstinct: "so",
    text: "Khi tham gia một cộng đồng mới, tôi muốn biết mình cần bỏ ra những gì hay mình sẽ gặp những ai?",
  },

  {
    id: "I06",
    pairId: "SO_SX_01",
    agreeInstinct: "so",
    disagreeInstinct: "sx",
    text: "Ở một buổi gặp mặt, tôi dễ chú ý ai đang kết nối với ai hay ai khiến tôi đặc biệt bị thu hút?",
  },
  {
    id: "I07",
    pairId: "SO_SX_02",
    agreeInstinct: "so",
    disagreeInstinct: "sx",
    text: "Khi quen một người mới, tôi quan tâm hơn vị trí của họ trong nhóm hay cảm giác giữa hai người?",
  },
  {
    id: "I08",
    pairId: "SO_SX_03",
    agreeInstinct: "so",
    disagreeInstinct: "sx",
    text: "Trong một dự án chung, tôi chú ý hơn những người mình có thể kết nối hay một người mình muốn làm việc thật sát?",
  },
  {
    id: "I09",
    pairId: "SO_SX_04",
    agreeInstinct: "so",
    disagreeInstinct: "sx",
    text: "Nếu một người tôi thích không hợp với nhóm bạn, tôi để ý hơn việc họ hòa vào nhóm thế nào hay mình vẫn bị họ cuốn hút ra sao?",
  },
  {
    id: "I10",
    pairId: "SO_SX_05",
    agreeInstinct: "so",
    disagreeInstinct: "sx",
    text: "Khi chọn một hoạt động cùng nhóm, tôi thích thứ mọi người cùng tham gia hay thứ khiến tôi muốn tập trung vào một người đặc biệt?",
  },

  {
    id: "I11",
    pairId: "SX_SP_01",
    agreeInstinct: "sx",
    disagreeInstinct: "sp",
    text: "Khi chọn nơi ở, tôi để ý hơn cảm giác nơi đó tạo ra hay sự thuận tiện cho sinh hoạt?",
  },
  {
    id: "I12",
    pairId: "SX_SP_02",
    agreeInstinct: "sx",
    disagreeInstinct: "sp",
    text: "Khi mua một món đồ mình rất thích, tôi bị hút bởi cảm giác sử dụng hay tính hữu ích và độ bền?",
  },
  {
    id: "I13",
    pairId: "SX_SP_03",
    agreeInstinct: "sx",
    disagreeInstinct: "sp",
    text: "Khi chọn một chuyến đi, tôi nghiêng về nơi khiến mình thật sự bị cuốn vào hay nơi dễ ở và dễ xoay xở?",
  },
  {
    id: "I14",
    pairId: "SX_SP_04",
    agreeInstinct: "sx",
    disagreeInstinct: "sp",
    text: "Khi một kế hoạch rất hấp dẫn nhưng khá bất tiện, tôi dễ bị kéo về phía sức hút của nó hay điều kiện để mình thực hiện thoải mái?",
  },
];

export const enneagramInstinctQuestions = instinctQuestions;

export type InstinctRawAnswers = Record<string, number>;

export const ENNEAGRAM_INSTINCT_QUESTION_COUNT =
  enneagramInstinctQuestions.length;
