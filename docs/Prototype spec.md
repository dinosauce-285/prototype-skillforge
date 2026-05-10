# SkillForge — Mô Tả Các Màn Hình

---

## 1. Student Web

> **Nguồn DEMO**: `DEMO/src/app/AppRouter.jsx`, `DEMO/src/pages/StudentPages.jsx`, `DEMO/src/pages/AuthPages.jsx`, `DEMO/src/layouts/AppLayout.jsx`. Web DEMO là React routes/components, không còn là các thư mục HTML tĩnh.

| Màn hình | Route DEMO | Component | Mô tả sơ bộ |
|----------|------------|-----------|-------------|
| 01 | `/login` | `LoginWorkspacePage` | Màn hình chọn tài khoản demo theo role, đăng nhập vào Student/Instructor/Admin |
| 02 | `/register` | `AuthPage mode="register"` | Form đăng ký tài khoản mới trong cùng visual system của auth |
| 03 | `/` | `DashboardPage` | Dashboard học viên: resume course, my courses, recommended, certificates ready, recent activity, streak |
| 04 | `/courses` | `CatalogPage` | Catalog khóa học: search, filter topic/level/price, sort, course cards, add to cart |
| 05 | `/courses/:courseId` | `CourseDetailPage` | Chi tiết khóa học: hero course, enroll/cart action, modules, lesson list, certificate status, review access |
| 06 | `/learning/:courseId/:lessonId?` | `LearningPage` | Workspace học bài: lesson content/player, curriculum sidebar, materials, quiz shortcut, completion action |
| 07 | `/progress` | `ProgressPage` | Progress dashboard: KPI học tập, course progress, certificate readiness, learning activity |
| 08 | `/quiz/:courseId` | `QuizPage` | Course quiz trắc nghiệm: chọn đáp án, question map, submit result |
| 09 | `/results/:courseId` | `ResultsPage` | Kết quả quiz: score/pass status, feedback, CTA tiếp tục học/certificate/review |
| 10 | `/certificate/:courseId` | `CertificatePage` | Certificate chuẩn hoặc verified tùy course type, có preview và metadata xác minh |
| 11 | `/reviews/:courseId` | `ReviewsPage` | Review theo khóa: khóa quyền theo enrollment/completion, danh sách review, form submit |
| 12 | `/discussions/:courseId/:lessonId` | `DiscussionsPage` | Thread bình luận theo lesson, danh sách post và form publish comment |
| 13 | `/cart` | `CartPage` | Giỏ hàng student: item course, coupon, subtotal/discount/total, proceed checkout |
| 14 | `/checkout` | `CheckoutPage` | Checkout: chọn Card/MoMo/VNPay/PayPal, form thẻ mock, tạo order |
| 15 | `/orders` | `OrdersPage` | Transaction ledger: bảng invoice, date, items, method, status, total |
| 16 | `/profile` | `ProfilePage` | Hồ sơ dùng chung: profile summary, update form, logout, danh sách khóa đang học |

---

### Mô Tả Chi Tiết Student Web

> **Layout chung**: Student Web dùng top navbar cố định với brand SkillForge, nav `Dashboard / Courses / My Learning / Cart / Orders / Profile`, search course trên topbar, notification icon và avatar. Nội dung nằm trong `sf-container`, sử dụng card trắng bo góc lớn, chip trạng thái, button pill và ảnh course từ mock data.

#### 1. Login Workspace (`/login`)

**Mục đích**: Cho người dùng chọn nhanh persona demo và đăng nhập vào đúng role.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Auth shell** | Brand | SkillForge, thông điệp demo workspace |
| **Role picker** | Tài khoản demo | Chọn Student, Instructor hoặc Admin từ mock users |
| **Form đăng nhập** | Email/password | Trường nhập thông tin đăng nhập, có trạng thái được prefill theo persona |
| **Hành động** | Login | Đăng nhập và route về home tương ứng với role |
| **Liên kết phụ** | Register | Chuyển sang `/register` khi cần tạo tài khoản |

---

#### 2. Register (`/register`)

**Mục đích**: Tạo tài khoản mock mới bằng form đăng ký trong cùng layout auth.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Form** | Thông tin account | Tên, email, password và các trường đăng ký cơ bản |
| **Hành động** | Create account | Tạo user trong mock state và chuyển vào app |
| **Điều hướng** | Back to login | Quay lại login workspace |

---

#### 3. Dashboard (`/`)

