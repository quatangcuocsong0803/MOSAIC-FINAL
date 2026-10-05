export interface EnneagramSection {
  heading: string;
  content: string;
}

export interface EnneagramTypeData {
  title: string;
  subtitle: string;
  sections: EnneagramSection[];
}

export const enneagramData: Record<string, EnneagramTypeData> = {
  // ==========================================
  // TYPE 1 — NGƯỜI CẢI CÁCH
  // ==========================================
  "TYPE 1": {
    title: "TYPE 1 — NGƯỜI CẢI CÁCH",
    subtitle: "The Reformer — Sống đúng với tiêu chuẩn nội tại về điều đúng đắn, chính trực và cải thiện",
    sections: [
      {
        heading: "1. Type 1 trong hệ thống Enneagram",
        content: `Type 1 thường được gọi là The Reformer — Người Cải cách. Trong Enneagram, Type 1 không đơn giản là người sạch sẽ, có tổ chức, cầu toàn hay thích luật lệ. Những hành vi đó có thể xuất hiện ở nhiều type khác nhau. Điểm trung tâm của Type 1 nằm ở động lực muốn sống đúng với một tiêu chuẩn nội tại về điều gì là đúng, tốt, có trách nhiệm và có thể được cải thiện.

Enneagram Institute mô tả nỗi sợ nền tảng của Type 1 là trở nên sai trái, hư hỏng hoặc có khuyết điểm về mặt đạo đức; mong muốn nền tảng là trở thành người tốt, có integrity (chính trực) và sống cân bằng.

Vì vậy, một Type 1 có thể rất ngăn nắp, nhưng một Type 1 khác lại không đặc biệt quan tâm đến bàn làm việc hay lịch trình. Điều quan trọng hơn là cảm giác bên trong rằng: "Có một cách đúng hơn để làm việc này, và mình có trách nhiệm không bỏ qua nó."`
      },
      {
        heading: "2. Động lực cốt lõi (Core Motivation)",
        content: `Type 1 thường có xu hướng tự đánh giá mình bằng một tiêu chuẩn tương đối nghiêm. Họ cảm thấy chỉ "đủ tốt" vẫn chưa hoàn toàn đủ nếu biết rõ mình có khả năng làm tốt hơn.

Sự chú ý của Type 1 thường tự động bị kéo về phía:
• Điều gì chưa đúng hoặc thiếu nhất quán.
• Điều gì có thể sửa chữa và cải tiến.
• Trách nhiệm nào đang bị bỏ qua.
• Khoảng cách giữa thực tế và tiêu chuẩn mong muốn.

Type 1 không chỉ áp tiêu chuẩn lên người khác; nhiều người áp nó lên chính mình mạnh hơn rất nhiều. Đằng sau sự nghiêm túc là một giọng nói nội tâm (inner critic) liên tục đánh giá: "Mình nên làm tốt hơn", "Nếu biết điều đúng mà không làm, mình đang trở thành người như thế nào?".`
      },
      {
        heading: "3. Trung tâm bản năng (Instinctive Center)",
        content: `Type 1 nằm trong Instinctive Center (Trung tâm Bản năng), cùng với Type 8 và Type 9. Ba type này được nhóm quanh các chủ đề liên quan đến bản năng, quyền tự chủ, ranh giới và cơn giận (anger).

Ở Type 1, cơn giận thường không bùng nổ trực tiếp ra ngoài như Type 8, mà bị kiểm soát, nén lại hoặc chuyển hóa thành cảm giác bực bội âm ỉ (resentment), sự khó chịu (irritation), căng thẳng cơ thể và sự phê bình. Họ có thể nghĩ: "Mình không giận, chỉ là việc này rõ ràng đáng lẽ phải được làm đúng." Cơn giận xuất hiện dưới dạng thất vọng trước sự bất toàn (imperfection).`
      },
      {
        heading: "4. Cơ chế vận hành của Type 1",
        content: `Khi một tình huống xuất hiện, não bộ Type 1 tự động quét:
Thực tế → So sánh với tiêu chuẩn → Phát hiện sai lệch (discrepancy) → Thôi thúc sửa chữa ngay lập tức.

Pattern này tạo ra tính tận tâm, chính trực phi thường và khả năng duy trì chuẩn mực cao ngay cả khi không có ai giám sát. Tuy nhiên, nó cũng tạo áp lực nặng nề nếu mọi thứ liên tục bị chia thành hai cực: đúng/sai, nên/không nên, đủ tốt/chưa đủ tốt. Type 1 thường rất khó thực sự thư giãn khi biết vẫn còn việc "cần phải hoàn thành".`
      },
      {
        heading: "5. Khi Type 1 cân bằng (Healthy State)",
        content: `Ở trạng thái cân bằng, Type 1 trở nên có khả năng phân định sâu sắc (discerning): thấy rõ vấn đề mà không biến mọi khiếm khuyết thành khủng hoảng. Họ giữ vững nguyên tắc nhưng biết chấp nhận sự phức tạp của đời sống; họ cải tiến hệ thống nhưng không đòi hỏi con người phải hoàn hảo tuyệt đối.

Tiêu chuẩn không còn là cây roi để trừng phạt bản thân hay người khác, mà trở thành chiếc la bàn định hướng:
• "Cách này chưa tối ưu, nhưng không có nghĩa mọi thứ sụp đổ."
• "Mình có thể góp ý sửa chữa mà không cần kết án."
• "Một sai sót không biến mình thành một người tồi tệ."`
      },
      {
        heading: "6. Khi pattern trở nên cứng nhắc (Under Stress)",
        content: `Khi áp lực gia tăng, ranh giới giữa "mình có tiêu chuẩn" và "mọi thứ bắt buộc phải đạt tiêu chuẩn của mình" bắt đầu bị xóa nhòa. Type 1 có thể:
• Quá tập trung vào chi tiết vụn vặt cần sửa, khó lòng bỏ qua lỗi nhỏ.
• Thất vọng và phán xét khi người khác không có cùng cảm giác cấp bách.
• Cảm thấy tội lỗi khi nghỉ ngơi, tích tụ oán giận vì cảm giác chỉ có mình là người gánh vác trách nhiệm.
• Rơi vào cái bẫy "đạo đức hóa" (moralizing): biến thói quen hoặc sở thích cá nhân thành thước đo đạo đức (ví dụ: "Người đến muộn là người thiếu nhân cách").`
      },
      {
        heading: "7. Trong công việc và học tập",
        content: `Type 1 phát huy xuất sắc ở các môi trường đòi hỏi sự chuẩn xác, kiểm soát chất lượng, tính nhất quán và tinh thần trách nhiệm.

Tuy nhiên, Type 1 không giới hạn trong các ngành luật, kế toán hay quản lý. Một nghệ sĩ Type 1 có thể cực kỳ khắt khe về bố cục tác phẩm; một nhà nghiên cứu nghiêm ngặt với phương pháp luận; một lập trình viên dành nhiều tâm huyết cho code quality và kiến trúc hệ thống. Động lực hướng tới sự hoàn thiện vượt lên trên khuôn mẫu nghề nghiệp.`
      },
      {
        heading: "8. Trong các mối quan hệ",
        content: `Type 1 thường thể hiện tình yêu và sự quan tâm bằng cách cố gắng giúp người khác hoàn thiện hơn. Nghịch lý là đối phương đôi khi chỉ nghe thấy thông điệp: "Bạn chưa đủ tốt", trong khi thâm tâm Type 1 nghĩ: "Vì điều này quan trọng nên tôi muốn chúng ta cùng làm nó thật tốt."

Sự trưởng thành trong quan hệ đòi hỏi Type 1 học cách phân biệt giữa sự nâng đỡ (support) với sự chỉnh sửa (correction), hiểu rằng không phải khuyết điểm nào của người khác cũng cần mình can thiệp.`
      },
      {
        heading: "9. Type 1 với các Wings (1w9 & 1w2)",
        content: `• 1w9 (The Idealist - Người Lý Tưởng): Kết hợp động lực cải thiện của Type 1 với sự bình thản, tránh xung đột của Type 9. 1w9 thường điềm tĩnh, tự kiềm chế hơn và ít đối đầu trực diện ("Có cách làm đúng hơn; để mình tự xử lý trước"). Họ đặt nguyên tắc lên trước sự hòa hợp, khác với Type 9 đặt hòa hợp lên hàng đầu.

• 1w2 (The Advocate - Người Vận Động): Kết hợp động lực cải thiện của Type 1 với xu hướng hướng về con người của Type 2. Tiêu chuẩn không chỉ hướng vào hệ thống mà hướng vào con người: "Mình có thể giúp người này tốt lên như thế nào?". Họ chủ động hướng dẫn, can thiệp và hỗ trợ người khác.`
      },
      {
        heading: "10. Hướng phát triển (Growth Path)",
        content: `Type 1 không cần từ bỏ các tiêu chuẩn của mình. Sự chuyển hóa nằm ở việc:
• Chuyển từ "Cầu toàn cực đoan" (Perfection) sang "Sự thấu suốt sáng suốt" (Discernment).
• Chuyển từ "Phán xét" (Judgment) sang "Góp ý có đặt trong hoàn cảnh" (Contextual Correction).
• Chuyển từ "Phải làm" sang "Lựa chọn có ý thức".
• Chuyển từ "Tự chỉ trích" sang "Tự chịu trách nhiệm mà không tự trừng phạt".

Trong lý thuyết Enneagram, khi phát triển (Growth line), Type 1 kết nối với các phẩm chất lành mạnh của Type 7: cởi mở với sự ngẫu hứng, tận hưởng niềm vui và đón nhận những khả năng bất ngờ.`
      },
      {
        heading: "11. Mosaic diễn giải Type 1 như thế nào?",
        content: `Mosaic không phân loại Type 1 chỉ vì ai đó nói: "Tôi là người cầu toàn". Sự cầu toàn có thể xuất hiện ở Type 3 vì thành tích, Type 6 vì phòng ngừa rủi ro, hoặc Type 5 vì nhu cầu làm chủ năng lực.

Mosaic tập trung phân tích động lực sâu xa: "Tại sao việc làm đúng lại quan trọng đến mức độ đó đối với bạn?". Chúng tôi xem Type 1 như một cấu trúc tâm lý đề cao sự chính trực, chuẩn mực và trách nhiệm — không phải nhãn dán về một "người khó tính".`
      },
      {
        heading: "Nguồn tham khảo",
        content: `1. The Enneagram Institute — Type One: The Reformer; How the Enneagram System Works.
2. Hook et al. (2021) — The Enneagram: A systematic review of the literature and directions for future research. Journal of Clinical Psychology.`
      }
    ]
  },

  // ==========================================
  // TYPE 2 — NGƯỜI HỖ TRỢ
  // ==========================================
  "TYPE 2": {
    title: "TYPE 2 — NGƯỜI HỖ TRỢ",
    subtitle: "The Helper — Nhu cầu kết nối, yêu thương và cảm nhận giá trị bản thân trong mối quan hệ",
    sections: [
      {
        heading: "1. Type 2 trong hệ thống Enneagram",
        content: `Type 2 thường được gọi là The Helper — Người Hỗ trợ. Tuy nhiên, hành động giúp đỡ người khác không đủ để định nghĩa Type 2. Một Type 1 có thể giúp vì trách nhiệm, Type 6 vì lòng trung thành, Type 9 vì muốn hòa thuận, và Type 3 vì muốn trở thành người hữu ích.

Điểm sâu kín của Type 2 nằm ở nhu cầu được kết nối, được yêu thương và cảm nhận bản thân có giá trị trong mối quan hệ. Enneagram Institute mô tả nỗi sợ nền tảng của Type 2 là cảm giác không được ai cần đến, không xứng đáng được yêu; mong muốn nền tảng là được cảm nhận tình yêu thương chân thành.`
      },
      {
        heading: "2. Động lực cốt lõi (Core Motivation)",
        content: `Type 2 có ăng-ten cảm xúc cực kỳ nhạy bén trong các tương tác giữa người với người. Họ nhanh chóng nhận ra:
• Ai đang không ổn hoặc đang cần sự trợ giúp.
• Ai đang cảm thấy cô đơn, bị bỏ rơi.
• Mình có thể làm gì để kéo gần khoảng cách với đối phương.
• Mình cần trở thành mẫu người như thế nào để mối liên kết này được bền chặt.

Tâm điểm của Type 2 dễ chuyển từ "Mình thực sự muốn gì?" sang "Người kia đang cần gì ở mình?". Điều này tạo nên sự ấm áp, hào phóng thực sự, nhưng nếu diễn ra tự động, Type 2 dần đánh mất ý thức về nhu cầu của chính bản thân.`
      },
      {
        heading: "3. Trung tâm cảm xúc (Feeling Center)",
        content: `Type 2 thuộc Feeling Center (Trung tâm Cảm xúc), cùng Type 3 và Type 4. Cả ba type đều trăn trở về hình ảnh cá nhân (image), giá trị (value) và căn tính (identity) trong mối tương quan với người khác:
• Type 2 tìm kiếm giá trị thông qua mối quan hệ: "Tôi có ý nghĩa và quan trọng với bạn không?".
• Type 3 tìm kiếm giá trị thông qua thành tựu và sự công nhận: "Tôi đã đạt được những gì?".
• Type 4 tìm kiếm giá trị thông qua bản sắc độc bản và sự chân thực: "Tôi là ai trong sự khác biệt?".`
      },
      {
        heading: "4. Cơ chế vận hành của Type 2",
        content: `Khi bước vào một mối quan hệ, Type 2 tự nhiên quét:
Người kia cần gì → Mình có thể đáp ứng điều gì → Mối liên kết trở nên gắn bó hơn.

Mô hình này giúp Type 2 trở thành chỗ dựa tinh thần tuyệt vời. Rủi ro xuất hiện khi sự chăm sóc trở thành phương tiện gián tiếp để mưu cầu tình cảm. Thay vì dám bộc lộ "Tôi cần bạn", họ thể hiện qua hành động "Hãy nhìn xem tôi quan trọng và không thể thiếu đối với bạn đến mức nào".`
      },
      {
        heading: "5. Khi Type 2 cân bằng (Healthy State)",
        content: `Ở trạng thái lành mạnh, Type 2 vẫn ấm áp và hào sảng, nhưng sự giúp đỡ xuất phát từ tự do lựa chọn chứ không phải từ nỗi sợ bị bỏ rơi nếu mình không hữu dụng.

Họ học được cách hỏi: "Bạn có muốn tôi giúp không?" thay vì tự động áp đặt "Tôi biết điều gì tốt nhất cho bạn". Họ thấu hiểu chân lý sâu sắc: Tình yêu chân chính không phải là một món hàng phải đổi bằng sự hữu ích liên tục. Sự chăm sóc trở thành món quà tự do, không phải một phương tiện trao đổi cảm xúc.`
      },
      {
        heading: "6. Khi pattern trở nên cứng nhắc (Under Stress)",
        content: `Khi cảm giác bất an dâng cao, Type 2 có thể:
• Cho đi quá mức dẫn đến kiệt sức thể chất và tinh thần.
• Rất khó nói "Không", nhưng sau đó lại tích tụ nỗi oán giận vì cảm thấy người khác không biết trân trọng công sức của mình.
• Can thiệp thái quá vào đời tư của người khác với suy nghĩ mình biết rõ họ cần gì.
• Rơi vào cái bẫy "Hợp đồng ngầm" (Unspoken Contract): Miệng nói "Tôi không cần gì cả", nhưng thâm tâm trách móc "Sau tất cả những gì tôi hy sinh, bạn phải tự hiểu tôi cần gì chứ!".`
      },
      {
        heading: "7. Trong công việc và học tập",
        content: `Type 2 thể hiện xuất sắc ở những vị trí có sự kết nối con người, nhưng điều đó không có nghĩa họ chỉ làm y tế hay công tác xã hội.

Một kỹ sư Type 2 có thể là người đồng đội mà ai cũng muốn tìm đến để nhờ hỗ trợ kỹ thuật; một nhà quản lý Type 2 tạo nên sự đoàn kết gắn bó keo sơn trong tập thể; một nhà nghiên cứu Type 2 dành trọn tâm huyết cho việc dìu dắt thế hệ đàn em.`
      },
      {
        heading: "8. Trong các mối quan hệ",
        content: `Điểm mạnh vượt trội của Type 2 là sự chu đáo, nhạy bén và hết lòng vì người mình thương yêu. Thử thách lớn nhất là phân biệt giữa sự đồng hành (support) với việc biến mình thành người không thể thiếu (indispensable).

Type 2 cần học cách cho phép người khác có không gian để tự vấp ngã, tự giải quyết vấn đề và có những nhu cầu độc lập không liên quan đến mình.`
      },
      {
        heading: "9. Type 2 với các Wings (2w1 & 2w3)",
        content: `• 2w1 (The Servant - Người Phụng Sự): Kết hợp sự ấm áp của Type 2 với tinh thần trách nhiệm và chuẩn mực của Type 1. Việc giúp đỡ mang màu sắc bổn phận: "Đây là điều đúng đắn nên làm". 2w1 thường điềm đạm, nghiêm túc, tự chủ và ít phô trương hình ảnh hơn.

• 2w3 (The Host/Hostess - Người Chủ Nhà Duyên Dáng): Kết hợp tình cảm của Type 2 với nét duyên dáng, tham vọng và tài giao tiếp của Type 3. Họ hướng ngoại, cuốn hút và mong muốn sự giúp đỡ của mình tạo được sức ảnh hưởng cũng như sự ghi nhận rộng rãi.`
      },
      {
        heading: "10. Hướng phát triển (Growth Path)",
        content: `Hành trình thức tỉnh của Type 2 đạt được khi họ nhận ra:
• Nhu cầu của bản thân không phải là gánh nặng cho người khác.
• Tình yêu thương không cần phải mua bằng sự tận tụy không ngừng.
• Bày tỏ mong muốn trực tiếp tốt hơn rất nhiều việc kỳ vọng người khác tự đoán ý.
• Thiết lập ranh giới bảo vệ bản thân không đồng nghĩa với sự từ chối tình cảm.

Trong hệ thống Enneagram, khi phát triển (Growth line), Type 2 hướng tới các phẩm chất lành mạnh của Type 4: dám quay vào nội tâm, lắng nghe cảm xúc thật và trân trọng căn tính độc lập của chính mình.`
      },
      {
        heading: "11. Mosaic diễn giải Type 2 như thế nào?",
        content: `Mosaic không chỉ hỏi đơn thuần: "Bạn có thích giúp đỡ người khác không?". Câu hỏi mang tính bản chất hơn là: "Việc được người khác cần đến có ý nghĩa như thế nào đối với cảm giác về giá trị của bạn?".

Chúng tôi hướng tới việc khám phá động lực tiềm ẩn phía sau sự chăm sóc, tách biệt phẩm chất tốt bụng thông thường khỏi cơ chế tâm lý tìm kiếm sự chấp nhận.`
      },
      {
        heading: "Nguồn tham khảo",
        content: `1. The Enneagram Institute — Type Two: The Helper; How the Enneagram System Works.
2. Hook et al. (2021) — The Enneagram: A systematic review of the literature and directions for future research. Journal of Clinical Psychology.`
      }
    ]
  },

  // ==========================================
  // TYPE 3 — NGƯỜI THÀNH ĐẠT
  // ==========================================
  "TYPE 3": {
    title: "TYPE 3 — NGƯỜI THÀNH ĐẠT",
    subtitle: "The Achiever — Khát khao vươn tới thành công, khẳng định năng lực và xây dựng giá trị bản thân",
    sections: [
      {
        heading: "1. Type 3 trong hệ thống Enneagram",
        content: `Type 3 được gọi là The Achiever — Người Thành đạt. Tuy nhiên, khát khao thành tựu đơn thuần không đủ để định nghĩa Type 3: một Type 1 đạt thành tựu vì tiêu chuẩn, Type 5 vì nhu cầu làm chủ năng lực, còn Type 8 vì quyền tự chủ.

Với Type 3, thành tựu gắn liền mật thiết với cảm giác về giá trị cá nhân (personal worth). Enneagram Institute mô tả nỗi sợ nền tảng của Type 3 là cảm giác vô giá trị, bất tài; mong muốn nền tảng là cảm thấy bản thân có giá trị, được tôn trọng và thành công trong mắt cộng đồng.`
      },
      {
        heading: "2. Động lực cốt lõi (Core Motivation)",
        content: `Type 3 có khả năng nắm bắt nhạy bén tiêu chuẩn thành công của môi trường xung quanh:
• Trong trường học: Đó là điểm số và thành tích học tập.
• Trong sự nghiệp: Đó là chức danh, doanh số và sự thăng tiến.
• Trong nghệ thuật: Đó là sự độc đáo, giải thưởng và sự công nhận.
• Trong xã hội: Đó là hình ảnh một con người năng động, lịch thiệp và hiệu quả.

Khả năng thích ứng này mang lại động lực hành động mạnh mẽ. Thử thách xuất hiện khi câu nói "Tôi đạt được điều này" dần biến thành niềm tin "Tôi chỉ có giá trị khi tôi duy trì được thành công này".`
      },
      {
        heading: "3. Trung tâm cảm xúc (Feeling Center)",
        content: `Dù thuộc Feeling Center cùng Type 2 và Type 4, Type 3 thoạt nhìn thường không có vẻ "ủy mị hay giàu cảm xúc". Vấn đề cốt lõi của Trung tâm Cảm xúc ở đây là căn tính (identity) và giá trị bản thân.

Type 3 xử lý giá trị bản thân thông qua hiệu suất và hành động: "Tôi là người có giá trị khi tôi trở thành một người thành đạt". Cảm xúc cá nhân thường bị tạm gác sang một bên nếu nó bị coi là rào cản làm chậm tiến độ công việc.`
      },
      {
        heading: "4. Cơ chế vận hành của Type 3",
        content: `Khi tiếp cận một môi trường mới, Type 3 nhanh chóng giải mã:
Điều gì được đánh giá cao ở đây? → Mục tiêu cụ thể là gì? → Mình cần thể hiện hình ảnh ra sao để đạt được nó?

Mô hình này tạo ra sự linh hoạt và hiệu suất làm việc phi thường. Điểm nghẽn là ranh giới giữa mong muốn đích thực của nội tâm và "vai diễn thành công" (persona) dần bị xóa nhòa, khiến họ không còn chắc chắn mình thực sự muốn gì khi rời xa ánh đèn sân khấu.`
      },
      {
        heading: "5. Khi Type 3 cân bằng (Healthy State)",
        content: `Ở trạng thái cân bằng, Type 3 vẫn tràn đầy hoài bão nhưng thành công không còn là điều kiện tiên quyết để họ tự tôn trọng chính mình. Thành tựu trở thành sự bộc lộ tự nhiên của năng lực chứ không phải chiếc phao cứu sinh cho lòng tự trọng.

Họ học được cách:
• Dũng cảm thừa nhận thất bại và sai lầm như một phần của trải nghiệm.
• Lựa chọn mục tiêu vì ý nghĩa sâu sắc thực sự thay vì chỉ vì ánh hào quang bề nổi.
• Tận hưởng quá trình làm việc thay vì chỉ chăm chú vào kết quả cuối cùng.
• Thể hiện con người chân thật, gần gũi và liêm chính trong mọi tương tác.`
      },
      {
        heading: "6. Khi pattern trở nên cứng nhắc (Under Stress)",
        content: `Khi cảm giác bất an gia tăng, Type 3 có xu hướng:
• Đồng nhất toàn bộ nhân cách với năng suất lao động (workaholic).
• Liên tục so sánh bản thân với người khác và cảm thấy áp lực phải luôn dẫn đầu.
• Đánh bóng hình ảnh bề ngoài, giấu nhẹm điểm yếu hoặc sự kiệt sức bên trong.
• Gạt bỏ hoàn toàn cảm xúc cá nhân vì cho rằng "cảm xúc là thứ không tạo ra giá trị".
• Tiếp tục theo đuổi các mục tiêu mới ngay cả khi chúng không còn mang lại niềm vui hay ý nghĩa thực sự.`
      },
      {
        heading: "7. Trong công việc và học tập",
        content: `Type 3 phản ứng cực kỳ nhanh nhạy với các chỉ số đo lường hiệu quả (KPIs) và phản hồi từ môi trường.

Tuy nhiên, thành công của Type 3 không nhất thiết phải là chức vụ giám đốc hay tài chính. Một nghệ sĩ Type 3 theo đuổi sự hoàn hảo trong tác phẩm; một nhà hoạt động xã hội Type 3 nỗ lực tạo ra tác động cộng đồng lớn nhất; một nhà khoa học Type 3 tập trung vào số lượng công trình nghiên cứu được công bố. Mấu chốt là mối liên hệ giữa thành tựu và lòng tự tôn.`
      },
      {
        heading: "8. Trong các mối quan hệ",
        content: `Type 3 thường mang sự tháo vát vào tình cảm: giải quyết nhanh chóng mọi rắc rối, tạo dựng cuộc sống tiện nghi và là chỗ dựa vững chãi.

Tuy nhiên, sự gắn kết sâu sắc (intimacy) đòi hỏi những điều không thể đo đếm bằng hiệu suất: sự tổn thương, dũng cảm nói "Tôi đang bối rối", "Tôi thất bại rồi", hay "Tôi cần bạn nâng đỡ". Những lời bộc bạch này có thể khó khăn hơn bất kỳ đỉnh cao sự nghiệp nào đối với một Type 3 đang phòng thủ.`
      },
      {
        heading: "9. Type 3 với các Wings (3w2 & 3w4)",
        content: `• 3w2 (The Charmer - Người Lôi Cuốn): Kết hợp động lực thành công của Type 3 với nét duyên dáng, hòa đồng của Type 2. Thành công gắn liền với sự yêu mến, sức hút và khả năng kết nối xã hội ("Làm sao để mình vừa thành công rực rỡ vừa được mọi người quý mến?").

• 3w4 (The Professional - Chuyên Gia Đẳng Cấp): Thêm chiều sâu, tính độc bản và sự tinh tế từ Type 4. Thành công không chỉ là về đích, mà phải mang đậm dấu ấn cá nhân và phẩm vị riêng ("Tôi muốn thành công theo cách độc đáo mang bản sắc của riêng tôi"). Họ thường kín đáo và có chiều sâu nội tâm hơn.`
      },
      {
        heading: "10. Hướng phát triển (Growth Path)",
        content: `Sự chuyển hóa của Type 3 diễn ra khi họ học cách phân biệt:
• Năng lực làm việc (Achievement) không quyết định Giá trị con người (Worth).
• Sự linh hoạt thích ứng không đồng nghĩa với việc xóa bỏ con người thật.
• Hình ảnh thể hiện bên ngoài khác với bản chất sâu lắng bên trong.

Trong hệ thống Enneagram, khi phát triển (Growth line), Type 3 kết nối với phẩm chất lành mạnh của Type 6: cam kết gắn bó với tập thể, hành động vì lợi ích chung và cống hiến cho những lý tưởng lớn lao hơn vinh quang cá nhân.`
      },
      {
        heading: "11. Mosaic diễn giải Type 3 như thế nào?",
        content: `Mosaic không đánh giá một người là Type 3 chỉ vì họ có tham vọng lớn. Câu hỏi cốt lõi là: "Nếu một ngày mọi thành công và danh vị biến mất, cảm nhận về giá trị bản thân của bạn sẽ thay đổi như thế nào?".

Chúng tôi hướng tới việc giúp bạn nhận diện mối gắn kết giữa năng suất và sự tự chấp nhận, giải phóng bạn khỏi áp lực phải luôn hoàn hảo trong mắt người khác.`
      },
      {
        heading: "Nguồn tham khảo",
        content: `1. The Enneagram Institute — Type Three: The Achiever; How the Enneagram System Works.
2. Hook et al. (2021) — The Enneagram: A systematic review of the literature and directions for future research. Journal of Clinical Psychology.`
      }
    ]
  },

  // ==========================================
  // TYPE 4 — NGƯỜI CÁ TÍNH
  // ==========================================
  "TYPE 4": {
    title: "TYPE 4 — NGƯỜI CÁ TÍNH",
    subtitle: "The Individualist — Khám phá căn tính sâu sắc, tính chân thực và biểu đạt ý nghĩa độc bản",
    sections: [
      {
        heading: "1. Type 4 trong hệ thống Enneagram",
        content: `Type 4 thường được gọi là The Individualist — Người Cá tính. Tuy nhiên, sự sáng tạo, tính nhạy cảm hay khiếu nghệ thuật đơn thuần không đủ để định nghĩa Type 4. Type 4 được tổ chức sâu sắc quanh căn tính (identity), ý nghĩa (significance) và cảm giác rằng có một điều cốt lõi độc bản về bản thân cần được tìm thấy và biểu đạt trung thực.

Enneagram Institute mô tả nỗi sợ nền tảng của Type 4 là sự tầm thường, thiếu bản sắc riêng hoặc không có ý nghĩa cá nhân; mong muốn nền tảng là tìm thấy chính mình và ý nghĩa độc đáo của mình trong cuộc đời.`
      },
      {
        heading: "2. Động lực cốt lõi (Core Motivation)",
        content: `Type 4 có sự kết nối mãnh liệt với thế giới cảm xúc nội tâm. Một rung động không chỉ là thoáng qua, mà trở thành manh mối giúp họ trả lời câu hỏi: "Điều này nói lên điều gì về con người tôi?".

Sự chú ý của Type 4 thường hướng về:
• Những điều sâu sắc, giàu ý nghĩa nhân sinh.
• Những điều còn thiếu vắng hoặc chưa trọn vẹn trong thực tại.
• Nét độc đáo làm nên sự khác biệt giữa trải nghiệm này với trải nghiệm khác.
• Nỗi trăn trở liệu người khác có thực sự thấu hiểu thế giới tâm hồn của mình hay không.

Điểm mạnh của Type 4 là chiều sâu cảm xúc phi thường. Thử thách là họ dễ đồng nhất toàn bộ nhân cách với những trạng thái cảm xúc nhất thời.`
      },
      {
        heading: "3. Trung tâm cảm xúc (Feeling Center)",
        content: `Cùng thuộc Feeling Center với Type 2 và Type 3, nhưng cách giải quyết của Type 4 hoàn toàn khác biệt:
• Nếu Type 2 tìm giá trị qua mối quan hệ và Type 3 tìm giá trị qua thành tựu, thì Type 4 tìm kiếm giá trị thông qua sự chân thực nội tâm (authenticity) và bản sắc riêng biệt.
• Câu hỏi trung tâm của Type 4 là: "Tôi thực sự là ai nếu bỏ đi tất cả những nhãn dán hời hợt của xã hội?".`
      },
      {
        heading: "4. Cơ chế vận hành của Type 4",
        content: `Khi trải nghiệm một sự việc, Type 4 tự nhiên đào sâu:
Nó có ý nghĩa gì? → Nó chạm đến phần nào trong tâm hồn mình? → Điều gì trong bức tranh này vẫn còn thiếu vắng?

Quá trình này mang lại khả năng tự nhận thức tuyệt vời. Tuy nhiên, việc liên tục tập trung vào những điều còn thiếu (absence) dễ khiến thực tại bình dị trở nên nhạt nhòa khi so sánh với một lý tưởng hoàn mỹ trong tâm tưởng. Mối quan hệ thực tế có thể bị so sánh với một sự gắn kết tri kỷ huyền thoại; một thành quả có thật có thể bị hạ thấp chỉ vì "nó chưa đúng với cảm giác nguyên bản mình muốn".`
      },
      {
        heading: "5. Khi Type 4 cân bằng (Healthy State)",
        content: `Ở trạng thái lành mạnh, Type 4 vẫn giữ trọn vẹn chiều sâu cảm xúc nhưng không để mọi nỗi buồn biến thành bản án danh tính. Họ có thể trải nghiệm nỗi buồn mà không vội kết luận rằng cuộc đời mình mang một khiếm khuyết cơ bản.

Họ học cách kiến tạo ý nghĩa ngay từ những điều bình dị của đời thường thay vì chỉ chờ đợi những rung động mãnh liệt. Type 4 khỏe mạnh có khả năng sáng tạo vượt bậc, trung thực với cảm xúc và có năng lực chuyển hóa những nỗi đau cá nhân thành tác phẩm hoặc nguồn cảm hứng chữa lành cho cộng đồng.`
      },
      {
        heading: "6. Khi pattern trở nên cứng nhắc (Under Stress)",
        content: `Khi áp lực nội tâm gia tăng, Type 4 có thể:
• Đồng nhất quá mức với cảm xúc: tin rằng cảm giác của mình chính là chân lý tuyệt đối về con người mình.
• Lãng mạn hóa nỗi đau và những điều mất mát.
• Rơi vào cái bẫy so sánh và cảm thấy bản thân hoàn toàn khác biệt, bị cô lập ("Không ai hiểu được tôi").
• Rút lui khỏi các hoạt động xã hội vì sợ bị hiểu lầm hoặc thấy đời sống thường nhật quá dung tục, tầm thường.
• Khó duy trì kỷ luật và các thói quen thường nhật vì "chưa có cảm hứng".`
      },
      {
        heading: "7. Trong công việc và học tập",
        content: `Type 4 yêu thích công việc cho phép họ biểu đạt ý nghĩa và dấu ấn cá nhân, nhưng điều đó không có nghĩa mọi Type 4 đều phải làm họa sĩ hay nhà thơ.

Một nhà toán học Type 4 tìm thấy căn tính trong vẻ đẹp thanh nhã của các định lý; một lập trình viên coi việc viết code như một nghệ thuật thủ công tinh xảo; một bác sĩ Type 4 được thôi thúc bởi chiều sâu nhân bản trong nỗi đau của bệnh nhân. Động lực hướng tới ý nghĩa sâu sắc mới là điều định hình Type 4.`
      },
      {
        heading: "8. Trong các mối quan hệ",
        content: `Type 4 khao khát được nhìn nhận và thấu hiểu một cách chính xác bản chất con người mình, chứ không chỉ đơn thuần là những lời khen ngợi xã giao. Một lời khen hời hợt ít có giá trị bằng cảm giác: "Người này thực sự chạm đến cõi lòng mình".

Thử thách là việc kỳ vọng cường độ cảm xúc quá cao có thể khiến họ đánh giá thấp những tình cảm chân thành, bền bỉ nhưng giản dị của đời thường. Tình yêu đích thực không nhất thiết lúc nào cũng phải bi tráng để có ý nghĩa.`
      },
      {
        heading: "9. Type 4 với các Wings (4w3 & 4w5)",
        content: `• 4w3 (The Aristocrat - Người Quý Tộc Tinh Tế): Giữ vững chiều sâu căn tính của Type 4 nhưng kết hợp thêm ý thức về hình ảnh, mục tiêu và sự ghi nhận từ Type 3. Tác phẩm của họ không chỉ cần chân thực mà còn muốn được thế giới nhìn thấy và tôn vinh. 4w3 thường hoạt bát, có gu thẩm mỹ sắc sảo và hướng ngoại hơn.

• 4w5 (The Bohemian - Kẻ Lãng Tử Chiêm Nghiệm): Kết hợp chiều sâu của Type 4 với sự tĩnh lặng, độc lập tri thức của Type 5. Họ có xu hướng thu mình vào thế giới riêng của các biểu tượng, triết học và phân tích tâm lý. Họ ít màng tới sự công nhận bên ngoài hơn và đề cao việc bảo vệ không gian riêng tư.`
      },
      {
        heading: "10. Hướng phát triển (Growth Path)",
        content: `Sự phát triển của Type 4 đòi hỏi một bước chuyển biến quan trọng:
• Chuyển từ "Phải đợi cảm xúc hoàn hảo mới hành động" sang "Hành động có trách nhiệm ngay cả khi cảm xúc chưa hoàn hảo".
• Chuyển từ việc xem "Căn tính là cảm xúc nhất thời" sang "Căn tính được xây đắp qua những lựa chọn hành động thực tế".

Trong hệ thống Enneagram, khi phát triển (Growth line), Type 4 kết nối với các phẩm chất lành mạnh của Type 1: tính kỷ luật khách quan, khả năng tổ chức thực tế và tinh thần trách nhiệm với hiện thực.`
      },
      {
        heading: "11. Mosaic diễn giải Type 4 như thế nào?",
        content: `Mosaic không đánh giá Type 4 chỉ vì ai đó "hay buồn" hay "yêu nghệ thuật". Chúng tôi quan sát mối quan hệ giữa tâm trí bạn với căn tính và cảm giác về sự trọn vẹn:

"Khi cảm thấy thiếu vắng một điều gì đó, bạn có dễ cho rằng bản thân mình chưa hoàn chỉnh hoặc sinh ra không dành cho thế giới này không?". Mosaic tìm kiếm động lực về tính chân thực và căn tính độc bản, giải phóng bạn khỏi sự giam cầm của những cảm xúc tiêu cực.`
      },
      {
        heading: "Nguồn tham khảo",
        content: `1. The Enneagram Institute — Type Four: The Individualist; How the Enneagram System Works.
2. Hook et al. (2021) — The Enneagram: A systematic review of the literature and directions for future research. Journal of Clinical Psychology.`
      }
    ]
  },

  // ==========================================
  // TYPE 5 — NGƯỜI KHẢO SÁT
  // ==========================================
  "TYPE 5": {
    title: "TYPE 5 — NGƯỜI KHẢO SÁT",
    subtitle: "The Investigator — Thấu hiểu thế giới, bảo toàn năng lượng và làm chủ năng lực chuyên môn",
    sections: [
      {
        heading: "1. Type 5 trong hệ thống Enneagram",
        content: `Type 5 thường được gọi là The Investigator — Người Khảo sát. Định kiến thông thường hay gắn nhãn Type 5 là "người hướng nội mọt sách". Nhưng sự thông minh hay tính trầm lặng không định nghĩa Type 5.

Cốt lõi tâm lý của Type 5 liên quan đến năng lực làm chủ (competence), sự độc lập tự chủ (autonomy) và cảm giác có đủ nguồn lực nội tâm để đối diện với những đòi hỏi của thế giới bên ngoài. Enneagram Institute mô tả nỗi sợ nền tảng của Type 5 là cảm giác bất lực, vô dụng hoặc không đủ năng lực; mong muốn nền tảng là trở nên có năng lực, hiểu biết sâu sắc và làm chủ lĩnh vực của mình.`
      },
      {
        heading: "2. Động lực cốt lõi (Core Motivation)",
        content: `Type 5 có xu hướng muốn hiểu thấu đáo mọi quy luật trước khi dấn thân hành động. Trước một yêu cầu từ môi trường, phản xạ đầu tiên thường là: "Mình có đủ kiến thức, năng lượng và năng lực cho việc này không?".

Kiến thức trở thành tấm khiên phòng vệ vững chắc; sự xa cách (distance) trở thành phương thức bảo vệ nguồn năng lượng cá nhân. Type 5 không nhất thiết xa lánh con người vì ghét bỏ xã hội, mà vì họ cảm thấy các tương tác xã hội tiêu tốn quá nhiều băng thông tinh thần (bandwidth).`
      },
      {
        heading: "3. Trung tâm tư duy (Thinking Center)",
        content: `Type 5 thuộc Thinking Center (Trung tâm Tư duy), cùng Type 6 và Type 7. Ba type này xử lý sự bất định và nỗi âu lo (anxiety) theo ba chiến lược khác nhau:
• Type 5: Thu mình lại → Tìm hiểu bản chất → Xây dựng năng lực phòng bị.
• Type 6: Quét rủi ro → Kiểm chứng niềm tin → Tìm kiếm sự đảm bảo.
• Type 7: Mở ra vô số khả năng → Chuyển hướng chú ý → Thoát khỏi sự giới hạn.`
      },
      {
        heading: "4. Cơ chế vận hành của Type 5",
        content: `Khi đối mặt với đòi hỏi từ bên ngoài, Type 5 vận hành theo chuỗi:
Lùi lại quan sát → Thu thập thông tin → Xây dựng mô hình hiểu biết vững chắc → Khi đã sẵn sàng mới tham gia.

Mô hình này giúp Type 5 có khả năng tập trung sâu sắc phi thường (deep work). Thử thách là ảo tưởng: "Nếu mình hiểu biết đủ nhiều, mình sẽ không còn cảm giác bị quá tải". Vấn đề là tiêu chuẩn "thế nào là đủ" liên tục bị đẩy ra xa, khiến họ trì hoãn hành động thực tế.`
      },
      {
        heading: "5. Khi Type 5 cân bằng (Healthy State)",
        content: `Ở trạng thái lành mạnh, Type 5 không chỉ tích lũy tri thức mà còn đem tri thức vào đời sống. Họ dũng cảm bước vào tình huống thực tế ngay cả khi chưa cảm thấy hoàn toàn sẵn sàng 100%.

Họ hào phóng chia sẻ những hiểu biết sâu sắc thay vì chỉ giữ khư khư trong không gian riêng. Họ nhận ra rằng năng lượng không chỉ được bảo tồn bằng cách thu mình, mà việc tham gia vào những mối quan hệ và mục tiêu có ý nghĩa còn là nguồn tái tạo năng lượng vô tận. Họ trở thành những người có tầm nhìn tiên phong, sâu sắc và đầy sáng tạo.`
      },
      {
        heading: "6. Khi pattern trở nên cứng nhắc (Under Stress)",
        content: `Khi cảm giác quá tải tăng cao, Type 5 có thể:
• Rút lui quá mức vào thế giới riêng, cắt đứt kết nối với thực tế.
• Trí tuệ hóa cảm xúc (intellectualize): dùng lý lẽ để mổ xẻ thay vì thực sự cảm nhận nỗi đau hay tình yêu.
• Giữ chặt thời gian và năng lượng một cách cứng nhắc, luôn coi đòi hỏi của người khác là sự xâm lấn.
• Tích trữ kiến thức như một mục đích tự thân mà không bao giờ chuyển hóa thành hành động.
• Rơi từ ranh giới lành mạnh (privacy) sang sự cô lập hoàn toàn (isolation).`
      },
      {
        heading: "7. Trong công việc và học tập",
        content: `Type 5 tỏa sáng ở những lĩnh vực đòi hỏi tính chuyên môn hóa cao, sự độc lập và khả năng tư duy với các hệ thống phức tạp.

Tuy nhiên, "Type 5 = lập trình viên hay nhà khoa học" là định kiến hạn hẹp. Một vũ công Type 5 có thể nghiên cứu cơ sinh học và chuyển động ở chiều sâu đáng kinh ngạc; một đầu bếp Type 5 say mê tìm hiểu phản ứng hóa học của từng nguyên liệu; một nhà sử học Type 5 đắm mình trong kho lưu trữ để tái hiện quy luật của quá khứ.`
      },
      {
        heading: "8. Trong các mối quan hệ",
        content: `Type 5 cần nhiều không gian riêng tư để nạp lại năng lượng. Điều này không có nghĩa là họ yêu ít hơn hay thiếu tình cảm.

Thử thách lớn nhất là: một mối quan hệ đích thực đòi hỏi sự hiện diện và tương tác trước khi mọi thứ có thể được phân tích rành mạch. Người bạn đời không phải là một hệ thống kỹ thuật để bạn có thể giải mã hoàn chỉnh rồi mới bắt đầu chung sống.`
      },
      {
        heading: "9. Type 5 với các Wings (5w4 & 5w6)",
        content: `• 5w4 (The Iconoclast - Nhà Tư Tưởng Độc Đạo): Kết hợp năng lực tri thức của Type 5 với chiều sâu thẩm mỹ, căn tính độc bản của Type 4. Họ tìm kiếm tri thức không chỉ để hiểu thế giới mà còn để xây dựng một góc nhìn mang đậm dấu ấn riêng. Họ kín đáo, nhạy cảm và thường bị cuốn hút bởi các chủ đề ngách (niche).

• 5w6 (The Problem Solver - Người Giải Quyết Vấn Đề): Kết hợp tư duy phân tích của Type 5 với sự cẩn trọng, chú ý hệ thống và tính thực tế của Type 6. Tri thức phục vụ cho việc ứng dụng: "Hiểu hệ thống vận hành thế nào để dự đoán và phòng ngừa rủi ro". Họ có tính tổ chức và định hướng giải pháp rõ ràng hơn.`
      },
      {
        heading: "10. Hướng phát triển (Growth Path)",
        content: `Sự trưởng thành của Type 5 là hành trình dũng cảm bước ra thế giới:
• Chuyển từ "Quan sát thụ động" sang "Dấn thân hành động".
• Chuyển từ "Tích trữ kiến thức phòng thủ" sang "Ứng dụng tri thức tạo giá trị".
• Chuyển từ "Cảm thấy chưa đủ chuẩn bị" sang "Đã đủ tự tin để bắt đầu ngay hôm nay".

Trong hệ thống Enneagram, khi phát triển (Growth line), Type 5 kết nối với những phẩm chất lành mạnh của Type 8: sự tự tin quyết đoán, tinh thần lãnh đạo trực tiếp và khả năng làm chủ thực tại bằng sức mạnh thể chất và tinh thần.`
      },
      {
        heading: "11. Mosaic diễn giải Type 5 như thế nào?",
        content: `Mosaic không đánh giá Type 5 chỉ vì bạn "thích ở một mình" hay "thích đọc sách". Câu hỏi mang tính bản chất hơn là: "Bạn có sử dụng tri thức và khoảng cách như một phương tiện để cảm thấy mình đủ năng lực đối diện với những đòi hỏi của cuộc đời hay không?".

Mosaic giúp bạn nhìn thấu cơ chế phòng vệ của tâm trí để tự tin bước ra khỏi pháo đài tri thức của chính mình.`
      },
      {
        heading: "Nguồn tham khảo",
        content: `1. The Enneagram Institute — Type Five: The Investigator; How the Enneagram System Works.
2. Hook et al. (2021) — The Enneagram: A systematic review of the literature and directions for future research. Journal of Clinical Psychology.`
      }
    ]
  },

  // ==========================================
  // TYPE 6 — NGƯỜI TRUNG THÀNH
  // ==========================================
  "TYPE 6": {
    title: "TYPE 6 — NGƯỜI TRUNG THÀNH",
    subtitle: "The Loyalist — Định vị an toàn, kiến tạo niềm tin vững chắc và dự liệu mọi rủi ro",
    sections: [
      {
        heading: "1. Type 6 trong hệ thống Enneagram",
        content: `Type 6 được gọi là The Loyalist — Người Trung thành. Tuy nhiên, lòng trung thành một mình không đủ để định hình Type 6. Cốt lõi sâu kín của Type 6 nằm ở mối quan hệ với sự bất định (uncertainty), nhu cầu an toàn (security), niềm tin (trust) và sự tự tin nội tại.

Enneagram Institute mô tả nỗi sợ nền tảng của Type 6 là thiếu sự hỗ trợ, mất phương hướng và dễ bị tổn thương trước hiểm họa; mong muốn nền tảng là có được sự an toàn và chỗ dựa vững chắc.

Type 6 là kiểu tính cách có biểu hiện đa dạng và đối lập nhất: họ có thể thận trọng hoặc nổi loạn, tìm kiếm chỗ dựa hoặc phản kháng quyền lực, lo âu e dè hoặc chủ động đối đầu một cách dũng mãnh.`
      },
      {
        heading: "2. Động lực cốt lõi (Core Motivation)",
        content: `Trước một tình huống mơ hồ, tâm trí Type 6 lập tức kích hoạt chế độ radar quét rủi ro:
• Điều gì có thể diễn biến tồi tệ?
• Ai là người thực sự đáng tin cậy ở đây?
• Thông tin này có kẽ hở nào không?
• Kế hoạch dự phòng (Plan B) là gì nếu mọi thứ đổ vỡ?
• Người có thẩm quyền này có thực sự liêm chính và công tâm không?

Đây không phải là sự bi quan đơn thuần, mà là phương thức tư duy hướng tới hiểm họa (threat-oriented cognition) nhằm chủ động xây dựng vùng an toàn. Type 6 là những người vô cùng dũng cảm vì họ ý thức rất rõ về rủi ro nhưng vẫn chọn tiến lên phía trước.`
      },
      {
        heading: "3. Trung tâm tư duy & Phân nhánh Phobic / Counterphobic",
        content: `Nằm trong Thinking Center, Type 6 xử lý nỗi âu lo thông qua chuỗi hành động: Kiểm tra → Thử nghiệm → Tìm kiếm sự chắc chắn → Lại tiếp tục kiểm tra.

Biểu hiện của Type 6 được chia thành hai dạng chính:
• Phobic (Thu mình cẩn trọng): Đối diện với nỗi sợ bằng sự thận trọng, tuân thủ nguyên tắc, tìm kiếm đồng minh và kế hoạch an toàn.
• Counterphobic (Đối đầu chủ động): Đối diện với nỗi sợ bằng cách lao thẳng vào nó ("Nếu điều đó nguy hiểm, mình sẽ đối đầu với nó trước để giành thế chủ động"). Dạng này dễ bị nhầm lẫn với Type 8, nhưng động lực sâu xa vẫn là để giải quyết nỗi sợ và kiểm soát rủi ro chứ không phải mưu cầu quyền tự chủ tuyệt đối.`
      },
      {
        heading: "4. Cơ chế vận hành của Type 6",
        content: `Mô hình chuẩn của Type 6:
Phát hiện bất định → Quét rủi ro → Thu thập dữ liệu / Tìm chỗ dựa → Thử nghiệm độ tin cậy → Thận trọng tiến lên.

Khi căng thẳng tăng cao, họ rơi vào vòng lặp mệt mỏi: Quét rủi ro → Nghi ngờ → Tìm kiếm sự cam kết → Lại nghi ngờ chính lời cam kết đó → Tiếp tục quét rủi ro. Họ cần ghi nhớ một chân lý quan trọng: "Sự chắc chắn tuyệt đối (Certainty) không đồng nghĩa với Sự an toàn (Safety)". Không có lượng kiểm tra nào có thể loại bỏ hoàn toàn sự bất định của cuộc sống.`
      },
      {
        heading: "5. Khi Type 6 cân bằng (Healthy State)",
        content: `Ở trạng thái cân bằng, Type 6 tạo ra bước nhảy vĩ đại: chuyển từ việc tìm kiếm điểm tựa bên ngoài sang việc xây dựng niềm tin vững chãi vào chính mình (internal trust).

Họ hiểu rằng rủi ro luôn tồn tại nhưng không cần phải triệt tiêu rủi ro đến 0% mới có thể hành động. Họ biến sự hoài nghi thành công cụ tư duy phản biện sắc bén thay vì để nó giam cầm tâm trí. Type 6 khỏe mạnh là những người đồng đội đáng tin cậy nhất, giàu tinh thần hợp tác, kiên cường và đầy lòng quả cảm.`
      },
      {
        heading: "6. Khi pattern trở nên cứng nhắc (Under Stress)",
        content: `Khi nỗi bất an chi phối, Type 6 có thể:
• Thổi phồng nguy cơ (catastrophize), hình dung ra những kịch bản xấu nhất.
• Liên tục thử thách lòng trung thành của người khác một cách vô lý.
• Nhìn thế giới theo lăng kính nhị phân cứng nhắc: an toàn tuyệt đối hoặc nguy hiểm tột cùng.
• Vừa muốn có người dẫn dắt rõ ràng, vừa liên tục chống đối và nghi ngờ quyền lực.
• Trì hoãn việc ra quyết định quan trọng vì luôn cảm thấy "chưa đủ thông tin chắc chắn".`
      },
      {
        heading: "7. Trong công việc và học tập",
        content: `Type 6 là bậc thầy về giải quyết sự cố (troubleshooting), đánh giá rủi ro và xây dựng phương án ứng phó khủng hoảng.

Họ hiện diện ở mọi ngành nghề: một nhà lập trình Type 6 thiết kế hệ thống chịu lỗi xuất sắc; một nhà biên kịch Type 6 dự liệu chính xác phản ứng của khán giả; một nhà quản lý Type 6 thấy trước những xung đột tiềm ẩn trong đội ngũ để kịp thời hóa giải.`
      },
      {
        heading: "8. Trong các mối quan hệ",
        content: `Niềm tin (trust) là trung tâm của mọi mối quan hệ đối với Type 6. Khi đã trao gửi niềm tin, họ là những người bạn, người bạn đời trung thành và tận tụy nhất.

Thử thách lớn nhất là sự bất định có thể kích hoạt các đợt kiểm tra: "Bạn có thực sự nghĩ như vậy không? Có điều gì bạn đang giấu tôi không?". Một mối quan hệ lành mạnh đòi hỏi Type 6 học cách chấp nhận rằng chúng ta không thể kiểm soát hay biết hết mọi suy nghĩ của người khác.`
      },
      {
        heading: "9. Type 6 với các Wings (6w5 & 6w7)",
        content: `• 6w5 (The Defender - Người Bảo Vệ Kiên Định): Kết hợp sự cẩn trọng của Type 6 với tư duy nghiên cứu, phân tích độc lập của Type 5. Họ xử lý nỗi sợ thông qua tri thức, nghiên cứu và hệ thống chuyên môn. 6w5 thường trầm lặng, kín tiếng, hoài nghi và thiên về kỹ thuật hơn.

• 6w7 (The Buddy - Người Bạn Đồng Hành Nhiệt Thành): Kết hợp sự an toàn của Type 6 với tính hòa đồng, hài hước và năng động của Type 7. Họ giải tỏa căng thẳng thông qua tiếng cười, giao lưu bạn bè và sự lạc quan. 6w7 có tính xã hội cao hơn và dễ mến hơn.`
      },
      {
        heading: "10. Hướng phát triển (Growth Path)",
        content: `Con đường thức tỉnh của Type 6 đòi hỏi:
• Chuyển từ "Hoài nghi tê liệt" sang "Niềm tin có căn cứ".
• Chuyển từ "Tìm kiếm sự bảo đảm bên ngoài" sang "Lắng nghe tiếng nói thẩm quyền nội tâm".
• Chuyển từ "Cố gắng loại bỏ bất định" sang "Bình thản đón nhận sự khó đoán của cuộc sống".

Trong hệ thống Enneagram, khi phát triển (Growth line), Type 6 kết nối với phẩm chất lành mạnh của Type 9: sự tĩnh tại nội tâm, sự điềm đạm, bớt phản ứng thái quá và sống an nhiên giữa những biến động.`
      },
      {
        heading: "11. Mosaic diễn giải Type 6 như thế nào?",
        content: `Mosaic không phân loại Type 6 chỉ vì ai đó "hay lo lắng". Nỗi lo âu có thể xuất hiện ở bất kỳ ai. Chúng tôi tìm kiếm cấu trúc động lực xoay quanh niềm tin, điểm tựa và cách bạn phản ứng trước sự bất định.

Một Type 6 phản kháng (Counterphobic) có thể tự nhận mình không sợ điều gì, nhưng Mosaic nhìn thấu được lòng dũng cảm thực sự phía sau lớp áo giáp ấy.`
      },
      {
        heading: "Nguồn tham khảo",
        content: `1. The Enneagram Institute — Type Six: The Loyalist; How the Enneagram System Works.
2. Hook et al. (2021) — The Enneagram: A systematic review of the literature and directions for future research. Journal of Clinical Psychology.`
      }
    ]
  },

  // ==========================================
  // TYPE 7 — NGƯỜI NHIỆT HUYẾT
  // ==========================================
  "TYPE 7": {
    title: "TYPE 7 — NGƯỜI NHIỆT HUYẾT",
    subtitle: "The Enthusiast — Khát khao tự do, trải nghiệm phong phú và khả năng tái định hình tích cực",
    sections: [
      {
        heading: "1. Type 7 trong hệ thống Enneagram",
        content: `Type 7 thường được gọi là The Enthusiast — Người Nhiệt huyết. Định kiến phổ biến thường biến Type 7 thành người hướng ngoại, ham tiệc tùng và không thể ngồi yên.

Tuy nhiên, cấu trúc sâu sắc của Type 7 xoay quanh sự tự do (freedom), sự thỏa mãn (satisfaction) và cơ chế né tránh nỗi đau cũng như sự tước đoạt (avoidance of pain/deprivation). Enneagram Institute mô tả nỗi sợ nền tảng của Type 7 là bị giam cầm trong nỗi đau, thiếu thốn; mong muốn nền tảng là được tự do, hạnh phúc trọn vẹn và các nhu cầu được thỏa mãn.`
      },
      {
        heading: "2. Động lực cốt lõi (Core Motivation)",
        content: `Type 7 cực kỳ nhạy cảm trước các tiềm năng và cơ hội mới. Khi một giới hạn xuất hiện, tâm trí họ tự động hỏi: "Còn có lựa chọn nào khác ở đây?".

Khả năng tái định hình (reframing) của họ rất phi thường: một khó khăn ngay lập tức được nhìn nhận dưới một góc độ mới đầy hứa hẹn. Tuy nhiên, chính năng lực tuyệt vời này cũng có thể trở thành con đường tẩu thoát (escape route) giúp họ trốn tránh cảm giác khó chịu hoặc nỗi buồn cần được đối diện.`
      },
      {
        heading: "3. Trung tâm tư duy (Thinking Center)",
        content: `Dù thuộc Thinking Center cùng Type 5 và Type 6, Type 7 thoạt nhìn ít có vẻ là "người thiên về suy nghĩ" vì họ luôn tràn đầy năng lượng hành động.

Thực chất, chiến lược đối phó với nỗi âu lo của Type 7 mang tính nhận thức rất cao: Tái định hình thực tế → Lên kế hoạch cho tương lai → Chuyển hướng sự chú ý → Giữ cho mọi cánh cửa cơ hội luôn rộng mở. Thay vì đắm mình trong nỗi đau hiện tại, tâm trí họ lập tức bay tới những viễn cảnh tươi đẹp ngày mai.`
      },
      {
        heading: "4. Cơ chế vận hành của Type 7",
        content: `Chuỗi phản ứng của Type 7:
Cảm giác gò bó/đau đớn xuất hiện → Lập tức phát sinh ý tưởng mới → Hào hứng đón đợi → Chuyển động hướng tới mục tiêu tiếp theo.

Ở trạng thái lành mạnh, đây là tinh thần phục hồi phi thường (resilience). Khi trở nên cứng nhắc, nó biến thành thói quen: Cảm thấy khó chịu → Trốn chạy trước khi kịp chiêm nghiệm → Tìm kiếm kích thích mới. Sự trốn chạy không nhất thiết là đi bar hay du lịch; nó có thể là việc liên tục nhảy sang một ý tưởng, một dự án hay một sở thích tri thức mới.`
      },
      {
        heading: "5. Khi Type 7 cân bằng (Healthy State)",
        content: `Ở trạng thái cân bằng, Type 7 vẫn giữ nguyên niềm đam mê cuộc sống nhưng rèn luyện được năng lực "ở lại" (staying capacity):
• Ở lại với một dự án ngay cả khi sự mới lạ ban đầu đã nhạt dần.
• Ở lại và đối diện với những cảm xúc khó khăn mà không vội vàng tô hồng chúng.
• Ở lại với một sự lựa chọn duy nhất dù biết rằng vẫn còn vô số ngã rẽ khác.

Sự thỏa mãn không còn đến từ việc tích lũy vô tận các trải nghiệm bề nổi, mà đến từ khả năng trải nghiệm sâu sắc và trọn vẹn những gì đang hiện diện ngay trước mắt. Họ trở nên tập trung, biết ơn và tĩnh tại.`
      },
      {
        heading: "6. Khi pattern trở nên cứng nhắc (Under Stress)",
        content: `Khi nỗi bất an gia tăng, Type 7 có thể:
• Ôm đồm quá nhiều cam kết rồi bỏ dở giữa chừng vì chán.
• Sốt ruột, bồn chồn, luôn thèm khát những điều mới lạ.
• Tái định hình nỗi đau quá nhanh khiến bản thân và người khác không kịp thấu cảm.
• Chống đối mọi giới hạn hoặc cam kết kỷ luật cần thiết.
• Rơi vào cái bẫy xem "Tự do là không có bất kỳ ràng buộc nào", trong khi tự do chân chính là dũng cảm chọn một con đường và dám chấp nhận cái giá phải từ bỏ các con đường khác.`
      },
      {
        heading: "7. Trong công việc và học tập",
        content: `Type 7 xuất sắc trong việc phát sinh ý tưởng, sáng tạo đổi mới và thích ứng linh hoạt với sự thay đổi.

Tuy nhiên, không phải Type 7 nào cũng là doanh nhân hay người làm sự kiện. Một nhà khoa học Type 7 say mê tiềm năng của những phát kiến mới; một luật sư Type 7 thích thú với việc tìm ra những góc nhìn lập luận bất ngờ; một giáo viên Type 7 liên tục cải tiến giáo trình để đem lại niềm hứng khởi cho học trò.`
      },
      {
        heading: "8. Trong các mối quan hệ",
        content: `Type 7 mang lại tiếng cười, năng lượng tươi vui và mở ra những chân trời mới cho người bạn đời. Thử thách xuất hiện khi đối phương đang buồn đau hoặc xảy ra xung đột, Type 7 thường có xu hướng gạt đi: "Đừng nghĩ tiêu cực nữa, đi ăn gì vui vẻ đi!".

Đôi khi, người thân không cần một sự trốn chạy; họ cần bạn có mặt trọn vẹn, cùng ngồi lại và chia sẻ những xúc cảm chân thành trong những giờ phút ngặt nghèo.`
      },
      {
        heading: "9. Type 7 với các Wings (7w6 & 7w8)",
        content: `• 7w6 (The Entertainer - Người Hoạt Náo Duyên Dáng): Kết hợp tinh thần phiêu lưu của Type 7 với sự ấm áp, nhu cầu kết nối và sự chu đáo của Type 6. Họ có tính hợp tác cao hơn, coi trọng tình bạn và đôi khi có sự giằng xé giữa "Cứ thử đi" và "Nhỡ có rủi ro thì sao?".

• 7w8 (The Realist - Người Hành Động Thực Tế): Kết hợp niềm nhiệt huyết của Type 7 với tính quyết đoán, dũng cảm và thực tế của Type 8. Họ không chỉ mơ mộng về các ý tưởng mà có nguồn năng lượng mạnh mẽ để biến chúng thành hiện thực. Họ dám đối đầu với xung đột và kiên quyết bảo vệ sự tự do của mình.`
      },
      {
        heading: "10. Hướng phát triển (Growth Path)",
        content: `Hành trình thức tỉnh của Type 7 đòi hỏi thấu hiểu:
• Sự chờ đợi tương lai không thể thay thế cho việc hiện diện trong hiện tại.
• Vô số tiềm năng mở rộng không thể thay thế cho giá trị của sự cam kết sâu sắc.
• Tái định hình suy nghĩ không thể thay thế cho việc lắng nghe và chữa lành cảm xúc.

Trong hệ thống Enneagram, khi phát triển (Growth line), Type 7 kết nối với phẩm chất lành mạnh của Type 5: sự tập trung sâu sắc, khả năng tĩnh lặng nghiên cứu và kiên trì theo đuổi một mục tiêu tới cùng.`
      },
      {
        heading: "11. Mosaic diễn giải Type 7 như thế nào?",
        content: `Mosaic không đánh giá Type 7 chỉ vì bạn "thích đi du lịch" hay "hay cười nói". Một người Type 7 hoàn toàn có thể là người hướng nội và thích đọc sách.

Chúng tôi quan sát phản xạ nội tâm: "Khi cảm thấy ngột ngạt, đau đớn hoặc bế tắc, tâm trí bạn có tự động vẽ ra những lối thoát mới để không phải ở lại trong cảm xúc đó hay không?". Mosaic giúp bạn tìm thấy sự bình an nội tại mà không cần phải không ngừng tìm kiếm kích thích bên ngoài.`
      },
      {
        heading: "Nguồn tham khảo",
        content: `1. The Enneagram Institute — Type Seven: The Enthusiast; How the Enneagram System Works.
2. Hook et al. (2021) — The Enneagram: A systematic review of the literature and directions for future research. Journal of Clinical Psychology.`
      }
    ]
  },

  // ==========================================
  // TYPE 8 — NGƯỜI THÁCH THỨC
  // ==========================================
  "TYPE 8": {
    title: "TYPE 8 — NGƯỜI THÁCH THỨC",
    subtitle: "The Challenger — Bảo vệ quyền tự quyết, che chở người thân và hành động quyết liệt, trực diện",
    sections: [
      {
        heading: "1. Type 8 trong hệ thống Enneagram",
        content: `Type 8 thường được gọi là The Challenger — Người Thách thức. Những mô tả thông thường hay gắn nhãn Type 8 là hung hăng, to tiếng hay thích áp đặt quyền lực. Đây chỉ là những định kiến về mặt hành vi bề nổi.

Cốt lõi sâu kín của Type 8 xoay quanh quyền tự chủ (autonomy), sự tổn thương (vulnerability) và quyền tự quyết định số phận của chính mình. Enneagram Institute mô tả nỗi sợ nền tảng của Type 8 là bị kiểm soát, thao túng hoặc làm tổn hại; mong muốn nền tảng là bảo vệ bản thân và nắm quyền chủ động đối với cuộc đời mình.`
      },
      {
        heading: "2. Động lực cốt lõi (Core Motivation)",
        content: `Type 8 đặc biệt nhạy cảm với:
• Sự ép buộc, thao túng hoặc bất công quyền lực.
• Sự yếu đuối và nguy cơ bị người khác lợi dụng.
• Việc ai đó cố tình đưa ra quyết định thay cho họ.
• Mọi dấu hiệu cho thấy quyền tự quyết của bản thân đang bị xâm phạm.

Tâm trí Type 8 tự động đặt câu hỏi: "Ai đang nắm quyền lực ở đây? Mình có toàn quyền tự chủ không? Người này đang chân thật hay đang tìm cách kiểm soát mình?". Sức mạnh vì thế trở thành chiếc áo giáp phòng vệ tối thượng.`
      },
      {
        heading: "3. Trung tâm bản năng (Instinctive Center)",
        content: `Type 8 thuộc Instinctive Center (Trung tâm Bản năng) cùng Type 9 và Type 1. Khác với Type 9 nén giận hay Type 1 kìm hãm giận thành bực bội, cơn giận ở Type 8 thường được giải phóng trực tiếp ra bên ngoài qua hành động và lời nói.

Tuy nhiên, sự giận dữ không phải là định nghĩa của Type 8. Một Type 8 trầm lặng vẫn thể hiện rõ ràng ranh giới cá nhân và khí chất tự chủ mạnh mẽ mà không cần phải to tiếng.`
      },
      {
        heading: "4. Cơ chế vận hành của Type 8",
        content: `Khi nhận thấy áp lực hoặc dấu hiệu kiểm soát, phản xạ của Type 8 là:
Phát hiện sự áp đặt → Lập tức phản kháng → Giành lại quyền chủ động.

Mô hình này tạo nên sự quyết đoán, lòng can đảm phi thường và tinh thần không bao giờ cúi đầu trước sự đe dọa. Tuy nhiên, nếu phản xạ này diễn ra tự động, Type 8 dễ xem mọi sự bất đồng ý kiến như một cuộc chiến tranh giành quyền lực. Một lời đề nghị chân thành có thể bị nghe thành một mệnh lệnh; một lời góp ý có thể bị hiểu lầm là sự can thiệp thô bạo.`
      },
      {
        heading: "5. Khi Type 8 cân bằng (Healthy State)",
        content: `Ở trạng thái lành mạnh, Type 8 không còn cảm thấy cần phải liên tục chứng minh sức mạnh của mình. Sức mạnh được dùng để che chở, nâng đỡ người yếu thế thay vì thống trị.

Họ nhận ra rằng: Thể hiện sự mềm mỏng (vulnerability) không đồng nghĩa với yếu đuối, và chấp nhận sự hỗ trợ của người khác không có nghĩa là đầu hàng. Type 8 khỏe mạnh là những nhà lãnh đạo hào sảng, công bằng, bao dung và có khả năng tạo ra không gian an toàn cho mọi người cùng phát triển.`
      },
      {
        heading: "6. Khi pattern trở nên cứng nhắc (Under Stress)",
        content: `Khi cảm giác bị đe dọa tăng cao, Type 8 có thể:
• Leo thang xung đột quá nhanh, dùng cường độ năng lượng áp đảo người khác.
• Từ chối mọi sự giúp đỡ vì coi đó là biểu hiện của sự yếu kém.
• Xem sự tổn thương là điều nguy hiểm chết người cần phải triệt tiêu.
• Kiểm soát quá mức những người xung quanh dưới danh nghĩa "bảo vệ".
• Đánh giá thấp mức độ tổn thương mà lời nói thẳng thừng của mình có thể gây ra cho người khác.`
      },
      {
        heading: "7. Trong công việc và học tập",
        content: `Type 8 phát huy xuất sắc ở những môi trường đòi hỏi sự tự chủ cao, đối mặt với thử thách lớn và dám chịu trách nhiệm.

Tuy nhiên, Type 8 không bắt buộc phải làm giám đốc. Một kỹ sư Type 8 thích làm việc độc lập để toàn quyền sáng tạo; một nghệ sĩ Type 8 thách thức các chuẩn mực nghệ thuật cũ kỹ; một y tá Type 8 quyết liệt đấu tranh vì quyền lợi của bệnh nhân. Giá trị cốt lõi là sự tự chủ, không phải chức danh.`
      },
      {
        heading: "8. Trong các mối quan hệ",
        content: `Type 8 đề cao sự thẳng thắn, trung thực và ghét sự giả tạo. Niềm tin của họ lớn dần khi thấy đối phương không bị gục ngã trước cường độ của mình nhưng cũng không cố tình dùng mưu mẹo để thao túng.

Thử thách lớn nhất trong tình cảm là mở lòng chia sẻ những góc khuất mềm mại, những nỗi sợ và sự bất an trong lòng mình với bạn đời trước khi xung đột xảy ra.`
      },
      {
        heading: "9. Type 8 với các Wings (8w7 & 8w9)",
        content: `• 8w7 (The Maverick - Kẻ Tiên Phong Táo Bạo): Kết hợp sự tự chủ của Type 8 với năng lượng hành động và tinh thần đổi mới của Type 7. Họ hành động nhanh, táo bạo, ưa mạo hiểm và tràn đầy nhiệt huyết ("Nếu muốn thì làm ngay").

• 8w9 (The Bear - Chú Gấu Trầm Tĩnh): Kết hợp sức mạnh của Type 8 với sự điềm đạm, vững chãi của Type 9. Họ ít bùng nổ hơn, bình thản và chỉ thể hiện sức mạnh khi ranh giới bị xâm phạm. Họ bảo vệ người thân bằng sự vững chãi thầm lặng.`
      },
      {
        heading: "10. Hướng phát triển (Growth Path)",
        content: `Sự chuyển hóa của Type 8 diễn ra khi họ hiểu rằng:
• Sức mạnh thực sự không cần phải bọc trong lớp vỏ bất khả xâm phạm.
• Chuyển từ việc "Kiểm soát người khác" sang "Làm chủ chính mình".
• Chuyển từ "Cường độ áp đảo" sang "Sự rõ ràng và kiên định".
• Chuyển từ "Dùng sức mạnh chống lại thế giới" sang "Dùng sức mạnh phụng sự cộng đồng".

Trong hệ thống Enneagram, khi phát triển (Growth line), Type 8 kết nối với phẩm chất lành mạnh của Type 2: sự dịu dàng, lòng trắc ẩn, sự tận tâm chăm sóc và khả năng mở lòng yêu thương không phòng thủ.`
      },
      {
        heading: "11. Mosaic diễn giải Type 8 như thế nào?",
        content: `Mosaic không đánh giá bạn là Type 8 chỉ vì bạn "nóng tính". Sự tức giận có thể xuất hiện ở bất kỳ ai. Chúng tôi khám phá phản xạ tâm lý: "Khi cảm thấy ai đó có thể kiểm soát, áp đặt hoặc làm tổn thương bạn, phản ứng tự nhiên trong bạn là gì?".

Mosaic giúp Type 8 nhận ra vẻ đẹp của sự chân thành mềm mỏng, biến sức mạnh tự nhiên thành nguồn năng lượng bảo bọc vĩ đại.`
      },
      {
        heading: "Nguồn tham khảo",
        content: `1. The Enneagram Institute — Type Eight: The Challenger; How the Enneagram System Works.
2. Hook et al. (2021) — The Enneagram: A systematic review of the literature and directions for future research. Journal of Clinical Psychology.`
      }
    ]
  },

  // ==========================================
  // TYPE 9 — NGƯỜI HÒA GIẢI
  // ==========================================
  "TYPE 9": {
    title: "TYPE 9 — NGƯỜI HÒA GIẢI",
    subtitle: "The Peacemaker — Giữ gìn an yên nội tâm, hòa giải xung đột và kết nối mọi người xung quanh",
    sections: [
      {
        heading: "1. Type 9 trong hệ thống Enneagram",
        content: `Type 9 được gọi là The Peacemaker — Người Hòa giải. Tuy nhiên, tính cách điềm đạm, dễ chịu hay xu hướng ngại xung đột đơn thuần không đủ để xác định Type 9.

Cốt lõi sâu kín của Type 9 liên quan đến sự bình ổn nội tâm (inner stability), sự gắn kết giữa con người và sự phản kháng trước những xáo trộn. Enneagram Institute mô tả nỗi sợ nền tảng của Type 9 là sự mất mát, chia rẽ và đổ vỡ mối liên kết; mong muốn nền tảng là sự tĩnh tại, hòa hợp và bình an trong tâm hồn.`
      },
      {
        heading: "2. Động lực cốt lõi (Core Motivation)",
        content: `Type 9 đặc biệt nhạy cảm với mong muốn và kế hoạch của người khác. Đôi khi, việc nhận biết người khác muốn gì lại dễ dàng hơn nhiều so với việc trả lời câu hỏi: "Thực sự mình đang muốn gì?".

Để gìn giữ sự bình yên và tránh xung đột, Type 9 có xu hướng hòa vào mong muốn của tập thể, trì hoãn hoặc xem nhẹ ý kiến riêng của mình. Điều này giúp họ có năng lực thấu cảm đa chiều tuyệt vời, nhưng rủi ro là họ dần tự làm mờ đi tiếng nói và ưu tiên của chính mình cho đến khi sự ấm ức tích tụ bên trong.`
      },
      {
        heading: "3. Trung tâm bản năng (Instinctive Center)",
        content: `Type 9 thuộc Instinctive Center cùng Type 8 và Type 1. Type 9 thường bị hiểu nhầm là "người không bao giờ biết giận".

Thực tế, Type 9 vẫn thuộc trung tâm của cơn giận, nhưng cơn giận bị làm tê liệt (numbed), giảm thiểu hóa hoặc chuyển thành sự phản kháng thụ động (passive resistance) thay vì đối đầu trực diện: "Miệng tôi nói không giận, nhưng tôi đơn giản sẽ không làm điều bạn muốn".`
      },
      {
        heading: "4. Cơ chế vận hành của Type 9",
        content: `Khi xung đột hoặc yêu cầu xuất hiện, phản xạ của Type 9 là:
Quét góc nhìn mọi phía → Giảm thiểu sự xáo trộn → Nhượng bộ, thích ứng → Giữ vững sự êm thấm nội tâm.

Thế mạnh của họ là khả năng xoa dịu căng thẳng tuyệt vời. Thử thách là các ưu tiên quan trọng của bản thân liên tục bị đẩy lùi lại phía sau: "Để sau cũng được", "Cái nào cũng tốt cả", "Không có gì quan trọng đâu". Dần dà, họ có thể sống một cuộc đời mà mong ước riêng của mình chưa bao giờ được đặt lên hàng đầu.`
      },
      {
        heading: "5. Khi Type 9 cân bằng (Healthy State)",
        content: `Ở trạng thái lành mạnh, Type 9 không hề đánh mất khả năng hòa giải, mà họ bổ sung thêm sự hiện diện đầy sức sống của chính bản thân mình (presence). Họ nhìn thấy được quan điểm của mọi phía nhưng vẫn dõng dạc tuyên bố: "Và đây là điều tôi lựa chọn!".

Họ gìn giữ hòa bình không phải bằng sự tự xóa bỏ mình, mà bằng sự can dự vững chãi và chân thật. Type 9 khỏe mạnh là những người hòa giải tài ba, mang lại sự vững tâm, kết nối mọi người lại với nhau và tự tin theo đuổi mục tiêu đời mình.`
      },
      {
        heading: "6. Khi pattern trở nên cứng nhắc (Under Stress)",
        content: `Khi căng thẳng gia tăng, Type 9 có thể:
• Rơi vào trạng thái quán tính (inertia): trì hoãn hành động quan trọng nhất bằng cách bận rộn với những việc lặt vặt.
• Làm tê liệt cảm xúc bằng các thói quen vô thức (lướt điện thoại, ăn uống, xem phim liên tục).
• Tránh né các cuộc trò chuyện thẳng thắn cần thiết vì sợ phá vỡ hòa khí.
• Ngoài mặt gật đầu đồng ý nhưng bên trong chống đối thầm lặng.
• Chấp nhận ở lại trong một hoàn cảnh không thỏa mãn chỉ vì cảm thấy việc thay đổi quá mệt mỏi và xáo trộn.`
      },
      {
        heading: "7. Trong công việc và học tập",
        content: `Type 9 tỏa sáng ở những vị trí đòi hỏi sự kiên nhẫn, khả năng điều phối và tổng hợp ý kiến đa chiều.

Họ không chỉ làm các vai trò hậu phương. Một nhà lãnh đạo Type 9 có thể xây dựng sự đồng thuận vững chắc trong tổ chức; một nghệ sĩ Type 9 hòa quyện các trường phái khác nhau vào tác phẩm; một nhà nghiên cứu Type 9 kiên nhẫn kết nối các mảnh ghép tri thức rời rạc.`
      },
      {
        heading: "8. Trong các mối quan hệ",
        content: `Type 9 mang lại cho người bạn đời một không gian cảm xúc rộng mở, bình yên và không phán xét.

Tuy nhiên, một mối quan hệ lành mạnh cần có hai cá thể trọn vẹn, không phải một người liên tục nhường nhịn và tự thu nhỏ mình. Nếu bạn không nói ra điều mình thích, đối phương không thể tự đoán biết được. Xung đột thẳng thắn đôi khi không phá vỡ tình yêu, mà giúp tình yêu trở nên chân thật và sâu sắc hơn.`
      },
      {
        heading: "9. Type 9 với các Wings (9w8 & 9w1)",
        content: `• 9w8 (The Referee - Trọng Tài Hòa Giải): Kết hợp sự hòa nhã của Type 9 với sự vững vàng, tự chủ của Type 8. Họ có ranh giới rõ ràng hơn, kiên quyết hơn và dám đối mặt với xung đột khi cần thiết để nhanh chóng lập lại trật tự và sự bình an.

• 9w1 (The Dreamer - Người Mơ Mộng Lý Tưởng): Kết hợp sự bình an của Type 9 với tiêu chuẩn đạo đức và tính nguyên tắc của Type 1. Họ thường có xu hướng hướng tới một sự hòa hợp đúng đắn, mẫu mực, sống kín đáo, nhẹ nhàng và giàu tinh thần lý tưởng.`
      },
      {
        heading: "10. Hướng phát triển (Growth Path)",
        content: `Sự thức tỉnh của Type 9 không phải là biến mình thành người hiếu chiến, mà là:
• Chuyển từ "Hòa bình bằng sự nhượng bộ" sang "Hiện diện trọn vẹn và tự tin".
• Chuyển từ "Cái gì cũng được" sang "Ý thức rõ ràng về điều mình muốn".
• Chuyển từ "Quán tính trì trệ" sang "Hành động kiên quyết vì mục tiêu cá nhân".

Trong hệ thống Enneagram, khi phát triển (Growth line), Type 9 kết nối với phẩm chất lành mạnh của Type 3: sự chủ động, tính hiệu quả, năng lượng hành động và niềm tự hào về những thành tựu của chính mình.`
      },
      {
        heading: "11. Mosaic diễn giải Type 9 như thế nào?",
        content: `Mosaic không đánh giá Type 9 chỉ vì bạn "ghét cãi nhau". Rất nhiều kiểu tính cách tránh xung đột vì những lý do khác nhau. Câu hỏi sâu sắc hơn là: "Bạn có dễ tự làm mờ đi nhu cầu và ước mơ của chính mình để giữ gìn sự êm thấm xung quanh hay không?".

Mosaic giúp Type 9 tìm lại ngọn lửa khao khát nội tại, tự tin khẳng định vị thế và tiếng nói độc bản của mình giữa cuộc đời.`
      },
      {
        heading: "Nguồn tham khảo",
        content: `1. The Enneagram Institute — Type Nine: The Peacemaker; How the Enneagram System Works.
2. Hook et al. (2021) — The Enneagram: A systematic review of the literature and directions for future research. Journal of Clinical Psychology.`
      }
    ]
  },

  // ==========================================
  // TỔNG QUAN HỆ THỐNG ENNEAGRAM & GHI CHÚ
  // ==========================================
  "OVERVIEW": {
    title: "TỔNG QUAN HỆ THỐNG ENNEAGRAM",
    subtitle: "Triết lý tiếp cận của Mosaic: Động lực cốt lõi thay vì hành vi bề nổi",
    sections: [
      {
        heading: "1. Vị trí của Core Type và cơ chế Wings",
        content: `Trong mô hình của Mosaic, Core Type (Kiểu tính cách cốt lõi) luôn giữ vai trò quyết định, chi phối toàn bộ cấu trúc tâm lý. Theo lý thuyết Enneagram, Wing chỉ có thể là một trong hai type nằm ngay cạnh basic type trên vòng tròn Enneagram:
• Type 1 có wing 9 hoặc 2.
• Type 2 có wing 1 hoặc 3.
• Type 3 có wing 2 hoặc 4.
• Type 4 có wing 3 hoặc 5.
• Type 5 có wing 4 hoặc 6.
• Type 6 có wing 5 hoặc 7.
• Type 7 có wing 6 hoặc 8.
• Type 8 có wing 7 hoặc 9.
• Type 9 có wing 8 hoặc 1.

Enneagram Institute nhấn mạnh rằng một người có thể biểu hiện ảnh hưởng của cả hai wing ở những mức độ khác nhau tùy hoàn cảnh sống.`
      },
      {
        heading: "2. Góc nhìn khoa học và giới hạn của mô hình",
        content: `Mosaic xem Enneagram như một khung tham chiếu tâm lý (psychological framework) phục vụ cho sự tự phản tư và phát triển cá nhân, không phải là công cụ chẩn đoán lâm sàng.

Nghiên cứu tổng hợp (Systematic Review) năm 2021 của Hook và các cộng sự trên 104 mẫu độc lập cho thấy bằng chứng thực nghiệm về độ tin cậy và giá trị đo lường của Enneagram nhìn chung còn phân tán (mixed). Một số kết quả tương quan một phần với mô hình Big Five, nhưng các cấu trúc thứ cấp như Wings và đường mũi tên biến chuyển (arrows) hiện còn ít bằng chứng thực nghiệm độc lập. Mosaic vì thế sử dụng Wings như công cụ diễn giải bổ trợ, không tuyệt đối hóa như một sự thật bất biến.`
      },
      {
        heading: "3. Phương pháp tiếp cận của Mosaic",
        content: `Giống như cách tiếp cận MBTI, các trang Enneagram của Mosaic luôn bám sát trục tư duy:
Động lực cốt lõi → Chiến lược tâm lý → Điểm nghẽn thử thách → Biến thể phong phú → Con đường chuyển hóa.

Một hành vi bên ngoài có thể giống hệt nhau nhưng xuất phát từ chín động lực hoàn toàn khác biệt. Mục tiêu cao nhất của Mosaic là giúp bạn trả lời câu hỏi: "Điều gì đang thực sự thôi thúc bên dưới cách bạn tư duy, cảm nhận và hành động?".`
      },
      {
        heading: "Tài liệu tham khảo",
        content: `1. The Enneagram Institute — How the Enneagram System Works; Misidentifications Overview.
2. Hook, J. N., Hall, T. W., Davis, D. E., Van Tongeren, D. R., & Msn, M. (2021). The Enneagram: A systematic review of the literature and directions for future research. Journal of Clinical Psychology, 77(4), 865–883.`
      }
    ]
  }
};
