import type { ArticleDocument } from "./articleTypes";

export const updateArticle: ArticleDocument = {
  "title": "Cập nhật tính năng",
  "eyebrow": "MOSAIC / Product notes",
  "subtitle": "Nhật ký phát triển dành cho những thay đổi đáng chú ý, module mới và hướng đi tiếp theo của sản phẩm.",
  "highlights": [
    {
      "label": "Assessment",
      "text": "Mở rộng scoring, kết quả chi tiết, Question Map và thiết kế Enneagram theo motivation."
    },
    {
      "label": "Knowledge",
      "text": "Phát triển thư viện MBTI, Cognitive Functions, Enneagram, nguồn tham khảo và search."
    },
    {
      "label": "Hệ sinh thái",
      "text": "Profile, Discover, Matching, Discussion, Statistics và AI được kết nối dần theo roadmap."
    }
  ],
  "intro": [
    "MOSAIC được phát triển theo hướng mở rộng từng lớp thay vì cố gắng đưa mọi ý tưởng vào ngay từ phiên bản đầu tiên. Trang này ghi lại những tính năng mới, thay đổi đáng chú ý và hướng phát triển đang được triển khai, tập trung vào trải nghiệm sử dụng thực tế của nền tảng.",
    "Khác với trang Giới thiệu về MOSAIC, phần này không giải thích MOSAIC là gì. Khác với trang Cơ sở lý thuyết, phần này cũng không trình bày framework tâm lý hay nền tảng nghiên cứu. Đây là nơi theo dõi sản phẩm đang thay đổi như thế nào."
  ],
  "blocks": [
    {
      "type": "heading",
      "level": 2,
      "id": "cap-nhat-gan-ay",
      "text": "Cập nhật gần đây"
    },
    {
      "type": "heading",
      "level": 3,
      "id": "he-thong-bai-kiem-tra-uoc-mo-rong",
      "text": "Hệ thống bài kiểm tra được mở rộng"
    },
    {
      "type": "paragraph",
      "text": "MOSAIC hiện tập trung vào hai hệ assessment chính:"
    },
    {
      "type": "definition",
      "title": "Cognitive Functions / MBTI",
      "text": "Người dùng có thể hoàn thành bài test chức năng nhận thức, xem điểm của tám functions và nhận kết quả so sánh với các reference pattern của 16 MBTI types."
    },
    {
      "type": "definition",
      "title": "Enneagram",
      "text": "Bài test Enneagram hiện bao gồm phần core motivation và instinctual pattern, cho phép tạo kết quả chi tiết hơn thay vì chỉ trả về một core type duy nhất."
    },
    {
      "type": "paragraph",
      "text": "Các bài test tiếp theo như Big Five được giữ trong roadmap và sẽ được bổ sung khi cấu trúc scoring, nội dung và cách hiển thị kết quả đã đủ hoàn chỉnh."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "ket-qua-test-chi-tiet-hon",
      "text": "Kết quả test chi tiết hơn"
    },
    {
      "type": "paragraph",
      "text": "Trang kết quả không còn chỉ hiển thị một nhãn duy nhất."
    },
    {
      "type": "paragraph",
      "text": "Với Cognitive Functions, kết quả được mở rộng để thể hiện:"
    },
    {
      "type": "list",
      "items": [
        "điểm tám cognitive functions;",
        "mức độ tương thích với nhiều MBTI types;",
        "best-fit type;",
        "thứ tự các type gần nhất;",
        "sự khác biệt giữa profile thực tế và reference stack."
      ]
    },
    {
      "type": "paragraph",
      "text": "Với Enneagram, kết quả có thể bao gồm:"
    },
    {
      "type": "list",
      "items": [
        "core type;",
        "wing;",
        "mức độ certainty;",
        "phân bố điểm của 9 types;",
        "instinctual stack;",
        "tritype."
      ]
    },
    {
      "type": "paragraph",
      "text": "Mục tiêu của cập nhật này là giúp người dùng nhìn thấy cấu trúc phía sau kết quả, thay vì chỉ nhận một label rồi kết thúc."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "question-map-va-ieu-huong-bai-test",
      "text": "Question Map và điều hướng bài test"
    },
    {
      "type": "paragraph",
      "text": "Các assessment dài dễ gây mệt nếu người dùng không biết mình đang ở đâu."
    },
    {
      "type": "paragraph",
      "text": "Vì vậy MOSAIC đã bổ sung Question Map cho bài test."
    },
    {
      "type": "paragraph",
      "text": "Người dùng có thể:"
    },
    {
      "type": "list",
      "items": [
        "xem câu nào đã trả lời;",
        "xem câu nào còn trống;",
        "biết câu hiện tại;",
        "nhảy trực tiếp đến một câu bất kỳ;",
        "quay lại chỉnh câu trả lời;",
        "submit từ bất kỳ vị trí nào sau khi hoàn thành toàn bộ bài."
      ]
    },
    {
      "type": "paragraph",
      "text": "Question Map cũng tách các nhóm câu theo từng phần của assessment, ví dụ Core Motivation và Instinct trong Enneagram."
    },
    {
      "type": "paragraph",
      "text": "Cập nhật này chủ yếu nhằm giảm cảm giác “đi qua một danh sách câu hỏi vô tận” và làm quá trình kiểm tra câu trả lời trước khi submit dễ hơn."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "he-thong-enneagram-uoc-viet-lai-theo-motivation",
      "text": "Hệ thống Enneagram được viết lại theo motivation"
    },
    {
      "type": "paragraph",
      "text": "Một trong những thay đổi lớn nhất của phần Enneagram là cách thiết kế câu hỏi."
    },
    {
      "type": "paragraph",
      "text": "Các câu hỏi cũ dễ rơi vào dạng:"
    },
    {
      "type": "quote",
      "text": "“Bạn có hay giúp đỡ người khác không?”"
    },
    {
      "type": "paragraph",
      "text": "hoặc:"
    },
    {
      "type": "quote",
      "text": "“Bạn có thích thử điều mới không?”"
    },
    {
      "type": "paragraph",
      "text": "Những câu như vậy dễ bị ảnh hưởng bởi self-image và nhiều personality traits khác nhau."
    },
    {
      "type": "paragraph",
      "text": "Bộ câu hỏi mới được chỉnh theo hướng motivation-first và sử dụng nhiều câu đối chiếu giữa hai xu hướng."
    },
    {
      "type": "paragraph",
      "text": "Ví dụ, thay vì hỏi một behavior có tốt hay xấu, câu hỏi có thể đặt hai ưu tiên đều hợp lý cạnh nhau để xem người trả lời nghiêng về motivation nào hơn."
    },
    {
      "type": "paragraph",
      "text": "Việc này giúp assessment tập trung hơn vào lý do phía sau hành vi, đặc biệt với những type dễ bị nhầm vì biểu hiện bên ngoài giống nhau."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "instinctual-variants-uoc-tach-thanh-phan-rieng",
      "text": "Instinctual Variants được tách thành phần riêng"
    },
    {
      "type": "paragraph",
      "text": "Instinct không còn bị trộn trực tiếp vào core type scoring."
    },
    {
      "type": "paragraph",
      "text": "MOSAIC hiện xử lý ba instinctual orientations:"
    },
    {
      "type": "stack",
      "items": [
        "Self-Preservation — sp",
        "Social — so",
        "Sexual / One-to-One — sx"
      ]
    },
    {
      "type": "paragraph",
      "text": "Các câu hỏi instinct được thiết kế để phân biệt giữa ba hướng chú ý này thay vì biến chúng thành stereotype như:"
    },
    {
      "type": "list",
      "items": [
        "sp = chỉ thích nghỉ ngơi;",
        "so = thích nổi tiếng;",
        "sx = thích romance."
      ]
    },
    {
      "type": "paragraph",
      "text": "Kết quả cuối cùng tạo ra một instinctual stack, ví dụ:"
    },
    {
      "type": "paragraph",
      "text": "sp → sx → so"
    },
    {
      "type": "paragraph",
      "text": "hoặc:"
    },
    {
      "type": "paragraph",
      "text": "so → sp → sx"
    },
    {
      "type": "paragraph",
      "text": "Phần này vẫn được giữ riêng khỏi core Enneagram score để tránh một construct ảnh hưởng sai lên construct còn lại."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "thu-vien-knowledge-uoc-mo-rong",
      "text": "Thư viện Knowledge được mở rộng"
    },
    {
      "type": "paragraph",
      "text": "Knowledge đang được phát triển thành một khu vực nội dung riêng thay vì chỉ là vài đoạn giải thích ngắn trên trang kết quả."
    },
    {
      "type": "paragraph",
      "text": "Các nhóm nội dung hiện được xây dựng gồm:"
    },
    {
      "type": "definition",
      "title": "MBTI & Cognitive Functions",
      "text": "Bao gồm nền tảng MBTI, type dynamics, tám cognitive functions và 16 type pages."
    },
    {
      "type": "definition",
      "title": "Enneagram",
      "text": "Bao gồm hệ thống 9 core types, wings, instinctual variants và các khái niệm liên quan."
    },
    {
      "type": "definition",
      "title": "Big Five",
      "text": "Sẽ tập trung vào năm trait dimensions và các facets liên quan."
    },
    {
      "type": "paragraph",
      "text": "Mỗi bài trong Knowledge được viết theo hướng:"
    },
    {
      "type": "list",
      "items": [
        "có cấu trúc rõ;",
        "phân biệt lý thuyết với bằng chứng nghiên cứu;",
        "tránh stereotype;",
        "có nguồn tham khảo;",
        "và không trình bày một framework như sự thật tuyệt đối."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "id": "16-trang-mbti-rieng-biet",
      "text": "16 trang MBTI riêng biệt"
    },
    {
      "type": "paragraph",
      "text": "Mỗi MBTI type hiện được định hướng thành một article riêng trong Knowledge."
    },
    {
      "type": "paragraph",
      "text": "Các bài không tập trung vào mô tả kiểu:"
    },
    {
      "type": "quote",
      "text": "“INTJ lạnh lùng.”"
    },
    {
      "type": "quote",
      "text": "“ENFP nhiều năng lượng.”"
    },
    {
      "type": "quote",
      "text": "“ISTJ thích luật lệ.”"
    },
    {
      "type": "paragraph",
      "text": "Thay vào đó, mỗi trang sử dụng cùng một cấu trúc:"
    },
    {
      "type": "list",
      "items": [
        "type trong hệ MBTI;",
        "nhóm Role;",
        "reference function stack;",
        "cấu trúc nhận thức;",
        "dynamic giữa các functions;",
        "trạng thái cân bằng;",
        "khi pattern trở nên một chiều;",
        "học tập và công việc;",
        "quan hệ và giao tiếp;",
        "hiểu lầm thường gặp;",
        "hướng phát triển;",
        "cách MOSAIC diễn giải type."
      ]
    },
    {
      "type": "paragraph",
      "text": "Bốn nhóm màu Analysts, Diplomats, Sentinels và Explorers cũng được đưa vào như một lớp phân loại trực quan, đồng thời ghi rõ đây là hệ Roles phổ biến từ 16Personalities chứ không phải tầng gốc của MBTI."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "9-trang-enneagram-rieng-biet",
      "text": "9 trang Enneagram riêng biệt"
    },
    {
      "type": "paragraph",
      "text": "Knowledge cũng đã được mở rộng với các article riêng cho Type 1 đến Type 9."
    },
    {
      "type": "paragraph",
      "text": "Mỗi bài tập trung vào:"
    },
    {
      "type": "list",
      "items": [
        "động lực cốt lõi;",
        "basic fear và basic desire;",
        "center;",
        "cách pattern vận hành;",
        "trạng thái cân bằng;",
        "trạng thái rigid;",
        "biểu hiện trong học tập và công việc;",
        "quan hệ;",
        "hai wing của từng type;",
        "hướng phát triển;",
        "và cách MOSAIC tránh stereotype."
      ]
    },
    {
      "type": "paragraph",
      "text": "Ví dụ:"
    },
    {
      "type": "stack",
      "items": [
        "Type 1 có thể là 1w9 hoặc 1w2.",
        "Type 5 có thể là 5w4 hoặc 5w6.",
        "Type 9 có thể là 9w8 hoặc 9w1."
      ]
    },
    {
      "type": "paragraph",
      "text": "Wing được trình bày như một lớp bổ sung cho core type, không phải một type hoàn toàn mới."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "search-trong-knowledge",
      "text": "Search trong Knowledge"
    },
    {
      "type": "paragraph",
      "text": "Knowledge được thiết kế để phát triển thành một thư viện đủ lớn, vì vậy search là một phần quan trọng trong roadmap."
    },
    {
      "type": "paragraph",
      "text": "Người dùng sẽ có thể tìm trực tiếp các nội dung như:"
    },
    {
      "type": "quote",
      "text": "“Ni”"
    },
    {
      "type": "quote",
      "text": "“Type 4”"
    },
    {
      "type": "quote",
      "text": "“INTP”"
    },
    {
      "type": "quote",
      "text": "“wing”"
    },
    {
      "type": "quote",
      "text": "“Big Five”"
    },
    {
      "type": "quote",
      "text": "“Extraversion”"
    },
    {
      "type": "paragraph",
      "text": "Mục tiêu là giảm việc phải đi qua nhiều category để tìm một khái niệm cụ thể."
    },
    {
      "type": "paragraph",
      "text": "Về sau, search có thể được mở rộng bằng tag, related article và suggested reading."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "profile-ca-nhan",
      "text": "Profile cá nhân"
    },
    {
      "type": "paragraph",
      "text": "Profile đang được định hướng thành nơi tổng hợp nhiều lớp dữ liệu thay vì chỉ chứa username và avatar."
    },
    {
      "type": "paragraph",
      "text": "Một profile có thể hiển thị:"
    },
    {
      "type": "list",
      "items": [
        "MBTI best-fit;",
        "Cognitive Function profile;",
        "Enneagram core type;",
        "wing;",
        "instinctual stack;",
        "Big Five;",
        "interests;",
        "những thông tin người dùng muốn công khai."
      ]
    },
    {
      "type": "paragraph",
      "text": "Người dùng sẽ có quyền kiểm soát phần nào được public và phần nào chỉ dùng cho cá nhân."
    },
    {
      "type": "paragraph",
      "text": "Profile cũng là nền tảng để Discover và Matching hoạt động về sau."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "discover",
      "text": "Discover"
    },
    {
      "type": "paragraph",
      "text": "Discover được thiết kế như một khu vực để khám phá người dùng khác dựa trên profile và interests."
    },
    {
      "type": "paragraph",
      "text": "Thay vì chỉ có filter:"
    },
    {
      "type": "quote",
      "text": "“Tìm tất cả INFP”"
    },
    {
      "type": "paragraph",
      "text": "hệ thống có thể mở rộng theo:"
    },
    {
      "type": "list",
      "items": [
        "type;",
        "function profile;",
        "Enneagram;",
        "interests;",
        "country;",
        "age group;",
        "các preference mà người dùng tự nguyện chia sẻ."
      ]
    },
    {
      "type": "paragraph",
      "text": "Discover không thay thế social network truyền thống. Nó tập trung nhiều hơn vào khám phá pattern và điểm chung có ý nghĩa."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "matching-va-compatibility",
      "text": "Matching và Compatibility"
    },
    {
      "type": "paragraph",
      "text": "Matching đang được xây dựng theo hướng score nhiều chiều."
    },
    {
      "type": "paragraph",
      "text": "Thay vì:"
    },
    {
      "type": "quote",
      "text": "“INTJ hợp ENFP 95%”"
    },
    {
      "type": "paragraph",
      "text": "MOSAIC có thể tính compatibility từ nhiều nguồn:"
    },
    {
      "type": "list",
      "items": [
        "cognitive-function structure;",
        "profile similarity;",
        "complementary patterns;",
        "Enneagram;",
        "interests;",
        "các preference bổ sung trong tương lai."
      ]
    },
    {
      "type": "paragraph",
      "text": "Một compatibility score sẽ luôn được xem là tham khảo, không phải dự đoán chắc chắn về relationship."
    },
    {
      "type": "paragraph",
      "text": "Hệ thống cũng có thể lưu version của matching algorithm để kết quả cũ vẫn có thể truy vết khi thuật toán được cập nhật."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "discussion",
      "text": "Discussion"
    },
    {
      "type": "paragraph",
      "text": "Discussion là feature dành cho cộng đồng."
    },
    {
      "type": "paragraph",
      "text": "Người dùng có thể:"
    },
    {
      "type": "list",
      "items": [
        "tạo post;",
        "bình luận;",
        "reply;",
        "gắn chủ đề;",
        "thảo luận về typology;",
        "đặt câu hỏi;",
        "chia sẻ trải nghiệm cá nhân."
      ]
    },
    {
      "type": "paragraph",
      "text": "Một điểm quan trọng trong thiết kế là Discussion không được trộn với Knowledge."
    },
    {
      "type": "paragraph",
      "text": "Knowledge là nội dung được biên tập và có nguồn."
    },
    {
      "type": "paragraph",
      "text": "Discussion là nơi opinion, interpretation và trải nghiệm cá nhân được phép tồn tại rõ ràng như những thứ mang tính cộng đồng."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "interest-tags",
      "text": "Interest Tags"
    },
    {
      "type": "paragraph",
      "text": "MOSAIC đang bổ sung hệ thống Interest để kết nối nhiều feature với nhau."
    },
    {
      "type": "paragraph",
      "text": "Một người có thể chọn các interest như:"
    },
    {
      "type": "list",
      "items": [
        "MBTI;",
        "Enneagram;",
        "Psychology;",
        "Relationships;",
        "Career;",
        "Productivity;",
        "Cognitive Functions."
      ]
    },
    {
      "type": "paragraph",
      "text": "Interest có thể được dùng ở:"
    },
    {
      "type": "stack",
      "items": [
        "Profile",
        "để thể hiện chủ đề quan tâm."
      ]
    },
    {
      "type": "stack",
      "items": [
        "Discover",
        "để tìm người có điểm chung."
      ]
    },
    {
      "type": "stack",
      "items": [
        "Discussion",
        "để phân loại bài đăng."
      ]
    },
    {
      "type": "stack",
      "items": [
        "Knowledge",
        "để liên kết article."
      ]
    },
    {
      "type": "stack",
      "items": [
        "Matching",
        "để tạo thêm dữ liệu compatibility."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "id": "statistics",
      "text": "Statistics"
    },
    {
      "type": "paragraph",
      "text": "Statistics được định hướng thành dashboard tổng hợp dữ liệu assessment."
    },
    {
      "type": "paragraph",
      "text": "Các visualisation dự kiến bao gồm:"
    },
    {
      "type": "list",
      "items": [
        "distribution của 16 MBTI types;",
        "Cognitive Function averages;",
        "Enneagram distribution;",
        "instinctual variants;",
        "Big Five distributions;",
        "cross-tab giữa nhiều variables."
      ]
    },
    {
      "type": "paragraph",
      "text": "Filter có thể bao gồm:"
    },
    {
      "type": "list",
      "items": [
        "nhóm tuổi;",
        "quốc gia;",
        "giới tính;",
        "interests;",
        "loại assessment."
      ]
    },
    {
      "type": "paragraph",
      "text": "Tính năng này phụ thuộc vào lượng dữ liệu đủ lớn và đặc biệt phụ thuộc vào consent của người dùng."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "share-data-consent",
      "text": "Share Data Consent"
    },
    {
      "type": "paragraph",
      "text": "Một update quan trọng trong roadmap là tách việc làm test khỏi việc đóng góp dữ liệu."
    },
    {
      "type": "paragraph",
      "text": "Sau khi hoàn thành assessment, người dùng có thể được hỏi liệu họ có muốn cho phép kết quả được sử dụng cho Statistics hay không."
    },
    {
      "type": "paragraph",
      "text": "Hai lựa chọn đều dẫn tới việc xem result:"
    },
    {
      "type": "paragraph",
      "text": "Đồng ý chia sẻ dữ liệu tổng hợp"
    },
    {
      "type": "paragraph",
      "text": "hoặc"
    },
    {
      "type": "paragraph",
      "text": "Không chia sẻ"
    },
    {
      "type": "paragraph",
      "text": "Consent không được tick sẵn."
    },
    {
      "type": "paragraph",
      "text": "Việc từ chối không làm giảm functionality của test."
    },
    {
      "type": "paragraph",
      "text": "Nếu người dùng đồng ý, hệ thống có thể lưu:"
    },
    {
      "type": "list",
      "items": [
        "trạng thái consent;",
        "version của consent text;",
        "thời điểm đồng ý;",
        "một snapshot những demographic fields được phép sử dụng."
      ]
    },
    {
      "type": "paragraph",
      "text": "Thiết kế này giúp Statistics tồn tại mà không biến participation thành điều kiện bắt buộc."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "tich-hop-ai-trong-bai-test",
      "text": "Tích hợp AI trong bài test"
    },
    {
      "type": "paragraph",
      "text": "AI là một feature đang được thiết kế để bổ sung trải nghiệm assessment."
    },
    {
      "type": "paragraph",
      "text": "AI có thể được dùng cho:"
    },
    {
      "type": "list",
      "items": [
        "giải thích câu hỏi;",
        "hỏi follow-up khi cần;",
        "hỗ trợ phân biệt hai pattern gần nhau;",
        "giải thích result;",
        "tóm tắt profile;",
        "dẫn người dùng sang bài Knowledge phù hợp."
      ]
    },
    {
      "type": "paragraph",
      "text": "Hệ thống cũng có thể lưu riêng AI session và interaction để phân biệt:"
    },
    {
      "type": "paragraph",
      "text": "response dùng để scoring"
    },
    {
      "type": "paragraph",
      "text": "với"
    },
    {
      "type": "paragraph",
      "text": "conversation dùng để hỗ trợ diễn giải."
    },
    {
      "type": "paragraph",
      "text": "Điều này giúp AI không làm thay đổi scoring một cách không kiểm soát."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "result-history",
      "text": "Result History"
    },
    {
      "type": "paragraph",
      "text": "Khi hệ thống account và database hoàn thiện, kết quả test sẽ không còn phụ thuộc vào session hiện tại."
    },
    {
      "type": "paragraph",
      "text": "Người dùng có thể có lịch sử:"
    },
    {
      "type": "stack",
      "items": [
        "Cognitive Functions — Version 1 — 2026",
        "Enneagram — Version 1 — 2026",
        "Cognitive Functions — Retake — 2027"
      ]
    },
    {
      "type": "paragraph",
      "text": "Điều này mở ra khả năng xem:"
    },
    {
      "type": "list",
      "items": [
        "profile thay đổi thế nào;",
        "scoring version nào được dùng;",
        "result cũ và mới khác nhau ở đâu."
      ]
    },
    {
      "type": "paragraph",
      "text": "Mỗi assessment sẽ được gắn với test version để một bài test thay đổi câu hỏi hoặc scoring trong tương lai không làm mất context của kết quả cũ."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "phien-ban-hoa-bai-test",
      "text": "Phiên bản hóa bài test"
    },
    {
      "type": "paragraph",
      "text": "Question bank và scoring logic sẽ không được coi là thứ bất biến."
    },
    {
      "type": "paragraph",
      "text": "Mỗi assessment có thể có nhiều version:"
    },
    {
      "type": "stack",
      "items": [
        "Enneagram v1",
        "Enneagram v2"
      ]
    },
    {
      "type": "paragraph",
      "text": "hoặc:"
    },
    {
      "type": "stack",
      "items": [
        "Cognitive Functions v1",
        "Cognitive Functions v1.1"
      ]
    },
    {
      "type": "paragraph",
      "text": "Khi test thay đổi đáng kể, result cần biết nó được tạo từ version nào."
    },
    {
      "type": "paragraph",
      "text": "Điều này đặc biệt quan trọng nếu MOSAIC bắt đầu có lượng dữ liệu Statistics lớn, vì không nên trộn những score được tạo từ hai instrument khác nhau mà không ghi nhận sự thay đổi."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "article-sources-va-citation",
      "text": "Article Sources và Citation"
    },
    {
      "type": "paragraph",
      "text": "Knowledge đang được mở rộng để hỗ trợ nguồn tham khảo ở mức dữ liệu thay vì chỉ viết link trực tiếp trong text."
    },
    {
      "type": "paragraph",
      "text": "Một article có thể liên kết với nhiều Source:"
    },
    {
      "type": "paragraph",
      "text": "Jung — Psychological Types"
    },
    {
      "type": "paragraph",
      "text": "McCrae & Costa"
    },
    {
      "type": "paragraph",
      "text": "Myers & Briggs Foundation"
    },
    {
      "type": "paragraph",
      "text": "systematic reviews"
    },
    {
      "type": "paragraph",
      "text": "Mỗi source có thể lưu:"
    },
    {
      "type": "list",
      "items": [
        "tác giả;",
        "năm;",
        "publisher;",
        "DOI;",
        "URL;",
        "thứ tự citation;",
        "ghi chú."
      ]
    },
    {
      "type": "paragraph",
      "text": "Điều này cho phép cùng một nguồn được tái sử dụng giữa nhiều article và làm Knowledge dễ quản lý hơn khi số lượng nội dung tăng."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "cac-tinh-nang-ang-o-roadmap",
      "text": "Các tính năng đang ở roadmap"
    },
    {
      "type": "paragraph",
      "text": "Một số feature đã được đưa vào architecture nhưng chưa cần hoàn thiện ngay:"
    },
    {
      "type": "stack",
      "items": [
        "Big Five Assessment",
        "Hoàn thiện bộ câu hỏi, scoring và result page."
      ]
    },
    {
      "type": "definition",
      "title": "Advanced Matching",
      "text": "Nâng compatibility từ heuristic đơn giản sang nhiều dimensions."
    },
    {
      "type": "definition",
      "title": "Recommendation System",
      "text": "Gợi ý article, discussion hoặc người dùng dựa trên profile và interests."
    },
    {
      "type": "stack",
      "items": [
        "Statistics nâng cao",
        "Cross-analysis giữa nhiều typology systems."
      ]
    },
    {
      "type": "stack",
      "items": [
        "Version Comparison",
        "So sánh result của cùng người qua nhiều lần test."
      ]
    },
    {
      "type": "stack",
      "items": [
        "Moderation Tools",
        "Report post, review content, moderator role."
      ]
    },
    {
      "type": "stack",
      "items": [
        "Saved Articles",
        "Bookmark nội dung Knowledge."
      ]
    },
    {
      "type": "definition",
      "title": "Follow / Connection System",
      "text": "Cho phép xây social graph nếu phù hợp với hướng phát triển."
    },
    {
      "type": "definition",
      "title": "Personalized Knowledge",
      "text": "Gợi ý bài đọc dựa trên những phần nổi bật trong profile."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "cach-mosaic-cap-nhat-tinh-nang",
      "text": "Cách MOSAIC cập nhật tính năng"
    },
    {
      "type": "paragraph",
      "text": "Các feature của MOSAIC không được thêm chỉ vì chúng “trông thú vị”."
    },
    {
      "type": "paragraph",
      "text": "Một tính năng mới nên trả lời ít nhất một trong các câu hỏi sau:"
    },
    {
      "type": "paragraph",
      "text": "Nó giúp người dùng hiểu result rõ hơn không?"
    },
    {
      "type": "paragraph",
      "text": "Nó giúp kết nối các phần của hệ thống tốt hơn không?"
    },
    {
      "type": "paragraph",
      "text": "Nó cải thiện chất lượng dữ liệu hoặc trải nghiệm không?"
    },
    {
      "type": "paragraph",
      "text": "Nó giải quyết một vấn đề hiện có không?"
    },
    {
      "type": "paragraph",
      "text": "Nó có thể được triển khai mà không làm sai lệch cách diễn giải personality không?"
    },
    {
      "type": "paragraph",
      "text": "Nếu câu trả lời đều không rõ ràng, feature đó có thể được giữ lại cho roadmap thay vì đưa vào sản phẩm chỉ để tăng số lượng chức năng."
    },
    {
      "type": "paragraph",
      "text": "MOSAIC vì vậy được phát triển theo hướng từng module có lý do tồn tại rõ ràng, rồi mới kết nối các module thành một hệ thống lớn hơn."
    },
    {
      "type": "heading",
      "level": 2,
      "id": "trang-thai-phat-trien-hien-tai",
      "text": "Trạng thái phát triển hiện tại"
    },
    {
      "type": "paragraph",
      "text": "MOSAIC hiện đã có nền tảng hoạt động cho các phần cốt lõi của assessment, đặc biệt là:"
    },
    {
      "type": "stack",
      "items": [
        "Cognitive Functions / MBTI",
        "Enneagram",
        "Result pages",
        "Question navigation",
        "Scoring logic",
        "Knowledge content đang được mở rộng"
      ]
    },
    {
      "type": "paragraph",
      "text": "Các feature lớn tiếp theo xoay quanh:"
    },
    {
      "type": "stack",
      "items": [
        "database persistence,",
        "authentication,",
        "Profile,",
        "Discover / Matching,",
        "Discussion,",
        "Statistics,",
        "và AI-assisted interpretation."
      ]
    },
    {
      "type": "paragraph",
      "text": "Trang này sẽ tiếp tục được cập nhật khi những module đó chuyển từ roadmap sang phiên bản hoạt động."
    }
  ]
};