**Mục đích**: Dashboard chính của học viên sau khi đăng nhập. Hiển thị tổng quan tiến trình học tập, các khóa học đang theo dõi, hoạt động gần đây và gợi ý.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Khu vực chào mừng** | Tiêu đề chính | Lời chào theo tên người dùng |
| | Mục tiêu tuần | Hiển thị % hoàn thành mục tiêu trong tuần |
| **Cột chính** | Thẻ nổi bật | Hiển thị khóa học đang học dở với thumbnail, nút phát, tiêu đề, tiến trình |
| | Danh sách khóa | Các khóa đã đăng ký với thumbnail, tiêu đề, số bài học, thanh tiến trình |
| | Gợi ý | Các khóa học được đề xuất dựa trên sở thích |
| | Certificates Ready | Hai certificate đã hoàn thành để mở preview chuẩn/verified |
| **Cột bên** | Hoạt động gần đây | Timeline các hoạt động đã thực hiện |
| | Chuỗi học tập | Số ngày học liên tiếp |
| | Cart ready | Số item đang chờ checkout trong giỏ |

---

#### 4. Catalog (`/courses`)

**Mục đích**: Trang khám phá và tìm khóa học trong DEMO. Học viên có thể search, lọc và thêm khóa học vào cart.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Hero tìm kiếm** | Title | "Discover Your Next Mastery" |
| | Search input | Tìm theo title/subtitle |
| **Filter sidebar** | Topic | Checkbox category, có `All` |
| | Difficulty | Nút level, có `All` |
| | Price range | Slider max price |
| **Mobile filters** | Pills | Nút filter và chip category/level |
| **Kết quả** | Sort | Select `Most Popular`, `Newest First`, `Price: Low to High` |
| | Course grid | Card ảnh, category, instructor, rating, price |
| | Actions | Mở chi tiết course hoặc thêm vào cart |

---

#### 5. Course Detail (`/courses/:courseId`)

**Mục đích**: Xem thông tin course, trạng thái học/mua, curriculum và các hành động chính.

**Cấu trúc giao diện**:

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Hero course** | Ảnh course | Ảnh lớn từ mock data |
| | Badge | Category, level, certificate type; course verified có badge legal |
| | Tiêu đề | Tên khóa học |
| | Mô tả | Subtitle, instructor, duration, skills |
| **Hành động** | Enroll/Resume | Nếu đã enroll thì đi học, nếu chưa thì add to cart/checkout |
| | Review access | Link tới review, có khóa quyền theo trạng thái học |
| **Nội dung** | Overview | Course description, skills, certificate note |
| | Curriculum | Module list, lesson list, duration và trạng thái lesson |
| **Sidebar** | Price/status | Giá, enrollment/cart status, progress, certificate badge |
| | Legal certificate | Với verified course hiển thị thông tin tổ chức/compliance |

---

#### 6. Learning Workspace (`/learning/:courseId/:lessonId?`)

**Mục đích**: Màn hình học chính của student, mở lesson hiện tại hoặc lesson được chọn từ route.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Lesson content** | Player/content card | Hiển thị nội dung/video placeholder của lesson |
| | Lesson metadata | Title, type, duration, description |
| | Materials | Danh sách file tài liệu và loại/size |
| | Actions | Mark complete, open quiz/result/discussion |
| **Curriculum sidebar** | Module accordion | Danh sách module/lesson trong course |
| | Lesson state | Lesson đang active và lesson đã completed |
| **Progress** | Course progress | Phần trăm hoàn thành theo completed lessons |

---

#### 7. Progress (`/progress`)

**Mục đích**: Tổng hợp tiến độ học, khóa đang học, certificate và hoạt động gần đây.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | SectionHeader | Chip và mô tả learning progress |
| **KPI grid** | Course/completion metrics | Số khóa, số certificate, tiến độ tổng |
| **Course progress** | List/card | Mỗi course có progress bar và link học tiếp |
| **Certificates** | Certificate cards | Course đã đủ điều kiện mở certificate |
| **Activity** | Recent activity | Các cột mốc học tập từ mock state |

---

#### 8. Quiz (`/quiz/:courseId`)

**Mục đích**: Làm quiz trắc nghiệm của course và nộp kết quả vào mock state.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | Course context | Tên course và mô tả assessment |
| **Question list** | Question cards | Mỗi câu hiển thị prompt và danh sách radio options |
| **Actions** | Submit | Tạo quiz result và chuyển sang `/results/:courseId` |
| **State** | Answers | Lưu lựa chọn đáp án trong component state |
| **Sidebar** | Question Map | Lưới số câu, đánh dấu câu đã trả lời và ghi chú passing score 70% |

---

#### 9. Results (`/results/:courseId`)

