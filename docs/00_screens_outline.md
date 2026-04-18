# SkillForge — Mô Tả Các Màn Hình

---

## 1. Student Web 

| Màn hình | File | Mô tả sơ bộ |
|----------|------|-------------|
| 01 | `home_dashboard/code.html` | Trang chủ học viên - hiển thị tiến trình học tập, khóa học đang học, hoạt động gần đây |
| 02 | `course_details/code.html` | Chi tiết khóa học (trang công khai) |
| 03 | `course_details_verified/code.html` | Chi tiết khóa học (có xác minh chứng chỉ) |
| 04 | `course_reviews_ratings/code.html` | Đánh giá & xếp hạng khóa học |
| 05 | `learning_interface/code.html` | Giao diện học tập chính |
| 06 | `lesson_discussions/code.html` | Thảo luận bài học |
| 07 | `quiz_assignment/code.html` | Bài tập quiz |
| 08 | `progress_tracking/code.html` | Theo dõi tiến trình |
| 09 | `search_filtering/code.html` | Tìm kiếm & lọc khóa học |
| 10 | `recommendation_engine/code.html` | Gợi ý khóa học |
| 11 | `results_feedback/code.html` | Kết quả & phản hồi |
| 12 | `user_profile/code.html` | Hồ sơ người dùng |
| 13 | `registration/code.html` | Đăng ký |
| 14 | `authentication/code.html` | Đăng nhập |
| 15 | `forgot_password/code.html` | Quên mật khẩu |
| 16 | `standard_certificate_of_completion/code.html` | Chứng chỉ hoàn thành (tiêu chuẩn) |
| 17 | `verified_legal_certificate/code.html` | Chứng chỉ xác minh pháp lý |

---

### Mô Tả Chi Tiết Student Web

#### 1. Home Dashboard (`home_dashboard/code.html`)

**Mục đích**: Dashboard chính của học viên sau khi đăng nhập. Hiển thị tổng quan tiến trình học tập, các khóa học đang theo dõi, hoạt động gần đây và gợi ý.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Thanh điều hướng** | Logo | Thương hiệu SkillForge, menu điều hướng |
| | Menu | Các mục Courses / My Learning / Community |
| | Tìm kiếm | Ô nhập liệu tìm kiếm khóa học |
| | Thông báo | Nút chuông thông báo |
| | Avatar | Ảnh đại diện người dùng |
| **Khu vực chào mừng** | Tiêu đề chính | Lời chào theo tên người dùng |
| | Mục tiêu tuần | Hiển thị % hoàn thành mục tiêu trong tuần |
| **Cột chính** | Thẻ nổi bật | Hiển thị khóa học đang học dở với thumbnail, nút phát, tiêu đề, tiến trình |
| | Danh sách khóa | Các khóa đã đăng ký với thumbnail, tiêu đề, số bài học, thanh tiến trình |
| | Gợi ý | Các khóa học được đề xuất dựa trên sở thích |
| **Cột bên** | Hoạt động gần đây | Timeline các hoạt động đã thực hiện |
| | Chuỗi học tập | Số ngày học liên tiếp |
| | Hỏi mentor | Thẻ yêu cầu hỗ trợ từ mentor |
| **Thanh điều hướng dưới** | Mobile | Thanh điều hướng 4 mục (trên thiết bị di động) |

---

#### 2. Course Details (`course_details/code.html`)

