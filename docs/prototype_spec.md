# SkillForge — Đặc Tả Prototype

Tài liệu này mô tả các màn hình và chức năng hiện có trong bản Prototype SkillForge, bao gồm bản Demo Desktop tương tác (React) và bản Demo Mobile (HTML Catalog).

---

## 1. Interactive Desktop Demo (React App)

Toàn bộ giao diện Desktop hiện đã được chuyển đổi sang ứng dụng React tương tác nằm tại thư mục `DEMO/`.

| Phân hệ | Thành phần | Mô tả sơ bộ |
|----------|------|-------------|
| 01 | Student Dashboard | Dashboard chính dành cho học viên |
| 02 | Instructor Dashboard | Quản lý nội dung và học viên dành cho giảng viên |
| 03 | Admin Control Panel | Quản trị hệ thống, người dùng và tài chính |

---

### Mô Tả Chi Tiết Desktop Demo

#### 1. Student Dashboard (Phân hệ Học viên)
**Mục đích**: Trang chủ trung tâm của học viên, hiển thị tổng quan tiến trình học tập và các gợi ý.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Navigation** | Logo & Menu | Điều hướng giữa Home, Courses, My Learning |
| **Hero** | KPI Cards | Thống kê giờ học, tiến độ và chứng chỉ |
| **Main Content**| Active Courses | Danh sách các khóa học đang tham gia |
| **Sidebar** | Activities | Lịch sử học tập gần đây |

#### 2. Instructor Dashboard (Phân hệ Giảng viên)
**Mục đích**: Công cụ quản lý dành cho giảng viên để theo dõi khóa học và doanh thu.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Courses** | Course List | Danh sách khóa học với trạng thái và số học viên |
| **Analytics** | Revenue | Biểu đồ doanh thu và tăng trưởng |
| **Interactions**| Q&A Manager | Phản hồi các câu hỏi của học viên |

#### 3. Admin Dashboard (Phân hệ Quản trị)
**Mục đích**: Quản lý toàn bộ hệ thống, người dùng và kiểm duyệt nội dung.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Management** | User Admin | Quản lý tài khoản học viên và giảng viên |
| **Moderation** | Course Queue | Phê duyệt hoặc từ chối các khóa học mới |
| **Finance** | System Stats | Theo dõi dòng tiền và chiết khấu platform |

---

## 2. Student App (Mobile)

Danh sách các màn hình mobile dành cho học viên (Xem tại `index.html` thư mục gốc).

| Màn hình | File | Mô tả sơ bộ |
|----------|------|-------------|
| 01 | `student_app/dashboard/code.html` | Dashboard chính - hiển thị tiến trình |
| 02 | `student_app/course_search/code.html` | Tìm kiếm & khám phá khóa học |
| 03 | `student_app/course_details/code.html` | Chi tiết khóa học và nội dung |
| 04 | `student_app/course_recommendations/code.html` | Gợi ý cá nhân hóa |
| 05 | `student_app/course_reviews/code.html` | Đọc và viết đánh giá |
| 06 | `student_app/learning_interface/code.html` | Giao diện xem bài giảng |
| 07 | `student_app/lesson_discussions/code.html` | Thảo luận và hỏi đáp |
| 08 | `student_app/quiz_assignment/code.html` | Làm bài kiểm tra quiz |
| 09 | `student_app/quiz_results/code.html` | Kết quả và phản hồi quiz |
| 10 | `student_app/progress_tracking/code.html` | Theo dõi lịch sử học tập |
| 11 | `student_app/certificate_of_completion/code.html` | Chứng chỉ hoàn thành tiêu chuẩn |
| 12 | `student_app/verified_legal_certificate/code.html` | Chứng chỉ xác minh pháp lý |
| 13 | `student_app/user_profile/code.html` | Quản lý hồ sơ cá nhân |
| 14 | `student_app/login/code.html` | Đăng nhập tài khoản |

---

### Mô Tả Chi Tiết Student App

#### 1. Dashboard (`dashboard/code.html`)
**Mục đích**: Trang chủ của ứng dụng mobile, tập trung vào việc tiếp tục học tập.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | User Info | Chào mừng người dùng và nút thông báo |
| **Main** | Course Progress| Danh sách khóa học đang học dở |
| **Tabs** | Navigation | Home, Search, Learning, Profile |

#### 2. Course Search (`course_search/code.html`)
**Mục đích**: Giúp học viên tìm kiếm và lọc các khóa học theo chủ đề.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Search** | Search Bar | Nhập từ khóa tìm kiếm |
| **Filters** | Category Pills| Lọc nhanh theo chủ đề (Design, Code, Marketing) |
| **Results** | Course Cards | Hiển thị kết quả tìm kiếm dạng thẻ |

#### 3. Course Details (`course_details/code.html`)
**Mục đích**: Hiển thị thông tin chi tiết để học viên quyết định đăng ký.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Media** | Preview Video | Video giới thiệu khóa học |
| **Info** | Description | Tóm tắt nội dung, giảng viên và yêu cầu |
| **Action** | Enroll Button | Nút đăng ký/mua khóa học |

#### 4. Course Recommendations (`course_recommendations/code.html`)
**Mục đích**: Đề xuất các khóa học phù hợp dựa trên hành vi người dùng.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Title** | Heading | "Dành riêng cho bạn" |
| **Content** | Vertical List | Danh sách các khóa học gợi ý |

