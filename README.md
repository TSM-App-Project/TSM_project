# TSM Project - Hướng Dẫn Cài Đặt và Chạy Dự Án (Cho Máy Mới)

Đây là hướng dẫn chi tiết để thiết lập và khởi chạy dự án TSM (Phần mềm Quản lý Tiệm Vàng) trên một máy tính hoàn toàn mới.

## 1. Yêu cầu hệ thống (Prerequisites)
Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các phần mềm sau:
- **Java Development Kit (JDK) 17**: Cần thiết để chạy backend (Spring Boot).
- **Node.js (phiên bản 18.x hoặc 20.x trở lên)**: Kèm theo `npm` để cài đặt và chạy Frontend.
- **PostgreSQL**: Hệ quản trị cơ sở dữ liệu.
- **Git** (Tuỳ chọn, dùng để quản lý source code).

## 2. Cài đặt và Cấu hình Cơ sở dữ liệu (PostgreSQL)
1. Cài đặt PostgreSQL (Khuyên dùng phiên bản 14 trở lên).
2. Mở pgAdmin hoặc công cụ quản lý DB (như DBeaver, DataGrip, v.v.).
3. Tạo một database mới với tên: `db`
4. Đảm bảo thông tin đăng nhập PostgreSQL trên máy bạn trùng khớp với cấu hình mặc định của backend:
   - **Host:** `localhost:5432`
   - **Database:** `db`
   - **Username:** `postgres`
   - **Password:** `root`
   
   *(Lưu ý: Nếu máy bạn có mật khẩu hoặc username khác, vui lòng mở tệp `Backend/jewelry-shop-server/jewelry-shop-server/src/main/resources/application-local.yml` và chỉnh sửa phần `spring.datasource` tương ứng, hoặc thiết lập thông qua các biến môi trường `DB_USER`, `DB_PASSWORD`)*.

## 3. Khởi chạy Backend (Java Spring Boot)
1. Mở terminal (PowerShell hoặc Command Prompt) tại **thư mục gốc** của dự án.
2. Chạy script hỗ trợ khởi động Backend:
   ```powershell
   .\run_backend.ps1
   ```
   **Lưu ý**: Lần đầu chạy, Maven sẽ cần thời gian để tải tất cả các thư viện phụ thuộc (dependencies) về máy. Khi thấy dòng log thông báo `Started JewelryShopServerApplication` nghĩa là backend đã chạy thành công ở cổng `8080`.
   > 💡 Cơ sở dữ liệu sẽ được tự động tạo bảng (Hibernate `ddl-auto: update`) và dữ liệu mẫu (mock data) sẽ được tự động nạp vào thông qua tệp `import.sql`.

## 4. Khởi chạy Frontend (React / Vite)
1. Mở một cửa sổ terminal mới (vẫn giữ terminal của backend chạy ngầm).
2. Di chuyển vào thư mục Frontend:
   ```powershell
   cd Frontend
   ```
3. Cài đặt các thư viện cần thiết (chỉ cần chạy một lần duy nhất):
   ```powershell
   npm install
   ```
4. Khởi động giao diện web ở chế độ phát triển (Development):
   ```powershell
   npm run dev
   ```
   Sau khi hoàn tất, terminal sẽ hiển thị một đường link (thường là `http://localhost:5173`). Bạn có thể nhấn giữ `Ctrl` + Click vào link để mở trên trình duyệt web.

5. **(Tuỳ chọn) Chạy dưới dạng ứng dụng Desktop (Electron):**
   Nếu bạn muốn trải nghiệm ứng dụng độc lập trên máy tính thay vì trình duyệt, hãy chạy lệnh sau:
   ```powershell
   npm run electron
   ```

## 5. Tài khoản đăng nhập mặc định
Dự án được khởi tạo sẵn một số tài khoản với các vai trò khác nhau. Bạn có thể sử dụng các tên đăng nhập (username) sau:
- **Admin:** `admin`
- **Quản lý:** `quanly1`
- **Kế toán:** `ketoan1`
- **Nhân viên:** `nhanvien1`

*(Mật khẩu cho các tài khoản trên đã được mã hóa sẵn trong tệp `import.sql`. Mật khẩu gốc cho các tài khoản mặc định này là `password` hoặc `123456`).*

## 6. Xử lý sự cố thường gặp (Troubleshooting)
- **Lỗi không tìm thấy `java` khi chạy `run_backend.ps1`**: Hãy đảm bảo bạn đã cài đặt Java 17 và thiết lập biến môi trường `JAVA_HOME` trỏ tới thư mục cài đặt JDK.
- **Lỗi kết nối Database (Connection refused)**: Kiểm tra lại dịch vụ PostgreSQL xem đã khởi chạy chưa, port có đúng là `5432` không, và username/password đã đúng với cấu hình chưa.
- **Lỗi khi chạy `npm install`**: Đảm bảo phiên bản Node.js của bạn đạt yêu cầu. Nếu có lỗi dependency, bạn có thể xóa thư mục `node_modules` và file `package-lock.json` sau đó chạy lại `npm install`. Có thể dùng thêm các lệnh sửa lỗi được cấu hình sẵn như `npm run fix-electron` hoặc `npm run fix-charts` nếu cần thiết.