**Mục đích**: Hiển thị kết quả quiz đã nộp và hướng đi tiếp.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Result summary** | Score/pass | Điểm, phần trăm, trạng thái pass/fail |
| **Feedback** | Explanation | Hiển thị giải thích của từng câu trong course quiz |
| **Actions** | Continue | Quay lại learning, mở certificate hoặc review |

---

#### 10. Certificate (`/certificate/:courseId`)

**Mục đích**: Hiển thị certificate theo loại course: standard hoặc verified legal.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | Certificate label | Standard hoặc Verified Legal |
| | Actions | Open reviews hoặc quay lại course |
| **Standard preview** | Certificate frame | SkillForge, learner name, course title, issued date |
| **Verified preview** | Formal certificate | Seal, organization, QR/lookup ID, hash, compliance reference |
| **Metadata cards** | Course/result/next step | Tên khóa, quiz percent, CTA review |

---

#### 11. Reviews (`/reviews/:courseId`)

**Mục đích**: Xem và gửi review cho course, có rule khóa quyền trong DEMO.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | Course title | Tên course và trạng thái quyền xem review |
| **Locked state** | Enroll required | Nếu chưa mua/enroll thì không xem danh sách review |
| **Review list** | Review cards | Author, date, stars, content |
| **Sidebar form** | Write review | Select rating, textarea, submit; chỉ hiện khi enrolled, completed và chưa review |
| **Status card** | Review access | Giải thích vì sao chưa được review hoặc đã review |

---

#### 12. Discussions (`/discussions/:courseId/:lessonId`)

**Mục đích**: Thread bình luận theo lesson cụ thể.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | Lesson title | SectionHeader với tên lesson và course context |
| **Thread list** | Post cards | Author, role, date, content |
| **Composer** | Textarea | Nhập câu hỏi/bình luận |
| | Publish | Thêm post vào mock discussion state |

---

#### 13. Cart (`/cart`)

**Mục đích**: Quản lý các khóa đã thêm vào giỏ và áp coupon trước checkout.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | SectionHeader | "Cart & Checkout System" |
| **Cart items** | Course cards | Ảnh, category, title, subtitle, price, remove |
| **Empty state** | Browse Courses | Nếu cart trống hiển thị CTA về `/courses` |
| **Order summary** | Sticky sidebar | Subtotal, discount, total |
| **Coupon** | Input + Apply/Clear | Dùng coupon trong mock state, gợi ý `DEMO20`, `WELCOME10` |
| **CTA** | Proceed to Checkout | Disabled khi cart trống |

---

#### 14. Checkout (`/checkout`)

**Mục đích**: Hoàn tất thanh toán mock và tạo order.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Payment method** | Method grid | Card, MoMo, VNPay, PayPal |
| **Card form** | Inputs | Cardholder, card number, expiry, CVV prefilled |
| **Order summary** | Items | Course title/category/price |
| | Cost breakdown | Subtotal, discount, total |
| **CTA** | Complete Enrollment | Gọi checkout action, chuyển sang `/orders`, grant enrollment |

---

#### 15. Orders (`/orders`)

**Mục đích**: Lịch sử giao dịch sau checkout.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | SectionHeader | "Order History & Receipts" |
| **Table** | Invoice rows | Invoice, date, items, method, status, total |
| **Scope** | Role-aware data | Student chỉ thấy order của mình; admin có thể thấy toàn bộ trong logic component |

---

#### 16. Profile (`/profile`)

**Mục đích**: Hồ sơ dùng chung cho user hiện tại, với student có thêm danh sách khóa học.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Profile summary** | User card | Name, headline, bio, role, certificate count |
| **Update form** | Inputs | Name, headline, bio |
| **Actions** | Save/logout | Lưu vào mock state hoặc đăng xuất |
| **My learning** | Course list | Với student hiển thị các khóa enrolled và link mở learning |

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

> **Nguồn DEMO**: `DEMO/src/app/AppRouter.jsx`, `DEMO/src/pages/InstructorPages.jsx`, `DEMO/src/layouts/AppLayout.jsx`. Instructor Web là React route/component, không còn là các file HTML tĩnh.

