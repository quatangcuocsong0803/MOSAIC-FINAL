export interface CognitiveSection {
  heading: string;
  content: string;
}

export interface CognitiveTypeData {
  title: string;
  sections: CognitiveSection[];
}

export const cognitiveData: Record<string, CognitiveTypeData> = {
  // ==========================================
  // TỔNG QUAN COGNITIVE FUNCTIONS
  // ==========================================
  OVERVIEW: {
    title: "Tổng quan về Chức năng nhận thức (Cognitive Functions Overview)",
    sections: [
      {
        heading: "1. Nguồn gốc lịch sử từ Carl Jung đến MBTI",
        content: `Cognitive functions (Chức năng nhận thức) là một cách mô tả những quá trình tâm lý mà con người ưu tiên khi tiếp nhận thông tin và đưa ra đánh giá. Nền tảng lịch sử của hệ thống xuất phát từ tác phẩm "Psychological Types" (1921) của Carl Gustav Jung, trong đó ông mô tả bốn chức năng tâm lý — Thinking, Feeling, Sensation và Intuition — kết hợp với hai thái độ tâm lý là Extraversion và Introversion.

Từ đó hình thành tám function-attitudes mà typology hiện đại thường viết là Te, Ti, Fe, Fi, Se, Si, Ne và Ni.`
      },
      {
        heading: "2. Chức năng Phán đoán (Judging) và Tiếp nhận (Perceiving)",
        content: `• Thinking (T) và Feeling (F) thuộc nhóm judging functions: Chúng đánh giá dữ liệu, đặt ra các tiêu chuẩn (criteria) và hình thành kết luận, quyết định.
• Sensation (S) và Intuition (N) thuộc nhóm perceiving functions: Chúng liên quan đến cách thức thông tin được nhận biết và tiếp thu trước khi bất kỳ sự phán đoán nào được áp đặt lên nó.

Khi Jung gọi một số kiểu là “rational” (hợp lý) và một số là “irrational” (phi lý), ông không có ý nói một nhóm thông minh còn nhóm kia phi lý trí. Trong thuật ngữ của Jung, “irrational” đơn giản chỉ các tiến trình tiếp nhận thông tin trực tiếp mà không lấy suy luận phán đoán làm nguyên tắc đầu tiên.`
      },
      {
        heading: "3. Khái niệm Type Dynamics trong hệ Myers-Briggs",
        content: `MBTI sau này phát triển khái niệm Type Dynamics, trong đó mỗi kiểu tính cách được mô tả bằng thứ bậc 4 chức năng:
1. Chức năng chủ đạo (Dominant): Tiến trình được tin cậy và sử dụng thuần thục, tự nhiên nhất trong ý thức.
2. Chức năng hỗ trợ (Auxiliary): Cân bằng chức năng chủ đạo giữa tiếp nhận/phán đoán và hướng nội/hướng ngoại.
3. Chức năng thứ ba (Tertiary) & Chức năng yếu (Inferior): Thường ít ý thức hơn và phát triển dần theo thời gian.

Myers & Briggs Foundation lưu ý rằng chiều hướng hướng nội/hướng ngoại của chức năng thứ ba vẫn là chủ đề có nhiều cách diễn giải trong cộng đồng tâm lý học. Mosaic tránh trình bày function stack như một chuỗi sinh học bất biến.`
      },
      {
        heading: "4. Chức năng nhận thức là Tiến trình (Process), không phải Hành vi",
        content: `Quan trọng hơn hết, một chức năng nhận thức không phải là một hành vi đơn lẻ:
• Thích tranh luận không tự động là Ti.
• Giỏi lãnh đạo không tự động là Te.
• Quan tâm người khác không tự động là Fe.
• Cảm xúc sâu sắc không tự động là Fi.
• Thích phiêu lưu, du lịch không tự động là Se.
• Có trí nhớ tốt không tự động là Si.
• Sáng tạo dồi dào không tự động là Ne.
• Hay nghĩ về tương lai không tự động là Ni.

Điều Mosaic cố gắng quan sát là tiến trình (process) phía sau hành vi: Người đó đang chú ý tới loại thông tin nào, đang dùng tiêu chuẩn nào để đánh giá nó, và động lực nhận thức nào khiến cùng một hoàn cảnh lại được xử lý theo những cách hoàn toàn khác nhau.`
      },
      {
        heading: "5. Nguồn tham khảo học thuật",
        content: `1. C. G. Jung — Psychological Types (1921), Chương X: General Description of the Types.
2. Myers & Briggs Foundation — Type Dynamics: Overview; The Processes of Type Dynamics.`
      }
    ]
  },

  // ==========================================
  // 01. TI — INTROVERTED THINKING
  // ==========================================
  Ti: {
    title: "Ti — Introverted Thinking (Tư duy hướng nội)",
    sections: [
      {
        heading: "1. Bản chất của Ti: Thấu hiểu qua logic nội tại (Understanding through internal logic)",
        content: `Introverted Thinking, hay Ti, là quá trình cố gắng hiểu một sự vật bằng cách xây dựng một mô hình logic nhất quán ở bên trong.

Câu hỏi tự nhiên của Ti không hẳn là “Cách nào hiệu quả nhất?”, mà thường gần với: “Thứ này thực sự hoạt động theo nguyên lý nào?”. Một người đang sử dụng Ti mạnh có xu hướng tháo một ý tưởng thành các thành phần nhỏ, xem quan hệ giữa chúng có hợp lý không, kiểm tra các định nghĩa và tìm điểm mâu thuẫn trước khi chấp nhận toàn bộ hệ thống.

Trong Psychological Types, Jung phân biệt kiểu thinking hướng ra đối tượng với thinking được định hướng nhiều hơn bởi subjective factor. Với introverted thinking, ý tưởng được phát triển “vào trong”: dữ kiện bên ngoài vẫn quan trọng, nhưng chúng không tự động trở thành tiêu chuẩn cuối cùng. Điều quan trọng là chúng có thể được tích hợp vào một cấu trúc hiểu biết mà người đó thấy thực sự nhất quán hay không. Jung dùng triết gia Immanuel Kant như một ví dụ minh họa cho xu hướng tư duy hướng vào hệ thống ý niệm bên trong, đối lập với kiểu reasoning đi từ lượng lớn dữ liệu khách quan bên ngoài.`
      },
      {
        heading: "2. Ti không đơn giản là “thông minh” hay “logic”",
        content: `Một trong những nhầm lẫn phổ biến nhất về Ti là xem nó như chỉ số IQ. Không phải vậy. Bất kỳ người nào cũng có thể suy luận logic; cognitive function mô tả hướng mà quá trình đánh giá thường ưu tiên, chứ không đo năng lực trí tuệ.

Ti đặc biệt quan tâm đến tính nhất quán nội tại (internal consistency). Hai lời giải có thể cùng cho ra kết quả đúng, nhưng Ti vẫn muốn biết tại sao một lời giải lại hợp lý hơn về mặt cấu trúc. Một quy tắc được số đông chấp nhận cũng chưa đủ để khiến Ti tin nó đúng; Ti muốn nhìn thấy nguyên lý bên dưới.

Đó là lý do người dùng Ti thường đặt những câu hỏi nghe rất cơ bản: “Ta đang định nghĩa từ này như thế nào?”, “Hai điều này thực sự có cùng nghĩa không?”, “Nếu giả định này sai thì toàn bộ kết luận có sụp đổ không?”. Những câu hỏi ấy đôi khi làm chậm cuộc thảo luận, nhưng cũng thường phát hiện những lỗ hổng mâu thuẫn mà cách tiếp cận thực dụng hơn dễ bỏ qua.`
      },
      {
        heading: "3. Ti trong đời sống thực",
        content: `• Trong học tập: Ti thường không hài lòng với việc ghi nhớ một công thức vẹt nếu chưa hiểu vì sao công thức đó hoạt động.
• Trong lập trình: Biểu hiện qua nhu cầu hiểu kiến trúc sâu xa và logic của hệ thống thay vì chỉ làm cho code chạy được tạm thời.
• Khi tranh luận: Ti dễ tách luận điểm khỏi người nói. Một ý tưởng có thể đến từ người mình không thích nhưng vẫn đúng, hoặc đến từ người mình kính trọng nhưng vẫn có lỗ hổng.
• Trong quyết định cá nhân: Ti muốn “làm rõ vấn đề” trước khi quyết định. Một lựa chọn thiếu cấu trúc hoặc chứa nhiều khái niệm mơ hồ có thể gây khó chịu hơn bản thân việc lựa chọn.

Myers & Briggs Foundation mô tả Ti theo hướng tìm kiếm logic và consistency bên trong các ý tưởng, dựa vào một internal framework và thường có chiều sâu tập trung mang tính phân tích. Trong MBTI, Ti là dominant process của ISTP và INTP.`
      },
      {
        heading: "4. Khi Ti phát triển cân bằng & lành mạnh",
        content: `Ti tốt không phải là người liên tục săm soi, sửa lỗi của người khác. Ở trạng thái trưởng thành, nó tạo ra khả năng phân tích cực kỳ minh bạch và trong sáng:
• Tách bạch các giả định (assumptions) khỏi bằng chứng thực tế (evidence).
• Phân biệt tương quan ngẫu nhiên với quan hệ nguyên nhân – kết quả.
• Nhận ra khi hai bên đang tranh cãi chỉ vì dùng hai định nghĩa khác nhau.
• Sẵn sàng sửa chữa mô hình khi dữ liệu mới cho thấy mô hình cũ sai.

Điểm mạnh sâu nhất của Ti là khả năng làm cho một hệ thống phức tạp trở nên có thể hiểu được một cách khúc chiết.`
      },
      {
        heading: "5. Khi Ti bị lạm dụng hoặc phát triển một chiều",
        content: `Vấn đề xuất hiện khi nhu cầu hoàn thiện mô hình biến thành mục tiêu tự thân. Người sử dụng Ti có thể tiếp tục phân tích sau thời điểm cần hành động, coi mọi ngoại lệ như một lý do để trì hoãn kết luận, hoặc trở nên quá tập trung vào sự chính xác khái niệm đến mức bỏ qua tác động thực tế và cảm xúc của người khác.

Myers & Briggs Foundation mô tả dominant Ti khi bị phóng đại có thể trở thành một cuộc tìm kiếm “sự thật tuyệt đối” mang tính ám ảnh, quá tách rời thực tế và quá tập trung vào mặt tiêu cực của một vấn đề.`
      },
      {
        heading: "6. So sánh Ti và Te: Tiêu chuẩn tối ưu khác nhau ở đâu?",
        content: `Cả hai đều là Thinking. Khác biệt chính không phải “Ti thông minh hơn” hay “Te thực tế hơn”, mà nằm ở tiêu chuẩn mà reasoning muốn tối ưu:

• Ti hỏi: “Hệ thống này có thực sự hợp lý từ bên trong không?” (Internal coherence).
• Te hỏi: “Hệ thống này có tổ chức được thực tế và tạo ra kết quả không?” (External effectiveness).

Một chiếc máy có thể chạy tốt ngoài đời nhưng được thiết kế theo một logic mà Ti thấy chắp vá, lộn xộn. Ngược lại, một mô hình có thể cực kỳ thanh lịch về lý thuyết nhưng Te sẽ đặt câu hỏi liệu nó có giải quyết được vấn đề thực tế ngoài đời hay không.`
      },
      {
        heading: "7. Nguồn tham khảo học thuật",
        content: `1. C. G. Jung — Psychological Types, Chương X (Introverted Thinking).
2. Myers & Briggs Foundation — The Processes of Type Dynamics (Introverted Thinking).`
      }
    ]
  },

  // ==========================================
  // 02. TE — EXTRAVERTED THINKING
  // ==========================================
  Te: {
    title: "Te — Extraverted Thinking (Tư duy hướng ngoại)",
    sections: [
      {
        heading: "1. Bản chất của Te: Biến logic thành cấu trúc thực thi (Turning logic into structure)",
        content: `Nếu Ti muốn biết hệ thống thật sự hoạt động như thế nào từ bên trong, Te muốn tổ chức thế giới bên ngoài sao cho hệ thống có thể vận hành hiệu quả nhất.

Extraverted Thinking là quá trình đánh giá dựa nhiều vào thông tin, tiêu chuẩn và các mối quan hệ có thể kiểm chứng ở thế giới khách quan bên ngoài. Nó quan tâm đến kết quả, quy trình, trật tự, phương pháp, các chỉ số đo lường được (measurable outcomes) và việc chuyển hóa một mục tiêu thành chuỗi hành động cụ thể.

Jung mô tả extraverted thinking là kiểu thinking được định hướng mạnh bởi đối tượng (object) và dữ liệu khách quan. Tiêu chuẩn phán đoán của nó được lấy từ những điều có thể được xác lập bên ngoài chủ thể: sự kiện thực tế, các nguyên tắc đã được công nhận, hệ thống hoặc ý tưởng đã được biểu hiện thành một framework khách quan.`
      },
      {
        heading: "2. Te tìm kiếm điều gì?",
        content: `Te thường muốn trả lời một nhóm câu hỏi rất cụ thể:
• Mục tiêu cụ thể là gì?
• Tiêu chuẩn thành công là gì và đo lường bằng cách nào?
• Nguồn lực hiện có bao nhiêu?
• Thứ tự ưu tiên và lộ trình thực hiện thế nào?
• Phương pháp nào tiết kiệm thời gian và tài nguyên nhất?
• Bằng cách nào ta biết được kế hoạch đang vận hành đúng hướng?

Bởi vậy Te có xu hướng thích những thứ có thể đưa vào vận hành thực tế (operationalize). “Hãy cải thiện trải nghiệm người dùng” là mục tiêu mơ hồ; “Giảm thời gian hoàn thành bài test từ 15 phút xuống 10 phút mà không làm giảm tỷ lệ hoàn thành” là thứ Te có thể lập tức xây dựng quy trình giải quyết.`
      },
      {
        heading: "3. Te trong đời sống thực",
        content: `• Trong dự án nhóm: Người dùng Te tự nhiên chuyển cuộc thảo luận từ “Chúng ta muốn làm gì?” sang “Ai làm phần nào, deadline bao giờ và tiêu chí nghiệm thu là gì?”.
• Trong học tập: Quan tâm đến cách chuyển kiến thức thành quy trình ứng dụng.
• Trong kinh doanh: Chú ý đến phân bổ nguồn lực (allocation), năng suất, đối chuẩn (benchmark), quy trình và bằng chứng dữ liệu.
• Trong tranh luận: Có xu hướng hỏi dữ kiện nào hỗ trợ cho luận điểm và luận điểm đó có đứng vững khi đối chiếu với thực tế hay không.

Myers & Briggs Foundation mô tả Te là quá trình tìm kiếm logic và sự nhất quán trong thế giới bên ngoài, tổ chức môi trường để đạt mục tiêu. Trong MBTI, Te là dominant process của ESTJ và ENTJ.`
      },
      {
        heading: "4. Điểm mạnh của Te trưởng thành",
        content: `Te trưởng thành có khả năng biến sự hỗn loạn thành trật tự và cấu trúc rõ ràng:
• Nhìn một mục tiêu lớn rồi chia thành các cột mốc (milestones) khả thi.
• Nhanh chóng nhận ra quy trình nào đang lãng phí thời gian và nguồn lực.
• Thiết lập luật lệ minh bạch để tập thể phối hợp nhịp nhàng mà không phải giải quyết sự vụ từ đầu.

Te khỏe mạnh không đồng nghĩa với độc đoán. Một người giỏi Te có thể rất linh hoạt nếu dữ liệu thực tế cho thấy kế hoạch cũ không còn hiệu quả. Tiêu chuẩn cuối cùng không phải “đây là cách của tôi”, mà là “đây là cách hiện đang giải quyết vấn đề tốt nhất theo tiêu chí ta có”.`
      },
      {
        heading: "5. Khi Te bị lạm dụng hoặc phát triển một chiều",
        content: `Khi quá dựa vào Te, con người có xu hướng xem những thứ không đo lường được bằng số liệu như thể chúng không hề quan trọng:
• Hiệu suất lấn át ý nghĩa con người.
• Quy tắc cứng nhắc lấn át các trường hợp ngoại lệ chính đáng.
• Kết quả ngắn hạn lấn át giá trị của cả quá trình.

Tài liệu MBTI chính thống mô tả dominant Te khi bị phóng đại có thể trở nên lạnh lùng, quá duy lý và liên tục phê phán sự thiếu logic của người khác.`
      },
      {
        heading: "6. Te không phải là “hàm làm sếp” (Boss function)",
        content: `Có người rất quyết đoán nhưng không hề dùng Te. Có người dùng Te rất mạnh nhưng nói chuyện cực kỳ hòa nhã, nhẹ nhàng. Te là một phương thức tư duy hướng ra việc tổ chức đối tượng khách quan, không phải phong cách giao tiếp hay nấc thang quyền lực.

Cả Te và Ti đều có thể là kỹ sư, nhà nghiên cứu, quản lý hay nghệ sĩ. Sự khác biệt nằm ở loại câu hỏi mà tâm trí tự nhiên hướng tới để tối ưu hóa.`
      },
      {
        heading: "7. Nguồn tham khảo học thuật",
        content: `1. C. G. Jung — Psychological Types, Chương X (Extraverted Thinking).
2. Myers & Briggs Foundation — The Processes of Type Dynamics (Extraverted Thinking).`
      }
    ]
  },

  // ==========================================
  // 03. FI — INTROVERTED FEELING
  // ==========================================
  Fi: {
    title: "Fi — Introverted Feeling (Cảm xúc hướng nội)",
    sections: [
      {
        heading: "1. Bản chất của Fi: Sống hòa hợp với hệ giá trị nội tâm (Living in alignment with inner values)",
        content: `Fi đánh giá thế giới bằng cách hỏi điều gì thực sự có giá trị đối với bản thân và liệu hành động của mình có phù hợp với những giá trị đó hay không.

Đây là một chức năng thường bị hiểu lầm thành “nhiều cảm xúc ủy mị”. Jung không dùng từ Feeling theo nghĩa xúc cảm bề mặt. Trong typology của ông, Feeling là một judging function: nó định giá trị (valuation), phân biệt điều gì đáng chấp nhận, có ý nghĩa, phù hợp hay không phù hợp với lương tâm.

Với introverted Feeling, tiêu chuẩn ấy chủ yếu được định hướng bởi yếu tố chủ quan sâu kín (subjective factor). Jung nhấn mạnh rằng dạng feeling này rất khó quan sát từ bên ngoài bởi động lực thật không nhất thiết biểu lộ trực tiếp. Một người có thể cảm nhận giá trị đạo đức cực kỳ mạnh mẽ nhưng không có nhu cầu làm cho cả căn phòng biết mình đang cảm thấy gì.`
      },
      {
        heading: "2. Từ khóa cốt lõi của Fi: Sự nhất quán nội tâm (Congruence & Authenticity)",
        content: `Từ khóa chính xác nhất cho Fi không phải “cảm xúc”, mà là congruence: Điều thể hiện bên ngoài và niềm tin bên trong có khớp nhau không?

Người đang sử dụng Fi tự vấn:
• “Tôi có thực sự tin vào điều này không?”
• “Nếu không ai biết tôi làm việc này, tôi vẫn lựa chọn nó chứ?”
• “Đây là điều tôi thực sự muốn hay chỉ là điều người khác muốn tôi trở thành?”

Bởi vậy Fi cực kỳ nhạy bén với sự chân thật (authenticity). Một hành động được xã hội tán thưởng nhưng mang động cơ giả tạo vẫn gây khó chịu. Ngược lại, một lựa chọn không được số đông thấu hiểu vẫn cảm thấy thanh thản nếu nó đúng với giá trị sâu kín bên trong.`
      },
      {
        heading: "3. Cơ chế thấu cảm của Fi",
        content: `Fi thường gắn với sự thấu cảm, nhưng cơ chế của nó khác với Fe:
Fi tiếp cận người khác thông qua nhận thức sâu sắc về trải nghiệm nội tâm của từng cá nhân độc lập. Khi nhìn thấy ai đó đau khổ, Fi liên hệ: “Nếu tôi ở vị trí đó, trải nghiệm ấy có ý nghĩa đau đớn như thế nào đối với bản thân?”.

Fi tôn trọng sâu sắc quyền của người khác được có cảm xúc, giá trị và lựa chọn riêng biệt, ngay cả khi bản thân không hoàn toàn chia sẻ quan điểm đó.`
      },
      {
        heading: "4. Fi trong đời sống thực",
        content: `• Trong nghệ thuật: Tìm kiếm hình thức biểu đạt khiến tác phẩm mang đậm dấu ấn chân thật của riêng mình.
• Trong nghề nghiệp: Quan tâm sâu sắc đến việc công việc có phản ánh lý tưởng mình trân quý hay không.
• Trong quan hệ: Mong muốn sự gắn kết chân thành, nơi đôi bên không phải đeo mặt nạ để làm vừa lòng nhau.

Người dùng Fi mạnh không nhất thiết phải nổi loạn. Nếu chuẩn mực xã hội phù hợp với giá trị nội tâm, họ hoàn toàn tuân thủ. Điểm mấu chốt là tính chính danh cuối cùng luôn đến từ sự đồng thuận của lương tâm, không phải từ việc dư luận khen hay chê.`
      },
      {
        heading: "5. Khi Fi phát triển một chiều & Khi Fi lành mạnh",
        content: `Nếu các giá trị nội tâm không còn được đối chiếu với thực tế hoặc góc nhìn của người khác, Fi có thể trở nên tự quy chiếu quá mức: “Điều này khiến tôi cảm thấy sai” bị nhầm thành “Điều này khách quan là sai”. Dưới áp lực, người dùng Fi có thể trở nên quá nhạy cảm và chìm vào gánh nặng cảm xúc riêng.

Ngược lại, Fi khỏe mạnh không đòi hỏi thế giới phải xác nhận mọi cảm xúc của mình. Nó thấu hiểu rằng giá trị cá nhân có thể vô cùng sâu sắc mà vẫn thuộc về góc nhìn riêng biệt của mỗi cá nhân.`
      },
      {
        heading: "6. Phân biệt Fi và Fe: Hai hướng của phán đoán cảm xúc",
        content: `• Fi hỏi: “Điều này có chân thật với lương tâm tôi không?” (Internal alignment).
• Fe hỏi: “Điều này tạo ra giá trị, sự kết nối và tác động gì giữa con người với nhau?” (Relational harmony).

Một bên không phải “ích kỷ”, bên kia cũng không phải “giả tạo”. Đó chỉ là hai chiều kích định hướng khác nhau của quá trình định giá trị cảm xúc.`
      },
      {
        heading: "7. Nguồn tham khảo học thuật",
        content: `1. C. G. Jung — Psychological Types, Chương X (Introverted Feeling).
2. Myers & Briggs Foundation — The Processes of Type Dynamics (Introverted Feeling).`
      }
    ]
  },

  // ==========================================
  // 04. FE — EXTRAVERTED FEELING
  // ==========================================
  Fe: {
    title: "Fe — Extraverted Feeling (Cảm xúc hướng ngoại)",
    sections: [
      {
        heading: "1. Bản chất của Fe: Thấu cảm và điều phối trường quan hệ (Reading and shaping the human field)",
        content: `Nếu Fi quan tâm đến giá trị bên trong của từng cá nhân, Fe chú ý mạnh mẽ tới trường quan hệ ở bên ngoài: Mọi người đang cảm nhận nhau thế nào, điều gì được coi là phù hợp trong bối cảnh chung, và tương tác này đang tạo ra bầu không khí gì.

Trong mô tả của Jung, extraverted feeling được định hướng bởi đối tượng và các giá trị khách quan xã hội: quy ước văn hóa, kỳ vọng quan hệ, ý nghĩa chung và tình huống cụ thể. Jung xem Fe như một lực lượng tâm lý kiến tạo nên tính hòa đồng xã hội và sự phối hợp nhịp nhàng giữa con người với con người.`
      },
      {
        heading: "2. Fe là một judging function (Đánh giá bối cảnh xã hội)",
        content: `Điều này rất quan trọng: Fe không đơn thuần là “cảm nhận được cảm xúc của người khác”, mà nó liên tục đánh giá tình huống xã hội:
• Một câu nói về mặt dữ kiện (factual) không sai, nhưng có thể hoàn toàn không phù hợp với thời điểm hay tâm trạng của đối phương.
• Nhận ra ngay ai đó đang cảm thấy lạc lõng hoặc bị gạt khỏi cuộc trò chuyện.
• Hiểu rằng cách thức truyền đạt một thông điệp quan trọng ngang ngửa với chính nội dung của thông điệp đó.

Fe hỏi: “Điều này sẽ được mọi người tiếp nhận ra sao?”, “Mọi người đang cần gì để cùng tiến lên?”, “Hệ giá trị nào đang gắn kết tập thể này?”.`
      },
      {
        heading: "3. Fe trong các mối quan hệ",
        content: `Fe thường biểu lộ sự quan tâm bằng những hành động cụ thể mà người khác có thể cảm nhận được ngay: lời hỏi han, sự ghi nhận, lời cảm ơn, nghi thức ứng xử lịch thiệp, tạo không gian cho người khác lên tiếng và chủ động điều hòa bầu không khí.

Điều đó không có nghĩa là Fe lúc nào cũng dịu dàng. Nếu Fe tin rằng tập thể cần một chuẩn mực để bảo vệ lợi ích chung, nó có thể cực kỳ kiên quyết yêu cầu mọi người tuân thủ chuẩn mực đó.`
      },
      {
        heading: "4. Fe và nhận thức xã hội tinh tế (Social Awareness & Contextualization)",
        content: `Một người dùng Fe trưởng thành có năng lực đặt thông điệp vào đúng ngữ cảnh (contextualization) xuất sắc: Cùng một ý tưởng nhưng sẽ được diễn đạt khác nhau khi nói với bạn thân, đồng nghiệp, trẻ nhỏ hay trong hội nghị cấp cao.

Với Fe, điều này không phải là giả tạo; đó là nhận thức sâu sắc rằng giao tiếp luôn xảy ra giữa những con người bằng xương bằng thịt trong những hoàn cảnh cụ thể, chứ không phải trong môi trường chân không.`
      },
      {
        heading: "5. Khi Fe mất cân bằng (Bẫy làm hài lòng người khác & Hòa hợp bề mặt)",
        content: `Mặt trái của khả năng đọc trường quan hệ là sự lệ thuộc quá mức vào phản hồi bên ngoài:
• Quá nhạy cảm với sự chấp thuận của người khác.
• Coi sự đồng thuận của đám đông là bằng chứng đương nhiên cho sự đúng đắn.
• Vô tình ép buộc mọi người phải thể hiện cảm xúc “đúng chuẩn” bề ngoài.

Official MBTI cảnh báo overused Fe có thể trở nên can thiệp thái quá hoặc tạo ra sự hòa hợp nông cạn. Sự hòa hợp thực sự không phải là việc né tránh xung đột bằng mọi giá; Fe trưởng thành học được rằng đôi khi để gìn giữ mối quan hệ sâu sắc, ta phải cho phép một sự bất đồng chân thực được bộc lộ.`
      },
      {
        heading: "6. Fe không đồng nghĩa với lòng tốt vô điều kiện",
        content: `Một người dùng Fi có thể cực kỳ vị tha, và một người dùng Fe vẫn có thể thao túng người khác. Cognitive functions chỉ mô tả cách thức phán đoán giá trị được định hướng ra sao, không phải là thước đo đạo đức hay nhân cách của một con người.`
      },
      {
        heading: "7. Nguồn tham khảo học thuật",
        content: `1. C. G. Jung — Psychological Types, Chương X (Extraverted Feeling).
2. Myers & Briggs Foundation — The Processes of Type Dynamics (Extraverted Feeling).`
      }
    ]
  },

  // ==========================================
  // 05. SI — INTROVERTED SENSING
  // ==========================================
  Si: {
    title: "Si — Introverted Sensing (Cảm giác hướng nội)",
    sections: [
      {
        heading: "1. Bản chất của Si: Hiện tại qua lăng kính trải nghiệm tích lũy (The present filtered through accumulated experience)",
        content: `Si tiếp nhận hiện tại thông qua dấu vết của những trải nghiệm đã được lưu lại bên trong. Nó thường bị mô tả quá đơn giản thành “trí nhớ tốt” hoặc “thích truyền thống”. Hai đặc điểm đó đôi khi có thể đi cùng Si, nhưng chúng không phải là bản chất cốt lõi của function.

Điểm trung tâm là ấn tượng giác quan chủ quan (subjective impression of sensation). Jung mô tả introverted sensation như một kiểu perception trong đó sự vật bên ngoài tạo ra ấn tượng giác quan, nhưng ý thức đặc biệt chú ý đến tác động chủ quan mà kích thích ấy để lại trong tâm trí. Vì vậy, cùng một cảnh vật có thể để lại dấu ấn rất khác nhau ở mỗi người.`
      },
      {
        heading: "2. Hệ thống tham chiếu nội tâm (Internal Referencing & Baseline)",
        content: `Cách dễ hiểu nhất là xem Si như một hệ thống đối chiếu nội bộ:
• Một căn phòng mới ngay lập tức tạo cảm giác “khác với những nơi mình từng ở”.
• Một món ăn được đánh giá qua độ lệch so với hương vị quen thuộc trước đây.
• Một quy trình mới được tiếp nhận bằng cách so sánh với quy trình đã từng hoạt động hiệu quả.

Myers & Briggs Foundation mô tả dominant Si là quá trình liên tục so sánh sự kiện hiện tại với kinh nghiệm quá khứ và lưu giữ các dữ liệu giác quan có ý nghĩa để dùng về sau. Trong MBTI, Si là dominant process của ISTJ và ISFJ.`
      },
      {
        heading: "3. Vì sao người dùng Si thường có vẻ cẩn trọng?",
        content: `Bởi vì trải nghiệm tích lũy tạo ra các điểm tham chiếu vững chắc: Nếu bạn từng chứng kiến cùng một sai sót xảy ra 3 lần khi một bước quy trình bị bỏ qua, lần thứ 4 bạn có lý do xác đáng để cẩn thận với bước đó.

Đây không phải là nỗi sợ hãi sự đổi mới; đó là nhận thức rằng dữ liệu quá khứ chứa đựng thông tin vô cùng hữu ích về hiện tại. Si khỏe mạnh không nói “cũ luôn tốt hơn mới”; nó nói: “Trước khi dẹp bỏ cái cũ, hãy hiểu rõ nó từng giải quyết vấn đề gì”.`
      },
      {
        heading: "4. Si trong đời sống thực",
        content: `• Trong học tập: Tiếp thu tốt nhất khi kiến thức gắn với các ví dụ thực tế rõ ràng và xây dựng tuần tự từ nền tảng đã biết.
• Trong công việc: Nhanh chóng nhận ra sự sai lệch khỏi chuẩn mực (baseline): một con số bất thường, một bước bị thiếu sót, một sự thay đổi nhỏ trong hành vi quen thuộc của đồng nghiệp.
• Trong cơ thể: Nhạy bén với trạng thái sinh học nội tại và những biến đổi nhỏ so với trạng thái bình thường của bản thân.
• Trong quan hệ: Ghi nhớ những chi tiết đã tích lũy thành lịch sử gắn kết chung giữa hai người.`
      },
      {
        heading: "5. Si không phải là “hàm trí nhớ” hay bảo thủ mù quáng",
        content: `Trí nhớ là năng lực phổ quát của con người; một người Ne hay Se vẫn có thể có trí nhớ siêu việt. Điểm đặc trưng của Si là cách thức mà ký ức và các ấn tượng lưu giữ được dùng để định hướng nhận thức cho hiện tại.

Tương tự, “truyền thống” không đồng nghĩa với Si. Một người dùng Si có thể duy trì những thói quen hoàn toàn khác biệt với xã hội nếu thói quen đó đã chứng minh là tối ưu đối với chính họ.`
      },
      {
        heading: "6. Khi Si bị sử dụng quá mức & Phân biệt Si vs Se",
        content: `Tham chiếu hữu ích có thể trở thành nhà tù nếu quá khứ bị biến thành tiêu chuẩn tuyệt đối: Xem mọi sự mới lạ là mối đe dọa, hoặc mất khả năng cập nhật chuẩn mực khi thực tế đã đổi khác.

• Si hỏi: “Trải nghiệm hiện tại giống hoặc khác với điều mình đã biết như thế nào?” (Internal reference).
• Se hỏi: “Ngay lúc này, thực tế cụ thể đang mang lại điều gì cho các giác quan?” (Present immediacy).`
      },
      {
        heading: "7. Nguồn tham khảo học thuật",
        content: `1. C. G. Jung — Psychological Types, Chương X (Introverted Sensation).
2. Myers & Briggs Foundation — The Processes of Type Dynamics (Introverted Sensing).`
      }
    ]
  },

  // ==========================================
  // 06. SE — EXTRAVERTED SENSING
  // ==========================================
  Se: {
    title: "Se — Extraverted Sensing (Cảm giác hướng ngoại)",
    sections: [
      {
        heading: "1. Bản chất của Se: Tiếp xúc trực tiếp với thực tại đang diễn ra (Direct contact with what is happening now)",
        content: `Se là quá trình tiếp nhận dữ liệu cụ thể của môi trường với độ ưu tiên tuyệt đối cho những gì đang thực sự hiện diện ngay tại khoảnh khắc này.

Trong thuật ngữ Jungian, sensation không đồng nghĩa với việc tìm kiếm cảm giác mạnh (thrill-seeking). Sensation đơn giản là sự nhận biết thông qua những gì cụ thể và hiện hữu. Jung mô tả extraverted sensation là dạng tiếp nhận bị tác động mạnh mẽ bởi đối tượng khách quan: Cường độ, màu sắc, âm thanh và đặc tính vật lý của sự vật đang xảy ra bên ngoài có sức nặng rất lớn.`
      },
      {
        heading: "2. Tiếp nhận thực tại trước khi giải thích",
        content: `Se bắt đầu bằng câu hỏi trực diện: “Có điều gì đang hiện diện ở đây?”.
• Không phải: “Điều này gợi nhớ đến chuyện gì trong quá khứ?” (như Si).
• Không phải: “Điều này có thể liên tưởng tới tiềm năng nào?” (như Ne).
• Không phải: “Ẩn sau nó là quy luật dài hạn nào?” (như Ni).

Se chú ý đến chính bản thân đối tượng (object itself). Nó biểu hiện qua việc nhận ra chuyển động, cơ hội vật lý, sự thay đổi vi tế trong môi trường, âm sắc, nhịp điệu hoặc các chi tiết giác quan mà người khác vì bận suy nghĩ miên man nên không hề nhận ra.`
      },
      {
        heading: "3. Mối liên hệ giữa Se và khả năng phản xạ hành động (Responsiveness)",
        content: `Vì dữ liệu của Se nằm ở môi trường thực tế trước mắt, nó gắn liền tự nhiên với sự thích ứng và phản hồi nhanh nhạy.

Khi một sự cố xảy ra, người dùng Se có thể ngay lập tức thử một thao tác xử lý; kết quả thay đổi, họ lập tức điều chỉnh theo dữ liệu mới. Thay vì cần một mô hình lý thuyết hoàn chỉnh trước khi bước vào cuộc chơi, họ học hỏi hiệu quả nhất qua tương tác thực tế trực tiếp.

Trong MBTI, Se là dominant process của ESTP và ESFP.`
      },
      {
        heading: "4. Se không phải là “hàm tiệc tùng” (Party function)",
        content: `Định kiến Internet thường biến Se thành đua xe, tiệc tùng, thể thao mạo hiểm hay tiêu xài hàng hiệu. Những hành vi đó có thể chứa Se, nhưng không cái nào định nghĩa bản chất của Se.

Một bác sĩ cấp cứu đang quan sát các chỉ số sinh tồn biến động từng giây đang sử dụng Se. Một họa sĩ đang chú ý tỉ mỉ vào độ chuyển màu của ánh sáng cũng đang dùng Se. Một người thợ máy lắng nghe tiếng rung bất thường của động cơ cũng đang dùng Se. Cốt lõi của Se là tiếp xúc ở độ phân giải cao với thực tại hiện hữu.`
      },
      {
        heading: "5. Năng lực của Se trưởng thành & Khi Se mất cân bằng",
        content: `Se khỏe mạnh tạo ra khả năng thích ứng linh hoạt tuyệt vời: Thay vì cố ép thực tế phải khớp với kế hoạch cứng nhắc trên giấy, nó nhìn thấy kế hoạch cần phải thay đổi ở đâu để phù hợp với thực tế. Nó mang lại năng lực thưởng thức trọn vẹn vẻ đẹp của hiện tại.

Nếu kích thích tức thời trở thành tiêu chuẩn duy nhất, người dùng có thể đánh đổi hậu quả dài hạn để lấy sự thỏa mãn ngắn hạn trước mắt. Official MBTI nhắc tới trạng thái thái quá của Se là sự bốc đồng và hiếu động quá mức khi thiếu đi sự soi sáng của các chức năng phán đoán.`
      },
      {
        heading: "6. Phân biệt Se và Si: Hai lăng kính của Giác quan",
        content: `• Se ưu tiên sự trung thực tuyệt đối với thực tại giác quan trước mắt (Fidelity to current sensory reality).
• Si ưu tiên tính liên tục giữa ấn tượng hiện tại với kho tàng tham chiếu giác quan đã tích lũy trong quá khứ (Continuity with internal reference).`
      },
      {
        heading: "7. Nguồn tham khảo học thuật",
        content: `1. C. G. Jung — Psychological Types, Chương X (Extraverted Sensation).
2. Myers & Briggs Foundation — The Processes of Type Dynamics (Extraverted Sensing).`
      }
    ]
  },

  // ==========================================
  // 07. NI — INTROVERTED INTUITION
  // ==========================================
  Ni: {
    title: "Ni — Introverted Intuition (Trực giác hướng nội)",
    sections: [
      {
        heading: "1. Bản chất của Ni: Hội tụ về một quy luật bản chất (Converging toward an underlying pattern)",
        content: `Ni có lẽ là chức năng bị thần thoại hóa nhiều nhất trên Internet. Nó không phải là khả năng thấu thị huyền bí, không phải nhìn thấy trước tương lai và cũng không tự động biến ai đó thành người sâu sắc.

Ni là một kiểu nhận thức hướng vào các hình ảnh, biểu tượng và mối liên kết nội tại, có xu hướng hội tụ nhiều tín hiệu rời rạc thành một diễn giải hoặc xu hướng vận động (trajectory) thống nhất.

Jung mô tả introverted intuition hướng về các nội dung tâm lý phát sinh trong vô thức chủ quan, theo dõi sự biến đổi và ý nghĩa sâu xa của chúng, gắn liền với khả năng nhìn thấy tiềm năng trong những tiến trình không hiển lộ trực tiếp trên bề mặt.`
      },
      {
        heading: "2. Ni nén ý tưởng thay vì nhảy ý tưởng (Convergence vs Divergence)",
        content: `Sự khác biệt căn bản giữa Ni và Ne nằm ở hướng chuyển động:
• Ne nhìn một sự vật và mở rộng ra vô số cách diễn giải khác nhau (Divergence).
• Ni tiếp nhận nhiều mảnh ghép rời rạc và nén chúng dần về một quy luật cốt lõi bên dưới (Convergence).

Quá trình này diễn ra phần lớn dưới tầng tiềm thức trước khi kết luận được đưa lên ý thức. Người dùng Ni có thể cảm nhận: “Tôi chưa thể giải thích ngay bằng lời, nhưng có điều gì đó không ổn ở đây”. Sau đó, họ mới lần ngược lại để tìm các dữ kiện đã tạo nên ấn tượng đó.

Trong MBTI, Ni là dominant process của INFJ và INTJ.`
      },
      {
        heading: "3. Ni và định hướng tương lai (Pattern-based anticipation)",
        content: `Ni thường gắn liền với tương lai vì việc nén các quy luật tự nhiên tạo ra quỹ đạo vận động: Nếu sự việc A dẫn đến B, B làm tăng khả năng xảy ra C, và nhiều tín hiệu cùng chỉ về một hướng, Ni tự động chú ý tới câu hỏi: “Chuyện này rốt cuộc đang dẫn về đâu?”.

Đây không phải tiên tri ma thuật. Dự phóng của Ni hoàn toàn có thể sai lầm nếu dữ liệu đầu vào nghèo nàn, lăng kính chủ quan bị thiên lệch, hoặc người dùng quá cố chấp với câu chuyện do mình tưởng tượng ra. Ni nên được hiểu là sự dự phóng dựa trên quy luật bản chất (pattern-based anticipation).`
      },
      {
        heading: "4. Ni trong đời sống thực",
        content: `• Trong nghiên cứu: Tìm ra một sợi chỉ đỏ lý thuyết xuyên suốt kết nối hàng chục quan sát thực nghiệm tưởng như rời rạc.
• Trong chiến lược: Bỏ qua hàng loạt chi tiết vụn vặt để giữ vững định hướng dài hạn cốt lõi.
• Trong nghệ thuật & viết lách: Nhạy bén với biểu tượng (symbolism), chủ đề cốt lõi và tính nhất quán của tác phẩm.
• Trong quan hệ: Chú ý đến xu hướng vận động của mối quan hệ hơn là từng sự việc riêng lẻ: “Mối gắn kết giữa hai chúng ta đang thực sự trở thành điều gì?”.`
      },
      {
        heading: "5. Khi Ni tự khóa vào một diễn giải chủ quan (Tunnel Vision)",
        content: `Mặt trái của sự hội tụ là hội chứng tầm nhìn đường hầm (tunnel vision): Một giả thuyết bắt đầu có vẻ đúng; mọi dữ kiện mới ngoài đời bị gượng ép diễn giải sao cho vừa vặn với giả thuyết đó; các lời giải thích thay thế khác hoàn toàn bị phớt lờ.

Tài liệu MBTI gọi đây là trạng thái quá bám chấp vào tầm nhìn và chỉ thu nạp dữ liệu ủng hộ lý thuyết của mình. Ni trưởng thành bắt buộc phải luôn mở một cánh cửa cho Se: “Thực tế hiện tại có thực sự ủng hộ cho cách diễn giải này của mình hay không?”.`
      },
      {
        heading: "6. Phân biệt Ni và Ne: Hai chiều kích của Trực giác",
        content: `• Ni hỏi: “Tất cả những điều này đang hội tụ về quy luật cốt lõi nào?” (Nhiều tín hiệu → Một quy luật).
• Ne hỏi: “Từ điểm khởi đầu này còn có thể mở ra những khả năng nào khác?” (Một điểm → Nhiều tiềm năng).`
      },
      {
        heading: "7. Nguồn tham khảo học thuật",
        content: `1. C. G. Jung — Psychological Types, Chương X (Introverted Intuition).
2. Myers & Briggs Foundation — The Processes of Type Dynamics (Introverted Intuition).`
      }
    ]
  },

  // ==========================================
  // 08. NE — EXTRAVERTED INTUITION
  // ==========================================
  Ne: {
    title: "Ne — Extraverted Intuition (Trực giác hướng ngoại)",
    sections: [
      {
        heading: "1. Bản chất của Ne: Nhìn thấy những tiềm năng chưa khai phá (Seeing what else could be)",
        content: `Nếu Ni thường hội tụ, Ne luôn mở rộng.
Extraverted Intuition là quá trình nhận ra các mối liên hệ và tiềm năng mới trong thế giới khách quan bên ngoài: Một đồ vật, một cuộc trò chuyện hay một sự kiện thực tế có thể nhanh chóng kích hoạt hàng loạt hướng liên tưởng và nhiều viễn cảnh mà tình huống đó có thể phát triển thành.

Jung mô tả extraverted intuition là sự tìm kiếm các khả năng tiềm ẩn trong hoàn cảnh bên ngoài. Kiểu trực giác này cực kỳ nhạy bén với những điều “đang manh nha” — nơi thực tại chứa đựng những tiềm năng chuyển hóa chưa định hình. Khi một tình huống đã trở nên quá quen thuộc và cố định, sự chú ý của Ne tự động chuyển sang nơi còn không gian cho sự biến chuyển mới.`
      },
      {
        heading: "2. Ne nhìn hiện tại như một điểm xuất phát",
        content: `• Se nhìn một chiếc hộp và chú ý hình dáng, màu sắc, chất liệu cụ thể của chiếc hộp đó.
• Ne nhìn chiếc hộp và lập tức nảy ra: Nó có thể dùng làm gì khác? Ghép với vật gì? Biến hóa thành món đồ chơi nào? Hoặc sự hiện diện của nó ở đây nói lên điều gì?

Đây là lý do Ne gắn liền với tư duy động não (brainstorming). Một ý tưởng không nhất thiết được đưa ra vì người dùng tin chắc nó đúng; đôi khi ý tưởng được nói ra chỉ vì nó mở thêm một nhánh tư duy mới mẻ.

Trong MBTI, ENFP và ENTP có Ne là dominant process.`
      },
      {
        heading: "3. Động cơ liên tưởng của Ne (Associative Engine)",
        content: `Một cuộc trò chuyện về nhà ở có thể nhanh chóng dẫn sang quy hoạch đô thị, dẫn tiếp sang sự cô đơn của con người thời hiện đại, rồi sang mô hình làm việc từ xa, và kết thúc bằng một ý tưởng khởi nghiệp công nghệ.

Với người ngoài, mạch suy nghĩ có vẻ ngẫu hứng, nhưng trong tâm trí Ne, mỗi bước nhảy vọt đều có một cây cầu liên tưởng (associative bridge) chặt chẽ. Thế mạnh của tiến trình này là không bị trói buộc bởi công năng ban đầu của sự vật hay định kiến thông thường.`
      },
      {
        heading: "4. Ne trong sáng tạo và giải quyết vấn đề",
        content: `Sáng tạo không phải là độc quyền của Ne, nhưng Ne cực kỳ xuất sắc trong giai đoạn phát sinh ý tưởng (hypothesis generation):
• Tạo ra nhiều giả thuyết khác nhau trước khi chọn lựa.
• Kết nối hai lĩnh vực tưởng như hoàn toàn không liên quan thành một giải pháp đột phá.
• Nhìn thấy cơ hội tiềm tàng ngay trong một giới hạn mà người khác coi là ngõ cụt.`
      },
      {
        heading: "5. Ne không đồng nghĩa với ADHD hay thiếu kỷ luật",
        content: `Đây là một định kiến phổ biến nhưng sai lầm. Một người dùng Ne với các chức năng phán đoán (Ti hoặc Fi) phát triển tốt hoàn toàn có khả năng kiên trì thực thi dự án dài hạn. Chức năng nhận thức giải thích vì sao các khả năng mới liên tục xuất hiện trong đầu, không quyết định người đó có tính kỷ luật hay không.

Tương tự, sự yêu thích cái mới không đủ để kết luận là Ne: Se cũng thích cái mới vì trải nghiệm trực tiếp; Ne bị cuốn hút bởi tiềm năng ẩn giấu bên trong cái mới.`
      },
      {
        heading: "6. Khi Ne bị lạm dụng & Cách Ne trưởng thành học hỏi từ Si",
        content: `Nếu mọi khả năng đều được giữ mở vô tận, sẽ không có lựa chọn nào thực sự biến thành cam kết hành động cụ thể. Một ý tưởng mới luôn trông hấp dẫn hơn một dự án đã bước vào giai đoạn thực thi nhọc nhằn.

Tài liệu MBTI mô tả exaggerated Ne là trạng thái bị ngập trong các lựa chọn hoặc thay đổi chỉ vì muốn thay đổi. Ne trưởng thành phải học hỏi giá trị của Si: tính liên tục, điểm tựa tham chiếu, bằng chứng từ kinh nghiệm thực tiễn và việc xem xét các ý tưởng tương tự trước đây đã mang lại kết quả ra sao.`
      },
      {
        heading: "7. So sánh Ne và Ni: Hai kiến trúc bổ trợ của Trực giác",
        content: `Ne không “nông” hơn Ni; Ni cũng không “sáng tạo” hơn Ne.
Cả hai đều là Trực giác (Intuition) — tức đều quan tâm đến những thông tin vượt ra ngoài mô tả trực quan của hiện tại:
• Ne mở rộng: Một kích thích ban đầu → Tỏa ra vô số nhánh tiềm năng.
• Ni hội tụ: Vô số mảnh ghép rời rạc → Thu về một quy luật cốt lõi duy nhất.`
      },
      {
        heading: "8. Nguồn tham khảo học thuật",
        content: `1. C. G. Jung — Psychological Types, Chương X (Extraverted Intuition).
2. Myers & Briggs Foundation — The Processes of Type Dynamics (Extraverted Intuition).`
      }
    ]
  }
};