**Mục đích**: Trang thông tin chi tiết khóa học công khai. Hiển thị nội dung, giáo trình, giảng viên và đánh giá để học viên quyết định đăng ký.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực tiêu đề** | Hình nền | Hình ảnh mờ làm nền |
| | Nhãn | Badge "Bestseller" |
| | Tiêu đề | Tên khóa học |
| | Mô tả | Tóm tắt ngắn về khóa học |
| | Nút hành động | Nút đăng ký và xem trước |
| | Thống kê | Số học viên, thời lượng, chứng chỉ |
| | Video preview | Thumbnail video với nút phát |
| **Thanh tab** | Tab điều hướng | Các tab: Tổng quan / Giáo trình / Giảng viên / Đánh giá |
| **Cột chính** | Giới thiệu | Mô tả chi tiết, các tính năng |
| | Giáo trình | Danh sách các module có thể mở rộng |
| **Cột bên** | Đánh giá | Điểm trung bình, sao, % giới thiệu |
| | Giảng viên | Ảnh, tên, mô tả, liên kết mạng xã hội |
| | Khuyến mãi | Banner giảm giá giới hạn |
| **Xem trước bài giảng** | Lưới | Lưới các video xem trước |
| **Nút sticky** | Mobile | Nút đăng ký cố định dưới màn hình |

---

#### 3. Course Details (Verified) (`course_details_verified/code.html`)

**Mục đích**: Giống màn hình Course Details nhưng có thêm chứng chỉ xác minh — khóa học có giá trị pháp lý được công nhận bởi đối tác.

**Khác biệt so với Course Details**:

| Thành phần | Mô tả |
|-----------|-------|
| Nhãn bổ sung | Badge xác nhận chứng chỉ (màu vàng) |

> **Lưu ý**: Tất cả các thành phần khác giống màn hình Course Details.

---

#### 4. Course Reviews & Ratings (`course_reviews_ratings/code.html`)

**Mục đích**: Trang xem đánh giá của học viên về khóa học. Cho phép học viên khác đọc review và viết đánh giá của mình.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực tiêu đề** | Tiêu đề phụ | Mục đích trang |
| | Tiêu đề chính | Tên khóa học |
| | Thông tin | Tên giảng viên, ngày hoàn thành |
| **Cột chính** | Tiêu đề danh sách | Số lượng review |
| | Danh sách review | Hiển thị các review: ảnh, tên, chức danh, sao, nội dung, nút hữu ích, thời gian |
| | Xem thêm | Nút tải thêm review |
| **Cột bên** | Thẻ tổng kết | Điểm trung bình, biểu đồ phân bố sao |
| | Thẻ đánh giá | Form viết review: chọn sao, textarea, nút gửi |

---

#### 5. Learning Interface (`learning_interface/code.html`)

**Mục đích**: Màn hình xem video bài giảng chính. Học viên theo dõi nội dung bài học, ghi chú inline và truy cập tài liệu.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực video** | Trình phát video | Video player với các điều khiển overlay |
| | Thông tin | Nhãn cấp độ, tiêu đề bài học, mô tả |
| | Ghi chú inline | Khu vực ghi chú tại thời điểm cụ thể trong video |
| | Tài liệu | Phần hiển thị tiến trình, tải xuống |
| **Thanh bên phải** | Nội dung khóa | Danh sách modules/bài học với trạng thái |

---

#### 6. Lesson Discussions (`lesson_discussions/code.html`)

**Mục đích**: Diễn đàn Q&A cho từng bài học. Học viên đặt câu hỏi, thảo luận và nhận hỗ trợ từ giảng viên.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực tiêu đề** | Link quay lại | Quay về module |
| | Tiêu đề | Tiêu đề trang |
| | Mô tả | Mục đích của diễn đàn |
| **Thẻ thống kê** | Số liệu | Số câu hỏi, giảng viên, tỷ lệ giải đáp |
| **Tìm kiếm & lọc** | Tìm kiếm | Ô nhập liệu tìm kiếm |
| | Lọc | Nút mở bộ lọc |
| | Đặt câu hỏi | Nút tạo câu hỏi mới |
| **Danh sách chủ đề** | Chủ đề nổi bật | Câu hỏi được đánh dấu, có timestamp, câu trả lời từ giảng viên |
| | Câu hỏi cộng đồng | Câu hỏi từ học viên |
| | Báo lỗi | Báo cáo lỗi tài nguyên |
| | Xem thêm | Nút tải thêm |

---

#### 7. Quiz Assignment (`quiz_assignment/code.html`)