| Màn hình | Route DEMO | Component | Mô tả sơ bộ |
|----------|------------|-----------|-------------|
| 01 | `/login` | `LoginWorkspacePage` | Chọn tài khoản instructor demo rồi vào `/instructor` |
| 02 | `/instructor` | `InstructorOverviewPage` | Overview workspace: owned courses, orders, revenue, legal requests, manual grading |
| 03 | `/instructor/courses` | `InstructorCoursesPage` | Course Studio: tạo course mới, xem course sở hữu, mở editor hoặc xóa course |
| 04 | `/instructor/courses/:courseId` | `InstructorCourseEditorPage` | Editor tổng hợp: overview, learners, discussions, curriculum, lesson editor |
| 05 | `/instructor/curriculum` | `InstructorCurriculumPage` | Redirect về `/instructor/courses` trong DEMO |
| 06 | `/instructor/quizzes` | `InstructorQuizBuilderPage` | Redirect về `/instructor/courses` trong DEMO |
| 07 | `/instructor/courses/:courseId/lessons/:lessonId/quiz` | `InstructorLessonQuizEditorPage` | Lesson quiz editor chi tiết cho từng lesson |
| 08 | `/instructor/compliance` | `InstructorCompliancePage` | Legal certificate workflow: hồ sơ tổ chức và request verified certificate |
| 09 | `/instructor/grading` | `InstructorGradingPage` | Manual grading queue: chấm essay/open response, lưu điểm và feedback |
| 10 | `/instructor/students` | `InstructorStudentsPage` | Student analytics: learners, enrollments, revenue theo course |
| 11 | `/instructor/coupons` | `InstructorCouponsPage` | Tạo coupon, xem danh sách coupon, pause/activate |
| 12 | `/profile` | `ProfilePage` | Hồ sơ dùng chung cho instructor, update profile và logout |

---

### Mô Tả Chi Tiết Instructor Web

> **Layout chung**: Instructor Web dùng top navbar cố định với nav `Overview / Course Studio / Cert Review / Grading / Students / Coupons / Profile`. Khi vào course editor, navbar chuyển sang trạng thái editing workspace có breadcrumb quay về Course Studio. Nội dung dùng `sf-container`, `demo-kpi`, grid KPI và form input/select/textarea thống nhất với DEMO.

#### 1. Login Workspace (`/login`)

**Mục đích**: Dùng chung login workspace, chọn instructor persona để vào `/instructor`.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Role picker** | Instructor account | Chọn user instructor trong mock users |
| **Auth form** | Email/password | Prefill theo persona hoặc nhập thủ công |
| **Điều hướng** | Login action | Sau khi login route về `/instructor` |

---

#### 2. Instructor Overview (`/instructor`)

**Mục đích**: Trang tổng quan vận hành của instructor.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | SectionHeader | "Instructor workspace" và mô tả các route quản trị |
| **KPI rows** | Owned courses/orders/revenue | Số khóa sở hữu, order captured, gross revenue |
| | Legal/grading/verified | Legal requests, manual grading pending, verified courses |
| **Quick links** | Route buttons | Course Studio, Legal Certificate Workflow, Manual Grading, Student Analytics, Promotions |
| **Compliance snapshot** | Course status cards | Standard, Pending Admin Review hoặc Verified by Skill Forge |

---

#### 3. Course Studio (`/instructor/courses`)

**Mục đích**: Tạo course mới và vào workspace chỉnh sửa course.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | SectionHeader | "Create and enter course workspaces" |
| **Create form** | Inputs/select | Title, subtitle, category, level, price, duration, certificate type, skills |
| **Action** | Create Course | Tạo course mock và reset form |
| **Course list** | Course rows | Title, category, level, price |
| **Actions** | Edit/Delete | Mở `/instructor/courses/:courseId` hoặc xóa course |

---

#### 4. Course Editor (`/instructor/courses/:courseId`)

**Mục đích**: Workspace chỉnh sửa course tổng hợp, đúng màn hình lớn nhất của DEMO.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Editor header** | Course title | Tên course, mô tả và nút chuyển Overview/Lesson Editor |
| **Curriculum sidebar** | Module/lesson tree | Danh sách module và lesson, chọn lesson để edit |
| **Tab bar** | Overview/Learners/Discussions/Curriculum/Lesson | Các tab trong editor |
| **Overview tab** | Course form | Title, subtitle, category, level, price, duration, certificate type, skills |
| **Learners tab** | Student list | Học viên enrolled, progress, completed lesson count |
| **Discussions tab** | Q&A feed | Discussion gom theo lesson, author/role/content/date |
| **Curriculum tab** | Module/lesson builder | Thêm module, thêm lesson, quản lý cấu trúc |
| **Lesson tab** | Lesson editor | Type, title, description, video/content, materials, lesson quiz |

---

#### 5. Curriculum Shortcut (`/instructor/curriculum`)

**Mục đích**: Route tương thích, hiện redirect về Course Studio trong DEMO.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Redirect** | Navigate | Tự động chuyển sang `/instructor/courses` |
| **Course Studio** | Curriculum tab | Người dùng mở course editor rồi vào tab Curriculum để chỉnh module/lesson |

