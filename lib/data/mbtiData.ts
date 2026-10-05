export interface MbtiSection {
  heading: string;
  content: string;
}

export interface MbtiTypeData {
  title: string;
  sections: MbtiSection[];
}

const masterOverviewSections: MbtiSection[] = [
  {
    heading: "1. MBTI là gì?",
    content: `MBTI, viết tắt của Myers-Briggs Type Indicator, là một hệ thống phân loại sở thích tâm lý được phát triển bởi Katharine Cook Briggs và Isabel Briggs Myers dựa trên lý thuyết kiểu tâm lý của Carl Gustav Jung. Hệ thống mô tả bốn cặp sở thích: Extraversion–Introversion, Sensing–Intuition, Thinking–Feeling và Judging–Perceiving. Khi chọn một phía từ mỗi cặp, ta có một mã gồm bốn chữ cái và tổng cộng mười sáu kiểu.

Điểm quan trọng nằm ở từ sở thích. Trong ngôn ngữ Myers-Briggs, một preference không có nghĩa một người chỉ có thể sử dụng một phía. Người thiên về Thinking vẫn có Feeling; người thiên về Introversion vẫn có thể giao tiếp tốt; người thiên về Perceiving vẫn có thể lên kế hoạch rất kỹ. Sở thích chỉ mô tả một hướng thường cảm thấy tự nhiên, quen thuộc hoặc dễ tiếp cận hơn. Myers & Briggs Foundation cũng nhấn mạnh rằng con người sử dụng cả hai phía của mỗi cặp trong đời sống hằng ngày.

Vì vậy, MBTI không nên được đọc giống một bộ bốn công tắc bật–tắt. Một người không phải hoặc “100% hướng nội” hoặc “100% hướng ngoại”, cũng không trở thành một người hoàn toàn khác chỉ vì điểm số nằm gần ranh giới giữa hai preference. Bốn chữ cái là cách phân loại theo mô hình type; trải nghiệm thực tế của con người vẫn có nhiều mức độ và biến thiên hơn.

MBTI cũng không chỉ là bốn chữ cái đứng cạnh nhau. Trong type dynamics, mã bốn chữ được đọc như một cấu trúc tương tác giữa quá trình nhận thông tin và quá trình đưa ra phán đoán. Đây là nơi MBTI kết nối với khái niệm các chức năng nhận thức.`
  },
  {
    heading: "2. Nguồn gốc của MBTI",
    content: `Carl Jung không tạo ra MBTI và cũng không tạo ra mười sáu mã bốn chữ như INFP, ESTJ hay ENTP. Trong Psychological Types, xuất bản lần đầu năm 1921, Jung xây dựng một hệ thống xoay quanh hai thái độ tâm lý — Introversion và Extraversion — cùng bốn chức năng tâm lý: Thinking, Feeling, Sensation và Intuition. Ông mô tả Thinking và Feeling như các chức năng phán đoán, còn Sensation và Intuition như các chức năng tiếp nhận. Mỗi chức năng có thể được định hướng theo thái độ hướng nội hoặc hướng ngoại, tạo nền tảng cho những khái niệm sau này thường được gọi là Ti, Te, Fi, Fe, Si, Se, Ni và Ne.

Jung cũng không xem các chức năng của một người là ngang bằng nhau. Ông cho rằng thông thường sẽ có một chức năng được phân hóa và phát triển nổi bật hơn, trong khi các quá trình còn lại ít được ý thức hoặc phát triển hơn. Ý tưởng về sự bất cân xứng này trở thành một trong những nền tảng để các hệ thống hậu Jung xây dựng khái niệm thứ bậc chức năng.

Katharine Cook Briggs và con gái Isabel Briggs Myers về sau phát triển những ý tưởng này thành hệ Myers-Briggs. Isabel Myers xây dựng một công cụ tự báo cáo nhằm giúp con người xác định preference và whole type. Hệ thống Myers-Briggs giữ ba cặp liên quan trực tiếp tới các khái niệm Jung — E/I, S/N và T/F — đồng thời bổ sung cặp Judging–Perceiving như một phần của mã bốn chữ. Myers & Briggs Foundation mô tả J/P là một đóng góp của Myers nhằm làm rõ cách các quá trình tâm lý được biểu hiện ra thế giới bên ngoài.

Do đó, có thể hiểu MBTI là một sự phát triển từ lý thuyết của Jung, chứ không phải bản sao nguyên vẹn của Psychological Types. Những khái niệm phổ biến ngày nay như mã bốn chữ, mười sáu kiểu, J/P và cách mã hóa type dynamics đều thuộc quá trình phát triển sau Jung.`
  },
  {
    heading: "3. Bốn chữ cái trong MBTI",
    content: `E – I: Hướng của sự chú ý
Extraversion (E) và Introversion (I) trong MBTI không đơn giản là “hướng ngoại” và “nhút nhát”. Trong ngôn ngữ typology, cặp này liên quan đến hướng mà sự chú ý và năng lượng tâm lý có xu hướng được định hướng. Extraversion ưu tiên thế giới bên ngoài: con người, đồ vật, hoạt động, sự kiện. Introversion ưu tiên thế giới bên trong: suy nghĩ, hình ảnh, ý tưởng, ký ức và quá trình phản tư.

S – N: Cách tiếp nhận thông tin
Sensing (S) ưu tiên dữ liệu cụ thể, có thể quan sát, trải nghiệm trực tiếp và những gì đang hoặc đã thực sự hiện diện. Intuition (N) chú ý nhiều hơn tới mối liên hệ, ý nghĩa, khả năng, mô hình và hàm ý vượt ra ngoài mô tả trực quan của dữ kiện hiện tại.

T – F: Cách đưa ra phán đoán
Thinking (T) đặt nhiều trọng lượng hơn vào quan hệ logic, nguyên tắc, tiêu chí nhất quán và sự phân tích khách quan. Feeling (F) đặt nhiều trọng lượng hơn vào values, hoàn cảnh con người, ý nghĩa cá nhân hoặc xã hội và sự hòa hợp.

J – P: Cách tương tác với thế giới bên ngoài
Judging (J) và Perceiving (P) mô tả loại quá trình mà một người có xu hướng hướng ra thế giới bên ngoài:
- Với J type: quá trình judging (Thinking hoặc Feeling) được extraverted.
- Với P type: quá trình perceiving (Sensing hoặc Intuition) được extraverted.`
  },
  {
    heading: "4. Từ bốn chữ cái đến các chức năng nhận thức (Type Dynamics)",
    content: `Bốn chữ cái không chỉ là bốn preference được cộng lại. Trong cách đọc type dynamics, chúng hoạt động như một mã cho quan hệ giữa perception, judgment, introversion và extraversion.

Hai chữ giữa xác định hai quá trình được ưu tiên. Ví dụ, INTP có N là perceiving preference và T là judging preference. Chữ cuối là P, nên quá trình perceiving được hướng ra ngoài: N trở thành Ne. Nhưng type bắt đầu bằng I, nghĩa là quá trình hướng ra ngoài không phải trung tâm; nó đóng vai trò hỗ trợ. Quá trình chủ đạo do đó là judging process hướng vào trong: Ti.
Ta có: INTP → Ti – Ne. Hoàn thiện stack thành: Ti – Ne – Si – Fe.

Với ENTJ: T là judging, N là perceiving. Chữ J cho biết judging process được extraverted (Te). Vì ENTJ là E type, Te trở thành dominant: ENTJ → Te – Ni – Se – Fi.

Với INFJ: J cho biết judging process được extraverted (Fe). Vì INFJ là I type, Fe đóng vai trò auxiliary, dominant là Ni: INFJ → Ni – Fe – Ti – Se.`
  },
  {
    heading: "5. Tám chức năng nhận thức (Cognitive Functions)",
    content: `Ti – Tư duy hướng nội:
Introverted Thinking (Ti) tìm kiếm sự nhất quán logic trong một framework bên trong. Nó có xu hướng muốn hiểu một hệ thống hoạt động theo nguyên lý nào, các khái niệm được định nghĩa ra sao và liệu những phần khác nhau của luận điểm có thực sự tương thích với nhau hay không. Trong mô hình type dynamics, Ti giữ vai trò dominant ở INTP và ISTP.

Te – Tư duy hướng ngoại:
Extraverted Thinking (Te) hướng logic vào việc cấu trúc thế giới bên ngoài. Nó chú ý tới objective information, procedure, tiêu chuẩn, hiệu quả, nguồn lực, thứ tự và kết quả có thể kiểm tra. Te là dominant của ENTJ và ESTJ.

Fi – Cảm xúc hướng nội:
Introverted Feeling (Fi) là một judging process xoay quanh valuation bên trong: điều gì có giá trị với cá nhân, lựa chọn nào phù hợp với điều mình thực sự tin và liệu hành động bên ngoài có nhất quán với nội tâm hay không. Fi là dominant của INFP và ISFP.

Fe – Cảm xúc hướng ngoại:
Extraverted Feeling (Fe) là quá trình value judgment hướng ra các mối quan hệ bên ngoài. Nó chú ý tới interpersonal context, những giá trị được chia sẻ, tác động xã hội và sự kết nối giữa mọi người. Fe là dominant của ENFJ và ESFJ.

Si – Cảm giác hướng nội:
Introverted Sensing (Si) tiếp nhận hiện tại trong quan hệ với những impression, baseline và trải nghiệm đã được tích lũy bên trong (internal referencing). Si là dominant của ISTJ và ISFJ.

Se – Cảm giác hướng ngoại:
Extraverted Sensing (Se) ưu tiên dữ liệu cụ thể đang hiện diện trong môi trường: hình ảnh, âm thanh, thay đổi vật lý, timing và những cơ hội quan sát trực tiếp. Se là dominant của ESTP và ESFP.

Ni – Trực giác hướng nội:
Introverted Intuition (Ni) là quá trình hội tụ: nhiều mảnh ghép, ấn tượng hoặc tín hiệu rời rạc dần được tích hợp thành một pattern, ý nghĩa cốt lõi hoặc định hướng thống nhất. Ni là dominant của INFJ và INTJ.

Ne – Trực giác hướng ngoại:
Extraverted Intuition (Ne) là quá trình mở rộng: nhanh chóng tạo ra nhiều khả năng, liên tưởng và hướng phát triển khác nhau từ bất kỳ ý tưởng hay sự kiện nào. Ne là dominant của ENFP và ENTP.`
  },
  {
    heading: "6. Cấu trúc chức năng của một kiểu MBTI",
    content: `Type dynamics sắp xếp bốn chức năng thành một thứ bậc phát triển:

Chức năng chủ đạo (Dominant):
Quá trình trung tâm của type, nơi một người dễ dựa vào nhất, thường có mức độ ý thức và thuần thục cao hơn hẳn.

Chức năng hỗ trợ (Auxiliary):
Cân bằng dominant theo hai chiều: nếu dominant là judging thì auxiliary là perceiving (và ngược lại); nếu dominant hướng nội thì auxiliary hướng ngoại (và ngược lại).

Chức năng thứ ba (Tertiary):
Ít ý thức hơn dominant–auxiliary, phát triển và tích hợp dần theo thời gian và trải nghiệm cá nhân.

Chức năng yếu (Inferior):
Quá trình đối lập trực tiếp với dominant (Ti ↔ Fe, Te ↔ Fi, Si ↔ Ne, Se ↔ Ni). Được xem là khó truy cập tự nhiên hơn, dễ trở thành điểm mù nhưng cũng là chìa khóa của sự cân bằng tâm lý khi trưởng thành.`
  },
  {
    heading: "7. Cách suy ra Function Stack từ bốn chữ cái",
    content: `1. Xác định hai chữ cái ở giữa: một perceiving preference (S hoặc N) và một judging preference (T hoặc F).
2. Dùng chữ cuối (J/P) để xác định process nào hướng ngoại:
   - J: Judging process được extraverted (Te hoặc Fe).
   - P: Perceiving process được extraverted (Se hoặc Ne).
3. Dùng chữ đầu (E/I) để xác định process hướng ngoại đó là dominant hay auxiliary:
   - E: Process hướng ngoại là Dominant.
   - I: Process hướng ngoại là Auxiliary; Dominant là process còn lại quay vào trong (introverted).
4. Xác định Tertiary là đối lập của Auxiliary, và Inferior là đối lập của Dominant.`
  },
  {
    heading: "8. Function Stack tham chiếu của 16 kiểu MBTI",
    content: `• ISTJ: Si → Te → Fi → Ne
• ISFJ: Si → Fe → Ti → Ne
• INFJ: Ni → Fe → Ti → Se
• INTJ: Ni → Te → Fi → Se
• ISTP: Ti → Se → Ni → Fe
• ISFP: Fi → Se → Ni → Te
• INFP: Fi → Ne → Si → Te
• INTP: Ti → Ne → Si → Fe
• ESTP: Se → Ti → Fe → Ni
• ESFP: Se → Fi → Te → Ni
• ENFP: Ne → Fi → Te → Si
• ENTP: Ne → Ti → Fe → Si
• ESTJ: Te → Si → Ne → Fi
• ESFJ: Fe → Si → Ne → Ti
• ENFJ: Fe → Ni → Se → Ti
• ENTJ: Te → Ni → Se → Fi

Giá trị của bảng nằm ở vai trò tương hỗ, không phải ở một ranking điểm số bắt buộc trong thực tế.`
  },
  {
    heading: "9. Function Stack và điểm số chức năng khác nhau như thế nào?",
    content: `Function stack là cấu trúc lý thuyết nói về vai trò giả định của các process trong một type.
Điểm số chức năng là kết quả đo lường thực tế từ bài đánh giá (assessment), phản ánh mức độ nhất quán của câu trả lời.

Một người có điểm số: Fi 84 · Ne 79 · Ni 73 · Ti 69 · Si 64 · Fe 55 · Te 48 · Se 42.
Thứ tự thực tế là Fi > Ne > Ni > Ti > Si > Fe > Te > Se. Dù không xếp đúng từng bậc Fi–Ne–Si–Te như sách giáo khoa, mô hình gần nhất vẫn là INFP. Stack giải thích vai trò lý thuyết; Assessment quan sát phân bổ thực tế.`
  },
  {
    heading: "10. Vì sao kết quả thực tế không nhất thiết khớp hoàn toàn với function stack?",
    content: `Một con người không sống trong điều kiện phòng thí nghiệm. Giáo dục, nghề nghiệp, gia đình, văn hóa, môi trường sống và quá trình rèn luyện kỹ năng đều thúc đẩy một số chức năng phát triển mạnh hơn thông thường.

Một INFP làm quản lý nhiều năm có thể rèn luyện Te rất sắc sảo. Một ENTP làm nghiên cứu có thể dành thời gian khổng lồ cho phân tích sâu. Một questionnaire chỉ quan sát mẫu phản hồi, không phải bản chụp trực tiếp cấu trúc não bộ.`
  },
  {
    heading: "11. Vì sao hai người cùng một kiểu MBTI vẫn có thể rất khác nhau?",
    content: `Một kiểu MBTI không phải là một khuôn đúc nhân bản.
Hai người cùng là ENTP có thể khác nhau sâu sắc về trí tuệ, sở thích, tính khí, môi trường văn hóa, đạo đức và mức độ trưởng thành.
Dominant function không tạo ra một tập hành vi duy nhất. Ne có thể biểu hiện qua nghiên cứu khoa học, viết lách, kinh doanh hoặc giải quyết vấn đề đời sống. Type mô tả mô hình ưu tiên nhận thức, không mô tả toàn bộ con người.`
  },
  {
    heading: "12. Sở thích nhận thức không đồng nghĩa với khả năng",
    content: `Thinking không có nghĩa thông minh hơn Feeling. Intuition không có nghĩa sáng tạo hơn Sensing. Extraversion không có nghĩa giao tiếp giỏi hơn Introversion. Judging không có nghĩa tổ chức tốt hơn Perceiving.

Myers-Briggs phân biệt rõ giữa personality preference với bài kiểm tra năng lực (skill/ability). Có Ti không chứng minh khả năng logic cao; có Fe không đảm bảo luôn đồng cảm tốt. Function cung cấp giả thuyết về cách tâm trí định hướng, không phải chứng chỉ năng lực.`
  },
  {
    heading: "13. Bốn chữ cái không phải bốn tỷ lệ phần trăm",
    content: `Các bài quiz hiển thị "72% Introvert · 65% Intuitive" thường gây hiểu lầm rằng tính cách là một bình chất lỏng bị chia phần trăm. Điểm số phản ánh mức độ nhất quán của câu trả lời, không phải tỷ lệ sở hữu preference. Một khác biệt nhỏ quanh ranh giới không tạo ra hai con người tách biệt hoàn toàn.`
  },
  {
    heading: "14. Kiểu phù hợp nhất (Best-Fit Type) thay vì danh tính tuyệt đối",
    content: `Trong thực hành Myers-Briggs chính thống, công cụ trắc nghiệm chỉ đưa ra kiểu được báo cáo (Reported Type). Người làm bài luôn được khuyến khích tìm hiểu và tự xác định kiểu phù hợp nhất (Best-fit Type) với chính mình. Kết quả là một gợi ý có điều kiện để tự chiêm nghiệm, không phải bản án cố định.`
  },
  {
    heading: "15. Sự phát triển của kiểu tính cách theo thời gian",
    content: `Type dynamics là một hành trình phát triển diễn ra suốt cuộc đời:
- Thời trẻ: Dominant phát triển nổi bật, Auxiliary dần mang lại sự cân bằng.
- Trưởng thành và trung niên: Tertiary và Inferior trở nên dễ tiếp cận hơn.
Phát triển tính cách không phải là trở nên bớt giống type của mình, mà là mở rộng vốn nhận thức, học cách sử dụng các chức năng khác khi hoàn cảnh yêu cầu.`
  },
  {
    heading: "16. Giới hạn của mô hình MBTI",
    content: `MBTI tập trung vào preference, perception, judgment và type dynamics. Nó không mô tả đầy đủ mức độ ổn định cảm xúc, trí tuệ, chấn thương, động lực nội tâm hay đạo đức. Tám chức năng nhận thức là khung thuật ngữ hữu ích để diễn giải trải nghiệm, không phải tám phân khu giải phẫu thần kinh độc lập trong não.`
  },
  {
    heading: "17. MBTI dưới góc nhìn lý thuyết và nghiên cứu",
    content: `Nghiên cứu của McCrae & Costa (1989) so sánh MBTI với Five-Factor Model cho thấy dữ liệu tâm lý phù hợp hơn với các chiều kích liên tục thay vì các phân loại nhị phân cứng nhắc.
MBTI vẫn duy trì giá trị to lớn như một ngôn ngữ hữu ích để tự phản tư về cách chú ý, tiếp nhận thông tin và ra quyết định trong đời sống.`
  },
  {
    heading: "18. MBTI không thể cho bạn biết điều gì?",
    content: `MBTI không thể quyết định trí thông minh, khả năng thành công, hay định đoạt một mối quan hệ chắc chắn bền vững hay thất bại.
Đặc biệt, MBTI không bao giờ là lời bào chữa cho hành vi tiêu cực ("Tôi là Ti nên tôi không cần lịch sự"). Mô hình personality hữu ích khi mở rộng tự nhận thức, và trở nên tai hại khi biến thành chiếc cớ biện minh.`
  },
  {
    heading: "19. Mosaic diễn giải MBTI như thế nào?",
    content: `Quy trình diễn giải tại Mosaic:
Câu trả lời → Điểm 8 chức năng nhận thức → Cấu trúc hồ sơ cá nhân → So sánh với 16 cấu trúc mẫu tham chiếu → Đánh giá độ tương thích → Gợi ý kiểu phù hợp nhất (Best-fit Type).

Mosaic luôn hiển thị song song cấu trúc lý thuyết (Reference Stack) bên cạnh hồ sơ phân bổ thực tế của bạn để tôn vinh sự độc bản của mỗi cá nhân.`
  },
  {
    heading: "20. Một kiểu tính cách là một mô hình, không phải một chiếc hộp",
    content: `Hãy xem 16 type như 16 chòm sao dẫn đường. Chòm sao giúp ta định hình bầu trời, nhưng các vì sao không biến mất chỉ vì chúng không nằm trên những đường nối do con người vẽ.
Câu hỏi cốt lõi của Mosaic không phải: "Bạn thuộc chiếc hộp nào?", mà là: "Pattern nào giúp bạn hiểu thêm về cách mình tiếp nhận thông tin và đưa ra phán đoán?".`
  },
  {
    heading: "Tài liệu tham khảo",
    content: `1. C. G. Jung — Psychological Types, Chương X: General Description of the Types.
2. Myers & Briggs Foundation — The MBTI Preferences & Type Dynamics: Overview.
3. Myers & Briggs Foundation — The Processes of Type Dynamics & Best-Fit Type.
4. McCrae, R. R., & Costa, P. T. Jr. (1989) — Reinterpreting the Myers-Briggs Type Indicator From the Perspective of the Five-Factor Model of Personality. Journal of Personality, 57(1), 17–40.
5. Myers & Briggs Foundation — MBTI Code of Ethics.`
  }
];