**Mục đích**: Màn hình làm bài quiz/assessment. Học viên trả lời các câu hỏi với nhiều loại câu hỏi khác nhau.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực tiến trình** | Module | Tên module hiện tại |
| | Tiêu đề | Tên bài quiz |
| | Tiến trình | Số câu hiện tại / tổng số, thanh tiến trình |
| **Cột câu hỏi** | Trắc nghiệm | Câu hỏi chọn đáp án |
| | Nối ghép | Câu hỏi kéo thả ghép |
| | Đúng/Sai | Câu hỏi chọn đúng hoặc sai |
| **Cột bên** | Bản đồ câu hỏi | Lưới các số câu hỏi, đánh dấu câu hiện tại |
| | Mẹo nhanh | Gợi ý cho câu hỏi |
| | Trạng thái | Trạng thái đang làm, tốc độ tự chọn |
| **Thanh hành động** | Điều hướng | Nút câu trước / câu tiếp |
| | Hành động | Đánh dấu xem lại |

---

#### 8. Progress Tracking (`progress_tracking/code.html`)

**Mục đích**: Trang xem lịch sử và tiến độ học tập. Hiển thị thời gian học, cột mốc và các khóa đang tiến hành.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực tiêu đề** | Tiêu đề | Tiêu đề trang |
| | Mô tả | Mô tả hành trình học tập |
| **Lưới thông tin** | Biểu đồ thời gian | Biểu đồ cột theo ngày |
| | Chỉ số tập trung | Hiệu suất học tập, chuỗi ngày |
| **Cột chính** | Cột mốc | Timeline dọc các cột mốc quan trọng |
| **Cột bên** | Đang học | Thanh tiến trình các khóa đang học |
| | Bài gần đây | Danh sách bài đã học gần đây |

---

#### 9. Search & Filtering (`search_filtering/code.html`)

**Mục đích**: Trang khám phá và tìm kiếm khóa học. Học viên lọc theo chủ đề, cấp độ, giá và đánh giá.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực tìm kiếm** | Ô nhập liệu | Ô tìm kiếm lớn |
| **Cột lọc** | Chủ đề | Checkbox các chủ đề |
| | Cấp độ | Nút chọn cấp độ |
| | Khoảng giá | Thanh trượt chọn giá |
| | Đánh giá tối thiểu | Chọn số sao |
| **Cột kết quả** | Bộ lọc mobile | Pills trượt ngang |
| | Sắp xếp | Dropdown chọn cách sắp xếp |
| | Lưới khóa | Hiển thị các khóa học dạng lưới |
| | Phân trang | Điều hướng trang |

---

#### 10. Recommendation Engine (`recommendation_engine/code.html`)

**Mục đích**: Trang gợi ý khóa học cá nhân hóa dựa trên sở thích và lịch sử học của học viên.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực tiêu đề** | Tiêu đề | "Dành cho [Tên]" |
| | Cơ sở | Nền tảng gợi ý |
| **Lưới nổi bật** | Khóa học chính | Khóa học được chọn làm mục tiêu trong ngày |
| | Danh sách phụ | Khóa đang học dở, gợi ý |
| **Carousel xu hướng** | Trượt ngang | Các khóa học xu hướng |
| **Vì bạn đã xem** | Khu vực | Gợi ý dựa trên lịch sử |
| **Lộ trình nghề nghiệp** | Banner | Lộ trình đến vị trí mong muốn |

---

#### 11. Results & Feedback (`results_feedback/code.html`)

**Mục đích**: Trang xem kết quả sau khi nộp quiz/assessment. Hiển thị điểm số, xếp hạng và phản hồi chi tiết từng câu.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|----------|--------|
| **Khu vực kết quả** | Trạng thái | Hoàn thành bài đánh giá |
| | Thành tích | Kết quả đạt được |
| | Điểm số | Hiển thị vòng tròn điểm số |
| | Hạng | Xếp hạng đạt được |
| **Phân tích** | Thời gian | Thời gian làm bài |
| | Độ ch��nh x��c | Tỷ lệ đúng |
| | Chờ chấm | Số câu chờ chấm |
| **Chi tiết câu hỏi** | Câu đúng | Hiển thị đúng, đáp án đúng, phản hồi |
| | Câu sai | Hiển thị sai, đáp án sai vs đúng, phản hồi |
| | Câu chờ | Câu tự luận đang chờ chấm |
| **Hành động** | Nút | Tiếp tục / Làm lại |