---

#### 6. Quiz Shortcut (`/instructor/quizzes`)

**Mục đích**: Route tương thích, hiện redirect về Course Studio trong DEMO.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Redirect** | Navigate | Tự động chuyển sang `/instructor/courses` |
| **Course Editor** | Lesson quiz | Quiz thực tế được chỉnh trong lesson editor hoặc route lesson quiz chi tiết |

---

#### 7. Lesson Quiz Editor (`/instructor/courses/:courseId/lessons/:lessonId/quiz`)

**Mục đích**: Chỉnh quiz riêng của một lesson trong course editor.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Context header** | Course/lesson title | Nhận biết đang edit lesson nào |
| **Question cards** | Lesson quiz | Các câu hỏi của lesson, gồm objective/matching/essay |
| **Pair/options editor** | Dynamic fields | Cập nhật options hoặc matching pairs |
| **Save** | Lesson quiz action | Lưu quiz vào lesson trong mock state |

---

#### 8. Legal Certificate Workflow (`/instructor/compliance`)

**Mục đích**: Chuẩn bị hồ sơ tổ chức và gửi request course verified certificate.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Step 1** | Organization profile | Business name, decision number, license, authority, representative, notes |
| **Required scans** | Document note | License/training center proof và organization proof |
| **Step 2** | Request form | Course, organization name, compliance standard, archive plan, verification method |
| **Request queue** | Request cards | Organization, course, archive plan, standard, verification, submitted date |
| **Status** | Badge | Pending Admin Review, Verified by Skill Forge hoặc rejected |

---

#### 9. Manual Grading (`/instructor/grading`)

**Mục đích**: Chấm các submission tự luận/open-response cần instructor review.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **KPI grid** | Pending/graded/auto | Số bài cần chấm, đã chấm, tự động chấm |
| **Submission list** | Cards | Course, lesson, student, submitted date, status badge |
| **Grading panel** | Selected submission | Answer excerpt, score input, feedback textarea |
| **Action** | Save Grade | Lưu điểm và feedback; objective submission bị disable form |

---

#### 10. Student Analytics (`/instructor/students`)

**Mục đích**: Theo dõi learners/revenue theo các course instructor sở hữu.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | SectionHeader | "Monitor learners and revenue" |
| **KPI grid** | Students/orders/revenue | Total learners, estimated orders, estimated gross revenue |
| **Course rows** | Course analytics | Title, students, rating, link về course editor |

---

#### 11. Instructor Coupons (`/instructor/coupons`)

**Mục đích**: Tạo và quản lý coupon dùng chung với checkout.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | SectionHeader | "Manage conversion incentives" |
| **Create form** | Inputs/select | Code, type percent/fixed, value, description |
| **Action** | Create Coupon | Thêm coupon vào shared mock state |
| **Coupon list** | Rows | Code, description, status |
| **Status action** | Pause/Activate | Đổi trạng thái coupon |

---

#### 12. Instructor Profile (`/profile`)

**Mục đích**: Dùng chung `ProfilePage` để xem/sửa hồ sơ instructor.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Profile summary** | User card | Name, headline, bio, role, certificate count |
| **Update profile** | Form | Name, headline, bio |
| **Actions** | Save/logout | Lưu vào mock state hoặc đăng xuất |

---

## 4. Admin Web

> **Nguồn DEMO**: `DEMO/src/app/AppRouter.jsx`, `DEMO/src/pages/AdminPage.jsx`, `DEMO/src/layouts/AppLayout.jsx`. Admin Web là React route/component, không còn là các file HTML tĩnh.

| Màn hình | Route DEMO | Component | Mô tả sơ bộ |
|----------|------------|-----------|-------------|
| 01 | `/login` | `LoginWorkspacePage` | Chọn tài khoản admin demo rồi vào `/admin` |
| 02 | `/admin` | `AdminPage` | Dashboard vận hành platform: KPI user, recent activity, platform health |
| 03 | `/admin/users` | `AdminUsersPage` | User Management: KPI user, role/status table, filter controls |
| 04 | `/admin/courses` | `AdminCoursesPage` | Course Moderation Queue: duyệt legal certificate request, approve/reject |
| 05 | `/admin/coupons` | `AdminCouponsPage` | Coupon Manager: KPI campaign, active promotions, quick config tạo coupon |
| 06 | `/admin/settings` | `AdminSettingsPage` | System Settings: economic model, visual identity, automation, resilience |

---

