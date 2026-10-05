import type { ArticleDocument } from "./articleTypes";

export const aboutArticle: ArticleDocument = {
  "title": "Giới thiệu về MOSAIC",
  "eyebrow": "MOSAIC / Giới thiệu",
  "subtitle": "Một nền tảng typology được xây dựng để đặt nhiều mô hình cạnh nhau, giữ lại sự phức tạp của con người và biến kết quả test thành một hệ sinh thái có cấu trúc.",
  "highlights": [
    {
      "label": "Hiểu bản thân",
      "text": "Dùng nhiều lớp dữ liệu để hỗ trợ self-reflection, thay vì thu gọn người dùng vào một nhãn."
    },
    {
      "label": "Có cấu trúc",
      "text": "Kết nối assessment, profile, knowledge, discover, discussion và statistics trong cùng một hệ thống."
    },
    {
      "label": "Thận trọng",
      "text": "Xem type và score như mẫu tham chiếu để diễn giải xu hướng, không phải định nghĩa tuyệt đối."
    }
  ],
  "intro": [
    "MOSAIC là một nền tảng khám phá và hệ thống hóa kiến thức về personality typology, được xây dựng xoay quanh ba mục tiêu chính: giúp người dùng hiểu bản thân sâu hơn, tiếp cận các hệ thống typology một cách có cấu trúc, và kết nối kết quả cá nhân với một hệ sinh thái gồm bài test, hồ sơ, kiến thức, thảo luận, matching và thống kê.",
    "Thay vì xem mỗi hệ thống như một bài trắc nghiệm độc lập, MOSAIC tiếp cận personality typology như một tập hợp nhiều mô hình có thể được đặt cạnh nhau, so sánh và diễn giải trong cùng một không gian. Người dùng có thể bắt đầu với MBTI và Cognitive Functions, tiếp tục với Enneagram, sau này mở rộng sang Big Five và các framework khác, rồi dần xây dựng một hồ sơ typology toàn diện hơn theo thời gian.",
    "Điểm quan trọng trong cách tiếp cận của MOSAIC là không coi một kết quả test như một nhãn tuyệt đối. Một type, function stack hay Enneagram core type được xem như mẫu tham chiếu để diễn giải xu hướng, không phải một chiếc hộp cố định quyết định toàn bộ tính cách, năng lực hay hành vi của một con người. Vì vậy, hệ thống tập trung nhiều hơn vào cấu trúc điểm số, mức độ tương thích giữa các pattern, động lực phía sau hành vi và những khác biệt giữa kết quả thực tế với mô hình lý thuyết."
  ],
  "blocks": [
    {
      "type": "heading",
      "level": 2,
      "id": "mot-nen-tang-nhieu-he-thong-typology",
      "text": "Một nền tảng, nhiều hệ thống typology"
    },
    {
      "type": "paragraph",
      "text": "MOSAIC được thiết kế để tránh tình trạng người dùng phải chuyển qua nhiều website khác nhau để làm test, đọc kiến thức, tìm cộng đồng hoặc so sánh kết quả."
    },
    {
      "type": "paragraph",
      "text": "Trong cùng một hệ thống, người dùng có thể:"
    },
    {
      "type": "list",
      "items": [
        "thực hiện các bài assessment;",
        "xem và lưu kết quả;",
        "xây dựng hồ sơ typology cá nhân;",
        "đọc thư viện kiến thức;",
        "khám phá người dùng khác;",
        "xem mức độ tương thích;",
        "tham gia thảo luận;",
        "xem dữ liệu thống kê tổng hợp;",
        "và sử dụng các tính năng AI hỗ trợ diễn giải trong những phần phù hợp."
      ]
    },
    {
      "type": "paragraph",
      "text": "Các module này không hoạt động tách rời. Chúng được thiết kế để bổ sung cho nhau."
    },
    {
      "type": "paragraph",
      "text": "Một kết quả test có thể trở thành một phần của Profile. Profile có thể được dùng trong Discover và Matching. Dữ liệu test mà người dùng tự nguyện cho phép chia sẻ có thể đóng góp vào Statistics. Knowledge giúp giải thích các hệ thống đằng sau kết quả. Discussion tạo không gian để người dùng trao đổi về các chủ đề đó mà không biến phần kiến thức chính thức thành một forum thiếu cấu trúc."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "test-khong-chi-e-tra-ve-mot-nhan",
      "text": "Test không chỉ để trả về một nhãn"
    },
    {
      "type": "paragraph",
      "text": "Phần assessment là một trong những thành phần cốt lõi của MOSAIC."
    },
    {
      "type": "paragraph",
      "text": "Với Cognitive Functions, hệ thống không chỉ trả về một mã bốn chữ. Kết quả trước hết được xây dựng từ hồ sơ tám chức năng nhận thức, sau đó mới được so sánh với các reference pattern của 16 MBTI types để tìm những kiểu tương thích nhất."
    },
    {
      "type": "paragraph",
      "text": "Điều này cho phép MOSAIC hiển thị cả:"
    },
    {
      "type": "list",
      "items": [
        "điểm của từng cognitive function;",
        "cấu trúc function profile;",
        "mức độ tương thích với từng MBTI type;",
        "kiểu phù hợp nhất;",
        "những type đứng gần nhau;",
        "và sự khác biệt giữa profile thực tế với function stack tham chiếu."
      ]
    },
    {
      "type": "paragraph",
      "text": "Với Enneagram, hệ thống tập trung vào động lực cốt lõi hơn là stereotype hành vi. Kết quả bao gồm core type, wing, instinctual stack, mức độ phân tách giữa các type và các thành phần liên quan khác."
    },
    {
      "type": "paragraph",
      "text": "Cách tiếp cận này giúp kết quả giàu thông tin hơn câu trả lời đơn giản kiểu:"
    },
    {
      "type": "quote",
      "text": "“Bạn là INFP.”"
    },
    {
      "type": "paragraph",
      "text": "hoặc:"
    },
    {
      "type": "quote",
      "text": "“Bạn là Type 5.”"
    },
    {
      "type": "paragraph",
      "text": "Thay vào đó, MOSAIC cố gắng trả lời:"
    },
    {
      "type": "quote",
      "text": "“Trong những mẫu tham chiếu đang được so sánh, pattern nào hiện phù hợp nhất với hồ sơ câu trả lời của bạn, và vì sao?”"
    },
    {
      "type": "heading",
      "level": 2,
      "id": "ai-nhu-mot-lop-ho-tro-khong-phai-nguoi-phan-quyet",
      "text": "AI như một lớp hỗ trợ, không phải người phán quyết"
    },
    {
      "type": "paragraph",
      "text": "MOSAIC có định hướng tích hợp AI vào hệ thống assessment và diễn giải kết quả, nhưng AI không được xem như công cụ thay thế hoàn toàn scoring logic."
    },
    {
      "type": "paragraph",
      "text": "Các bài test cốt lõi vẫn sử dụng những thuật toán chấm điểm xác định và có thể kiểm tra lại. AI phù hợp hơn với những nhiệm vụ như:"
    },
    {
      "type": "list",
      "items": [
        "giải thích kết quả theo ngôn ngữ dễ hiểu;",
        "làm rõ sự khác biệt giữa các type gần nhau;",
        "hỗ trợ người dùng suy nghĩ về một câu hỏi khó;",
        "đưa ra follow-up phù hợp;",
        "tóm tắt một hồ sơ phức tạp;",
        "liên kết kết quả với nội dung trong Knowledge."
      ]
    },
    {
      "type": "paragraph",
      "text": "Cách này giúp phần scoring vẫn nhất quán và có thể tái tạo, trong khi AI tạo thêm một lớp diễn giải linh hoạt hơn cho từng người."
    },
    {
      "type": "paragraph",
      "text": "AI trong MOSAIC không nên được hiểu là:"
    },
    {
      "type": "quote",
      "text": "“AI quyết định bạn là ai.”"
    },
    {
      "type": "paragraph",
      "text": "Vai trò phù hợp hơn là:"
    },
    {
      "type": "quote",
      "text": "“AI giúp bạn đọc và hiểu dữ liệu mà hệ thống đã tạo ra.”"
    },
    {
      "type": "heading",
      "level": 2,
      "id": "profile-nhu-mot-buc-tranh-tong-hop",
      "text": "Profile như một bức tranh tổng hợp"
    },
    {
      "type": "paragraph",
      "text": "Profile trong MOSAIC không chỉ là trang chứa avatar và username."
    },
    {
      "type": "paragraph",
      "text": "Về lâu dài, nó được thiết kế để trở thành nơi tổng hợp các kết quả personality của một người:"
    },
    {
      "type": "list",
      "items": [
        "Cognitive Functions;",
        "MBTI best-fit;",
        "Enneagram;",
        "instinctual variants;",
        "Big Five;",
        "interests;",
        "và những thông tin mà chính người dùng lựa chọn công khai."
      ]
    },
    {
      "type": "paragraph",
      "text": "Một profile vì vậy có thể phản ánh nhiều chiều hơn một type duy nhất."
    },
    {
      "type": "paragraph",
      "text": "Hai người cùng INFP có thể có function profile rất khác. Hai người cùng Type 5 có thể có wing hoặc instinct khác nhau. Một người có thể có MBTI tương đối giống người khác nhưng Big Five lại khác rõ."
    },
    {
      "type": "paragraph",
      "text": "MOSAIC giữ những khác biệt đó thay vì cố ép người dùng vào một nhãn tổng quát duy nhất."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "discover-va-matching",
      "text": "Discover và Matching"
    },
    {
      "type": "paragraph",
      "text": "Discover được xây dựng để người dùng có thể khám phá những người khác dựa trên nhiều lớp thông tin thay vì chỉ tìm theo một MBTI type."
    },
    {
      "type": "paragraph",
      "text": "Matching trong MOSAIC không được hiểu như một hệ thống tuyên bố:"
    },
    {
      "type": "quote",
      "text": "“Hai type này chắc chắn hợp nhau.”"
    },
    {
      "type": "paragraph",
      "text": "Thay vào đó, một compatibility score có thể được xây dựng từ nhiều yếu tố:"
    },
    {
      "type": "list",
      "items": [
        "similarity hoặc complementarity trong cognitive functions;",
        "Enneagram pattern;",
        "interests;",
        "profile preferences;",
        "và các tiêu chí khác được bổ sung sau này."
      ]
    },
    {
      "type": "paragraph",
      "text": "Mục tiêu là cung cấp một chỉ số tham khảo để khám phá connection, không phải dự đoán chắc chắn chất lượng của một mối quan hệ."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "discussion-nhu-mot-khong-gian-cong-ong-rieng",
      "text": "Discussion như một không gian cộng đồng riêng"
    },
    {
      "type": "paragraph",
      "text": "Một vấn đề thường gặp ở các cộng đồng typology là ranh giới giữa kiến thức, trải nghiệm cá nhân và stereotype rất dễ bị xóa nhòa."
    },
    {
      "type": "paragraph",
      "text": "MOSAIC tách Discussion khỏi Knowledge để giải quyết phần nào vấn đề này."
    },
    {
      "type": "paragraph",
      "text": "Discussion là nơi người dùng có thể:"
    },
    {
      "type": "list",
      "items": [
        "đăng bài;",
        "đặt câu hỏi;",
        "chia sẻ trải nghiệm;",
        "thảo luận về type;",
        "phản biện một cách nhìn;",
        "hoặc trao đổi về những chủ đề liên quan."
      ]
    },
    {
      "type": "paragraph",
      "text": "Ý kiến cá nhân được phép tồn tại, nhưng nó không tự động trở thành nội dung kiến thức chính thức của nền tảng."
    },
    {
      "type": "paragraph",
      "text": "Việc tách hai khu vực giúp MOSAIC giữ được cả hai thứ: một cộng đồng sống động và một thư viện có cấu trúc."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "knowledge-nhu-mot-thu-vien-typology",
      "text": "Knowledge như một thư viện typology"
    },
    {
      "type": "paragraph",
      "text": "Knowledge là phần thư viện của MOSAIC."
    },
    {
      "type": "paragraph",
      "text": "Nội dung không chỉ mô tả “INTJ là người thế nào” hay “Type 4 có đặc điểm gì”, mà đi sâu hơn vào:"
    },
    {
      "type": "list",
      "items": [
        "nguồn gốc của hệ thống;",
        "cách mô hình được xây dựng;",
        "cognitive functions;",
        "function dynamics;",
        "16 MBTI types;",
        "9 Enneagram types;",
        "wings;",
        "instincts;",
        "Big Five;",
        "sự khác nhau giữa các framework;",
        "giới hạn của từng mô hình;",
        "và tình trạng bằng chứng nghiên cứu."
      ]
    },
    {
      "type": "paragraph",
      "text": "MOSAIC cố gắng phân biệt rõ ba lớp:"
    },
    {
      "type": "stack",
      "items": [
        "lý thuyết của hệ thống,",
        "bằng chứng nghiên cứu,",
        "và cách diễn giải phổ biến trong cộng đồng."
      ]
    },
    {
      "type": "paragraph",
      "text": "Một khái niệm được dùng rộng rãi không có nghĩa nó đã được xác nhận mạnh về mặt khoa học. Ngược lại, việc một framework có giới hạn psychometric cũng không có nghĩa mọi khái niệm trong đó hoàn toàn vô dụng cho self-reflection."
    },
    {
      "type": "paragraph",
      "text": "Knowledge được xây dựng để giữ được sự phân biệt đó."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "statistics-va-du-lieu-ong-gop-tu-nguyen",
      "text": "Statistics và dữ liệu đóng góp tự nguyện"
    },
    {
      "type": "paragraph",
      "text": "Statistics là phần biến dữ liệu assessment thành những pattern tổng hợp."
    },
    {
      "type": "paragraph",
      "text": "Ví dụ, người dùng có thể khám phá:"
    },
    {
      "type": "list",
      "items": [
        "phân bố MBTI trong một tập dữ liệu;",
        "phân bố Enneagram;",
        "cognitive function patterns;",
        "Big Five distributions;",
        "khác biệt theo nhóm tuổi;",
        "quốc gia;",
        "hoặc những demographic filter khác khi dữ liệu đủ lớn."
      ]
    },
    {
      "type": "paragraph",
      "text": "Nhưng Statistics không được xây dựng bằng cách công khai từng profile cá nhân."
    },
    {
      "type": "paragraph",
      "text": "Chỉ những dữ liệu mà người dùng chủ động đồng ý chia sẻ mới được đưa vào tập dữ liệu thống kê. Các kết quả được sử dụng ở dạng tổng hợp, và lựa chọn consent phải được tách khỏi việc người dùng có được xem kết quả của chính họ hay không."
    },
    {
      "type": "paragraph",
      "text": "Nói cách khác:"
    },
    {
      "type": "paragraph",
      "text": "Không đồng ý đóng góp dữ liệu không làm mất quyền xem kết quả."
    },
    {
      "type": "paragraph",
      "text": "MOSAIC cũng không nên hứa “anonymous” một cách tuyệt đối nếu hệ thống trong tương lai vẫn cần một internal identifier để quản lý consent hoặc cập nhật dữ liệu. Cách mô tả chính xác hơn là dữ liệu được sử dụng cho thống kê tổng hợp, còn kết quả cá nhân không được hiển thị công khai trong Statistics."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "mot-cach-tiep-can-than-trong-hon-voi-typology",
      "text": "Một cách tiếp cận thận trọng hơn với typology"
    },
    {
      "type": "paragraph",
      "text": "MOSAIC không được xây dựng trên giả định rằng personality typology có thể giải thích toàn bộ một con người."
    },
    {
      "type": "paragraph",
      "text": "MBTI không đo intelligence. Enneagram không phải công cụ chẩn đoán lâm sàng. Một compatibility score không thể dự đoán chắc chắn relationship. Một bài test không thể thay thế self-understanding, professional assessment hoặc trải nghiệm thực tế."
    },
    {
      "type": "paragraph",
      "text": "Do đó, hệ thống cố gắng tránh những cách diễn giải như:"
    },
    {
      "type": "quote",
      "text": "“INTJ luôn lạnh lùng.”"
    },
    {
      "type": "quote",
      "text": "“Type 8 chắc chắn hung hăng.”"
    },
    {
      "type": "quote",
      "text": "“INFP và ENFJ là cặp hoàn hảo.”"
    },
    {
      "type": "quote",
      "text": "“Bạn có 82% Introversion.”"
    },
    {
      "type": "paragraph",
      "text": "Thay vào đó, ngôn ngữ của MOSAIC ưu tiên:"
    },
    {
      "type": "quote",
      "text": "“có xu hướng”"
    },
    {
      "type": "quote",
      "text": "“mẫu tham chiếu”"
    },
    {
      "type": "quote",
      "text": "“mức độ tương thích”"
    },
    {
      "type": "quote",
      "text": "“theo lý thuyết này”"
    },
    {
      "type": "quote",
      "text": "“kết quả hiện tại”"
    },
    {
      "type": "quote",
      "text": "“có thể biểu hiện”"
    },
    {
      "type": "paragraph",
      "text": "Sự khác biệt tưởng nhỏ về câu chữ này phản ánh một nguyên tắc lớn hơn: typology nên mở thêm cách hiểu một con người, không thu nhỏ họ thành một nhãn."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "vi-sao-ten-la-mosaic",
      "text": "Vì sao tên là MOSAIC?"
    },
    {
      "type": "paragraph",
      "text": "Một bức mosaic được tạo nên từ nhiều mảnh riêng biệt. Mỗi mảnh có màu sắc, hình dạng và vị trí khác nhau; nhìn riêng, nó chỉ cho thấy một phần rất nhỏ. Khi nhiều mảnh được đặt cạnh nhau, một hình ảnh lớn hơn mới xuất hiện."
    },
    {
      "type": "paragraph",
      "text": "Đó cũng là cách MOSAIC tiếp cận personality."
    },
    {
      "type": "paragraph",
      "text": "MBTI là một mảnh."
    },
    {
      "type": "paragraph",
      "text": "Cognitive Functions là một mảnh."
    },
    {
      "type": "paragraph",
      "text": "Enneagram là một mảnh."
    },
    {
      "type": "paragraph",
      "text": "Big Five là một mảnh."
    },
    {
      "type": "paragraph",
      "text": "Interests, trải nghiệm cá nhân, môi trường và rất nhiều yếu tố khác vẫn là những mảnh khác mà một bài typology không thể bao quát hoàn toàn."
    },
    {
      "type": "paragraph",
      "text": "Không một hệ thống đơn lẻ nào được xem là “bản đồ hoàn chỉnh” của một con người."
    },
    {
      "type": "paragraph",
      "text": "MOSAIC đặt các framework cạnh nhau để tạo ra một bức tranh phong phú hơn, nhưng vẫn giữ khoảng trống cho những phần mà typology không thể đo được."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "mosaic-huong-toi-ieu-gi",
      "text": "MOSAIC hướng tới điều gì?"
    },
    {
      "type": "paragraph",
      "text": "Mục tiêu dài hạn của MOSAIC là trở thành một hệ sinh thái typology có cấu trúc, nơi assessment, dữ liệu, kiến thức và cộng đồng không tồn tại như những phần rời rạc."
    },
    {
      "type": "paragraph",
      "text": "Một người có thể bắt đầu bằng một bài test."
    },
    {
      "type": "paragraph",
      "text": "Sau đó đọc lý thuyết phía sau kết quả."
    },
    {
      "type": "paragraph",
      "text": "So sánh nhiều hệ thống."
    },
    {
      "type": "paragraph",
      "text": "Xây dựng profile."
    },
    {
      "type": "paragraph",
      "text": "Khám phá người khác."
    },
    {
      "type": "paragraph",
      "text": "Thảo luận."
    },
    {
      "type": "paragraph",
      "text": "Và nếu muốn, đóng góp kết quả vào một tập dữ liệu thống kê lớn hơn."
    },
    {
      "type": "paragraph",
      "text": "MOSAIC không cố đưa ra câu trả lời cuối cùng cho câu hỏi:"
    },
    {
      "type": "quote",
      "text": "“Tôi là ai?”"
    },
    {
      "type": "paragraph",
      "text": "Nó được xây dựng để giúp người dùng có thêm dữ liệu, ngôn ngữ và góc nhìn để tự trả lời câu hỏi đó theo cách có hệ thống hơn."
    }
  ]
};