---

#### 12. User Profile (`user_profile/code.html`)

**Mục đích**: Trang hồ sơ cá nhân của học viên. Hiển thị thông tin cá nhân, mục tiêu học tập, tiến độ và cài đặt tài khoản.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực hồ sơ** | Nền | Hình nền gradient |
| | Ảnh đại diện | Avatar có nút chỉnh sửa |
| | Tên | Họ tên người dùng |
| | Chức danh | Vị trí và cấp độ |
| | Hành động | Cập nhật / Chia sẻ |
| **Cột chính** | Giới thiệu | Mô tả bản thân |
| | Mục tiêu | Danh sách mục tiêu theo quý |
| | Tiến độ tổng | Hiển thị % hoàn thành tổng |
| **Cột bên** | Cài đặt | Email, mật khẩu, thông báo, hồ sơ công khai |
| | Đăng xuất | Nút đăng xuất |
| **Thẻ persona** | Badge | Loại hình học tập |

---

#### 13. Registration (`registration/code.html`)

**Mục đích**: Trang đăng ký tài khoản mới cho học viên.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Cột hình ảnh** | Hình nền | Hình ảnh trang trí mờ |
| | Slogan | Khẩu hiệu |
| | Mô tả | Giới thiệu về nền tảng |
| **Cột biểu mẫu** | Đăng nhập mạng | Nút Google/Facebook |
| | Phân cách | Dòng "or email" |
| | Biểu mẫu | Họ tên / Email / Mật khẩu / Điều khoản |
| | Gửi | Nút tạo tài khoản |
| | Footer | Link đăng nhập |
| **Mobile** | Thương hiệu | Logo dưới cùng |

---

#### 14. Authentication (`authentication/code.html`)

**Mục đích**: Trang đăng nhập vào hệ thống.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Cột hình ảnh** | Hình nền | Hình ảnh trang trí |
| | Slogan | Khẩu hiệu |
| | Bằng chứng xã hội | Số người dùng mới |
| **Cột biểu mẫu** | Tiêu đề | Lời chào mừng |
| | Đăng nhập mạng | Nút Google/Facebook |
| | Biểu mẫu | Email / Mật khẩu + link quên mật khẩu |
| | Gửi | Nút đăng nhập |
| | Footer | Link đăng ký |
| | Badge tin cậy | Các badge bảo mật |

---

#### 15. Forgot Password (`forgot_password/code.html`)

**Mục đích**: Trang khôi phục mật khẩu khi học viên quên mật khẩu.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Cột hình ảnh** | Hình nền | Hình ảnh văn phòng |
| | Slogan | Khẩu hiệu |
| **Cột biểu mẫu** | Tiêu đề | Tiêu đề trang |
| | Mô tả | Hướng dẫn |
| | Biểu mẫu | Nhập email |
| | Gửi | Nút gửi link khôi phục |
| | Link quay lại | Quay về đăng nhập |
| | Trợ giúp | Thẻ liên hệ hỗ trợ |

---

#### 16. Standard Certificate of Completion (`standard_certificate_of_completion/code.html`)

**Mục đích**: Trang hiển thị chứng chỉ hoàn thành khóa học (tiêu chuẩn). Chứng nhận học viên đã hoàn thành khóa học.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực tiêu đề** | Trạng thái | Hoàn thành khóa học |
| | Lời chúc mừng | Chúc mừng người học |
| | Khóa học | Tên khóa đã hoàn thành |
| | Hành động | Lưu / Chia sẻ |
| **Xem trước chứng chỉ** | Thiết kế | Khung chứng chỉ |
| | Thương hiệu | Tên nền tảng và loại chứng chỉ |
| | Người nhận | Tên người được cấp |
| | Khóa học | Tên khóa học |
| | Chữ ký | Chữ ký người phụ trách |
| | Ngày cấp | Ngày cấp chứng chỉ |
| **Tóm tắt khóa** | Nội dung | Số modules, bài tập |
| | Thời gian | Tổng thời gian học |
| | Kỹ năng | Các kỹ năng đạt được |

