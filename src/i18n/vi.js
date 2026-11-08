// Toan bo chu tren trang (ban Viet). Ban English: en.js, CUNG bo key (chay `npm run i18n:check` de kiem tra).
// Cac gia tri co {name} / {n} / {date}... la cho de dien luc render hoac luc gui form.
export default {
  lang: "vi",
  ogLocale: "vi_VN",

  meta: {
    title: "The Nail Story · Nail art tại 43 Quán Thánh, Hà Nội",
    description: "Studio nail art ở 43 Quán Thánh, Ba Đình, Hà Nội, từ 2018. Xem collection, bảng giá và đặt lịch.",
    imageAlt: "Mặt tiền The Story Studio, 43 Quán Thánh, Hà Nội",
  },
  a11y: { skip: "Bỏ qua, đến form đặt lịch" },

  nav: {
    home: "The Nail Story, về đầu trang",
    logoAlt: "Studio The Nail Story",
    langGroup: "Ngôn ngữ",
    viLabel: "Tiếng Việt",
    enLabel: "English",
  },

  hero: {
    label: "Giới thiệu",
    imgAlt: "Mặt tiền The Story Studio, 43 Quán Thánh",
    line1: "Every set",
    line2: "tells a story",
    sub: "Studio nail art nhỏ trên phố Quán Thánh. Mỗi bộ móng bắt đầu từ một cuộc trò chuyện, và được làm chậm rãi cho đến khi thật vừa với bạn.",
    cta: "Đặt lịch",
  },

  story: {
    title: "Our Story",
    sub: "A quiet corner on Quán Thánh",
    body: "Thành lập từ tháng 12/2018, The Nail Story đã tô vẽ nên hành trình riêng không thể thay thế trong giới Nail Art - nơi cái đẹp được kể lại bằng những gam màu tinh tế và đường nét tỉ mỉ. Ở đây, từng bộ móng không chỉ là một tác phẩm nghệ thuật, mà còn là tư duy thẩm mỹ riêng của phong cách và cá tính.",
    address: "43 Quán Thánh, Ba Đình",
    photo1: "Dãy bàn làm móng trong studio The Nail Story",
    photo2: "Khách ngồi chờ trên sofa trong studio",
    photo3: "Kệ màu sơn và bảng mẫu móng",
    photo4: "Kỹ thuật viên đang làm móng cho khách",
  },

  services: {
    title: "Our Services",
    nailAlt: "The Nail Story",
    lashAlt: "The Lash Story",
    lashLine: "Chăm sóc mi, lông mày trong cùng không gian.",
    lashCta: "Khám phá",
  },

  collection: {
    title: "Collection",
    deckLabel: "Collection, vuốt để xem mẫu tiếp theo",
    prev: "Mẫu trước",
    next: "Mẫu sau",
    note: "Mỗi bộ được tư vấn và báo giá trước khi làm. Chi tiết có thể chỉnh theo ý và ngân sách của bạn.",
    slideAlt: "Mẫu {name}",
    base: { natural: "Nền móng thật", gelx: "Nền móng úp Gel X" },
    ext: { yes: "Có nối", no: "Không nối" },
  },

  menu: {
    title: "Menu",
    effective: "Áp dụng từ 20/05/2026",
    currencyNote: "",
    groups: {
      gel: { name: "Gel", note: "Giá đã bao gồm làm sạch móng, cắt dũa form và sơn gel." },
      design: { name: "Design", note: "" },
      spa: { name: "Spa", note: "" },
    },
    items: {
      apex: { name: "Nail tay tạo cầu", sub: "Apex Manicure" },
      pedi: { name: "Nail chân", sub: "Pedicure" },
      biab: { name: "BIAB", sub: "" },
      press: { name: "Úp gel", sub: "Press-on w Gel" },
      gelx: { name: "Gel X", sub: "Extension" },
      dual: { name: "Dual form", sub: "Extension" },
      removal: { name: "Tháo", sub: "Removal" },
      length: { name: "Extra độ dài", sub: "Extra Length" },
      glitter: { name: "Nhũ / mắt mèo", sub: "Glitter" },
      chrome: { name: "Tráng gương", sub: "Chrome" },
      french: { name: "French", sub: "" },
      ombre: { name: "Ombre", sub: "" },
      others: { name: "Design khác", sub: "Others" },
      concealer: { name: "Che khuyết điểm", sub: "Concealer" },
      handSpa: { name: "Spa tay", sub: "Hand Spa" },
      footSpa: { name: "Spa chân", sub: "Foot Spa" },
    },
  },

  contact: {
    phone: "086 656 6819",
    tel: "tel:0866566819",
    chatLabel: "Hotline/Zalo: 086 656 6819",
    chatHref: "https://zalo.me/0866566819",
    chatMethod: "zalo",
  },

  book: {
    title: "Đặt lịch",
    lead: "Để lại tên, số điện thoại và thời gian bạn muốn ghé. Studio sẽ nhắn lại để xác nhận giờ và cùng bạn chọn mẫu.",
    review: "Xem đánh giá trên Google",
  },

  form: {
    name: "Tên của bạn",
    phone: "Số điện thoại / Zalo",
    phoneHelp: "",
    date: "Ngày",
    time: "Khung giờ",
    note: "Ghi chú",
    optional: "(không bắt buộc)",
    noteHelp: "Muốn làm mẫu nào trong collection, hay có ảnh mẫu riêng? Ghi vào đây hoặc gửi qua Zalo.",
    submit: "Đặt lịch",
    sending: "Đang gửi...",
    sendError: "Chưa gửi được. Bạn thử lại, hoặc nhắn studio qua Zalo nhé.",
    phoneRule: "vn",
    err: {
      name: "Bạn cho studio xin tên nhé.",
      phone: "Số điện thoại chưa đúng, ví dụ 086 656 6819.",
      date: "Chọn ngày bạn muốn đến.",
      dateGone: "Ngày này đã qua.",
      time: "Chọn một khung giờ.",
      timeGone: "Khung giờ này hôm nay đã qua.",
    },
    done: {
      title: "Cảm ơn {name}",
      body: "Studio đã nhận lịch ngày {date} lúc {time}. Studio sẽ nhắn số {phone} để xác nhận giờ và cùng bạn chọn mẫu.",
    },
  },

  fmt: {
    thousands: ".",
    currency: "đ",
    dateStyle: "dmy",
    dateLocale: "vi-VN",
    timeStyle: "24h",
  },

  insta: {
    title: "Inspiration",
    handle: "@thenailstory.studio",
    tile: "Xem bài đăng {n} trên Instagram",
  },

  footer: {
    logoAlt: "Studio The Nail Story",
    tagline: "Every set tells a story",
    address: "43 Quán Thánh, Ba Đình, Hà Nội",
    social: "Mạng xã hội",
    copy: "© 2026 The Nail Story",
  },

  sticky: { cta: "Đặt lịch" },
};