### Mô Tả Chi Tiết Admin

> **Layout chung**: Admin dùng sidebar cố định bên trái với brand `SkillForge Admin Portal`, menu `Dashboard / Users / Courses / Coupons / Settings`, avatar Master Admin ở cuối sidebar và topbar search system records + notification/account icon. Nội dung chính nằm lệch phải sau sidebar.

#### 1. Login Workspace (`/login`)

**Mục đích**: Dùng chung login workspace, chọn admin persona để vào `/admin`.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Role picker** | Admin account | Chọn user admin trong mock users |
| **Auth form** | Email/password | Prefill theo persona hoặc nhập thủ công |
| **Điều hướng** | Login action | Sau khi login route về `/admin` |

---

#### 2. Admin Dashboard (`/admin`)

**Mục đích**: Tổng quan platform health, cộng đồng và hoạt động gần đây.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | Admin Dashboard | Title và mô tả operational dashboard |
| **KPI grid** | MetricCard | Total Users, Active Students, Verified Instructors, Pending Approvals |
| **Recent activity** | Activity list | Icon + mô tả sự kiện platform |
| **Platform health** | Gradient panel | Stability %, progress bar, gross revenue, legal queue |

---

#### 3. User Management (`/admin/users`)

**Mục đích**: Quản lý users theo role/status và xem trạng thái organization review.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | User Management | Title, mô tả, Export CSV, Invite User |
| **KPI grid** | Metrics | Total Users, Students, Instructors, Pending Review |
| **Controls** | Filter + tabs | Filter button, All Users/Instructors/Students tabs |
| **User table** | Rows | Avatar, name/email, role/id, status, enrollments |
| **Actions** | Row icons | Edit/visibility icon hiện khi hover |

---

#### 4. Course Moderation (`/admin/courses`)

**Mục đích**: Duyệt request legal certificate/verified course từ instructor.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | Queue summary | Title, số pending, priority |
| **Stats** | Wait/Daily/Quality | Wait time, daily goal, quality index |
| **Filters** | Status pills | All Submissions, Verified Legal, Pending Review, Rejected |
| **Moderation cards** | Request cards | Course image, ID, instructor, duration, archive plan, verification method |
| **Moderator note** | Textarea | Ghi chú admin cho từng request |
| **Actions** | Approve/Reject | Gọi reviewLegalCertificateRequest, cập nhật status |
| **Assets row** | Visual cards | Document Assets, Review Heatmaps, Partner Integration |

---

#### 5. Coupon Manager (`/admin/coupons`)

**Mục đích**: Quản lý coupon toàn platform và tạo coupon dùng chung với checkout.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | Coupon Manager | Export Report, Create New Coupon |
| **KPI cards** | Campaign metrics | Total Active Savings, Redemption Rate, Expiring Soon |
| **Active promotions** | Coupon rows | Code, description, status, discount, more action |
| **Quick Config** | Create form | Coupon code, discount type, value, description |
| **Action** | Forge Link | Tạo coupon mới trong shared mock state |

---

#### 6. System Settings (`/admin/settings`)

**Mục đích**: Cấu hình tham số vận hành demo ở cấp platform.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | System Settings | Discard Changes, Publish Updates |
| **Economic Model** | Inputs + chart | Commission %, payout threshold, projected monthly revenue |
| **Visual Identity** | Brand controls | Primary color, typography set |
| **Automation Anchors** | Toggle rows | Smart Reminders, Email Digest, Auto-Verification |
| **System Resilience** | Backup panel | Backup frequency, retention period, Download Audit Logs |

---

## 5. Payment Web

> **Nguồn DEMO**: Payment Web không có shell/folder web riêng trong DEMO. Các màn hình thanh toán nằm trong Student Web (`CartPage`, `CheckoutPage`, `OrdersPage`); số liệu doanh thu được hiển thị lại ở Instructor/Admin.

| Màn hình | Route DEMO | Component | Mô tả sơ bộ |
|----------|------------|-----------|-------------|
| 01 | `/cart` | `CartPage` | Giỏ hàng course, coupon, subtotal/discount/total, checkout CTA |
| 02 | `/checkout` | `CheckoutPage` | Chọn phương thức thanh toán, form thẻ mock, tạo order |
| 03 | `/orders` | `OrdersPage` | Lịch sử order/receipt sau checkout |
| 04 | `/instructor` + `/instructor/students` | `InstructorOverviewPage`, `InstructorStudentsPage` | Doanh thu instructor từ mock orders |
| 05 | `/admin` | `AdminPage` | Gross revenue và platform health ở dashboard admin |

---