---

#### 17. Verified Legal Certificate (`verified_legal_certificate/code.html`)

**Mục đích**: Trang hiển thị chứng chỉ xác minh pháp lý (có giá trị pháp môn). Chứng chỉ được công nhận bởi đối tác và tuân thủ tiêu chuẩn.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực tiêu đề** | Badge | Xác nhận tổ chức đối tác |
| | Tiêu đề | Chứng chỉ xác minh pháp lý |
| | Mã tham chiếu | Mã số giấy phép |
| | Hành động | Tải PDF / Xác minh |
| **Xem trước chứng chỉ** | Thiết kế | Khung formal, watermark |
| | Badge pháp lý | Seal xác minh pháp lý |
| | Người nhận | Tên người được cấp |
| | Khóa học | Tên khóa học |
| | Mã QR | Mã xác minh |
| | Chữ ký | Chữ ký người phụ trách |
| | Mã hash | Mã tài liệu |
| | Ngày cấp | Ngày cấp |
| **Thông tin tuân thủ** | Xác minh pháp luật | Tuân thủ quy định |
| | Chữ ký số | Chữ ký mã hóa |
| | Thẩm quyền | Công nhận toàn cầu |

---

## 2. Student App 

| Màn hình | File | Mô tả sơ bộ |
|----------|------|-------------|
| 01 | `dashboard/code.html` | Dashboard (mobile) |
| 02 | `course_search/code.html` | Tìm kiếm khóa học (mobile) |
| 03 | `course_details/code.html` | Chi tiết khóa học (mobile) |
| 04 | `course_recommendations/code.html` | Gợi ý khóa học (mobile) |
| 05 | `course_reviews/code.html` | Đánh giá khóa học (mobile) |
| 06 | `learning_interface/code.html` | Giao diện học tập (mobile) |
| 07 | `lesson_discussions/code.html` | Thảo luận bài học (mobile) |
| 08 | `quiz_assignment/code.html` | Bài tập quiz (mobile) |
| 09 | `quiz_results/code.html` | Kết quả quiz (mobile) |
| 10 | `progress_tracking/code.html` | Theo dõi tiến trình (mobile) |
| 11 | `certificate_of_completion/code.html` | Chứng chỉ hoàn thành (mobile) |
| 12 | `verified_legal_certificate/code.html` | Chứng chỉ xác minh (mobile) |
| 13 | `user_profile/code.html` | Hồ sơ người dùng (mobile) |
| 14 | `login/code.html` | Đăng nhập (mobile) |

---

## 3. Instructor Web 

| Màn hình | File | Mô tả sơ bộ |
|----------|------|-------------|
| 01 | `login_skillforge/code.html` | Đăng nhập giảng viên |
| 02 | `my_courses_skillforge/code.html` | Danh sách khóa học của giảng viên |
| 03 | `course_editor_basic_info/code.html` | Chỉnh sửa thông tin cơ bản khóa học |
| 04 | `curriculum_builder_skillforge/code.html` | Xây dựng giáo trình |
| 05 | `quiz_builder_skillforge/code.html` | Tạo quiz |
| 06 | `q_a_management/code.html` | Quản lý Q&A |
| 07 | `manual_grading/code.html` | Chấm điểm thủ công |
| 08 | `student_progress_skillforge/code.html` | Tiến trình học viên |
| 09 | `coupon_management_skillforge/code.html` | Quản lý coupon |
| 10 | `my_profile_skillforge/code.html` | Hồ sơ giảng viên |

---

### Mô Tả Chi Tiết Instructor Web