export const mbtiData: Record<string, MbtiTypeData> = {
  OVERVIEW: {
    title: "MBTI & Chức năng nhận thức (Tổng quan lý thuyết)",
    sections: masterOverviewSections
  },
  THEORY: {
    title: "MBTI & Chức năng nhận thức (Hệ thống lý thuyết)",
    sections: masterOverviewSections
  },
  MBTI: {
    title: "MBTI & Chức năng nhận thức",
    sections: masterOverviewSections
  },

  // ==========================================
  // 1. INTJ — NHÀ CHIẾN LƯỢC
  // ==========================================
  INTJ: {
    title: "INTJ — Nhà Chiến Lược (Architect)",
    sections: [
      {
        heading: "1. INTJ trong hệ thống MBTI",
        content: `INTJ là một trong 16 kiểu của hệ Myers-Briggs, được tạo bởi bốn preference: Introversion (I), Intuition (N), Thinking (T) và Judging (J). Tuy nhiên, Mosaic không xem INTJ như một danh sách tính từ cố định kiểu “hướng nội, thông minh, lạnh lùng, có kế hoạch”. Một cách đọc hữu ích hơn là xem INTJ như một mẫu tham chiếu về cách perception và judgment có thể được tổ chức.

Trong type dynamics, INTJ thường được biểu diễn bằng reference stack:
Ni → Te → Fi → Se

Ni được đặt ở vị trí dominant, Te ở auxiliary, Fi ở tertiary và Se ở inferior. Myers & Briggs Foundation mô tả dominant là process được một type có xu hướng dựa vào nhiều nhất, auxiliary đóng vai trò cân bằng, còn tertiary và inferior thường ít conscious hơn. Foundation cũng lưu ý orientation của tertiary vẫn là chủ đề có nhiều cách diễn giải, vì vậy Mosaic sử dụng stack bốn chức năng như một reference model, không phải cấu trúc sinh học bất biến.`
      },
      {
        heading: "2. Nhóm màu: Analysts",
        content: `Phân loại bốn màu mà nhiều người quen thuộc từ 16Personalities được gọi là Roles. Hệ này chia 16 type thành bốn nhóm: Analysts, Diplomats, Sentinels và Explorers. Analysts gồm INTJ, INTP, ENTJ và ENTP, tức bốn type cùng có N và T. Đây là taxonomy riêng của 16Personalities, không phải một tầng gốc của MBTI hay lý thuyết Jung.

Trong Mosaic, nhãn Analyst có thể được dùng để tổ chức thư viện và tạo nhận diện trực quan, nhưng không nên hiểu thành “INTJ chắc chắn là người phân tích giỏi”. Role chỉ gom một số type theo đặc điểm chung của framework đó; cá nhân cụ thể vẫn có thể khác stereotype của nhóm rất nhiều.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Ni chủ đạo — hội tụ về một pattern:
Introverted Intuition gom nhiều tín hiệu rời rạc thành một interpretation tương đối thống nhất. Với reference INTJ, Ni đặt trọng tâm vào underlying pattern, trajectory và câu hỏi “những điều này đang dẫn tới đâu?”. Một INTJ có thể vì thế quan tâm tới cấu trúc phía sau sự kiện hơn là chỉ từng event riêng lẻ. Ni không phải tiên tri; một conclusion mạnh vẫn có thể sai nếu thiếu dữ kiện đầu vào hoặc quá gắn với narrative cũ.

• Te hỗ trợ — đưa pattern ra ngoài thực tế:
Nếu Ni tạo direction, Te hỏi direction đó có thể được tổ chức và thực thi như thế nào qua external structure, criteria, procedure, efficiency và observable result. Cặp Ni–Te vận hành theo chu trình: pattern → direction → structure → execution.

• Fi thứ ba — giá trị cá nhân:
Fi bổ sung một lớp judgment mang tính internal valuation. Một giải pháp có thể hiệu quả về Te nhưng vẫn bị từ chối nếu nó xung đột với điều người đó thực sự coi trọng. Quyết định nhìn rất “lý trí” từ ngoài vẫn có thể chứa giới hạn Fi rất rõ: “Tôi không muốn đạt mục tiêu bằng cách này.”

• Se yếu — dữ liệu của hiện tại:
Se đặt attention vào concrete reality đang diễn ra. Trong reference pattern INTJ, Se đối diện Ni: một bên nén reality thành interpretation; bên kia yêu cầu quay lại với thứ thực sự đang tồn tại trước mắt, nhắc nhở mô hình chỉ hữu ích khi cập nhật được dữ liệu hiện tại.`
      },
      {
        heading: "4. Dynamic tổng thể của INTJ",
        content: `Cách đọc hữu ích nhất là nhìn cách các chức năng hỗ trợ và sửa nhau:
Ni đưa ra một direction. Te thử biến direction thành architecture. Fi đặt câu hỏi về alignment cá nhân. Se kiểm tra model với reality.

Một INTJ phát triển tốt không phải người “Ni càng nhiều càng tốt”. Nếu Ni hoàn toàn lấn át, người đó có thể ngày càng chắc chắn về một interpretation mà không còn kiểm tra nó. Te và Se giúp model quay trở lại với evidence.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Một INTJ cân bằng có khả năng giữ long-term direction nhưng vẫn update khi điều kiện thay đổi. Họ thích structure nhưng không đồng nghĩa rigid. Họ đặt logic lên cao mà vẫn có personal values rất rõ ràng.

Điểm mạnh tiềm năng của pattern này nằm ở việc nối conceptual direction với external implementation. Một idea không chỉ cần thú vị; nó cần một structure để tồn tại trong thực tế.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Ni có thể trở thành tunnel vision: dữ kiện mới được diễn giải sao cho phù hợp với theory cũ.
• Te có thể trở thành over-optimization: thứ gì không dễ đo hoặc không phục vụ goal bị xem là không quan trọng.
• Fi có thể xuất hiện dưới dạng rigid personal judgment nếu không được phản tư.
• Se có thể bị bỏ qua cho đến khi reality buộc người đó phải phản ứng với những chi tiết trước đó không được chú ý.

Myers & Briggs Foundation mô tả exaggerated Ni theo hướng chỉ tiếp nhận dữ liệu hỗ trợ theory và inferior Se trở nên khó kiểm soát hơn dưới stress.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `INTJ có thể thích những môi trường cho phép xây model, hiểu system, thiết kế framework hoặc làm việc với vấn đề dài hạn. Nhưng điều này không tạo ra một danh sách nghề “dành riêng cho INTJ”.

Một INTJ có thể làm research, engineering, design, medicine, business, art, education hoặc bất kỳ lĩnh vực nào phù hợp với năng lực và hoàn cảnh. Official MBTI nhấn mạnh rằng type không dự đoán intelligence, ability hay success và không nên dùng để hạn chế lựa chọn nghề nghiệp.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Stereotype phổ biến biến INTJ thành người lạnh lùng hoặc không cần người khác. Type dynamics không hỗ trợ kết luận đơn giản như vậy.

Ni–Te có thể khiến một số người thích communication có direction rõ, còn Fi có thể khiến những relationship thật sự quan trọng mang tính rất riêng tư và sâu sắc. Mức độ warmth, affection hay social skill không thể suy ra trực tiếp từ bốn chữ cái.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• “INTJ luôn có kế hoạch cho mọi thứ” là quá đơn giản hóa.
• “INTJ không có cảm xúc” là sai lầm hoàn toàn (Fi đóng vai trò giữ gìn giá trị sâu kín).
• “INTJ thông minh hơn các type khác” càng không phải claim của MBTI.

Type mô tả preference pattern, không phải intelligence profile hoặc character assessment.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `Phát triển không có nghĩa cố trở nên “INTJ hơn”. Một hướng trưởng thành là:
• Để Ni tạo direction nhưng cho Te kiểm chứng.
• Để Fi nhận diện personal value mà không đóng kín vào nó.
• Để Se tiếp tục đưa dữ liệu mới vào model.

Một system tốt không chỉ elegant; nó phải còn đứng vững khi gặp reality.`
      },
      {
        heading: "11. Mosaic diễn giải INTJ như thế nào?",
        content: `Mosaic không tìm INTJ bằng stereotype “thích planning” hay “không thích small talk”. Hệ thống trước hết quan sát profile của tám cognitive functions rồi so sánh toàn bộ pattern đó với những reference stack khác nhau.

Nếu INTJ có compatibility cao nhất, cách đọc phù hợp là: “INTJ hiện là mẫu tham chiếu gần nhất với hồ sơ chức năng của bạn”, không phải “Bạn phải là INTJ và mọi đặc điểm INTJ đều áp dụng cho bạn”.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics: Overview; The Processes of Type Dynamics; Verification of Best-Fit Type; MBTI Code of Ethics.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 2. INTP — NHÀ TƯ DUY
  // ==========================================
  INTP: {
    title: "INTP — Nhà Tư Duy (Logician)",
    sections: [
      {
        heading: "1. INTP trong hệ thống MBTI",
        content: `INTP kết hợp Introversion, Intuition, Thinking và Perceiving. Trong cách đọc đơn giản, bốn chữ này dễ bị biến thành hình ảnh “người hướng nội thích logic và lý thuyết”. Nhưng Mosaic tiếp cận INTP từ structure của type dynamics thay vì stereotype hành vi.

Reference stack thường dùng là:
Ti → Ne → Si → Fe

Trong đó Ti là dominant, Ne là auxiliary, Si là tertiary theo convention stack phổ biến và Fe là inferior. Stack này nên được hiểu như một reference architecture hơn là thứ tự strength bắt buộc.`
      },
      {
        heading: "2. Nhóm màu: Analysts",
        content: `Trong hệ Roles của 16Personalities, INTP thuộc Analysts cùng INTJ, ENTJ và ENTP. Shared traits của nhóm này là N và T. Đây là hệ phân loại của 16Personalities, không phải một bộ phận chính thức trong MBTI.

Mosaic dùng Analyst như nhãn điều hướng, nhưng không suy ra rằng INTP phải giỏi toán, thích science hay có intelligence cao.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Ti chủ đạo — xây consistency bên trong:
Introverted Thinking hướng judgment vào một internal framework. Thay vì chỉ hỏi một phương án có hiệu quả không, Ti muốn biết nó có thực sự hợp lý không, tại sao nó đúng, và liệu definition hay assumption bên dưới có coherent không. Ti liên quan tới việc tách vấn đề thành phần nhỏ, refine concept và tìm contradiction.

• Ne hỗ trợ — mở model ra nhiều khả năng:
Ne mở internal system ra bằng alternative interpretation, hypothetical scenario và connection mới. Một claim được đưa vào nhiều context, so sánh với nhiều possible explanation. Cặp Ti–Ne tạo chu trình: phân tích → mở khả năng → thử logic → chỉnh model.

• Si thứ ba — reference từ experience:
Si cung cấp continuity: knowledge cũ, những chi tiết từng quan sát và cách một problem từng được giải quyết trở thành internal reference, giúp Ti–Ne không phải phát minh lại mọi thứ từ đầu.

• Fe yếu — context giữa người với người:
Fe đưa vào những information mà pure analysis có thể bỏ qua: người khác sẽ hiểu conclusion thế nào, conversation đang tạo tác động gì và điều gì đang được valued trong shared context. Inferior Fe không đồng nghĩa thiếu empathy hay không có cảm xúc.`
      },
      {
        heading: "4. Dynamic tổng thể của INTP",
        content: `Ti cố đạt conceptual precision. Ne ngăn precision biến thành rigidity bằng cách liên tục đưa thêm alternative. Si giữ continuity giữa analysis hiện tại và experience cũ. Fe nối reasoning với external human context.

Điểm đặc biệt của reference INTP không nằm ở “logic” nói chung — tất cả type đều reasoning — mà nằm ở internal analytical judgment được hỗ trợ bởi divergent perception.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Ti tạo một model rõ ràng mà không cần hoàn thiện vô hạn. Ne tạo possibility nhưng biết khi nào một option đã đủ mạnh để đem ra thử nghiệm. Si cho phép tích lũy chuyên môn sâu. Fe giúp ideas trở nên communicable và relevant với người khác.

Một INTP cân bằng không cần chọn giữa “logic” và “con người”; hai tầng nhận thức này có thể nâng đỡ lẫn nhau.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Ti có thể biến precision thành endless qualification: luôn còn một exception khác cần xem xét.
• Ne có thể liên tục tạo branch mới khiến conclusion không bao giờ đủ final.
• Si có thể giữ một internal precedent quá lâu.
• Fe có thể chỉ được chú ý khi social feedback đã trở thành vấn đề lớn.

Official type-dynamics material mô tả exaggerated Ti như quá detached hoặc mắc kẹt trong tìm kiếm truth tuyệt đối.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `INTP có thể thích môi trường cho phép hiểu principle, question assumption và xây model. Nhưng việc đó có thể xảy ra trong programming, design, medicine, history, law, philosophy hay bất kỳ domain nào.

“INTP = coder” là stereotype, không phải type theory. Type không đo lường skill hay success và không quyết định nghề nghiệp.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Ti có thể khiến nội dung argument được ưu tiên hơn cách nó được truyền đạt. Nhưng một INTP có Fe phát triển tốt hoàn toàn có thể giao tiếp tinh tế và thấu cảm.

Một người cùng type có thể rất reserved, trong khi người khác nói nhiều khi gặp chủ đề quan tâm. Introversion không đồng nghĩa với shyness.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• INTP không phải “robot logic”.
• Ti không phải là chỉ số IQ.
• Ne không đồng nghĩa với thiếu tập trung.
• Fe inferior không đồng nghĩa với vô tâm.
• Một INTP có tính tổ chức cao hoàn toàn bình thường; organization là skill có thể rèn luyện.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `INTP phát triển bằng cách biết lúc nào model đã đủ để đem ra thử nghiệm thực tế.
• Ne cần external feedback chứ không chỉ thêm possibility.
• Si giúp tích lũy thay vì phân tán.
• Fe giúp insight trở thành một phần của communication thay vì chỉ đúng ở trong đầu.`
      },
      {
        heading: "11. Mosaic diễn giải INTP như thế nào?",
        content: `Mosaic không kiểm tra xem người dùng có “thích tranh luận logic” hay không. Hệ thống xem toàn bộ function profile và so nó với Ti–Ne reference architecture.

Một người có Ti, Ne và Ni đều cao vẫn có thể có INTP là best-fit nếu tổng thể pattern tương thích nhất với INTP. Best-fit là giả thuyết tham chiếu để tự phản tư, không phải danh tính tuyệt đối.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics: Overview; The Processes of Type Dynamics; Verification of Best-Fit Type.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 3. ENTJ — NHÀ ĐIỀU HÀNH
  // ==========================================
  ENTJ: {
    title: "ENTJ — Nhà Điều Hành (Commander)",
    sections: [
      {
        heading: "1. ENTJ trong hệ thống MBTI",
        content: `ENTJ gồm Extraversion, Intuition, Thinking và Judging. Trong văn hóa Internet, type này thường bị thu gọn thành hình ảnh “CEO”, “commander” hoặc “người lãnh đạo bẩm sinh”. Mosaic tránh cách đọc đó.

Reference function stack phổ biến của ENTJ là:
Te → Ni → Se → Fi

Điều quan trọng không phải ENTJ “có Te cao” mà là mô hình đặt Te ở vị trí dominant và Ni làm auxiliary.`
      },
      {
        heading: "2. Nhóm màu: Analysts",
        content: `ENTJ thuộc Analysts trong hệ Roles của 16Personalities, cùng INTJ, INTP và ENTP với shared traits N–T. Đây là taxonomy riêng của 16Personalities chứ không phải component của official MBTI.

Vì vậy “Analyst” không có nghĩa ENTJ phải rational hơn các type khác trong mọi tình huống.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Te chủ đạo — tổ chức external reality:
Te là judging process hướng ra ngoài, quan tâm tới goal, criterion, procedure, resource và observable outcome. Vấn đề được nhìn như thứ có thể chia tách thành phần việc, trách nhiệm và trình tự. Te không đồng nghĩa bossiness; một người Te mạnh vẫn có thể nhẹ nhàng hoặc không hề hứng thú với việc làm sếp.

• Ni hỗ trợ — xác định direction:
Ni giúp Te không chỉ tối ưu cái đang tồn tại mà còn đặt câu hỏi hệ thống này đang hướng tới đâu. Te giỏi execution; Ni quyết định execution nào đáng đầu tư. Cặp Te–Ni là sự kết hợp giữa strategic direction và external organization.

• Se thứ ba — đọc conditions hiện tại:
Se giúp pattern không bị tách khỏi reality. Data mới, opportunity mới và constraint mới có thể thay đổi cách một plan được thực hiện trong thực tế.

• Fi yếu — giá trị cá nhân:
Fi là đối cực của Te, liên quan tới personal alignment, internal value và câu hỏi: “Kết quả này có thực sự đáng giá đối với tôi?”. Inferior Fi không có nghĩa thiếu đạo đức hay vô cảm.`
      },
      {
        heading: "4. Dynamic tổng thể của ENTJ",
        content: `Te muốn move things. Ni muốn move chúng theo một direction có coherence. Se cập nhật conditions. Fi giữ một tầng inner value mà pure efficiency không thể thay thế.

Sự trưởng thành của pattern này không nằm ở việc tăng tốc liên tục mà ở khả năng phân biệt điều gì có thể làm với điều gì đáng làm.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Te tạo clarity mà không biến con người thành công cụ. Ni giữ long-term direction nhưng vẫn cho phép strategy thay đổi linh hoạt. Se cập nhật reality kịp thời. Fi giúp objective vẫn gắn liền với giá trị con người.

Một ENTJ cân bằng có thể rất decisive nhưng không độc đoán, bảo thủ.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Te có thể over-optimize: thứ gì không đo lường được bằng số liệu bị xem là không quan trọng.
• Ni có thể biến vision thành sự áp đặt chủ quan.
• Se có thể chạy theo cơ hội ngắn hạn khi plan bị stress.
• Fi có thể xuất hiện dưới dạng tự ái cá nhân hoặc sự phòng thủ ngầm.

Official MBTI mô tả overused Te như quá lạnh lùng, tách biệt hoặc phê phán logic của người khác.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `ENTJ có thể thích domain nơi họ được tổ chức hệ thống hoặc giải quyết objective phức tạp. Nhưng họ không có “nghề định mệnh”.

Một ENTJ có thể là filmmaker, physician, researcher, teacher, entrepreneur hoặc nhân viên chuyên môn không hề muốn quản lý ai. MBTI không dự đoán success hoặc leadership ability.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Te có thể tạo communication tương đối direct, nhưng directness vẫn chịu ảnh hưởng bởi văn hóa và kỹ năng xã hội.

Ni và Fi cũng có thể khiến một số ENTJ chọn lọc mối quan hệ có chủ ý, coi trọng sự nhất quán và tin cậy lâu dài hơn số lượng bạn bè xã giao.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• “ENTJ sinh ra để làm lãnh đạo” là định kiến sai lầm.
• “ENTJ không có cảm xúc” là ngụy biện.
• Te là orientation của phán đoán, không phải thứ bậc quyền lực xã hội. Leadership là tập hợp kỹ năng và vai trò cần học hỏi.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Te cần các tiêu chuẩn vượt ra ngoài tính hiệu quả cơ học.
• Ni cần Se để kiểm chứng dữ kiện đời thực.
• Fi cần được xem như nguồn thông tin cảm xúc quý giá, không phải sự gián đoạn phiền toái.

Một hệ thống tốt không chỉ hoàn thành mục tiêu, mà còn trả lời được mục tiêu đó phục vụ cho điều gì.`
      },
      {
        heading: "11. Mosaic diễn giải ENTJ như thế nào?",
        content: `Mosaic không gán ENTJ cho người trả lời “tôi thích lãnh đạo”. Một người không thích quản lý người khác vẫn có thể có Te–Ni profile rất rõ nét.

Mosaic so sánh kiến trúc chức năng, giữ lại các type lân cận và trình bày ENTJ như mẫu tham chiếu phù hợp nhất nếu hồ sơ có độ tương thích cao nhất.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics; Best-Fit Type; Code of Ethics.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 4. ENTP — NHÀ PHÁT MINH
  // ==========================================
  ENTP: {
    title: "ENTP — Nhà Phát Minh (Debater)",
    sections: [
      {
        heading: "1. ENTP trong hệ thống MBTI",
        content: `ENTP kết hợp Extraversion, Intuition, Thinking và Perceiving. Một stereotype đặc biệt phổ biến là “Debater”: thích tranh luận, phá luật và luôn có câu phản biện. Đó chỉ là một biểu hiện hành vi có thể xảy ra.

Reference stack phổ biến là:
Ne → Ti → Fe → Si`
      },
      {
        heading: "2. Nhóm màu: Analysts",
        content: `ENTP thuộc nhóm Analysts của 16Personalities cùng INTJ, INTP và ENTJ dựa trên hai đặc tính chung N và T. Role này không thuộc official MBTI.

Mosaic dùng nhãn này như layer phân loại thư viện chứ không dùng nó để mặc định ENTP thích tranh cãi hoặc luôn hành xử “logic”.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Ne chủ đạo — mở possibility:
Extraverted Intuition nhìn một kích thích và nhanh chóng thấy thêm connections, interpretations hoặc directions mới. Một idea không nhất thiết được đưa ra vì ENTP tin nó đúng tuyệt đối, mà vì nó đáng được thử nghiệm. Ne khiến hiện tại trở thành điểm mở đầu hơn là điểm kết thúc.

• Ti hỗ trợ — kiểm tra coherence:
Ti chọn lọc những possibility mà Ne tạo ra. Một ý tưởng thú vị chưa đủ; nó phải đứng vững khi logic được giải phẫu: definition là gì, assumption nào đang được dùng và kết luận có rút ra từ tiền đề không.

• Fe thứ ba — reading social field:
Fe thêm nhận thức về bối cảnh con người: một luận điểm không tồn tại trong chân không mà được nói với ai đó, ở thời điểm cụ thể và tạo tác động cụ thể. Tertiary Fe giúp một số ENTP điều chỉnh giao tiếp khéo léo.

• Si yếu — continuity và precedent:
Si cung cấp tham chiếu từ những gì đã xảy ra trước đó. Ne thích điều có thể trở thành; Si nhắc rằng kinh nghiệm cũ cũng chứa đựng dữ liệu quý báu.`
      },
      {
        heading: "4. Dynamic tổng thể của ENTP",
        content: `Ne tạo branch. Ti tỉa bớt những branch yếu. Fe giúp idea di chuyển mượt mà qua các cuộc trò chuyện. Si giữ bối cảnh lịch sử và kinh nghiệm tích lũy.

Một ENTP phát triển tốt không chỉ có nhiều ý tưởng, mà biết ý tưởng nào thực sự đáng giữ lại và triển khai.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Ne vẫn cởi mở nhưng không cần mở mọi cánh cửa cùng lúc. Ti vẫn hoài nghi phản biện nhưng không biến mọi cuộc trò chuyện thành vũ đài tranh luận. Fe giúp nhận ra khi nào trò chơi trí tuệ đang gây tổn thương người khác. Si giúp tích lũy chuyên môn và tránh lặp lại sai lầm cũ.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Ne có thể bị ngợp trong vô số khả năng không hồi kết.
• Ti có thể liên tục thách thức đến mức không phương án nào đủ tốt để bắt đầu.
• Fe có thể bị sử dụng một cách quá toan tính, thao túng.
• Si có thể bị xem nhẹ chỉ vì sự quen thuộc không còn mang lại cảm giác phấn khích.

Foundation mô tả exaggerated Ne là bị choáng ngợp bởi các lựa chọn hoặc thay đổi chỉ vì muốn thay đổi.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `ENTP có thể hứng thú với open-ended problem, experimentation và môi trường nơi các giả định cũ bị thách thức.

Nhưng không phải ENTP nào cũng là doanh nhân hay luật sư. Một ENTP hoàn toàn có thể thích làm việc theo quy trình nếu quy trình đó phục vụ cho mục tiêu lớn mà họ đam mê.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `“ENTP thích cãi nhau” là stereotype nghèo nàn thông tin. Một số ENTP tận hưởng các cuộc trao đổi tri thức; số khác thể hiện Ne–Ti qua nghiên cứu, viết lách hoặc suy tưởng riêng tư.

Tần suất tranh luận không phải là tiêu chí đánh giá kiểu tính cách.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• ENTP không đồng nghĩa với kẻ thích chọc phá (troll) hay hỗn loạn.
• Ne không đồng nghĩa với chứng rối loạn giảm chú ý (ADHD).
• Ne mô tả phương thức tiếp nhận hướng tới tiềm năng, không phải chẩn đoán tâm thần hay thước đo độ trưởng thành.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Ne cần sự cam kết đủ lâu để tiềm năng biến thành sản phẩm hoàn chỉnh.
• Ti cần dữ liệu và bằng chứng khách quan bên ngoài.
• Fe giúp tự do trí tuệ cùng tồn tại hài hòa với sự thấu cảm xã hội.
• Si giúp kinh nghiệm quá khứ thực sự được kế thừa.`
      },
      {
        heading: "11. Mosaic diễn giải ENTP như thế nào?",
        content: `Mosaic không hỏi người dùng có thích tranh luận hay không. Hệ thống quan sát kiến trúc Ne–Ti và sự cân bằng của toàn bộ hồ sơ 8 chức năng.

Một ENTP có Si khá cao hoặc Fe phát triển tốt vẫn hoàn toàn phù hợp với mẫu tham chiếu ENTP.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics; Best-Fit Type.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 5. INFJ — NGƯỜI CỐ VẤN
  // ==========================================
  INFJ: {
    title: "INFJ — Người Cố Vấn (Advocate)",
    sections: [
      {
        heading: "1. INFJ trong hệ thống MBTI",
        content: `INFJ kết hợp Introversion, Intuition, Feeling và Judging. Internet thường bao quanh type này bằng các stereotype như “hiếm”, “huyền bí”, “thấu thị lòng người” hoặc “empath”. Mosaic không dựa vào những nhận định thần thánh hóa đó.

Reference stack phổ biến:
Ni → Fe → Ti → Se`
      },
      {
        heading: "2. Nhóm màu: Diplomats",
        content: `Trong hệ Roles của 16Personalities, INFJ cùng INFP, ENFJ và ENFP tạo thành nhóm Diplomats với shared traits N và F. Đây là taxonomy riêng của 16Personalities, không phải phân loại chính thức của MBTI.

Mosaic dùng “Diplomat” làm nhãn màu và điều hướng, nhưng không biến nó thành khẳng định rằng INFJ tự động có lòng trắc ẩn cao hay giỏi hòa giải.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Ni chủ đạo — underlying pattern:
Ni có xu hướng hội tụ nhiều mảnh ghép rời rạc thành một diễn giải hoặc xu hướng vận động thống nhất. Attention của INFJ nghiêng về ý nghĩa, biểu tượng và câu hỏi: “Điều này thực sự đang trở thành điều gì?”. Tuy nhiên, trực giác Ni vẫn là một cách giải thích, không phải khả năng đọc ý nghĩ của người khác.

• Fe hỗ trợ — relational field:
Fe đưa Ni ra bối cảnh con người bên ngoài: người khác đang trải nghiệm điều gì, kỳ vọng nào đang vận hành và thông điệp sẽ được tiếp nhận ra sao.

• Ti thứ ba — kiểm tra logic của interpretation:
Ti giúp INFJ không chỉ cả tin vào ấn tượng trực giác Ni–Fe, mà tự đặt câu hỏi: “Bằng chứng là gì? Có giả định sai lầm nào không? Còn cách giải thích nào khác hợp lý hơn không?”.

• Se yếu — reality hiện tại:
Se đối diện với Ni, đưa sự chú ý trở về với bằng chứng cụ thể và dữ liệu thực tế đang hiện diện trước mắt.`
      },
      {
        heading: "4. Dynamic tổng thể của INFJ",
        content: `Ni hình thành ý nghĩa. Fe kết nối ý nghĩa với con người. Ti kiểm tra tính nhất quán logic. Se kiểm tra dữ liệu thực tế.

Reference INFJ vì vậy không chỉ là “trực giác + đồng cảm”, mà chứa đựng nhu cầu phản tư phê phán (critical checking) và neo đậu vào thực tại.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Ni tạo ra cái nhìn sâu sắc nhưng không tự phong nó thành chân lý tuyệt đối. Fe thấu cảm hoàn cảnh mà không quyết định thay người khác. Ti kiểm tra diễn giải. Se giữ liên lạc chặt chẽ với thực tại hiện tại.

Một INFJ cân bằng có thể giữ vững góc nhìn sâu sắc nhưng vẫn khiêm tốn nói: “Đây là cách tôi đang hiểu sự việc, không chắc đó là sự thật duy nhất.”`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Ni có thể dựng nên câu chuyện khép kín, áp đặt định kiến.
• Fe có thể quá bận tâm đến hòa khí bề mặt hoặc kỳ vọng của người khác.
• Ti có thể biến thành sự phân tích quá đà trong cô lập.
• Se có thể bị bỏ qua cho tới khi các chi tiết thực tế bên ngoài bùng nổ thành khủng hoảng.

Sự tự tin vào trực giác không đồng nghĩa với tính chính xác của trực giác.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `INFJ có thể thích công việc có chiều sâu ý nghĩa hoặc tác động nhân văn, nhưng đây không phải khuôn mẫu nghề nghiệp bắt buộc.

Một INFJ có thể là kỹ sư, nhà thiết kế, nhà khoa học, nhà văn, chuyên gia tâm lý hay bất kỳ nghề nghiệp nào khác.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Fe hỗ trợ giúp bối cảnh xã hội được quan sát tinh tế, nhưng Introversion chủ đạo vẫn khiến phần lớn quá trình xử lý diễn ra rất riêng tư.

Một INFJ có thể rất cởi mở, bộc trực; một người khác cùng kiểu lại có thể rất kín đáo, dè dặt.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• INFJ không phải nhà ngoại cảm.
• Ni không nhìn thấy trước tương lai.
• Fe không đảm bảo luôn luôn biết đồng cảm đúng cách.
• “Kiểu hiếm nhất” không đồng nghĩa với kiểu ưu việt hơn. Official MBTI khẳng định không kiểu nào tốt hơn kiểu nào.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Ni cần Se để kiểm tra thực tế (reality-check).
• Fe cần ranh giới cá nhân lành mạnh.
• Ti giúp chất vấn và gạn lọc các giả định.

Một trực giác trưởng thành không chỉ sâu sắc, mà còn có khả năng đứng vững trước các phản biện thực chứng.`
      },
      {
        heading: "11. Mosaic diễn giải INFJ như thế nào?",
        content: `Mosaic tìm kiếm mô hình tương thích với cấu trúc Ni–Fe chứ không tìm người tự nhận là “empath”.

Nếu một hồ sơ có Ni mạnh, Fe rõ ràng nhưng Ti hoặc Fi cũng cao, Mosaic giữ nguyên tính chân thực phức tạp đó thay vì ép vào một khuôn mẫu cứng nhắc.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics; Best-Fit Type; Is the MBTI a Test?.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 6. INFP — NGƯỜI HÒA GIẢI
  // ==========================================
  INFP: {
    title: "INFP — Người Hòa Giải (Mediator)",
    sections: [
      {
        heading: "1. INFP trong hệ thống MBTI",
        content: `INFP kết hợp Introversion, Intuition, Feeling và Perceiving. Kiểu tính cách này thường bị định kiến thành “nhạy cảm”, “mơ mộng”, “nghệ sĩ” hoặc “thiếu thực tế”. Những từ ngữ đó không mô tả đúng cấu trúc nhận thức.

Reference stack:
Fi → Ne → Si → Te`
      },
      {
        heading: "2. Nhóm màu: Diplomats",
        content: `INFP thuộc Diplomats trong hệ Roles của 16Personalities cùng INFJ, ENFJ và ENFP dựa trên N và F. Đây là taxonomy riêng của 16Personalities, không phải phần gốc của Myers-Briggs.

Mosaic sử dụng nhóm màu để tổ chức nội dung, không coi “Diplomat” là bằng chứng rằng INFP phải luôn hiền lành hay dĩ hòa vi quý.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Fi chủ đạo — internal valuation:
Fi đặt trọng tâm vào sự nhất quán nội tâm (personal congruence). Một lựa chọn không chỉ được đánh giá bằng kết quả bên ngoài, mà bằng câu hỏi liệu nó có phù hợp với điều người đó thực sự coi trọng hay không. Fi là một quá trình phán đoán giá trị, không đồng nghĩa với sự ủy mị.

• Ne hỗ trợ — mở nhiều khả năng:
Ne giúp Fi không trở thành một hệ thống khép kín. Một giá trị có thể được biểu hiện qua nhiều hình thức; một căn tính có nhiều tương lai tiềm năng; một xung đột có thể được nhìn qua nhiều lăng kính thấu cảm.

• Si thứ ba — continuity của experience:
Si lưu giữ những ấn tượng và trải nghiệm có ý nghĩa thiêng liêng, tạo sự liên tục giữa căn tính hiện tại với những bài học đã định hình nên hệ giá trị.

• Te yếu — external organization:
Te đưa giá trị nội tâm ra ngoài thành mục tiêu, kế hoạch, quy trình và kết quả cụ thể đo lường được. Inferior Te không có nghĩa INFP không có khả năng làm việc hiệu quả.`
      },
      {
        heading: "4. Dynamic tổng thể của INFP",
        content: `Fi xác định điều gì có ý nghĩa đích thực. Ne mở rộng các phương thức biểu đạt. Si giữ gìn sự kết nối quá khứ. Te dịch chuyển ý hướng thành cấu trúc hành động ngoài đời thực.

Cách hiểu này phong phú và thực tế hơn rất nhiều so với định kiến “kẻ mộng mơ nhạy cảm”.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Fi giữ vững sự chính trực mà không biến giá trị cá nhân thành luật lệ phổ quát áp đặt lên người khác. Ne mở rộng khả năng nhưng không để bản sắc bị phân tán. Si mang lại sự vững vàng từ kinh nghiệm. Te giúp lý tưởng biến thành hành động thực tế có tác động rõ rệt.

Một INFP trưởng thành vừa kiên định với hệ giá trị, vừa có khả năng hành động cực kỳ thực tế khi cần thiết.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Fi có thể tự quy chiếu quá mức: “Tôi cảm thấy sai” bị đồng nhất thành “điều đó khách quan là sai”.
• Ne có thể mở ra quá nhiều ngã rẽ khiến hành động bị tê liệt.
• Si có thể ôm giữ những tổn thương hoặc định kiến cảm xúc cũ quá lâu.
• Te có thể bộc lộ dưới dạng sự tự chỉ trích bản thân gay gắt hoặc ép mình làm việc máy móc khi chịu áp lực lớn.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `INFP có thể cần tìm thấy ý nghĩa trong công việc hơn một số người khác, nhưng “ý nghĩa” không đồng nghĩa với nghệ thuật thuần túy.

Một INFP có thể tìm thấy ý nghĩa trong kỹ thuật, y tế công cộng, tài chính, nghiên cứu khoa học hay logistics. MBTI không giới hạn nghề nghiệp của một con người.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Fi chủ đạo khiến thế giới cảm xúc của INFP rất riêng tư. Họ có thể cảm nhận một mối quan hệ vô cùng sâu sắc mà không nhất thiết biểu lộ ra ngoài bằng những cử chỉ vồ vập.

Ne giúp họ thấu hiểu nhiều góc nhìn khác nhau mà không nhất thiết phải đồng tình với tất cả.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• Fi không đồng nghĩa với việc dễ khóc hay yếu đuối.
• INFP không mặc định né tránh xung đột (khi giá trị cốt lõi bị xâm phạm, họ rất kiên cường).
• Chữ P không có nghĩa là lộn xộn, vô tổ chức.
• Chữ N không có nghĩa là thiên tài sáng tạo siêu việt.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Fi cần phản hồi từ thực tế đời sống.
• Ne cần sự chọn lọc và quyết đoán.
• Si cần cập nhật góc nhìn mới.
• Te giúp các giá trị đạo đức tạo ra thành quả cụ thể ngoài thế giới.

Trưởng thành không phải là từ bỏ tính chân thật (authenticity), mà là giúp sự chân thật đó có khả năng tồn tại vững vàng trong thực tế.`
      },
      {
        heading: "11. Mosaic diễn giải INFP như thế nào?",
        content: `Mosaic không ép hồ sơ của bạn phải khớp từng bậc Fi > Ne > Si > Te. Một người có Fi và Ne nổi trội nhưng điểm Ni hoặc Ti cũng cao vẫn có thể có INFP là mẫu tham chiếu gần nhất.

Chúng tôi hiển thị kết quả theo dạng best-fit cùng các kiểu lân cận để bạn nhìn thấy bức tranh tổng thể.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics; Verification of Best-Fit Type; Code of Ethics.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 7. ENFJ — NGƯỜI KHAI SÁNG
  // ==========================================
  ENFJ: {
    title: "ENFJ — Người Khai Sáng (Protagonist)",
    sections: [
      {
        heading: "1. ENFJ trong hệ thống MBTI",
        content: `ENFJ gồm Extraversion, Intuition, Feeling và Judging. Những mô tả đại chúng thường gọi ENFJ là “người truyền cảm hứng” hoặc “nhà lãnh đạo bẩm sinh”, nhưng những nhãn dán đó dễ biến khả năng tiềm năng thành một quy tắc cứng nhắc.

Reference stack:
Fe → Ni → Se → Ti`
      },
      {
        heading: "2. Nhóm màu: Diplomats",
        content: `ENFJ thuộc nhóm Diplomats của 16Personalities cùng INFJ, INFP và ENFP với shared traits N–F. Đây là taxonomy riêng của 16Personalities, không phải phân loại chính thức của MBTI.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Fe chủ đạo — external valuation:
Fe chú ý mạnh mẽ tới bối cảnh con người: mối quan hệ, kỳ vọng chung, giá trị văn hóa và tác động qua lại giữa mọi người. Một quyết định đúng về mặt logic vẫn được Fe hỏi thêm: “Nó sẽ được mọi người tiếp nhận ra sao?”.

• Ni hỗ trợ — tìm direction bên dưới interaction:
Ni giúp Fe nhìn ra xu hướng dài hạn: Tập thể này đang đi về đâu? Mối quan hệ này đang trở thành điều gì? Một thông điệp có hàm ý gì nếu kéo dài trong tương lai?

• Se thứ ba — đọc present context:
Se cung cấp các tín hiệu thời gian thực (real-time cues), giúp pattern Ni–Fe gắn liền với giọng điệu, thời điểm và điều kiện cụ thể bên ngoài.

• Ti yếu — internal consistency:
Ti đặt câu hỏi về tính logic của các phán đoán xã hội: Sự đồng thuận của đám đông không tự động có nghĩa là đúng; sự hòa hợp bề mặt không tự động có nghĩa là tốt.`
      },
      {
        heading: "4. Dynamic tổng thể của ENFJ",
        content: `Fe thấu hiểu con người và các mối quan hệ. Ni tìm kiếm định hướng dài hạn tiềm ẩn. Se cập nhật bối cảnh thực tế. Ti kiểm tra tính nhất quán logic.

Mô hình này tạo ra nhận thức xã hội tinh tế ở nhiều người, nhưng không đảm bảo trí thông minh cảm xúc nếu thiếu đi sự rèn luyện.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Fe tạo dựng sự kết nối chân thành mà không cố kiểm soát. Ni mang lại ý nghĩa lâu dài nhưng vẫn sẵn sàng tiếp nhận sự điều chỉnh. Se quan sát con người thật ngoài đời thay vì hình mẫu lý tưởng trong tâm tưởng. Ti giúp tách biệt giữa “mọi người thích điều này” với “điều này thực sự đúng đắn”.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Fe có thể can thiệp thái quá hoặc áp đặt suy nghĩ rằng mình biết điều gì là tốt nhất cho người khác.
• Ni có thể dựng nên những câu chuyện chủ quan về mối quan hệ mà không kiểm chứng.
• Se có thể phản ứng quá nhạy với những tín hiệu bên ngoài.
• Ti có thể trở thành sự dằn vặt, phê phán bản thân gay gắt trong âm thầm.

Foundation mô tả exaggerated Fe là xâm lấn ranh giới hoặc ép buộc sự hòa hợp giả tạo bề ngoài.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `ENFJ có thể thích công việc liên quan đến con người nhưng không bắt buộc. Một ENFJ hoàn toàn có thể yêu thích khoa học dữ liệu, lập trình hệ thống hay các lĩnh vực kỹ thuật phức tạp. Fe không biến một người thành giáo viên hay nhà tư vấn một cách mặc định.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Fe chủ đạo giúp giao tiếp được điều chỉnh tinh tế theo từng đối tượng. Tuy nhiên, người có Fe vẫn có ranh giới cá nhân, sở thích riêng và những khoảng thời gian không muốn giao tiếp xã hội. Chữ E không có nghĩa là cần đám đông liên tục.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• ENFJ không phải “nhà lãnh đạo bẩm sinh” theo định nghĩa tuyệt đối.
• Fe không đồng nghĩa với sự tốt bụng vô điều kiện.
• ENFJ không mặc định sở hữu sức hút lôi cuốn (charisma).
• Kỹ năng lãnh đạo, thuyết phục và thấu cảm là năng lực xã hội phức tạp cần rèn luyện.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Fe cần ranh giới lành mạnh.
• Ni cần kiểm chứng thực tế đời thường.
• Se cần được dùng để nhìn nhận những gì đang thực sự diễn ra.
• Ti giúp xây dựng năng lực phán đoán độc lập.

Trưởng thành không phải là “giúp đỡ người khác nhiều hơn nữa”, mà là khả năng phân biệt giữa sự kết nối chân thành với việc can thiệp thái quá.`
      },
      {
        heading: "11. Mosaic diễn giải ENFJ như thế nào?",
        content: `Mosaic không đánh giá ENFJ bằng câu hỏi “bạn có thích giúp đỡ mọi người không?”. Hành vi giúp đỡ có thể xuất phát từ nhiều động cơ tâm lý khác nhau.

Hệ thống tìm kiếm cấu trúc định hướng Fe–Ni và giữ nguyên phân bố của toàn bộ 8 chức năng nhận thức.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics; MBTI Code of Ethics.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 8. ENFP — NGƯỜI TRUYỀN CẢM HỨNG
  // ==========================================
  ENFP: {
    title: "ENFP — Người Truyền Cảm Hứng (Campaigner)",
    sections: [
      {
        heading: "1. ENFP trong hệ thống MBTI",
        content: `ENFP kết hợp Extraversion, Intuition, Feeling và Perceiving. Kiểu tính cách này thường bị biến thành hình tượng tràn đầy năng lượng, hỗn loạn, lạc quan tếu và luôn nhảy sang dự án mới. Đó là định kiến hành vi hơn là cấu trúc nhận thức.

Reference stack:
Ne → Fi → Te → Si`
      },
      {
        heading: "2. Nhóm màu: Diplomats",
        content: `ENFP thuộc Diplomats của 16Personalities cùng INFJ, INFP và ENFJ với shared traits N và F. Đây không phải phân lớp chính thức của MBTI.

Mosaic dùng Role như cách phân nhóm và điều hướng trực quan, không dùng để gán nhãn “lý tưởng hóa” hay “giàu lòng trắc ẩn” cho mọi cá nhân.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Ne chủ đạo — possibility ở external world:
Ne chú ý tới các mối liên hệ, cách diễn giải thay thế và tiềm năng phát triển. Một tình huống hiếm khi chỉ có một cách nhìn; một giới hạn có thể trở thành khởi điểm cho nhiều hướng đi mới.

• Fi hỗ trợ — chọn điều có meaning:
Nếu Ne mở ra vô số khả năng, Fi giúp chọn lọc khả năng nào thực sự có ý nghĩa và giá trị đối với cá nhân. Không phải ý tưởng nào thú vị cũng đáng để theo đuổi.

• Te thứ ba — biến possibility thành action:
Te bổ sung năng lực thực thi: chuyển ý tưởng thành dự án, mục tiêu và thời hạn hoàn thành thay vì chỉ dừng lại ở các nhánh suy tưởng.

• Si yếu — continuity và reference:
Si đưa kinh nghiệm trong quá khứ trở lại phương trình: Ne hỏi “còn điều gì có thể xảy ra?”, Si hỏi “những lần trước điều tương tự đã dẫn tới kết quả nào?”.`
      },
      {
        heading: "4. Dynamic tổng thể của ENFP",
        content: `Ne mở rộng tiềm năng. Fi chọn lọc giá trị. Te triển khai hành động. Si giữ gìn tính liên tục của kinh nghiệm.

Khi bốn chức năng này nâng đỡ nhau, ENFP không chỉ là người phát sinh ý tưởng mà có thể biến ý tưởng thành định hướng dài hạn bền vững.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Ne không cần chạy theo mọi điều mới lạ. Fi xây dựng tiêu chuẩn nội tâm sâu sắc. Te đưa tiêu chuẩn vào hành động thực tế. Si giúp học hỏi từ sự lặp lại và kinh nghiệm quá khứ.

Một ENFP trưởng thành có thể rất kiên định và kỷ luật nếu điều đó phục vụ cho một giá trị đủ lớn lao.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Ne có thể bị ngợp trong vô số lựa chọn mở.
• Fi có thể khiến các quyết định quá phụ thuộc vào cảm xúc phản ứng nhất thời.
• Te có thể bộc lộ một cách quá cứng nhắc nhằm cố gắng kiểm soát sự hỗn loạn.
• Si có thể bị xem thường chỉ vì sự quen thuộc không mang lại cảm giác phấn khích.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `ENFP thường được gắn với các ngành nghề sáng tạo hoặc khởi nghiệp. Tuy nhiên, sự sáng tạo không phải là đặc quyền của Ne và nghề nghiệp không thể suy ra từ kiểu MBTI.

Một ENFP hoàn toàn có thể tìm thấy niềm vui trong kế toán, y học, kỹ thuật hay quản trị công.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Tính hướng ngoại của Ne không nhất thiết đồng nghĩa với việc là “người của công chúng”. Ne có thể hướng ngoại qua ý tưởng, môi trường và các cuộc thảo luận tri thức chứ không chỉ là số lượng bạn bè.

Một ENFP vẫn có thể cần nhiều khoảng thời gian một mình để nạp lại năng lượng.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• ENFP không đồng nghĩa với chứng ADHD.
• Ne không đồng nghĩa với sự thiếu kỷ luật.
• Fi không đồng nghĩa với sự ủy mị, yếu đuối.
• ENFP không bắt buộc lúc nào cũng phải sôi nổi, hoạt bát.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Ne cần tiêu chí chọn lọc và sự cam kết lâu dài.
• Fi cần phản hồi từ thực tế đời sống.
• Te giúp tạo ra kết quả cụ thể ngoài thế giới.
• Si giúp những kinh nghiệm quý báu trước đây không bị gạt bỏ mỗi khi có ý tưởng mới xuất hiện.`
      },
      {
        heading: "11. Mosaic diễn giải ENFP như thế nào?",
        content: `Mosaic tìm kiếm mô hình tham chiếu Ne–Fi chứ không tìm “năng lượng ENFP” bề ngoài.

Một hồ sơ ENFP có thể có hành vi bên ngoài rất điềm đạm, ít nói nhưng vẫn sở hữu kiến trúc nhận thức Ne chủ đạo theo mô hình lý thuyết.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics; Best-Fit Type.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 9. ISTJ — NGƯỜI TRÁCH NHIỆM
  // ==========================================
  ISTJ: {
    title: "ISTJ — Người Trách Nhiệm (Inspector)",
    sections: [
      {
        heading: "1. ISTJ trong hệ thống MBTI",
        content: `ISTJ gồm Introversion, Sensing, Thinking và Judging. Định kiến phổ biến thường mô tả kiểu tính cách này là cứng nhắc, nguyên tắc, bảo thủ hoặc chỉ thích làm theo luật. Mosaic không coi những hành vi đó là định nghĩa của type.

Reference stack:
Si → Te → Fi → Ne`
      },
      {
        heading: "2. Nhóm màu: Sentinels",
        content: `ISTJ thuộc nhóm Sentinels trong hệ Roles của 16Personalities cùng ISFJ, ESTJ và ESFJ dựa trên S–J. Đây không phải phân nhóm gốc của MBTI chính thống.

Mosaic dùng Sentinel như một hệ thống trực quan, không hiểu nó thành “người thủ cựu” hay “người giữ luật cứng nhắc”.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Si chủ đạo — internal reference:
Si tiếp nhận hiện tại trong mối tương quan với các ấn tượng lưu trữ và kinh nghiệm tích lũy trước đó. Một sự thay đổi được nhận ra ngay lập tức vì nó lệch khỏi chuẩn mực quen thuộc (baseline). Quy trình được hiểu không chỉ là luật lệ mà là thứ đã chứng minh được kết quả trong quá khứ.

• Te hỗ trợ — external structure:
Te biến kinh nghiệm của Si thành quy trình, tiêu chuẩn, trình tự và mục tiêu cụ thể. Si nói “chúng ta đã học được gì?”, Te hỏi “vậy nên tổ chức công việc này ra sao?”.

• Fi thứ ba — personal value:
Fi cung cấp tiêu chuẩn đạo đức nội tâm riêng bên dưới các quy tắc bên ngoài. Một ISTJ tuân thủ hệ thống không phải vì luật luôn đúng, mà vì hệ thống đó phù hợp với nguyên tắc liêm chính cá nhân.

• Ne yếu — alternative possibility:
Ne mở ra các khả năng nằm ngoài tham chiếu đã biết. Inferior Ne không có nghĩa là ISTJ thiếu óc sáng tạo.`
      },
      {
        heading: "4. Dynamic tổng thể của ISTJ",
        content: `Si giữ tính liên tục. Te tạo lập cấu trúc. Fi bảo chứng sự chính trực. Ne mở ra các phương án dự phòng.

Cấu trúc này tạo nên sự đáng tin cậy ở nhiều người, nhưng tính tin cậy là hành vi, không phải bản thân chức năng tâm lý.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Si sử dụng quá khứ như nguồn dữ liệu quý giá chứ không phải mệnh lệnh bất di bất dịch. Te duy trì hệ thống hiệu quả. Fi cho phép đưa ra phán đoán cá nhân công tâm. Ne giúp nhận ra khi nào kinh nghiệm cũ không còn đủ để giải quyết vấn đề mới.

Một ISTJ cân bằng hoàn toàn có thể thay đổi phương pháp rất nhanh chóng khi có đầy đủ bằng chứng thuyết phục.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Si có thể biến sự quen thuộc thành tiêu chuẩn duy nhất để đánh giá.
• Te có thể bảo vệ quy trình chỉ vì quy trình đã tồn tại từ trước.
• Ne có thể xuất hiện dưới áp lực lớn thành nỗi lo sợ về vô số kịch bản tồi tệ nhất.

Những biểu hiện này không đồng nghĩa với việc ISTJ “sợ thay đổi”; phản ứng thực tế còn phụ thuộc vào bối cảnh và trải nghiệm sống.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `ISTJ có thể thích môi trường có cấu trúc rõ ràng và chuyên môn tích lũy, nhưng điều đó không có nghĩa họ chỉ hợp làm hành chính hay kế toán.

Một ISTJ hoàn toàn có thể trở thành nghệ sĩ, doanh nhân, nhà khoa học hay diễn viên xuất sắc.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Sự quan tâm của ISTJ thường được thể hiện qua hành động nhất quán và trách nhiệm, nhưng đó không phải quy tắc bất biến.

Một ISTJ có thể rất ấm áp và biểu đạt bằng lời nói; người khác cùng kiểu lại có thể kín đáo hơn. MBTI không quyết định ngôn ngữ tình yêu của một cá nhân.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• Si không đồng nghĩa với trí nhớ siêu phàm.
• ISTJ không mặc định là người bảo thủ.
• Chữ J không có nghĩa là sạch sẽ, ngăn nắp tuyệt đối.
• Te không có nghĩa là thích kiểm soát người khác.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Si cần liên tục cập nhật thông tin mới.
• Te cần đặt trong bối cảnh con người cụ thể.
• Fi cần không gian cho những phán đoán nhân văn.
• Ne giúp những “cách chưa từng làm” được xem xét khách quan trước khi bị gạt bỏ.`
      },
      {
        heading: "11. Mosaic diễn giải ISTJ như thế nào?",
        content: `Mosaic tìm kiếm kiến trúc Si–Te thay vì hỏi người dùng “bạn có thích làm theo luật không?”.

Một người có Si cao nhưng tư tưởng rất tiến bộ và phi truyền thống vẫn hoàn toàn phù hợp với ISTJ; truyền thống là nội dung (content), còn Si là tiến trình nhận thức (process).`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics; Code of Ethics.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 10. ISFJ — NGƯỜI NUÔI DƯỠNG
  // ==========================================
  ISFJ: {
    title: "ISFJ — Người Nuôi Dưỡng (Defender)",
    sections: [
      {
        heading: "1. ISFJ trong hệ thống MBTI",
        content: `ISFJ kết hợp Introversion, Sensing, Feeling và Judging. Kiểu tính cách này thường bị rút gọn thành “người chăm sóc”, “hiền lành”, “truyền thống” hoặc “luôn hy sinh vì người khác”. Những mô tả đó không đủ để định hình mô hình nhận thức.

Reference stack:
Si → Fe → Ti → Ne`
      },
      {
        heading: "2. Nhóm màu: Sentinels",
        content: `ISFJ thuộc Sentinels của 16Personalities cùng ISTJ, ESTJ và ESFJ dựa trên S và J trong mô hình 16Personalities. Đây không phải thành phần chính thức của MBTI.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Si chủ đạo — continuity của experience:
Si cung cấp tham chiếu nội tâm từ những gì từng xảy ra hoặc từng có ý nghĩa trong quá khứ. Tình huống hiện tại được tiếp nhận thông qua sự đối chiếu với các dữ kiện chuẩn mực cũ.

• Fe hỗ trợ — shared human context:
Fe đưa những kinh nghiệm đó vào bối cảnh quan hệ xã hội: Si nhớ rõ các chi tiết; Fe biến các chi tiết đó thành ý nghĩa quan hệ (điều gì từng quan trọng với ai, kỳ vọng nào đã hình thành và sự thay đổi này tác động ra sao tới tình cảm).

• Ti thứ ba — internal analysis:
Ti cung cấp khả năng chất vấn các quy ước xã hội và kiểm tra tính nhất quán logic. Điều này rất quan trọng vì Si–Fe nếu đứng một mình có thể quá phụ thuộc vào tiền lệ và sự kỳ vọng của đám đông.

• Ne yếu — possibility:
Ne mở ra các cách diễn giải thay thế và viễn cảnh tương lai mới lạ.`
      },
      {
        heading: "4. Dynamic tổng thể của ISFJ",
        content: `Si giữ tính liên tục của trải nghiệm. Fe duy trì sự hài hòa trong các mối quan hệ. Ti kiểm tra tính hợp lý của hệ thống. Ne mở ra các khả năng mới.

Reference ISFJ vì vậy không phải “người phục vụ”, mà là một cấu trúc nhận thức và phán đoán có chiều sâu và sự cân bằng.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Si tận dụng kinh nghiệm quý báu nhưng vẫn sẵn sàng cập nhật cái mới. Fe quan tâm sâu sắc tới con người nhưng biết giữ ranh giới cá nhân vững vàng. Ti cho phép đưa ra đánh giá độc lập. Ne mở ra các giải pháp mới mà không phá vỡ sự ổn định một cách vô cớ.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Si có thể biến tiền lệ cũ thành chuẩn mực áp đặt tuyệt đối.
• Fe có thể khiến kỳ vọng của người khác được ưu tiên quá mức dẫn đến kiệt sức.
• Ti có thể trở thành sự dằn vặt, mổ xẻ nội tâm cô độc.
• Ne có thể phóng đại sự bất định thành quá nhiều mối nguy tiềm tàng.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `ISFJ có thể thích môi trường nơi các chi tiết và tính ổn định được coi trọng, nhưng không có nghĩa họ chỉ làm công việc chăm sóc.

Một ISFJ có thể làm kỹ sư phần mềm, nhà nghiên cứu khoa học, luật sư, doanh nhân hoặc nghệ sĩ.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Fe giúp ISFJ nhạy bén với kỳ vọng xã hội, nhưng điều đó không bắt buộc họ phải luôn đồng ý với mọi người.

ISFJ hoàn toàn có thể có ranh giới cá nhân rất kiên định và dám bày tỏ sự bất đồng một cách dứt khoát.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• ISFJ không đồng nghĩa với nhút nhát hay thụ động.
• Fe không đồng nghĩa với sự làm hài lòng mọi người (people-pleasing).
• Si không có nghĩa là tôn sùng truyền thống mù quáng.
• ISFJ không phải là kiểu nhân vật mờ nhạt hay cam chịu.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Si cần cho phép chuẩn mực nội tâm được thay đổi theo thời đại.
• Fe cần phân biệt rõ giữa sự đồng cảm thực sự với việc tự xóa bỏ nhu cầu bản thân.
• Ti giúp chất vấn và thanh lọc các giả định cũ.
• Ne giúp nhìn nhận những phương án mới như cơ hội thay vì hiểm họa.`
      },
      {
        heading: "11. Mosaic diễn giải ISFJ như thế nào?",
        content: `Mosaic không hỏi “bạn có thích chăm sóc người khác không?”. Hành vi chăm sóc có thể xuất phát từ rất nhiều quá trình tâm lý khác nhau.

Hệ thống xem xét kiến trúc Si–Fe cùng toàn bộ phân bổ 8 chức năng nhận thức để đưa ra nhận định chân xác.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics; Best-Fit Type.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 11. ESTJ — NGƯỜI GIÁM SÁT
  // ==========================================
  ESTJ: {
    title: "ESTJ — Người Giám Sát (Executive)",
    sections: [
      {
        heading: "1. ESTJ trong hệ thống MBTI",
        content: `ESTJ gồm Extraversion, Sensing, Thinking và Judging. Những mô tả Internet thường biến type này thành “ông chủ”, “người giữ luật” hoặc “nhà quản lý độc đoán”. Mosaic không định nghĩa ESTJ bằng quyền lực áp đặt.

Reference stack:
Te → Si → Ne → Fi`
      },
      {
        heading: "2. Nhóm màu: Sentinels",
        content: `Trong hệ Roles của 16Personalities, ESTJ nằm trong Sentinels cùng ISTJ, ISFJ và ESFJ dựa trên S–J. Đây không phải phân nhóm chính thức của MBTI.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Te chủ đạo — tổ chức thế giới bên ngoài:
Te muốn mọi mục tiêu phải được chuyển thành hành động thực tế (operationalize): Mục tiêu cụ thể là gì? Tiêu chuẩn hoàn thành là gì? Ai phụ trách việc gì? Quy trình nào đang gặp trục trặc?

• Si hỗ trợ — sử dụng precedent:
Si cung cấp tham chiếu từ kinh nghiệm thực tiễn trước đây. Te muốn tổ chức hệ thống; Si giúp hệ thống học hỏi từ những phương pháp đã từng vận hành hiệu quả.

• Ne thứ ba — alternative method:
Ne cho phép nhận ra rằng một quy trình quen thuộc không phải là lựa chọn duy nhất, đưa tính linh hoạt vào bộ đôi Te–Si.

• Fi yếu — personal alignment:
Fi đặt câu hỏi về hệ giá trị cá nhân: Một kết quả có thể rất hiệu quả về năng suất nhưng vẫn xung đột với nguyên tắc lương tâm của cá nhân.`
      },
      {
        heading: "4. Dynamic tổng thể của ESTJ",
        content: `Te xây dựng hệ thống quy trình. Si lưu giữ kinh nghiệm và chuẩn mực. Ne mở ra các phương pháp cải tiến. Fi đặt ra giới hạn đạo đức nội tại.

Đó là kiến trúc nhận thức tham chiếu, không đồng nghĩa với tính cách “thích ra lệnh”.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Te rõ ràng, minh bạch nhưng có khả năng thích ứng linh hoạt. Si dùng tiền lệ như dữ liệu tham khảo chứ không phải giáo điều. Ne chấp nhận các phương pháp mới mẻ. Fi giúp con người và giá trị nhân văn không bị biến thành các biến số phụ trong bài toán hiệu suất.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Te có thể biến hiệu quả cơ học thành tiêu chuẩn tối thượng duy nhất.
• Si có thể cố bám giữ quy trình cũ quá lâu khi hoàn cảnh đã thay đổi.
• Ne có thể bị gạt bỏ chỉ vì ý tưởng mới chưa được chứng minh ngay.
• Fi có thể bị xem nhẹ cho đến khi các vấn đề cảm xúc bùng nổ dữ dội.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `ESTJ có thể thích các hệ thống rõ ràng và kết quả có thể quan sát trực tiếp, nhưng không phải mọi ESTJ đều làm quản lý hay lãnh đạo người khác.

Một nghệ sĩ hay nhà nghiên cứu ESTJ có thể dùng Te–Si để quản trị tiến độ và quy trình sáng tạo riêng của họ cực kỳ chuẩn mực.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Giao tiếp trực tiếp (direct communication) có thể phổ biến ở một số người dùng Te nhưng không phải yêu cầu bắt buộc.

Văn hóa gia đình, giáo dục và các khía cạnh nhân cách ngoài MBTI ảnh hưởng đến phong cách giao tiếp mạnh mẽ hơn một stack chức năng đơn lẻ.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• ESTJ không đồng nghĩa với độc đoán hay bảo thủ.
• Te không đồng nghĩa với kiểm soát áp đặt.
• Si không có nghĩa là bài xích cái mới.
• MBTI không được dùng để suy luận quan điểm chính trị hay phẩm chất đạo đức.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Te cần được đặt trong bối cảnh nhân văn.
• Si cần liên tục cập nhật dữ liệu mới.
• Ne cần không gian để thử nghiệm các phương pháp mới.
• Fi giúp trân trọng những giá trị vô hình dù không dễ đo lường bằng con số.`
      },
      {
        heading: "11. Mosaic diễn giải ESTJ như thế nào?",
        content: `Mosaic tìm kiếm cấu trúc Te–Si thay vì hỏi “bạn có thích làm lãnh đạo không?”.

Một ESTJ có Ne cao hoặc Fi phát triển mạnh vẫn có thể rất phù hợp với mẫu tham chiếu ESTJ.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics; Code of Ethics.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 12. ESFJ — NGƯỜI CHĂM SÓC
  // ==========================================
  ESFJ: {
    title: "ESFJ — Người Chăm Sóc (Consul)",
    sections: [
      {
        heading: "1. ESFJ trong hệ thống MBTI",
        content: `ESFJ kết hợp Extraversion, Sensing, Feeling và Judging. Stereotype thường biến ESFJ thành “người của công chúng”, “thích tiệc tùng”, “chăm sóc thái quá” hoặc người chỉ quan tâm đến sự công nhận bề ngoài. Mosaic không coi mức độ hòa đồng hay sự nổi tiếng là tiêu chí của type.

Reference stack:
Fe → Si → Ne → Ti`
      },
      {
        heading: "2. Nhóm màu: Sentinels",
        content: `ESFJ thuộc Sentinels trong hệ Roles của 16Personalities cùng ISTJ, ISFJ và ESTJ dựa trên S và J. Role này không thuộc official MBTI.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Fe chủ đạo — relational valuation:
Fe chú ý tới các mối quan hệ, kỳ vọng chung và giá trị tập thể, đánh giá hành động dựa trên ý nghĩa xã hội và sự hòa hợp giữa con người với con người.

• Si hỗ trợ — continuity và shared history:
Si bổ sung tham chiếu nội tâm: Fe quan tâm đến con người hiện tại; Si ghi nhớ bối cảnh hình thành mối quan hệ đó, những kỷ niệm thiêng liêng và chuẩn mực đã được xây dựng qua thời gian.

• Ne thứ ba — alternative possibility:
Ne giúp ESFJ không chỉ dựa vào kịch bản xã hội quen thuộc, mà nhận ra rằng một tình huống có thể có cách hiểu khác, một truyền thống có thể được thực hiện theo cách mới mẻ hơn.

• Ti yếu — independent logical audit:
Ti cho phép chất vấn sự đồng thuận: Việc cả một nhóm người cùng đồng ý không tự động có nghĩa là kết luận đó hợp lý về mặt logic.`
      },
      {
        heading: "4. Dynamic tổng thể của ESFJ",
        content: `Fe thấu hiểu cảm xúc xã hội. Si gìn giữ tính liên tục của các giá trị chung. Ne mở ra các phương án linh hoạt. Ti kiểm tra tính nhất quán logic.

Reference ESFJ vì vậy sở hữu cả chiều kích quan hệ sâu sắc lẫn tư duy phân tích độc lập.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Fe gắn kết cộng đồng mà không ép buộc sự hòa hợp giả tạo. Si tôn trọng truyền thống nhưng không thần thánh hóa các quy ước cũ kỹ. Ne mở ra các lựa chọn mới. Ti giúp việc đánh giá trở nên khách quan và độc lập hơn.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Fe có thể tập trung quá mức vào việc làm hài lòng người khác hoặc tìm kiếm sự chấp thuận bên ngoài.
• Si có thể biến thói quen thành quy tắc bắt buộc.
• Ne có thể bộc lộ dưới dạng nỗi bất an trước những điều chưa chắc chắn.
• Ti có thể trở thành sự dằn vặt, phê phán bản thân cay nghiệt trong âm thầm.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `ESFJ có thể thích môi trường đòi hỏi sự phối hợp nhịp nhàng giữa con người, nhưng không bị giới hạn trong ngành dịch vụ hay chăm sóc.

Một ESFJ hoàn toàn có thể làm kỹ thuật, y khoa, quản trị kinh doanh, nghệ thuật hay nghiên cứu khoa học.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Fe chủ đạo không có nghĩa là lúc nào cũng muốn ở cạnh đám đông. Tính hướng ngoại trong lý thuyết kiểu mô tả hướng của sự chú ý tâm lý, không phải sức bền xã giao đơn thuần.

Một ESFJ vẫn có thể cần nhiều khoảng lặng yên tĩnh cho riêng mình.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• ESFJ không đồng nghĩa với người nông cạn hay thích xu nịnh.
• Fe không phải là sự giả tạo.
• Si không đồng nghĩa với sự cổ hủ, bảo thủ.
• Chức năng Feeling không có nghĩa là thiếu lý trí hay phi logic.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Fe cần xây dựng ranh giới bảo vệ cảm xúc bản thân.
• Si cần cho phép tiền lệ được điều chỉnh linh hoạt.
• Ne giúp sự đổi mới không bị nhìn nhận như sự phá hoại.
• Ti giúp tách biệt sự đồng thuận xã hội khỏi tính đúng đắn logic.`
      },
      {
        heading: "11. Mosaic diễn giải ESFJ như thế nào?",
        content: `Mosaic tìm kiếm mô hình định hướng Fe–Si chứ không dùng mức độ giao thiệp xã hội làm thước đo cho ESFJ.

Một người kín tiếng vẫn có thể hoàn toàn phù hợp với kiến trúc tham chiếu của ESFJ.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics; Best-Fit Type.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 13. ISTP — NHÀ KỸ THUẬT
  // ==========================================
  ISTP: {
    title: "ISTP — Nhà Kỹ Thuật (Crafter)",
    sections: [
      {
        heading: "1. ISTP trong hệ thống MBTI",
        content: `ISTP gồm Introversion, Sensing, Thinking và Perceiving. Các mô tả trực tuyến thường gắn nhãn ISTP với thợ sửa chữa, công cụ cơ khí, thể thao mạo hiểm hoặc “kẻ cô độc lạnh lùng”. Những sở thích đó không phải là định nghĩa của type.

Reference stack:
Ti → Se → Ni → Fe`
      },
      {
        heading: "2. Nhóm màu: Explorers",
        content: `ISTP thuộc nhóm Explorers của 16Personalities cùng ISFP, ESTP và ESFP dựa trên S và P trong framework 16Personalities. Đây không phải phân nhóm chính thức của MBTI.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Ti chủ đạo — mechanics của system:
Ti muốn hiểu cấu trúc hệ thống từ bên trong: một quy trình được tháo rời thành từng phần, mối quan hệ và nguyên lý vận hành để xem nó thực sự hoạt động ra sao.

• Se hỗ trợ — test model với reality:
Se giúp Ti không chỉ phân tích thuần lý thuyết trừu tượng. Một giả thuyết có thể được thử nghiệm trực tiếp ngoài đời thực; thực tại phản hồi và mô hình được cập nhật ngay lập tức. Ti–Se tạo nên vòng lặp tương tác mạnh mẽ giữa tư duy phân tích và trải nghiệm thực chứng.

• Ni thứ ba — trajectory:
Ni giúp quan sát cụ thể biến thành hàm ý tiềm ẩn bên dưới: không chỉ “điều gì đang xảy ra?” mà “xu hướng này có thể dẫn tới kết quả nào?”.

• Fe yếu — social context:
Fe đưa sự giao tiếp và tác động quan hệ vào bài toán giải quyết vấn đề. Inferior Fe không có nghĩa là ISTP vô cảm hay thiếu tình cảm.`
      },
      {
        heading: "4. Dynamic tổng thể của ISTP",
        content: `Ti thấu hiểu cơ chế. Se kiểm chứng bằng thực tế đời thường. Ni đúc kết kinh nghiệm thành quy luật bản chất. Fe đưa bối cảnh con người vào phương trình hành động.

Pattern này giải thích bản chất nhận thức sâu sắc hơn nhiều so với stereotype “anh thợ máy”.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Ti không phân tích quá đà dẫn đến bế tắc. Se không chỉ phản xạ nhất thời mà có sự cân nhắc. Ni tạo ra định hướng dài hạn. Fe giúp các giải pháp kỹ thuật có tính ứng dụng cao và thân thiện với con người.

Một ISTP có thể rất giỏi về lý thuyết trừu tượng nếu Ti được áp dụng vào các lĩnh vực toán học, triết học hay kiến trúc phần mềm.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Ti có thể tách rời hoàn toàn khỏi bối cảnh thực tế và cảm xúc của người khác.
• Se có thể ưu tiên cảm giác kích thích tức thời quá mức.
• Ni có thể tạo ra những dự đoán hạn hẹp, bi quan.
• Fe có thể bị né tránh hoàn toàn cho đến khi các xung đột quan hệ trở nên không thể cứu vãn.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `ISTP có thể thích học qua thực hành (learn-by-doing), nhưng “thực hành” không nhất thiết phải là vận động tay chân hay cơ khí.

Tìm lỗi phần mềm (debugging), thiết kế thí nghiệm khoa học hay biên tập âm nhạc phức tạp đều có vòng lặp phản hồi nhận thức tương tự.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Phong thái điềm tĩnh, ít nói thường được gắn cho ISTP, nhưng Introversion không đồng nghĩa với sự xa cách về mặt cảm xúc.

Một ISTP có Fe phát triển tốt hoàn toàn có thể giao tiếp tinh tế, ân cần và biết cách chăm sóc người khác bằng hành động thiết thực.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• ISTP không bắt buộc phải thích sửa xe hay máy móc.
• Se không đồng nghĩa với việc lúc nào cũng cần cảm giác mạnh (adrenaline).
• Ti không phải là thước đo của thiên tài.
• ISTP không mặc định né tránh sự cam kết lâu dài trong tình cảm.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Ti cần sự kiểm chứng từ dữ liệu thực tế bên ngoài.
• Se cần được định hướng bởi các mục tiêu dài hạn.
• Ni cần bằng chứng thực chứng để không rơi vào định kiến.
• Fe giúp sự chính xác về kỹ thuật cùng tồn tại hòa hợp với bối cảnh nhân văn.`
      },
      {
        heading: "11. Mosaic diễn giải ISTP như thế nào?",
        content: `Mosaic không hỏi người dùng có thích sửa chữa đồ đạc hay chơi thể thao không. Hệ thống quan sát động lực Ti–Se và toàn bộ hồ sơ nhận thức.

Một ISTP có điểm Ni tương đối cao không phải là điều mâu thuẫn; Mosaic giữ nguyên tính chân thực của dữ liệu thay vì ép bạn vào một khuôn mẫu cứng nhắc.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 14. ISFP — NGƯỜI NGHỆ SĨ
  // ==========================================
  ISFP: {
    title: "ISFP — Người Nghệ Sĩ (Adventurer)",
    sections: [
      {
        heading: "1. ISFP trong hệ thống MBTI",
        content: `ISFP gồm Introversion, Sensing, Feeling và Perceiving. Kiểu tính cách này thường được gọi là “nghệ sĩ” hoặc “nhà thám hiểm”, nhưng nghệ thuật và sự phiêu lưu là sở thích cá nhân, không phải chức năng nhận thức tâm lý.

Reference stack:
Fi → Se → Ni → Te`
      },
      {
        heading: "2. Nhóm màu: Explorers",
        content: `ISFP nằm trong nhóm Explorers của 16Personalities cùng ISTP, ESTP và ESFP dựa trên S–P trong mô hình 16Personalities và không thuộc cốt lõi của MBTI chính thống.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Fi chủ đạo — personal alignment:
Fi đặt hệ giá trị nội tâm làm trung tâm phán đoán. Một trải nghiệm được đánh giá không chỉ bằng kết quả đạt được, mà bằng sự hòa hợp chân thực với lương tâm và căn tính cá nhân.

• Se hỗ trợ — direct experience:
Se đưa Fi tiếp xúc trực tiếp với thực tại sinh động: Giá trị không chỉ tồn tại trừu tượng trong tâm tưởng; nó được biểu hiện và kiểm chứng qua con người thật, đồ vật thật và các sự kiện cụ thể ngoài đời.

• Ni thứ ba — meaning phía sau experience:
Ni kết nối các trải nghiệm rời rạc thành một bức tranh ý nghĩa hoặc định hướng sâu xa, giúp Fi–Se không chỉ phản ứng theo cảm xúc nhất thời của từng khoảnh khắc.

• Te yếu — structure và execution:
Te giúp chuyển hóa giá trị thành mục tiêu, nguồn lực và kế hoạch thực thi rõ ràng. Inferior Te không đồng nghĩa với sự thiếu hiệu suất hay vô kỷ luật.`
      },
      {
        heading: "4. Dynamic tổng thể của ISFP",
        content: `Fi định hình giá trị cốt lõi. Se đem giá trị vào đời sống thực tế sinh động. Ni kiến tạo định hướng và tầm nhìn. Te giúp định hướng đó có được cấu trúc thực thi vững chắc.

Đây là một khung nhận thức rộng lớn và phong phú hơn rất nhiều so với nhãn dán “người nghệ sĩ hướng nội”.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Fi giữ vững tính chân thực (authenticity) mà vẫn cởi mở đón nhận phản hồi từ bên ngoài. Se duy trì sự gắn kết vững vàng với hiện tại. Ni giúp nhìn thấu các hàm ý lâu dài. Te biến ý nguyện thành hành động có kết quả cụ thể.

Một ISFP có thể rất quyết đoán và bản lĩnh khi hệ giá trị và bằng chứng thực tế đã hoàn toàn rõ ràng.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Fi có thể tự quy chiếu quá mức, xem cảm giác riêng là chân lý tuyệt đối.
• Se có thể khiến trải nghiệm trước mắt có sức nặng quá lớn, làm lu mờ mục tiêu dài hạn.
• Ni có thể vội vã hình thành các phán đoán ý nghĩa khi chưa đủ dữ liệu thực tế.
• Te có thể bộc lộ một cách thô ráp, cứng nhắc khi bị căng thẳng tột độ.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `ISFP có thể thích các công việc có sự can dự cụ thể và quyền tự chủ cá nhân, nhưng điều này hiện diện trong vô số ngành nghề khác nhau.

Một ISFP không bắt buộc phải làm hội họa hay âm nhạc mới là “đúng kiểu tính cách”.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Fi chủ đạo khiến ý nghĩa cảm xúc của ISFP rất sâu sắc nhưng kín đáo. Một người có thể quan tâm sâu sắc đến bạn đời nhưng không bộc lộ quá nhiều bằng lời nói hoa mỹ.

Ngược lại, một ISFP khác có thể biểu đạt tình cảm rất phong phú qua hành động chăm sóc tinh tế.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• ISFP không đồng nghĩa với nghệ sĩ tự do.
• Fi không có nghĩa là yếu đuối hay mong manh.
• Se không có nghĩa là bốc đồng, nông nổi.
• Chữ P không có nghĩa là thiếu trách nhiệm hay vô tổ chức.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Fi cần sự đối chiếu với dữ liệu đời thực.
• Se cần được định hướng bởi mục tiêu dài hạn.
• Ni giúp kết nối trải nghiệm hiện tại thành một con đường phát triển bền vững.
• Te giúp các giá trị đạo đức tạo ra kết quả có thể duy trì lâu dài.`
      },
      {
        heading: "11. Mosaic diễn giải ISFP như thế nào?",
        content: `Mosaic không gán nhãn ISFP chỉ vì người dùng yêu thích cái đẹp hay thiên nhiên.

Hệ thống tìm kiếm mô hình Fi–Se và so sánh với INFP, ESFP cùng các mẫu tham chiếu khác để xác định cấu trúc nhận thức nào phản ánh đúng nhất cách tư duy của bạn.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics; Best-Fit Type.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 15. ESTP — NGƯỜI KHỞI XƯỚNG
  // ==========================================
  ESTP: {
    title: "ESTP — Người Khởi Xướng (Entrepreneur)",
    sections: [
      {
        heading: "1. ESTP trong hệ thống MBTI",
        content: `ESTP kết hợp Extraversion, Sensing, Thinking và Perceiving. Định kiến đại chúng thường gắn kiểu này với sự mạo hiểm, tiệc tùng, thể thao cảm giác mạnh hoặc hành động liều lĩnh. Mosaic không xem bất kỳ hành vi nào trong số đó là điều kiện của type.

Reference stack:
Se → Ti → Fe → Ni`
      },
      {
        heading: "2. Nhóm màu: Explorers",
        content: `ESTP thuộc Explorers trong hệ Roles của 16Personalities cùng ISTP, ISFP và ESFP dựa trên S–P. Đây không phải phân nhóm chính thức của MBTI.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Se chủ đạo — contact với present reality:
Se ưu tiên thông tin đang thực sự hiện diện ngay trước mắt: chuyển động, thời cơ, điều kiện môi trường và dữ liệu cụ thể. Điều này tạo nên khả năng phản ứng nhanh nhạy, nhưng sự nhạy bén không đồng nghĩa với tính bốc đồng.

• Ti hỗ trợ — understand mechanism:
Ti giúp Se không chỉ phản xạ nhất thời. Một sự việc được phân tích để hiểu cơ chế vận hành: nếu thay đổi biến số này thì kết quả thực tế sẽ biến chuyển ra sao? Cặp Se–Ti tạo ra vòng lặp phản hồi cực nhanh giữa hành động và phân tích.

• Fe thứ ba — social cues:
Fe bổ sung nhận thức về bối cảnh con người: Se nắm bắt tín hiệu cử chỉ nhanh chóng; Fe giúp tín hiệu đó có ý nghĩa quan hệ để điều chỉnh ứng xử phù hợp.

• Ni yếu — long-term pattern:
Ni chất vấn xu hướng hiện tại đang dẫn về đâu, giúp cân bằng lại khuynh hướng tập trung quá mức vào những dữ liệu trước mắt.`
      },
      {
        heading: "4. Dynamic tổng thể của ESTP",
        content: `Se tiếp nhận dữ liệu trực tiếp. Ti hiểu rõ cấu trúc nguyên lý. Fe thấu hiểu tâm lý đối thoại. Ni xây dựng tầm nhìn dài hạn hơn.

Reference ESTP vì thế sở hữu cả chiều kích phân tích logic lẫn khả năng ứng xử xã hội linh hoạt, không chỉ đơn thuần là người hành động.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Se phản ứng nhanh nhưng có sự kiểm chứng của Ti. Fe giúp sự thích ứng linh hoạt không biến thành chủ nghĩa cơ hội thực dụng. Ni đặt các sự kiện trước mắt vào bức tranh dài hạn tổng thể.

Một ESTP trưởng thành có thể cực kỳ chiến lược vì họ vừa nắm bắt hoàn hảo điều kiện hiện tại vừa hiểu rõ cơ chế vận hành bên dưới.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Se có thể quá ưu tiên phần thưởng và kích thích ngắn hạn trước mắt.
• Ti có thể biến thành sự hợp lý hóa cho những hành động bốc đồng đã lỡ thực hiện.
• Fe có thể trở nên quá nhạy cảm hoặc thao túng phản hồi xã hội.
• Ni có thể bộc lộ dưới áp lực lớn thành nỗi sợ hãi mơ hồ về một tương lai bi quan.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `ESTP có thể học hỏi rất nhanh qua phản hồi thực tế (active feedback), nhưng họ hoàn toàn có thể yêu thích lý thuyết trừu tượng phức tạp.

Một ESTP có thể là nhà nghiên cứu khoa học, kỹ sư, bác sĩ phẫu thuật hay nhà văn xuất sắc.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Extraversion và Se không mặc định là sự ồn ào hay phô trương.

Một ESTP hoàn toàn có thể là người điềm đạm, ít nói nhưng cực kỳ tinh ý và chú ý quan sát mọi biến chuyển của môi trường xung quanh.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• ESTP không đồng nghĩa với kẻ liều mạng hay thích đánh cược vô lối.
• Se không đồng nghĩa với thói quen tiệc tùng triền miên.
• ESTP không hề thiếu chiều sâu tư duy.
• Chữ P không có nghĩa là thiếu tinh thần trách nhiệm.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Se cần được định hướng bởi tầm nhìn dài hạn.
• Ti cần được soi sáng bởi các giá trị nhân văn và bối cảnh cảm xúc.
• Fe cần sự chân thành đích thực.
• Ni giúp cơ hội trước mắt được xem xét trong mối tương quan với hậu quả lâu dài.`
      },
      {
        heading: "11. Mosaic diễn giải ESTP như thế nào?",
        content: `Mosaic không dùng các câu hỏi về thể thao mạo hiểm hay thói quen chấp nhận rủi ro để nhận diện ESTP.

Hệ thống tìm kiếm mô hình Se–Ti và cách nó phân tách rõ ràng với ESFP hay ISTP để tôn vinh sự độc đáo trong tư duy của bạn.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics; Code of Ethics.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  },

  // ==========================================
  // 16. ESFP — NGƯỜI TRÌNH DIỄN
  // ==========================================
  ESFP: {
    title: "ESFP — Người Trình Diễn (Entertainer)",
    sections: [
      {
        heading: "1. ESFP trong hệ thống MBTI",
        content: `ESFP gồm Extraversion, Sensing, Feeling và Perceiving. Định kiến đại chúng thường biến ESFP thành người làm trò mua vui, kẻ thích tiệc tùng hoặc người chỉ biết “sống cho hiện tại”. Mosaic không định nghĩa kiểu tính cách bằng lối sống bề nổi.

Reference stack:
Se → Fi → Te → Ni`
      },
      {
        heading: "2. Nhóm màu: Explorers",
        content: `ESFP thuộc nhóm Explorers của 16Personalities cùng ISTP, ISFP và ESTP dựa trên S–P trong mô hình đó. Đây là phân loại riêng của 16Personalities và không thuộc cấu trúc gốc của MBTI.`
      },
      {
        heading: "3. Cấu trúc nhận thức (Cognitive Architecture)",
        content: `• Se chủ đạo — hiện tại ở độ phân giải cao:
Se chú ý đến thực tế cụ thể đang diễn ra với độ phân giải giác quan sắc nét: đồ vật, chuyển động, ngữ điệu, kết cấu không gian, thời cơ và sự biến đổi của môi trường đều có sức hút mạnh mẽ.

• Fi hỗ trợ — chọn experience theo value:
Fi giúp Se không chỉ mải mê đuổi theo kích thích giác quan, mà đánh giá trải nghiệm theo ý nghĩa cá nhân: tôi thực sự mong muốn điều gì, điều gì chân thực và phù hợp với giá trị sống của tôi?

• Te thứ ba — external execution:
Te giúp các lựa chọn của Fi được chuyển hóa thành kế hoạch, cấu trúc hành động hoặc kết quả đo lường được ngoài đời thực.

• Ni yếu — trajectory và underlying meaning:
Ni đặt trải nghiệm hiện tại vào một bức tranh vận động dài hạn hơn, tự đặt câu hỏi: “Điều này đang dẫn dắt cuộc đời mình đi về đâu?”.`
      },
      {
        heading: "4. Dynamic tổng thể của ESFP",
        content: `Se tiếp nhận thực tế sống động. Fi đánh giá ý nghĩa nhân văn nội tại. Te tổ chức thực thi hiệu quả. Ni kiến tạo định hướng và tầm nhìn dài hạn.

Reference ESFP vì vậy không phải “người hướng ngoại ham vui”, mà là một mối tương quan nhận thức đặc sắc giữa năng lực tiếp nhận thực tại và phán đoán giá trị chân thành.`
      },
      {
        heading: "5. Khi pattern phát triển cân bằng",
        content: `Se giữ được sự nhạy bén linh hoạt tuyệt vời. Fi tạo ra tiêu chuẩn đánh giá nội tâm sâu sắc. Te giúp các giá trị có kết quả cụ thể trong thực tế. Ni cho phép nhìn xa hơn khoảnh khắc hiện tại.

Một ESFP cân bằng có thể cực kỳ kỷ luật và kiên định nếu mục tiêu đó thực sự phù hợp với hệ giá trị và thực tế của họ.`
      },
      {
        heading: "6. Khi pattern trở nên một chiều",
        content: `• Se có thể khiến phần thưởng tức thời trước mắt chiếm quá nhiều trọng lượng.
• Fi có thể biến sở thích cá nhân thành tiêu chuẩn duy nhất để đánh giá mọi việc.
• Te có thể bộc lộ sự cứng nhắc, áp đặt khi chịu áp lực cao.
• Ni có thể diễn giải quá đà các viễn cảnh bi quan khi đối mặt với sự bất định.`
      },
      {
        heading: "7. Trong học tập và công việc",
        content: `ESFP có thể thích các công việc có sự tương tác và can dự trực tiếp, nhưng sự can dự đó tồn tại trong vô số ngành nghề phong phú.

Một ESFP hoàn toàn có thể trở thành bác sĩ phẫu thuật, kỹ sư, nhà khoa học hay nhà quản lý tài ba, chứ không chỉ giới hạn trong nghệ thuật biểu diễn.`
      },
      {
        heading: "8. Trong quan hệ và giao tiếp",
        content: `Hướng ngoại không đồng nghĩa với việc lúc nào cũng cần sự nổi tiếng hay nhiều bạn bè.

Một ESFP có thể rất hòa đồng, nhưng một người khác cùng kiểu có thể chọn vòng tròn bạn bè rất nhỏ và dành nhiều thời gian tĩnh lặng cho riêng mình. Fi giúp họ duy trì ranh giới cá nhân rõ ràng dù phong cách bên ngoài có thể rất cởi mở.`
      },
      {
        heading: "9. Những hiểu lầm thường gặp",
        content: `• ESFP không đồng nghĩa với kẻ chỉ biết tiệc tùng, nông cạn.
• Chức năng Se không có nghĩa là hời hợt.
• Chức năng Feeling không có nghĩa là phi lý trí.
• Chữ P không có nghĩa là thiếu tinh thần trách nhiệm với cuộc sống.`
      },
      {
        heading: "10. Hướng phát triển",
        content: `• Se cần góc nhìn dài hạn về tương lai.
• Fi cần tiếp nhận thông tin phản hồi khách quan từ thực tế.
• Te giúp biến sở thích nhất thời thành cam kết lâu dài.
• Ni giúp các trải nghiệm phong phú của hiện tại được tích hợp thành một định hướng cuộc đời trọn vẹn.`
      },
      {
        heading: "11. Mosaic diễn giải ESFP như thế nào?",
        content: `Mosaic không nhận diện ESFP qua mức độ vui vẻ hay hành vi hướng ngoại bề ngoài.

Hệ thống tìm kiếm cấu trúc nhận thức Se–Fi và so sánh toàn diện với ESTP, ISFP cùng toàn bộ 16 mẫu tham chiếu để tôn vinh sự độc bản của chính bạn.`
      },
      {
        heading: "12. Nguồn tham khảo",
        content: `1. Myers & Briggs Foundation — Type Dynamics; Best-Fit Type.
2. 16Personalities — Personality Roles Defined.`
      }
    ]
  }
};