#### 5. Course Reviews (`course_reviews/code.html`)
**Mục đích**: Nơi học viên xem phản hồi và viết cảm nhận về khóa học.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Rating** | Overall Score | Điểm sao trung bình |
| **List** | User Comments | Danh sách các đánh giá từ học viên khác |

#### 6. Learning Interface (`learning_interface/code.html`)
**Mục đích**: Giao diện chính để xem bài giảng video.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Player** | Video Player | Trình phát video bài học |
| **Content** | Lesson List | Danh sách các bài giảng trong chương |

#### 7. Lesson Discussions (`lesson_discussions/code.html`)
**Mục đích**: Hỏi đáp và thảo luận trực tiếp về nội dung bài học.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Q&A** | Chat Thread | Các câu hỏi và câu trả lời theo luồng |
| **Input** | Comment Box | Nhập câu hỏi mới |

#### 8. Quiz Assignment (`quiz_assignment/code.html`)
**Mục đích**: Thực hiện các bài kiểm tra đánh giá kiến thức.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Question** | Question Text | Nội dung câu hỏi |
| **Options** | Answer Choices| Các lựa chọn đáp án (Trắc nghiệm, Đúng/Sai) |
| **Nav** | Progress Bar | Tiến trình làm bài (Câu x/y) |

#### 9. Quiz Results (`quiz_results/code.html`)
**Mục đích**: Hiển thị điểm số và phân tích kết quả bài kiểm tra.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Score** | Score Circle | Hiển thị % điểm đạt được |
| **Feedback** | Answer Review | Xem lại các câu đúng/sai |

#### 10. Progress Tracking (`progress_tracking/code.html`)
**Mục đích**: Theo dõi hành trình học tập và các cột mốc đạt được.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Stats** | Learning Time | Tổng thời gian đã học |
| **Chart** | Activity Graph| Biểu đồ hoạt động theo tuần |

#### 11. Certificate of Completion (`certificate_of_completion/code.html`)
**Mục đích**: Chứng nhận hoàn thành khóa học tiêu chuẩn.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Preview** | Image | Hình ảnh chứng chỉ |
| **Action** | Download/Share| Tải về máy hoặc chia sẻ lên mạng xã hội |

#### 12. Verified Legal Certificate (`verified_legal_certificate/code.html`)
**Mục đích**: Chứng chỉ có tính pháp lý và xác minh từ tổ chức.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Security** | Verification Code| Mã số xác thực và QR Code |
| **Details** | Official Info | Thông tin chi tiết về tính pháp lý |

#### 13. User Profile (`user_profile/code.html`)
**Mục đích**: Quản lý thông tin cá nhân và tùy chỉnh ứng dụng.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Profile** | User Avatar | Ảnh đại diện và tên người dùng |
| **Settings** | Menu List | Cài đặt thông báo, bảo mật, ngôn ngữ |

#### 14. Login (`login/code.html`)
**Mục đích**: Cổng đăng nhập vào ứng dụng mobile.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Form** | Credentials | Nhập Email và Mật khẩu |
| **Social** | Social Login | Đăng nhập qua Google/Apple |

---

## 3. Payment App (Mobile)

Các màn hình liên quan đến giao dịch tài chính.

| Màn hình | File | Mô tả sơ bộ |
|----------|------|-------------|
| 01 | `payment_app/cart_coupons/code.html` | Giỏ hàng & mã giảm giá |
| 02 | `payment_app/checkout/code.html` | Quy trình thanh toán |
| 03 | `payment_app/purchase_history/code.html` | Lịch sử mua hàng |
| 04 | `payment_app/revenue_payouts/code.html` | Doanh thu & chi trả |
| 05 | `payment_app/platform_finances/code.html` | Tài chính toàn hệ thống |

---

### Mô Tả Chi Tiết Payment App

#### 1. Cart & Coupons (`cart_coupons/code.html`)
**Mục đích**: Quản lý khóa học trong giỏ và áp dụng khuyến mãi.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Items** | Course List | Danh sách các khóa học đã chọn |
| **Coupon** | Promo Input | Ô nhập mã giảm giá |
| **Summary** | Price Total | Tổng tiền cần thanh toán |

#### 2. Checkout (`checkout/code.html`)
**Mục đích**: Hoàn tất quá trình thanh toán đơn hàng.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Payment** | Method Select | Chọn thẻ hoặc ví điện tử |
| **Confirm** | Summary | Tóm tắt đơn hàng lần cuối |

#### 3. Purchase History (`purchase_history/code.html`)
**Mục đích**: Tra cứu các khóa học đã mua và tải hóa đơn.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **History** | Order List | Danh sách các đơn hàng đã thực hiện |
| **Invoice** | Download Link| Tải hóa đơn PDF |

#### 4. Revenue & Payouts (`revenue_payouts/code.html`)
**Mục đích**: Giảng viên quản lý thu nhập và yêu cầu rút tiền.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Balance** | Current Amount| Số dư hiện tại có thể rút |
| **Payouts** | History | Lịch sử các lần rút tiền |

#### 5. Platform Finances (`platform_finances/code.html`)
**Mục đích**: Dành cho Admin theo dõi dòng tiền toàn nền tảng.
**Cấu trúc giao diện**:
| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Overview**| Total Revenue | Tổng doanh thu toàn hệ thống |
| **Reports** | Payout Queue | Duyệt các yêu cầu rút tiền từ giảng viên |

---
*Cập nhật: 08/05/2026*