#### 1. Đăng nhập giảng viên (`login_skillforge/code.html`)

**Mục đích**: Trang đăng nhập dành riêng cho giảng viên, truy cập vào khu vực quản lý khóa học.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Cột chính** | Form đăng nhập | Giao diện nhập thông tin tài khoản và mật khẩu |
| | Nút hỗ trợ | Tùy chọn quên mật khẩu hoặc tạo tài khoản mới |
| **Cột minh họa** | Banner | Khu vực chứa hình ảnh minh họa định hướng thương hiệu |

---

#### 2. Danh sách khóa học (`my_courses_skillforge/code.html`)

**Mục đích**: Quản lý danh sách các khóa học mà giảng viên đang phụ trách. Hiển thị thông tin tóm tắt và cho phép tạo mới khóa học.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Thanh tiêu đề** | Hành động | Nút "Tạo khóa học mới", thanh tìm kiếm |
| **Lưới nội dung** | Thẻ khóa học | Hiển thị thumbnail, trạng thái (Draft, Published), số lượng học viên, doanh thu |
| | Thống kê nhanh | Biểu đồ mini hoặc tóm tắt hiệu suất |

---

#### 3. Chỉnh sửa thông tin cơ bản khóa học (`course_editor_basic_info/code.html`)

**Mục đích**: Giao diện thiết lập hoặc chỉnh sửa các thông tin tổng quan của một khóa học.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Cột nội dung** | Form nhập liệu | Tiêu đề, mô tả tóm tắt, mô tả chi tiết |
| | Tuỳ chọn | Danh mục, mức độ khó, giá tiền |
| **Khu vực media** | Tải lên | Giao diện upload ảnh bìa (thumbnail) hoặc video giới thiệu |
| **Thanh trạng thái** | Hành động | Nút lưu bản nháp hoặc duyệt tiếp theo |

---

#### 4. Xây dựng giáo trình (`curriculum_builder_skillforge/code.html`)

**Mục đích**: Công cụ chuyên sâu giúp giảng viên tạo và tự do sắp xếp (kéo-thả) các chương/phần học và bài học.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực cấu trúc** | Nhóm bài (Module) | Quản lý tên chương lớn |
| | Bài giảng (Lesson) | Danh sách bài giảng có thể kéo thả để thay đổi sơ đồ |
| **Bảng chỉnh sửa** | Thuộc tính | Công cụ gắn video, tải tài liệu đính kèm, gắn bài viết |

---

#### 5. Tạo quiz (`quiz_builder_skillforge/code.html`)

**Mục đích**: Giao diện tạo đề thi/đánh giá với nhiều dạng câu hỏi kiểm tra cho bài học.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Thanh công cụ** | Cấu hình | Thời gian làm bài, điểm tối đa, điểm đậu |
| **Danh sách câu** | Loại câu hỏi | Form thiết kế câu hỏi dạng trắc nghiệm, điền khuyết |
| | Đáp án | Tùy chọn đặt đáp án đúng/sai, lời giải thích cụ thể |

---

#### 6. Quản lý Q&A (`q_a_management/code.html`)

**Mục đích**: Màn hình xem, trả lời và quản lý thắc mắc của học viên phát sinh từ tất cả các khóa học.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Cột bên (Lọc)** | Danh sách câu hỏi | Lọc các câu hỏi chưa trả lời (Unanswered), đã giải quyết, nhóm theo khóa học |
| **Khung hội thoại** | Nội dung thắc mắc | Nội dung chi tiết câu hỏi của học viên và thời gian |
| | Khung trả lời | Trình soạn thảo văn bản phản hồi dành cho giảng viên |

---

#### 7. Chấm điểm thủ công (`manual_grading/code.html`)

**Mục đích**: Giao diện chấm điểm các loại bài tập tự luận định dạng tài liệu, portfolio hoặc đồ án thực tế.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Cột hồ sơ** | Danh sách pending | Danh sách các học viên nộp bài chờ chấm điểm |
| **Vùng trung tâm** | Trình xem tài liệu | Trình xem trực tiếp bài làm (tài liệu/hình ảnh/link) của học viên |
| **Cột đánh giá** | Bộ chấm | Khung chấm điểm (Rubric) và nhận xét (Feedback text) |