### Mô Tả Chi Tiết Payment Web

> **Layout chung**: Payment flow kế thừa Student Web top navbar. Coupon dùng chung `state.coupons`; order sau checkout được ghi vào `state.orders`, đồng thời grant enrollment cho student.

#### 1. Cart (`/cart`)

**Mục đích**: Rà soát course đã chọn, áp coupon và chuyển sang checkout.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | SectionHeader | "Cart & Checkout System" |
| **Items** | Course cards | Ảnh course, category, title, subtitle, price, remove |
| **Empty state** | Browse Courses | CTA về `/courses` khi giỏ trống |
| **Sidebar** | Promotions & Coupons | Subtotal, discount, total |
| **Coupon controls** | Input + Apply/Clear | Thử `DEMO20` hoặc `WELCOME10` |
| **CTA** | Proceed to Checkout | Link sang `/checkout`, disabled khi không có item |

---

#### 2. Checkout (`/checkout`)

**Mục đích**: Tạo order mock và cấp quyền học.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | SectionHeader | "Payment Gateway Integration" |
| **Method grid** | Buttons | Card, MoMo, VNPay, PayPal |
| **Card form** | Inputs | Cardholder, card number, expiry, CVV |
| **Summary sidebar** | Order Summary | Items, subtotal, discount, total |
| **CTA** | Complete Enrollment | Gọi `actions.checkout(method)`, navigate sang `/orders` |

---

#### 3. Orders (`/orders`)

**Mục đích**: Xem order đã tạo từ checkout.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Header** | SectionHeader | "Transaction ledger" |
| **Table** | Receipt rows | Invoice, Date, Items, Method, Status, Total |
| **Status** | Chip | Success cho order mock |
| **Data scope** | Role logic | Student thấy order của mình, admin logic có thể thấy tất cả |

---

#### 4. Instructor Revenue (`/instructor`, `/instructor/students`)

**Mục đích**: DEMO không có màn hình earnings riêng; doanh thu instructor được nhúng vào portal instructor.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Instructor overview** | Gross Revenue KPI | Tính từ orders có course thuộc instructor |
| **Students page** | Revenue KPI | Estimated gross revenue theo published courses |
| **Course rows** | Analytics | Students, rating và link về course editor |

---

#### 5. Platform Finance (`/admin`)

**Mục đích**: DEMO không có màn hình finance admin riêng; tổng doanh thu platform nằm ở Admin Dashboard.

| Khu vực | Thành phần | Mô tả |
|---------|------------|-------|
| **Platform Health** | Gross Revenue | Tổng doanh thu từ `state.orders` |
| **Legal Queue** | Pending count | Số request legal certificate đang chờ |
| **Admin KPIs** | User/community metrics | Tổng user, active students, verified instructors |

---


## 6. Payment App 

| Màn hình | File | Mô tả sơ bộ |
|----------|------|-------------|
| 01 | `cart_coupons/code.html` | Giỏ hàng & coupon (mobile) |
| 02 | `checkout/code.html` | Thanh toán (mobile) |
| 03 | `purchase_history/code.html` | Lịch sử mua hàng (mobile) |
| 04 | `revenue_payouts/code.html` | Doanh thu & chi trả (mobile) |
| 05 | `platform_finances/code.html` | Tài chính platform (mobile) |

### Mô Tả Chi Tiết Payment App

#### 1. Cart & Coupons (`cart_coupons/code.html`)

**Mục đích**: Màn hình giỏ hàng mobile để xem danh sách khóa học đã chọn, áp mã giảm giá và tiến hành thanh toán.

**Cấu trúc giao diện**:

| Khu vực                   | Thành phần       | Mô tả                                                          |
| ------------------------- | ---------------- | -------------------------------------------------------------- |
| **Khu vực tiêu đề**       | Tên trang        | “Your Cart” + số lượng khóa đã chọn                            |
| **Danh sách giỏ hàng**    | Item khóa học    | Thumbnail, tên khóa, giảng viên, giá hiện tại/giá gốc, nút xóa |
| **Khối coupon**           | Nhập mã giảm giá | Ô nhập + nút Apply + ghi chú khuyến mãi                        |
| **Khối tổng tiền**        | Breakdown        | Subtotal, coupon discount, total                               |
|                           | CTA              | Nút Proceed to Payment                                         |
| **Thanh điều hướng dưới** | Mobile nav       | Learn / Cart / Orders / Revenue / Admin                        |

---

#### 2. Checkout (`checkout/code.html`)

**Mục đích**: Màn hình thanh toán mobile để chọn phương thức chi trả, nhập thông tin thẻ và xác nhận thanh toán đơn hàng.

