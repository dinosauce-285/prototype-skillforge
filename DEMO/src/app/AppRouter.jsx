import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { useAppState } from "../state/AppState";
import { homePathForRole } from "../lib/utils";
import { LoginWorkspacePage, AuthPage } from "../pages/AuthPages";
import {
  CartPage,
  CatalogPage,
  CertificatePage,
  CourseDetailPage,
  DashboardPage,
  DiscussionsPage,
  LearningPage,
  OrdersPage,
  ProfilePage,
  ProgressPage,
  QuizPage,
  ResultsPage,
  ReviewsPage,
  CheckoutPage,
} from "../pages/StudentPages";
import {
  InstructorCompliancePage,
  InstructorCouponsPage,
  InstructorCourseEditorPage,
  InstructorCoursesPage,
  InstructorGradingPage,
  InstructorCurriculumPage,
  InstructorOverviewPage,
  InstructorLessonQuizEditorPage,
  InstructorQuizBuilderPage,
  InstructorStudentsPage,
} from "../pages/InstructorPages";
import {
  AdminCouponsPage,
  AdminCoursesPage,
  AdminPage,
  AdminSettingsPage,
  AdminUsersPage,
} from "../pages/AdminPage";

function RoleRoute({ roles, children }) {
  const { currentUser } = useAppState();
  if (!roles.includes(currentUser.role)) return <Navigate to={homePathForRole(currentUser.role)} replace />;
  return children;
}

function ProtectedApp() {
  const { currentUser } = useAppState();
  const location = useLocation();
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <AppLayout currentUser={currentUser}><Routes>
    <Route path="/" element={<RoleRoute roles={["student"]}><DashboardPage /></RoleRoute>} />
    <Route path="/courses" element={<RoleRoute roles={["student"]}><CatalogPage /></RoleRoute>} />
    <Route path="/courses/:courseId" element={<RoleRoute roles={["student"]}><CourseDetailPage /></RoleRoute>} />
    <Route path="/learning/:courseId/:lessonId?" element={<RoleRoute roles={["student"]}><LearningPage /></RoleRoute>} />
    <Route path="/progress" element={<RoleRoute roles={["student"]}><ProgressPage /></RoleRoute>} />
    <Route path="/quiz/:courseId" element={<RoleRoute roles={["student"]}><QuizPage /></RoleRoute>} />
    <Route path="/results/:courseId" element={<RoleRoute roles={["student"]}><ResultsPage /></RoleRoute>} />
    <Route path="/certificate/:courseId" element={<RoleRoute roles={["student"]}><CertificatePage /></RoleRoute>} />
    <Route path="/cart" element={<RoleRoute roles={["student"]}><CartPage /></RoleRoute>} />
    <Route path="/checkout" element={<RoleRoute roles={["student"]}><CheckoutPage /></RoleRoute>} />
    <Route path="/orders" element={<RoleRoute roles={["student"]}><OrdersPage /></RoleRoute>} />
    <Route path="/reviews/:courseId" element={<RoleRoute roles={["student"]}><ReviewsPage /></RoleRoute>} />
    <Route path="/discussions/:courseId/:lessonId" element={<RoleRoute roles={["student"]}><DiscussionsPage /></RoleRoute>} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/instructor" element={<RoleRoute roles={["instructor"]}><InstructorOverviewPage /></RoleRoute>} />
    <Route path="/instructor/courses" element={<RoleRoute roles={["instructor"]}><InstructorCoursesPage /></RoleRoute>} />
    <Route path="/instructor/courses/:courseId" element={<RoleRoute roles={["instructor"]}><InstructorCourseEditorPage /></RoleRoute>} />
    <Route path="/instructor/courses/:courseId/lessons/:lessonId/quiz" element={<RoleRoute roles={["instructor"]}><InstructorLessonQuizEditorPage /></RoleRoute>} />
    <Route path="/instructor/compliance" element={<RoleRoute roles={["instructor"]}><InstructorCompliancePage /></RoleRoute>} />
    <Route path="/instructor/grading" element={<RoleRoute roles={["instructor"]}><InstructorGradingPage /></RoleRoute>} />
    <Route path="/instructor/curriculum" element={<RoleRoute roles={["instructor"]}><InstructorCurriculumPage /></RoleRoute>} />
    <Route path="/instructor/quizzes" element={<RoleRoute roles={["instructor"]}><InstructorQuizBuilderPage /></RoleRoute>} />
    <Route path="/instructor/students" element={<RoleRoute roles={["instructor"]}><InstructorStudentsPage /></RoleRoute>} />
    <Route path="/instructor/coupons" element={<RoleRoute roles={["instructor"]}><InstructorCouponsPage /></RoleRoute>} />
    <Route path="/admin" element={<RoleRoute roles={["admin"]}><AdminPage /></RoleRoute>} />
    <Route path="/admin/users" element={<RoleRoute roles={["admin"]}><AdminUsersPage /></RoleRoute>} />
    <Route path="/admin/courses" element={<RoleRoute roles={["admin"]}><AdminCoursesPage /></RoleRoute>} />
    <Route path="/admin/coupons" element={<RoleRoute roles={["admin"]}><AdminCouponsPage /></RoleRoute>} />
    <Route path="/admin/settings" element={<RoleRoute roles={["admin"]}><AdminSettingsPage /></RoleRoute>} />
    <Route path="*" element={<Navigate to={homePathForRole(currentUser.role)} replace />} />
  </Routes></AppLayout>;
}

export function AppRouter() {
  const { currentUser } = useAppState();
  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to={homePathForRole(currentUser.role)} replace /> : <LoginWorkspacePage />} />
      <Route path="/register" element={currentUser ? <Navigate to={homePathForRole(currentUser.role)} replace /> : <AuthPage mode="register" />} />
      <Route path="/*" element={<ProtectedApp />} />
    </Routes>
  );
}
