// Review Google that hien canh form dat lich. Moi ngon ngu mot bo rieng; render tinh luc build (build/render.js).
// Moi review: name, url (link review goc tren Google Maps), photos [{ src, w, h }], text.
// Ghi chu: text da rut gon (2-3 cau dau) va bo emoji; khong hien tra loi cua chu quan, khong ghi thoi gian.
// Anh khach: public/images/reviews/, tai tu googleusercontent (=w900) roi doi sang WebP rong toi da 720px.
export const REVIEWS = {
  vi: [
    {
      name: "Huyen Nguyen",
      url: "https://maps.app.goo.gl/Q5ocfRMBaHyvZnN87",
      photos: [{ src: "/images/reviews/huyen-1.webp", w: 720, h: 1280 }],
      text: "Dịch vụ tốt, chuyên nghiệp, các bạn KTV nhẹ nhàng, nhiệt tình. Mình nối mi đây nhiều lần rồi, nail làm cũng xinh và rất nhanh, đúng giờ.",
    },
    {
      name: "Tâm Nguyễn",
      url: "https://maps.app.goo.gl/49tAXFDMwhhHEKkv9",
      photos: [{ src: "/images/reviews/tam-1.webp", w: 720, h: 720 }],
      text: "Trải nghiệm dịch vụ ở đây tốt, cơ sở sạch sẽ, chăm sóc nhiệt tình, highly recommend mọi người tới đây ạ, tìm mãi mới được một quán ưng ý.",
    },
    {
      name: "Thảo Nhi Nguyễn",
      url: "https://maps.app.goo.gl/piYZGMLo5SztZQzp9",
      photos: [{ src: "/images/reviews/nhi-1.webp", w: 720, h: 1280 }],
      // Review goc viet bang tieng Anh; day la ban dich tieng Viet cua Google. Da rut gon.
      text: "Nhân viên rất thân thiện, chăm sóc khách hàng nhẹ nhàng và rất chuyên nghiệp. Tôi đã nối mi và làm móng tay, cả hai đều rất tuyệt vời, không có gì để phàn nàn.",
    },
  ],
  en: [
    {
      name: "Glady Rose G",
      url: "https://maps.app.goo.gl/KCsxHm37gMLfMgph6",
      photos: [{ src: "/images/reviews/glady-1.webp", w: 720, h: 960 }],
      // Da rut gon (bo cau cuoi).
      text: "Vy (lash technician) is so professional. She’s very gentle with my eyelashes and did a really really great job. My lashes are short and I didn’t know until know that it can be lifted this much!",
    },
    {
      name: "Sarah Elsmore",
      url: "https://maps.app.goo.gl/46ETjFwBSTiBJ8Sm9",
      photos: [
        { src: "/images/reviews/sarah-1.webp", w: 720, h: 960 },
        { src: "/images/reviews/sarah-2.webp", w: 720, h: 960 },
      ],
      // Da rut gon: bo doan gia / thoi gian lam bo va huong dan tim cua (gia cu, khong con dung).
      text: "I had my lashes done by The Lash Story and I had such a great experience!! I am totally obsessed with my lashes and would highly recommend! The girls are so lovely and very experienced.",
    },
    {
      name: "Viktoria Izadi",
      url: "https://maps.app.goo.gl/AH4p4vB9u2jJjKtm9",
      photos: [{ src: "/images/reviews/viktoria-1.webp", w: 720, h: 666 }],
      // Da rut gon (bo cau cuoi).
      text: "Linh did my amazing eyelashes and eye brows. I came in with some terrible lashes that were super hard to remove. She took her time and did the removal careful to not rip my natural lashes off.",
    },
  ],
};
