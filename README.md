# ⚡ Auto Fill Forms

Tự động điền Google Forms - Nhanh chóng & Tiện lợi

## 🌐 Cách 1: Bookmarklet (Đơn giản nhất)

### Sử dụng online
Truy cập: **https://autofill-25m.pages.dev/**

### Sử dụng offline
1. Mở file `bookmarklet.html` trong Chrome
2. Kéo nút **"⚡ Auto Fill"** lên thanh Bookmark
3. Mở Google Form bất kỳ
4. Click bookmark → Tự động điền
5. Bấm **Tiếp** → Click lại bookmark → Lặp lại

---

## 🧩 Cách 2: Chrome Extension

### Cài đặt
1. Mở `chrome://extensions/`
2. Bật **Developer mode**
3. Click **Load unpacked**
4. Chọn thư mục `chrome_extension`

### Sử dụng
1. Mở Google Form
2. Click icon Extension
3. Bấm **"Điền trang này"** hoặc **"Điền tất cả & Tiếp"**

---

## 📁 Cấu trúc Project

```
AUTOCOMP/
├── bookmarklet.html      # Trang web bookmarklet
├── chrome_extension/     # Chrome Extension
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   └── icon*.png
└── README.md
```

---

## ⚠️ Lưu ý
- Tool chọn **ngẫu nhiên** các đáp án
- Kiểm tra trước khi bấm **Gửi**
- Chỉ dùng cho mục đích học tập/nghiên cứu
