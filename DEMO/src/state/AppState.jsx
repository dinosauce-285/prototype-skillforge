import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { heroImages, initialState, makeLessonRecord } from "../mock/seed";
import { STORAGE_KEY, flattenLessons } from "../lib/utils";

const AppStateContext = createContext(null);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
  } catch {
    return initialState;
  }
}

export function AppStateProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentUser = state.users.find((user) => user.id === state.sessionUserId) ?? null;
  const courses = state.catalog;

  const actions = useMemo(
    () => ({
      login(email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();
        const found = state.users.find(
          (user) => user.email.toLowerCase() === normalizedEmail && user.password === normalizedPassword,
        );
        if (!found) return { ok: false, message: "Invalid credentials." };
        setState((prev) => ({ ...prev, sessionUserId: found.id }));
        return { ok: true, user: found };
      },
      register(payload) {
        const normalizedEmail = payload.email.trim().toLowerCase();
        const normalizedName = payload.name.trim();
        const normalizedPassword = payload.password.trim();
        const exists = state.users.some((user) => user.email.toLowerCase() === normalizedEmail);
        if (exists) return { ok: false, message: "Email already exists." };
        const user = {
          id: `user-${Date.now()}`,
          name: normalizedName,
          email: normalizedEmail,
          password: normalizedPassword,
          role: "student",
          headline: "New learner",
          bio: "Created in localStorage demo mode.",
          goals: ["Complete first lesson", "Try quiz flow", "Checkout a new course"],
          enrolledCourseIds: [],
          completedLessons: {},
          quizResults: {},
          certificates: [],
        };
        setState((prev) => ({ ...prev, users: [...prev.users, user], sessionUserId: user.id }));
        return { ok: true, user };
      },
      logout() {
        setState((prev) => ({ ...prev, sessionUserId: null }));
      },
      updateProfile(payload) {
        if (!currentUser) return;
        setState((prev) => ({
          ...prev,
          users: prev.users.map((user) =>
            user.id === currentUser.id
              ? { ...user, name: payload.name, headline: payload.headline, bio: payload.bio }
              : user,
          ),
        }));
      },
      saveOrganizationProfile(payload) {
        if (!currentUser) return;
        const documents = payload.documents?.length
          ? payload.documents
          : currentUser.organizationProfile?.documents ?? [
              { id: `org-doc-${Date.now()}-1`, name: "Vocational Training License Scan.pdf", type: "PDF" },
              { id: `org-doc-${Date.now()}-2`, name: "Center Establishment Decision.pdf", type: "PDF" },
            ];
        setState((prev) => ({
          ...prev,
          users: prev.users.map((user) =>
            user.id === currentUser.id
              ? {
                  ...user,
                  organizationProfile: {
                    ...user.organizationProfile,
                    ...payload,
                    accountType: "organization",
                    status: user.organizationProfile?.status === "approved" ? "approved" : "submitted",
                    submittedAt: new Date().toISOString(),
                    documents,
                  },
                }
              : user,
          ),
        }));
      },
      submitLegalCertificateRequest(payload) {
        if (!currentUser) return null;
        const course = courses.find((item) => item.id === payload.courseId);
        if (!course) return null;
        const existing = state.legalApprovalRequests.find((request) => request.courseId === payload.courseId);
        const nextRequest = {
          id: existing?.id ?? `legal-req-${Date.now()}`,
          instructorId: currentUser.id,
          instructorName: currentUser.name,
          courseId: course.id,
          courseTitle: course.title,
          organizationName: payload.organizationName,
          requestType: "legal_certificate_course",
          status: "pending",
          submittedAt: new Date().toISOString(),
          reviewedAt: null,
          reviewedBy: null,
          complianceStandard: payload.complianceStandard,
          archivePlan: payload.archivePlan,
          verificationMethod: payload.verificationMethod,
          documents: payload.documents?.length
            ? payload.documents
            : [
                { id: `legal-doc-${Date.now()}-1`, name: "Legal issuance declaration.pdf", type: "PDF" },
                { id: `legal-doc-${Date.now()}-2`, name: "Assessment governance evidence.pdf", type: "PDF" },
              ],
          adminNotes: "",
        };
        setState((prev) => ({
          ...prev,
          legalApprovalRequests: existing
            ? prev.legalApprovalRequests.map((request) => (request.id === existing.id ? nextRequest : request))
            : [nextRequest, ...prev.legalApprovalRequests],
          catalog: prev.catalog.map((item) =>
            item.id === course.id
              ? {
                  ...item,
                  legalCertificate: {
                    ...item.legalCertificate,
                    status: "pending",
                    badgeLabel: "Under legal review",
                    organizationName: payload.organizationName,
                    policy: payload.complianceStandard,
                  },
                }
              : item,
          ),
        }));
        return nextRequest;
      },
      reviewLegalCertificateRequest(requestId, payload) {
        if (!currentUser) return;
        const request = state.legalApprovalRequests.find((item) => item.id === requestId);
        if (!request) return;
        const approved = payload.status === "approved";
        setState((prev) => ({
          ...prev,
          legalApprovalRequests: prev.legalApprovalRequests.map((item) =>
            item.id === requestId
              ? {
                  ...item,
                  status: payload.status,
                  reviewedAt: new Date().toISOString(),
                  reviewedBy: currentUser.name,
                  adminNotes: payload.adminNotes,
                }
              : item,
          ),
          catalog: prev.catalog.map((course) =>
            course.id === request.courseId
              ? {
                  ...course,
                  certificateType: approved ? "verified" : course.certificateType,
                  legalCertificate: {
                    ...course.legalCertificate,
                    status: payload.status,
                    badgeLabel: approved ? "Verified by Skill Forge" : "Legal request rejected",
                    referenceId: approved ? (course.legalCertificate?.referenceId ?? `LGV-${course.id.toUpperCase()}-${new Date().getFullYear()}`) : course.legalCertificate?.referenceId,
                    organizationName: request.organizationName,
                    approvedAt: approved ? new Date().toISOString() : course.legalCertificate?.approvedAt,
                    approvedBy: approved ? currentUser.name : course.legalCertificate?.approvedBy,
                    policy: request.complianceStandard,
                    adminNotes: payload.adminNotes,
                  },
                }
              : course,
          ),
        }));
      },
      gradeSubmission(submissionId, payload) {
        if (!currentUser) return;
        setState((prev) => ({
          ...prev,
          gradingSubmissions: prev.gradingSubmissions.map((submission) =>
            submission.id === submissionId
              ? {
                  ...submission,
                  score: Number(payload.score),
                  instructorFeedback: payload.instructorFeedback,
                  status: "graded",
                  gradedAt: new Date().toISOString(),
                  gradedBy: currentUser.name,
                }
              : submission,
          ),
        }));
      },
      addToCart(courseId) {
        setState((prev) => ({ ...prev, cart: prev.cart.includes(courseId) ? prev.cart : [...prev.cart, courseId] }));
      },
      removeFromCart(courseId) {
        setState((prev) => ({ ...prev, cart: prev.cart.filter((id) => id !== courseId) }));
      },
      applyCoupon(code) {
        const coupon = state.coupons.find((item) => item.code.toLowerCase() === code.toLowerCase());
        if (!coupon) return { ok: false, message: "Coupon not found." };
        setState((prev) => ({ ...prev, appliedCoupon: coupon.code }));
        return { ok: true, message: `${coupon.code} applied.` };
      },
      clearCoupon() {
        setState((prev) => ({ ...prev, appliedCoupon: null }));
      },
      checkout(method) {
        if (!currentUser || !state.cart.length) return null;
        const cartCourses = courses.filter((course) => state.cart.includes(course.id));
        const subtotal = cartCourses.reduce((sum, course) => sum + course.price, 0);
        const coupon = state.coupons.find((item) => item.code === state.appliedCoupon);
        const discount = coupon ? (coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value) : 0;
        const order = {
          id: `ORD-${Math.floor(Date.now() / 1000)}`,
          userId: currentUser.id,
          courseIds: [...state.cart],
          subtotal,
          discount,
          total: Math.max(subtotal - discount, 0),
          method,
          status: "Paid",
          createdAt: new Date().toISOString(),
          receiptUrl: "#",
        };
        setState((prev) => ({
          ...prev,
          orders: [order, ...prev.orders],
          cart: [],
          appliedCoupon: null,
          users: prev.users.map((user) =>
            user.id === currentUser.id
              ? { ...user, enrolledCourseIds: Array.from(new Set([...user.enrolledCourseIds, ...order.courseIds])) }
              : user,
          ),
        }));
        return order;
      },
      markLessonComplete(courseId, lessonId) {
        if (!currentUser) return;
        setState((prev) => ({
          ...prev,
          users: prev.users.map((user) =>
            user.id === currentUser.id
              ? {
                  ...user,
                  completedLessons: {
                    ...user.completedLessons,
                    [courseId]: Array.from(new Set([...(user.completedLessons?.[courseId] ?? []), lessonId])),
                  },
                }
              : user,
          ),
        }));
      },
      submitQuiz(courseId, answers) {
        if (!currentUser) return null;
        const course = courses.find((item) => item.id === courseId);
        if (!course) return null;
        const score = course.quiz.reduce((sum, q, index) => (q.answer === Number(answers[index]) ? sum + 1 : sum), 0);
        const result = {
          id: `quiz-${Date.now()}`,
          courseId,
          score,
          total: course.quiz.length,
          percent: Math.round((score / course.quiz.length) * 100),
          answers,
          createdAt: new Date().toISOString(),
        };
        setState((prev) => ({
          ...prev,
          users: prev.users.map((user) =>
            user.id === currentUser.id
              ? {
                  ...user,
                  quizResults: { ...user.quizResults, [courseId]: result },
                  certificates:
                    result.percent >= 70 && !user.certificates.includes(courseId)
                      ? [...user.certificates, courseId]
                      : user.certificates,
                }
              : user,
          ),
        }));
        return result;
      },
      addReview(courseId, payload) {
        if (!currentUser) return;
        const course = courses.find((item) => item.id === courseId);
        if (!course) return { ok: false, message: "Course not found." };
        const enrolled = currentUser.enrolledCourseIds.includes(courseId);
        const completed = flattenLessons(course).length > 0 && (currentUser.completedLessons?.[courseId] ?? []).length >= flattenLessons(course).length;
        const alreadyReviewed = (state.reviews[courseId] ?? []).some((review) => review.userId === currentUser.id);
        if (!enrolled) return { ok: false, message: "Enroll in the course before leaving a review." };
        if (!completed) return { ok: false, message: "Finish the course before leaving a review." };
        if (alreadyReviewed) return { ok: false, message: "You already submitted a review for this course." };
        const review = {
          id: `review-${Date.now()}`,
          userId: currentUser.id,
          author: currentUser.name,
          rating: Number(payload.rating),
          content: payload.content.trim(),
          createdAt: new Date().toISOString(),
        };
        setState((prev) => ({ ...prev, reviews: { ...prev.reviews, [courseId]: [review, ...(prev.reviews[courseId] ?? [])] } }));
        return { ok: true };
      },
      addDiscussion(courseId, lessonId, content) {
        if (!currentUser) return;
        const key = `${courseId}:${lessonId}`;
        const post = {
          id: `discussion-${Date.now()}`,
          author: currentUser.name,
          role: currentUser.role,
          content,
          createdAt: new Date().toISOString(),
        };
        setState((prev) => ({ ...prev, discussions: { ...prev.discussions, [key]: [post, ...(prev.discussions[key] ?? [])] } }));
      },
      createCourse(payload) {
        const course = {
          id: payload.id || `course-${Date.now()}`,
          title: payload.title,
          subtitle: payload.subtitle,
          category: payload.category,
          level: payload.level,
          price: Number(payload.price),
          rating: 4.7,
          students: 0,
          duration: payload.duration,
          image: payload.image || heroImages.typography,
          instructorId: currentUser?.id ?? "instructor-1",
          instructorName: currentUser?.name ?? "Instructor",
          certificateType: payload.certificateType,
          legalCertificate: {
            status: "not_requested",
            badgeLabel: "",
            organizationName: currentUser?.organizationProfile?.businessName ?? "",
            policy: "TT 10/2026",
          },
          skills: payload.skills.split(",").map((item) => item.trim()).filter(Boolean),
          modules: [],
          quiz: [],
        };
        setState((prev) => ({ ...prev, catalog: [course, ...prev.catalog] }));
      },
      updateCourse(courseId, patch) {
        setState((prev) => ({
          ...prev,
          catalog: prev.catalog.map((course) => (course.id === courseId ? { ...course, ...patch } : course)),
        }));
      },
      deleteCourse(courseId) {
        setState((prev) => ({
          ...prev,
          catalog: prev.catalog.filter((course) => course.id !== courseId),
          cart: prev.cart.filter((id) => id !== courseId),
          legalApprovalRequests: prev.legalApprovalRequests.filter((request) => request.courseId !== courseId),
          gradingSubmissions: prev.gradingSubmissions.filter((submission) => submission.courseId !== courseId),
        }));
      },
      addModule(courseId, title) {
        setState((prev) => ({
          ...prev,
          catalog: prev.catalog.map((course) =>
            course.id !== courseId ? course : { ...course, modules: [...course.modules, { id: `module-${Date.now()}`, title, lessons: [] }] },
          ),
        }));
      },
      renameModule(courseId, moduleId, title) {
        setState((prev) => ({
          ...prev,
          catalog: prev.catalog.map((course) =>
            course.id !== courseId
              ? course
              : { ...course, modules: course.modules.map((module) => (module.id === moduleId ? { ...module, title } : module)) },
          ),
        }));
      },
      deleteModule(courseId, moduleId) {
        setState((prev) => ({
          ...prev,
          catalog: prev.catalog.map((course) =>
            course.id !== courseId ? course : { ...course, modules: course.modules.filter((module) => module.id !== moduleId) },
          ),
        }));
      },
      addLesson(courseId, moduleId, payload) {
        setState((prev) => ({
          ...prev,
          catalog: prev.catalog.map((course) => {
            if (course.id !== courseId) return course;
            const moduleIndex = course.modules.findIndex((module) => module.id === moduleId);
            const lessonIndex = Math.max((course.modules[moduleIndex]?.lessons?.length ?? 0), 0);
            const nextCourse = {
              ...course,
              modules: course.modules.map((module) =>
                module.id !== moduleId
                  ? module
                  : {
                      ...module,
                      lessons: [
                        ...module.lessons,
                        {
                          ...makeLessonRecord(course.id.replace(/[^a-z0-9]/gi, ""), moduleIndex, lessonIndex, payload),
                          id: `lesson-${Date.now()}`,
                        },
                      ],
                    },
              ),
            };
            return nextCourse;
          }),
        }));
      },
      updateLesson(courseId, moduleId, lessonId, patch) {
        setState((prev) => ({
          ...prev,
          catalog: prev.catalog.map((course) =>
            course.id !== courseId
              ? course
              : {
                  ...course,
                  modules: course.modules.map((module) =>
                    module.id !== moduleId
                      ? module
                      : {
                          ...module,
                          lessons: module.lessons.map((lesson) =>
                            lesson.id === lessonId
                              ? {
                                  ...lesson,
                                  ...patch,
                                  materials: patch.materials ?? lesson.materials ?? [],
                                  quiz: patch.quiz ?? lesson.quiz ?? [],
                                }
                              : lesson,
                          ),
                        },
                  ),
                },
          ),
        }));
      },
      deleteLesson(courseId, moduleId, lessonId) {
        setState((prev) => ({
          ...prev,
          catalog: prev.catalog.map((course) =>
            course.id !== courseId
              ? course
              : {
                  ...course,
                  modules: course.modules.map((module) =>
                    module.id !== moduleId ? module : { ...module, lessons: module.lessons.filter((lesson) => lesson.id !== lessonId) },
                  ),
                },
          ),
        }));
      },
      addQuizQuestion(courseId, payload) {
        setState((prev) => ({
          ...prev,
          catalog: prev.catalog.map((course) =>
            course.id !== courseId
              ? course
              : {
                  ...course,
                  quiz: [
                    ...course.quiz,
                    {
                      id: `quizq-${Date.now()}`,
                      prompt: payload.prompt,
                      options: payload.options,
                      answer: Number(payload.answer),
                      explanation: payload.explanation,
                    },
                  ],
                },
          ),
        }));
      },
      updateQuizQuestion(courseId, questionId, patch) {
        setState((prev) => ({
          ...prev,
          catalog: prev.catalog.map((course) =>
            course.id !== courseId
              ? course
              : { ...course, quiz: course.quiz.map((q) => (q.id === questionId ? { ...q, ...patch } : q)) },
          ),
        }));
      },
      deleteQuizQuestion(courseId, questionId) {
        setState((prev) => ({
          ...prev,
          catalog: prev.catalog.map((course) =>
            course.id !== courseId ? course : { ...course, quiz: course.quiz.filter((q) => q.id !== questionId) },
          ),
        }));
      },
      createCoupon(payload) {
        const coupon = {
          code: payload.code.toUpperCase(),
          type: payload.type,
          value: Number(payload.value),
          description: payload.description,
          status: "Active",
        };
        setState((prev) => ({ ...prev, coupons: [coupon, ...prev.coupons] }));
      },
      updateCoupon(code, patch) {
        setState((prev) => ({
          ...prev,
          coupons: prev.coupons.map((coupon) => (coupon.code === code ? { ...coupon, ...patch } : coupon)),
        }));
      },
    }),
    [courses, currentUser, state],
  );

  const value = { state, setState, currentUser, courses, actions, helpers: { flattenLessons } };
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useAppState must be used inside AppStateProvider");
  return value;
}