**Cấu trúc giao diện**:

| Khu vực                   | Thành phần       | Mô tả                                        |
| ------------------------- | ---------------- | -------------------------------------------- |
| **Khu vực thanh toán**    | Tiêu đề          | “Secure Checkout”                            |
|                           | Chọn phương thức | Credit Card, MoMo, VNPay, PayPal (dạng card) |
|                           | Form thẻ         | Cardholder, card number, expiry, CVV         |
|                           | Chỉ báo tin cậy  | Secure SSL + biểu tượng bảo mật              |
| **Khu vực đơn hàng**      | Tóm tắt sản phẩm | Danh sách item, số lượng, giá từng mục       |
|                           | Tổng hợp chi phí | Subtotal, platform fee, total amount         |
|                           | CTA              | Nút Pay Now                                  |
|                           | Điều khoản       | Ghi chú Terms of Service và Privacy Policy   |
| **Khối phụ**              | Promo code nhanh | Ô nhập promo + nút Apply                     |
| **Thanh điều hướng dưới** | Mobile nav       | Cart được ưu tiên hiển thị                   |

---

#### 3. Purchase History (`purchase_history/code.html`)

**Mục đích**: Màn hình lịch sử mua hàng mobile để tra cứu giao dịch, theo dõi trạng thái đơn và tải hóa đơn.

**Cấu trúc giao diện**:

| Khu vực                   | Thành phần        | Mô tả                                          |
| ------------------------- | ----------------- | ---------------------------------------------- |
| **Khu vực tiêu đề**       | Tên trang + mô tả | “Order History” và hướng dẫn quản lý giao dịch |
| **Khối thống kê nhanh**   | KPI ngắn          | Total Spent, Total Orders, Latest Invoice      |
| **Danh sách giao dịch**   | Item giao dịch    | Tên khóa, mã đơn, ngày, số tiền                |
|                           | Trạng thái        | Success / Failed với màu trạng thái            |
|                           | Hành động         | Nút tải hóa đơn (download)                     |
| **Thanh điều hướng dưới** | Mobile nav        | Orders được active                             |

---

#### 4. Revenue & Payouts (`revenue_payouts/code.html`)

**Mục đích**: Màn hình doanh thu mobile cho giảng viên, theo dõi số dư khả dụng, doanh thu theo khóa và trạng thái payout.

**Cấu trúc giao diện**:

| Khu vực                      | Thành phần       | Mô tả                                                 |
| ---------------------------- | ---------------- | ----------------------------------------------------- |
| **Hero tài chính**           | Số dư rút được   | Available for Withdrawal                              |
|                              | Hành động payout | Nút Request Payout + tài khoản nhận tiền              |
|                              | Chỉ số tích lũy  | Lifetime Earnings + tăng trưởng tháng                 |
| **Khối doanh thu theo khóa** | Danh sách course | Tên khóa, số học viên, tỷ lệ chia sẻ, doanh thu tháng |
| **Khối trạng thái chi trả**  | Timeline payout  | Pending / Paid / Approved theo từng yêu cầu           |
|                              | Mini chart       | Payout velocity theo chu kỳ                           |
| **Thanh điều hướng dưới**    | Mobile nav       | Revenue được active                                   |

---

#### 5. Platform Finances (`platform_finances/code.html`)

**Mục đích**: Màn hình tài chính platform trên mobile dành cho admin, giám sát doanh thu tổng, cấu hình chia sẻ và duyệt yêu cầu payout.

**Cấu trúc giao diện**:

| Khu vực                   | Thành phần              | Mô tả                                          |
| ------------------------- | ----------------------- | ---------------------------------------------- |
| **Khu vực tổng quan**     | Total Platform Revenue  | Chỉ số doanh thu toàn nền tảng + tăng trưởng   |
|                           | Biểu đồ xu hướng        | Cột doanh thu theo kỳ                          |
| **Khối cấu hình**         | Global Payout Logic     | Thiết lập tỷ lệ chia sẻ cho instructor         |
|                           | Instructor Payouts      | Tổng payout và net margin                      |
| **Khối vận hành**         | Pending Payout Requests | Bảng yêu cầu chi trả chờ duyệt                 |
|                           | Dữ liệu mỗi yêu cầu     | Instructor, requested amount, wallet balance   |
|                           | Hành động               | Approve / Reject                               |
| **Khối insight**          | Tóm tắt vận hành        | Payout health, new instructors, tax compliance |
| **Thanh điều hướng dưới** | Mobile nav              | Admin được active                              |

