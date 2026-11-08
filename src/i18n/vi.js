// Toan bo chu tren trang (ban Viet). Ban English: en.js, CUNG bo key (chay `npm run i18n:check` de kiem tra).
// Cac gia tri co {name} / {n} / {date}... la cho de dien luc render hoac luc gui form.
export default {
  lang: "vi",
  ogLocale: "vi_VN",

  meta: {
    title: "The Lash Story · Nối mi, uốn mi và định hình mày tại 43 Quán Thánh, Hà Nội",
    description: "Góc chăm sóc mi và lông mày ở 43 Quán Thánh, Ba Đình, Hà Nội, từ 2018. Xem bảng giá và đặt lịch.",
    imageAlt: "Mặt tiền The Story Studio, 43 Quán Thánh, Hà Nội",
  },
  a11y: { skip: "Bỏ qua, đến form đặt lịch" },

  nav: {
    home: "The Lash Story, về đầu trang",
    logoAlt: "Studio The Lash Story",
    langGroup: "Ngôn ngữ",
    viLabel: "Tiếng Việt",
    enLabel: "English",
  },

  hero: {
    label: "Giới thiệu",
    imgAlt: "Mặt tiền The Story Studio, 43 Quán Thánh",
    line1: "Every set",
    line2: "tells a story",
    sub: "Góc chăm sóc mi và lông mày của studio trên phố Quán Thánh. Mỗi kiểu mi bắt đầu từ đôi mắt bạn muốn trông như thế nào.",
    cta: "Đặt lịch",
  },

  story: {
    title: "Our Story",
    sub: "A quiet corner on Quán Thánh",
    body: "The Lash Story mở cửa cùng studio từ cuối năm 2018, ngay cạnh The Nail Story trên phố Quán Thánh. Mỗi kiểu mi bắt đầu từ việc lắng nghe: bạn thích đôi mắt nhẹ nhàng hay cuốn hút, hợp với gương mặt và nhịp sống của bạn. Từ đó độ dài, độ cong và độ dày được chọn kỹ, để bộ mi trông như của riêng bạn.",
    since: "Từ 12/2018",
    address: "43 Quán Thánh, Ba Đình",
    advice: "Tư vấn và báo giá trước khi làm",
    photo1: "Dãy bàn làm việc trong studio",
    photo2: "Góc chờ với sofa trong studio",
    photo3: "Kệ trưng bày trong studio",
    photo4: "Kỹ thuật viên đang chăm sóc khách",
  },

  services: {
    title: "Our Services",
    nailAlt: "The Nail Story",
    lashAlt: "The Lash Story",
    nailDesc: "Biến mỗi bộ móng thành một bức tranh nhỏ thể hiện cá tính của riêng bạn, từ nét nhẹ nhàng tinh tế đến những thiết kế đầy nghệ thuật.",
    nailCta: "Khám phá",
    lashLine: "Chăm sóc mi, lông mày trong cùng không gian.",
    lashDesc: "Đôi mắt là nơi câu chuyện bắt đầu. Mi và lông mày được chăm chút để gương mặt bạn rạng rỡ một cách tự nhiên.",
  },

  menu: {
    title: "Menu",
    effective: "Áp dụng từ 20/05/2026",
    currencyNote: "",
    ext: {
      title: "Lash Extension",
      tabsLabel: "Kiểu mi Lash Extension, chọn để xem ảnh",
      photoAlt: "Kiểu mi {name}",
      groups: { natural: "Natural Look", signature: "Signature Look", glam: "Glam Look" },
      looks: {
        classic: { name: "Classic", sub: "" },
        babyLash: { name: "Baby Lash", sub: "" },
        classicPlus: { name: "Classic Plus", sub: "" },
        kittenLash: { name: "Kitten Lash", sub: "" },
        pixieLash: { name: "Pixie Lash", sub: "" },
        sunnyLash: { name: "Sunny Lash", sub: "" },
        medusaLash: { name: "Medusa Lash", sub: "" },
        animeLash: { name: "Anime Lash", sub: "" },
      },
      surchargeTitle: "Phụ thu",
      surcharge: {
        removal: { name: "Tháo mi", sub: "Removal" },
        bottom: { name: "Nối mi dưới", sub: "Bottom lash" },
        thick: { name: "Nối dày", sub: "Extra thickness" },
        special: { name: "Chất liệu khác", sub: "Special material" },
      },
    },
    lift: {
      title: "Lash Lift",
      alt1: "Mắt với hàng mi uốn nâng",
      alt2: "Cận cảnh hàng mi uốn nâng",
      items: {
        lift: { name: "Lash Lift & Tint", sub: "Uốn nâng mi" },
        liftPremium: { name: "Premium Lash Lift & Tint", sub: "Uốn nâng mi dòng cao cấp" },
        treatment: { name: "Lash Treatment", sub: "Dưỡng phục hồi mi" },
      },
    },
    brow: {
      title: "Brow Lift",
      alt: "Cận cảnh đôi lông mày được định hình",
      items: {
        browLift: { name: "Brow Lift", sub: "Định hình mày" },
        browPremium: { name: "Premium Brow Lamination", sub: "Định hình mày dòng cao cấp" },
        browTint: { name: "Brow Tint", sub: "Phủ màu" },
        threading: { name: "Threading", sub: "Se chỉ" },
      },
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
    lead: "Để lại tên, số điện thoại và thời gian bạn muốn ghé. Studio sẽ nhắn lại để xác nhận giờ và cùng bạn chọn kiểu mi.",
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
    noteHelp: "Bạn thích kiểu mi nào, hay có ảnh mẫu riêng? Ghi vào đây hoặc gửi qua Zalo.",
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
      body: "Studio đã nhận lịch ngày {date} lúc {time}. Studio sẽ nhắn số {phone} để xác nhận giờ và cùng bạn chọn kiểu mi.",
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
    handle: "@thelashstory.studio",
    tile: "Xem bài đăng {n} trên Instagram",
  },

  footer: {
    logoAlt: "Studio The Lash Story",
    tagline: "Every set tells a story",
    address: "43 Quán Thánh, Ba Đình, Hà Nội",
    social: "Mạng xã hội",
    copy: "© 2026 The Lash Story",
  },

  sticky: { cta: "Đặt lịch" },
};
