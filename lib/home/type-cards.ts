export const mbtiCards = [
  { code:'INTJ', name:'Nhà chiến lược', summary:'Nhìn xa, kết nối mô hình và xây dựng hướng đi độc lập.', family:'analyst' },
  { code:'INTP', name:'Nhà tư duy', summary:'Tò mò về ý tưởng, logic và cách mọi thứ vận hành.', family:'analyst' },
  { code:'ENTJ', name:'Nhà chỉ huy', summary:'Tổ chức nguồn lực và biến tầm nhìn thành hành động.', family:'analyst' },
  { code:'ENTP', name:'Người tranh biện', summary:'Khám phá khả năng mới và thử thách các giả định.', family:'analyst' },
  { code:'INFJ', name:'Người cố vấn', summary:'Tìm ý nghĩa, chiều sâu và định hướng cho tương lai.', family:'diplomat' },
  { code:'INFP', name:'Người hòa giải', summary:'Trân trọng giá trị cá nhân, trí tưởng tượng và sự chân thành.', family:'diplomat' },
  { code:'ENFJ', name:'Người dẫn đường', summary:'Kết nối con người và khuyến khích sự phát triển chung.', family:'diplomat' },
  { code:'ENFP', name:'Người truyền cảm hứng', summary:'Đón nhận khả năng, sự sáng tạo và những kết nối mới.', family:'diplomat' },
  { code:'ISTJ', name:'Người trách nhiệm', summary:'Coi trọng tính nhất quán, kinh nghiệm và cam kết.', family:'sentinel' },
  { code:'ISFJ', name:'Người bảo vệ', summary:'Chăm sóc bằng sự chu đáo và chú ý tới chi tiết.', family:'sentinel' },
  { code:'ESTJ', name:'Người điều hành', summary:'Sắp xếp công việc rõ ràng và theo đuổi hiệu quả thực tế.', family:'sentinel' },
  { code:'ESFJ', name:'Người quan tâm', summary:'Gìn giữ sự gắn kết và quan tâm tới nhu cầu của mọi người.', family:'sentinel' },
  { code:'ISTP', name:'Nhà kỹ thuật', summary:'Tìm hiểu bằng trải nghiệm và giải quyết vấn đề thực tế.', family:'explorer' },
  { code:'ISFP', name:'Người nghệ sĩ', summary:'Nhạy với trải nghiệm, vẻ đẹp và cách biểu đạt cá nhân.', family:'explorer' },
  { code:'ESTP', name:'Người thực thi', summary:'Phản ứng linh hoạt và học hỏi qua hành động trực tiếp.', family:'explorer' },
  { code:'ESFP', name:'Người trình diễn', summary:'Mang năng lượng vào trải nghiệm và tương tác hiện tại.', family:'explorer' },
] as const;
export function typeImage(code:string) {
  const name=code==='INFP'?'infp-female.png':code==='ESFP'?'esfp.webp':`${code.toLowerCase()}.png`;
  return `/home/mbti/${name}`;
}