---

#### 8. Tiến trình học viên (`student_progress_skillforge/code.html`)

**Mục đích**: Bảng điều khiển giám sát tiến độ bao quát và xác định sinh viên nào đang có rủi ro tụt lại phía sau.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Bảng thống kê** | Chỉ số tổng | Tỷ lệ tốt nghiệp dự kiến, điểm trung bình |
| **Danh sách chi tiết** | Bảng người học | Liệt kê sinh viên với thanh tiến trình phần trăm hoàn thành khóa học |
| | Bộ lọc rủi ro | Nút chuyển nhanh xem nhóm Top Performers và At Risk |

---

#### 9. Quản lý coupon (`coupon_management_skillforge/code.html`)

**Mục đích**: Khu vực vận hành các chương trình khuyến mãi, khóa học giảm giá, marketing bằng coupon.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Hành động** | Trình tạo mã | Các module đặt mã code coupon, thiết lập số người dùng và hạn ngạch |
| **Danh sách mã** | Lưới Coupon | Các thẻ chi tiết coupon hoạt động kèm số lượng đã sử dụng / quy mô |

---

#### 10. Hồ sơ giảng viên (`my_profile_skillforge/code.html`)

**Mục đích**: Chỉnh sửa thông tin công khai và cập nhật cài đặt bảo mật, thanh toán cá nhân.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực hiển thị** | Profile | Ảnh đại diện, danh xưng, tiểu sử |
| **Cài đặt hệ thống** | Tùy chọn | Quản lý mạng xã hội, thiết lập thanh toán, thống kê toàn thời gian |

---

## 4. Admin 

| Màn hình | File | Mô tả sơ bộ |
|----------|------|-------------|
| 01 | `admin_login/code.html` | Đăng nhập admin |
| 02 | `user_management/code.html` | Quản lý người dùng |
| 03 | `course_moderation/code.html` | Kiểm duyệt khóa học |
| 04 | `coupon_manager/code.html` | Quản lý coupon (platform) |
| 05 | `system_settings/code.html` | Cài đặt hệ thống |

---

### Mô Tả Chi Tiết Admin

#### 1. Admin Login (`admin_login/code.html`)

**Mục đích**: Trang đăng nhập bảo mật dành riêng cho quản trị viên (Admin) truy cập vào hệ thống quản lý.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Cột biểu mẫu** | Tiêu đề | Nhận diện thương hiệu SkillForge và thông điệp truy cập |
| | Biểu mẫu | Ô nhập Administrator Email và Security Key (Mật khẩu) |
| | Hành động | Nút đăng nhập, tùy chọn nhớ thiết bị (Trust this device) |
| | Footer con | Thông báo bảo mật, hiển thị địa chỉ IP, link Compliance/Support |
| **Khu vực trang trí** | Nền | Đồ họa abstract, Typography logo lớn (SF) in chìm |

---

#### 2. User Management (`user_management/code.html`)

**Mục đích**: Bảng điều khiển quản trị giúp kiểm soát cộng đồng giáo dục, quản lý và phân quyền người dùng.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Thanh điều hướng bên** | Menu | Liên kết nhóm chức năng (Dashboard, Users, Courses...) |
| | Nhận diện | Avatar, tên, vai trò (Master Admin) |
| **Thanh điều hướng trên** | Tìm kiếm | Thanh tìm kiếm chung (tìm học viên, giảng viên, khóa học...) |
| | Hệ thống | Nút thông báo hệ thống, Cài đặt tài khoản |
| **Khu vực thông tin** | Tiêu đề | Giới thiệu chức năng và nút hành động (Export CSV, Invite User) |
| **Thống kê** | Lưới thẻ | Tổng user, học viên active, giảng viên được xác minh, yêu cầu chờ duyệt |
| **Bảng dữ liệu** | Điều khiển | Bộ lọc (Filter), Tab phân loại vai trò (Instructors, Students...) |

---

#### 3. Course Moderation (`course_moderation/code.html`)

**Mục đích**: Hàng đợi kiểm duyệt khóa học (Course Moderation Queue) để đảm bảo chất lượng nội dung tải lên.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Thanh điều hướng l** | Thành phần | Sidebar và Topbar chuẩn hóa hệ thống Admin |
| **Khu vực quan trọng** | Tiêu đề | Báo cáo số lượng chờ duyệt và mức độ ưu tiên |
| **Thống kê** | Lưới thẻ | Các chỉ số về kiểm duyệt, thời gian chờ (Wait Time), mục tiêu ngày định mức |
| **Danh sách duyệt** | Bảng | Liệt kê các tiến trình duyệt, trạng thái |

---

#### 4. Coupon Manager (`coupon_manager/code.html`)

**Mục đích**: Quản lý chiến dịch khuyến mãi liên quan đến việc cấp phát, theo dõi hiệu năng của các mã Coupon toàn hệ thống.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Thanh điều hướng** | Thành phần | Sidebar ưu tiên hiển thị phân quyền (System Administrator) |
| **Khu vực thông tin** | Tiêu đề | Giới thiệu tính năng và nút hành động (Export Report, Create New Coupon) |
| **Thống kê tổng quan** | Lưới thẻ | Thống kê số tiền tiết kiệm, tỷ lệ sử dụng (Redemption Rate), mã sắp hết hạn |
| **Cột chính** | Danh sách voucher | Hiển thị các mã khuyến mãi (Active/Expired), hiệu suất số lần sử dụng |
| **Tính năng tiện ích**| Mẫu thiết lập | Nhanh chóng tạo mã (Quick Config), loại giảm giá, %, ngày hết hạn |
| **Lưới phương tiện** | Hình ảnh/Kết nối | Banner Asset, Traffic Heatmaps, Partner Integration dưới màn hình |

---

#### 5. System Settings (`system_settings/code.html`)

**Mục đích**: Thiết lập tham số tĩnh/toàn hệ thống, tùy chỉnh mô hình kinh tế, thông báo tự động và thông số tuân thủ bảo mật.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực thông tin** | Tiêu đề | System Settings và các nút ấn duyệt thay đổi (Discard/Publish) |
| **Lưới thiết lập** | Mô hình tài chính | Cấu hình chiết khấu nền tảng (Commission %), Ngưỡng thanh toán, Dự báo tăng trưởng |
| | Nhận diện giao diện | Tuỳ chỉnh màu ưu tiên (Primary Brand Color), Font chữ (Typography) |
| | Tự động hóa | Thiết lập chốt Automation/Thông báo (Smart Reminders, Email Digest...) |
| | Lịch sử & Bảo mật| Tham số sao lưu (Backup), Retention period, nút tải về lưu trữ Audit Logs |

---

## 5. Payment Web 

| Màn hình | File | Mô tả sơ bộ |
|----------|------|-------------|
| 01 | `shopping_cart/code.html` | Giỏ hàng |
| 02 | `secure_payment/code.html` | Thanh toán an toàn |
| 03 | `order_history/code.html` | Lịch sử đơn hàng |
| 04 | `instructor_earnings/code.html` | Thu nhập giảng viên |
| 05 | `platform_finance_admin/code.html` | Tài chính platform |

---

## 6. Payment App 

| Màn hình | File | Mô tả sơ bộ |
|----------|------|-------------|
| 01 | `cart_coupons/code.html` | Giỏ hàng & coupon (mobile) |
| 02 | `checkout/code.html` | Thanh toán (mobile) |
| 03 | `purchase_history/code.html` | Lịch sử mua hàng (mobile) |
| 04 | `revenue_payouts/code.html` | Doanh thu & chi trả (mobile) |
| 05 | `platform_finances/code.html` | Tài chính platform (mobile) |

