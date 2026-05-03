import { useEffect, useMemo, useState } from "react";
import { NavLink, Navigate, useNavigate, useParams } from "react-router-dom";
import { MetricCard, SectionHeader } from "../components/ui";
import { courseProgress, currency, dateLabel, flattenLessons } from "../lib/utils";
import { useAppState } from "../state/AppState";

function useInstructorData() {
  const app = useAppState();
  const ownedCourses = app.courses.filter((course) => course.instructorId === app.currentUser.id);
  const instructorOrders = app.state.orders.filter((order) => order.courseIds.some((courseId) => ownedCourses.some((course) => course.id === courseId)));
  return { ...app, ownedCourses, instructorOrders };
}

function collectCourseStudents(state, course) {
  return state.users
    .filter((user) => user.role === "student" && user.enrolledCourseIds.includes(course.id))
    .map((user) => ({
      ...user,
      progress: courseProgress(user, course),
      completedCount: user.completedLessons?.[course.id]?.length ?? 0,
    }));
}

function collectCourseDiscussions(state, course) {
  const lessonMap = new Map(flattenLessons(course).map((lesson) => [lesson.id, lesson]));
  return Object.entries(state.discussions)
    .filter(([key]) => key.startsWith(`${course.id}:`))
    .flatMap(([key, posts]) => {
      const lessonId = key.split(":")[1];
      const lesson = lessonMap.get(lessonId);
      return posts.map((post) => ({ ...post, lessonId, lessonTitle: lesson?.title ?? "Unknown lesson" }));
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function courseLegalStatus(course) {
  return course.legalCertificate?.status ?? "not_requested";
}

function ownedLegalRequests(state, instructorId) {
  return state.legalApprovalRequests.filter((request) => request.instructorId === instructorId);
}

function ownedGradingSubmissions(state, courseIds) {
  return state.gradingSubmissions.filter((submission) => courseIds.includes(submission.courseId));
}

function defaultLessonMaterials(lesson) {
  return [
    {
      id: `material-${lesson.id || lesson.title}-brief`,
      title: `${lesson.title} Brief`,
      type: "PDF",
      size: "1.0 MB",
    },
  ];
}

function defaultLessonQuiz(lesson) {
  return [
    {
      id: `lessonq-${lesson.id || lesson.title}-1`,
      type: "single_choice",
      title: "Core takeaway",
      prompt: `What is the main objective of "${lesson.title}"?`,
      options: [
        "Understand the core concept and apply it in practice",
        "Skip directly to the final exam",
        "Memorize unrelated metrics",
        "Disable the workflow for learners",
      ],
      answer: 0,
      explanation: `This lesson is intended to build practical understanding around ${lesson.title}.`,
    },
    {
      id: `lessonq-${lesson.id || lesson.title}-2`,
      type: "true_false",
      title: "Concept check",
      prompt: `${lesson.title} should lead to a practical outcome the learner can use after the lesson.`,
      options: ["True", "False"],
      answer: 0,
      explanation: "Each lesson in this demo is structured around an applied outcome.",
    },
    {
      id: `lessonq-${lesson.id || lesson.title}-3`,
      type: "matching",
      title: "Match the workflow",
      prompt: `Match each part of ${lesson.title} to its role in the learning flow.`,
      pairs: [
        { id: `pair-${lesson.id || "lesson"}-1`, left: "Concept", right: "Core idea being taught" },
        { id: `pair-${lesson.id || "lesson"}-2`, left: "Practice", right: "Applied activity or implementation" },
        { id: `pair-${lesson.id || "lesson"}-3`, left: "Feedback", right: "Guidance that validates understanding" },
      ],
      explanation: "Matching is useful for checking structure and sequencing knowledge.",
    },
    {
      id: `lessonq-${lesson.id || lesson.title}-4`,
      type: "essay",
      title: "Reflection",
      prompt: `In 3-5 sentences, explain how you would apply the lesson "${lesson.title}" in a real project.`,
      rubric: "Look for clarity, a realistic use case, and explicit reference to the lesson outcome.",
      sampleAnswer: `A strong answer explains where ${lesson.title} fits in a product workflow and how the learner would apply it practically.`,
      explanation: "Essay questions help instructors assess reasoning depth beyond fixed choices.",
    },
  ];
}

function normalizeLessonQuestion(question, index) {
  const type = question.type || "single_choice";

  if (type === "matching") {
    return {
      id: question.id || `lessonq-${Date.now()}-${index}`,
      type,
      title: question.title || `Matching ${index + 1}`,
      prompt: question.prompt || "",
      pairs: question.pairs?.length ? question.pairs : [
        { id: `pair-${index}-1`, left: "", right: "" },
        { id: `pair-${index}-2`, left: "", right: "" },
      ],
      explanation: question.explanation || "",
    };
  }

  if (type === "essay") {
    return {
      id: question.id || `lessonq-${Date.now()}-${index}`,
      type,
      title: question.title || `Essay ${index + 1}`,
      prompt: question.prompt || "",
      rubric: question.rubric || "",
      sampleAnswer: question.sampleAnswer || "",
      explanation: question.explanation || "",
    };
  }

  return {
    id: question.id || `lessonq-${Date.now()}-${index}`,
    type,
    title: question.title || `${type === "true_false" ? "True / False" : "Question"} ${index + 1}`,
    prompt: question.prompt || "",
    options: question.options?.length ? question.options : (type === "true_false" ? ["True", "False"] : ["", "", "", ""]),
    answer: Number.isInteger(question.answer) ? question.answer : 0,
    explanation: question.explanation || "",
  };
}

function ensureLesson(lesson) {
  const rawQuiz = lesson.quiz?.length ? lesson.quiz : defaultLessonQuiz(lesson);
  return {
    ...lesson,
    type: lesson.type || "video",
    description: lesson.description || "",
    videoUrl: lesson.videoUrl || "",
    content: lesson.content || "",
    materials: lesson.materials?.length ? lesson.materials : defaultLessonMaterials(lesson),
    quiz: rawQuiz.map(normalizeLessonQuestion),
  };
}

export function InstructorOverviewPage() {
  const { currentUser, state, ownedCourses, instructorOrders } = useInstructorData();
  const requestCount = ownedLegalRequests(state, currentUser.id).length;
  const pendingGrading = ownedGradingSubmissions(state, ownedCourses.map((course) => course.id)).filter((submission) => submission.manualRequired && submission.status !== "graded").length;
  return (
    <div className="space-y-8">
      <SectionHeader chip="Instructor Portal & Administration" title="Instructor workspace" description="Dedicated routes for course management, curriculum, quizzes, student analytics, legal certificate review prep, manual grading, and promotions." />
      <div className="demo-grid demo-grid-3">
        <MetricCard title="Owned Courses" value={String(ownedCourses.length)} caption="Managed from this portal" />
        <MetricCard title="Orders Captured" value={String(instructorOrders.length)} caption="Derived from order history" />
        <MetricCard title="Gross Revenue" value={currency(instructorOrders.reduce((sum, order) => sum + order.total, 0))} caption="Mock paid orders only" />
      </div>
      <div className="demo-grid demo-grid-3">
        <MetricCard title="Legal Requests" value={String(requestCount)} caption="Organization and course certificate submissions" />
        <MetricCard title="Manual Grading" value={String(pendingGrading)} caption="Essay-style submissions waiting for instructor review" />
        <MetricCard title="Verified Courses" value={String(ownedCourses.filter((course) => courseLegalStatus(course) === "approved").length)} caption="Courses carrying the Verified by Skill Forge badge" />
      </div>
      <div className="demo-grid demo-grid-2">
        <div className="demo-kpi p-8">
          <h2 className="text-2xl font-headline font-black mb-4">Quick links</h2>
          <div className="space-y-3">
            <NavLink className="btn btn-surface btn-w-full" to="/instructor/courses">Course Studio</NavLink>
            <NavLink className="btn btn-surface btn-w-full" to="/instructor/compliance">Legal Certificate Workflow</NavLink>
            <NavLink className="btn btn-surface btn-w-full" to="/instructor/grading">Manual Grading Queue</NavLink>
            <NavLink className="btn btn-surface btn-w-full" to="/instructor/students">Student Analytics</NavLink>
            <NavLink className="btn btn-surface btn-w-full" to="/instructor/coupons">Promotions & Coupons</NavLink>
          </div>
        </div>
        <div className="demo-kpi p-8">
          <h2 className="text-2xl font-headline font-black mb-4">Compliance snapshot</h2>
          <div className="space-y-3">
            {ownedCourses.map((course) => <NavLink key={course.id} to={`/instructor/courses/${course.id}`} className="block bg-surface-container-low rounded-2xl p-4"><div className="flex items-center justify-between gap-4"><div><div className="font-bold">{course.title}</div><div className="text-sm text-on-surface-variant">{course.category} • {course.level}</div></div><span className={`demo-chip ${courseLegalStatus(course) === "approved" ? "demo-chip-success" : courseLegalStatus(course) === "pending" ? "demo-chip-primary" : "demo-chip-muted"}`}>{courseLegalStatus(course) === "approved" ? "Verified by Skill Forge" : courseLegalStatus(course) === "pending" ? "Pending Admin Review" : "Standard Cert"}</span></div></NavLink>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InstructorCoursesPage() {
  const navigate = useNavigate();
  const { currentUser, ownedCourses, actions } = useInstructorData();
  const [form, setForm] = useState({ title: "", subtitle: "", category: "Operations", level: "Beginner", price: 99, duration: "8h 00m", certificateType: "standard", skills: "Mock Data, CRUD, Demo" });

  return (
    <div className="space-y-8">
      <SectionHeader chip="Course Studio" title="Create and enter course workspaces" description="Each course now opens into a dedicated editor where you can manage overview, students, Q&A, chapters, lessons, content, materials, and lesson quiz." />
      <div className="demo-kpi p-8">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="demo-input" placeholder="Course title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
          <input className="demo-input" placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))} />
          <input className="demo-input" placeholder="Category" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} />
          <input className="demo-input" placeholder="Level" value={form.level} onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))} />
          <input className="demo-input" type="number" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} />
          <input className="demo-input" value={form.duration} onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))} />
          <select className="demo-select" value={form.certificateType} onChange={(e) => setForm((prev) => ({ ...prev, certificateType: e.target.value }))}><option value="standard">standard</option><option value="verified">verified</option></select>
          <input className="demo-input" value={form.skills} onChange={(e) => setForm((prev) => ({ ...prev, skills: e.target.value }))} />
        </div>
        <button
          className="btn btn-primary mt-5"
          onClick={() => {
            if (!form.title.trim()) return;
            actions.createCourse({ ...form, instructorId: currentUser.id, instructorName: currentUser.name });
            setForm({ title: "", subtitle: "", category: "Operations", level: "Beginner", price: 99, duration: "8h 00m", certificateType: "standard", skills: "Mock Data, CRUD, Demo" });
          }}
        >
          Create Course
        </button>
      </div>
      <div className="space-y-4">
        {ownedCourses.map((course) => (
          <div key={course.id} className="demo-kpi p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="font-bold text-xl">{course.title}</div>
                <div className="text-sm text-on-surface-variant">{course.category} • {course.level} • {currency(course.price)}</div>
              </div>
              <div className="flex gap-3">
                <button className="btn btn-primary" onClick={() => navigate(`/instructor/courses/${course.id}`)}>Edit Course</button>
                <button className="btn btn-surface" onClick={() => actions.deleteCourse(course.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InstructorCourseEditorPage() {
  const { courseId } = useParams();
  const { state, ownedCourses, actions } = useInstructorData();
  const course = ownedCourses.find((item) => item.id === courseId);
  const students = useMemo(() => (course ? collectCourseStudents(state, course) : []), [state, course]);
  const discussions = useMemo(() => (course ? collectCourseDiscussions(state, course) : []), [state, course]);
  const [activeTab, setActiveTab] = useState("overview");
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newLesson, setNewLesson] = useState({ title: "", duration: "08:00", type: "video" });
  const [materialDraft, setMaterialDraft] = useState({ title: "", type: "PDF", size: "1.0 MB" });

  const [courseForm, setCourseForm] = useState(() => course ? ({
    title: course.title,
    subtitle: course.subtitle,
    category: course.category,
    level: course.level,
    price: course.price,
    duration: course.duration,
    certificateType: course.certificateType,
    skills: course.skills.join(", "),
  }) : null);

  const [selectedModuleId, setSelectedModuleId] = useState(course?.modules[0]?.id ?? "");
  const firstLessonId = course?.modules[0]?.lessons[0]?.id ?? "";
  const [selectedLessonId, setSelectedLessonId] = useState(firstLessonId);

  const selectedModule = course?.modules.find((module) => module.id === selectedModuleId) ?? course?.modules[0];
  const selectedLessonRaw = selectedModule?.lessons.find((lesson) => lesson.id === selectedLessonId) ?? selectedModule?.lessons[0];
  const selectedLesson = selectedLessonRaw ? ensureLesson(selectedLessonRaw) : null;
  const totalLessons = course ? flattenLessons(course).length : 0;
  const openQuestionCount = discussions.filter((post) => post.role === "student").length;

  const [lessonForm, setLessonForm] = useState(() => selectedLesson ? ({
    title: selectedLesson.title,
    duration: selectedLesson.duration,
    type: selectedLesson.type,
    description: selectedLesson.description,
    videoUrl: selectedLesson.videoUrl,
    content: selectedLesson.content,
    materials: [...selectedLesson.materials],
    quiz: [...selectedLesson.quiz],
  }) : null);

  if (!course) return <Navigate to="/instructor/courses" replace />;

  const syncLessonForm = (lesson) => setLessonForm(lesson ? {
    title: lesson.title,
    duration: lesson.duration,
    type: lesson.type,
    description: lesson.description,
    videoUrl: lesson.videoUrl,
    content: lesson.content,
    materials: [...lesson.materials],
    quiz: [...lesson.quiz],
  } : null);

  useEffect(() => {
    if (!course?.modules?.length) {
      setSelectedModuleId("");
      setSelectedLessonId("");
      setLessonForm(null);
      return;
    }

    const nextModule = course.modules.find((module) => module.id === selectedModuleId) ?? course.modules[0];
    const nextLesson = nextModule?.lessons.find((lesson) => lesson.id === selectedLessonId) ?? nextModule?.lessons[0] ?? null;

    if (nextModule && nextModule.id !== selectedModuleId) {
      setSelectedModuleId(nextModule.id);
    }

    if (nextLesson) {
      if (nextLesson.id !== selectedLessonId) {
        setSelectedLessonId(nextLesson.id);
      }
      syncLessonForm(ensureLesson(nextLesson));
      return;
    }

    setSelectedLessonId("");
    setLessonForm(null);
  }, [course, selectedModuleId, selectedLessonId]);

  const openLesson = (moduleId, lesson) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lesson.id);
    syncLessonForm(ensureLesson(lesson));
    setActiveTab("lesson");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">Course Studio</div>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight">{course.title}</h1>
          <p className="text-on-surface-variant mt-2">Edit overview, track learners, answer discussion threads, and manage every chapter and lesson.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-surface" onClick={() => setActiveTab("overview")}>Overview</button>
          <button className="btn btn-primary" onClick={() => setActiveTab("lesson")}>Lesson Editor</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <aside className="col-span-12 xl:col-span-3">
          <div className="demo-kpi p-6 sticky top-28">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-headline font-bold text-2xl">Curriculum</h2>
              <button className="btn btn-surface btn-sm" onClick={() => setActiveTab("curriculum")}>Manage</button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {course.modules.map((module) => (
                <div key={module.id} className="space-y-2">
                  <button className={`w-full text-left rounded-xl px-4 py-3 ${selectedModuleId === module.id ? "bg-primary/10 text-primary font-bold" : "bg-surface-container-low text-on-surface"}`} onClick={() => {
                    const firstLesson = module.lessons[0];
                    setSelectedModuleId(module.id);
                    setSelectedLessonId(firstLesson?.id ?? "");
                    syncLessonForm(firstLesson ? ensureLesson(firstLesson) : null);
                  }}>
                    {module.title}
                  </button>
                  <div className="space-y-2 pl-3">
                    {module.lessons.map((lesson) => (
                      <button key={lesson.id} className={`w-full text-left rounded-xl px-4 py-3 ${selectedLessonId === lesson.id ? "bg-white shadow-sm border border-primary/10" : "bg-surface-container-lowest/70"}`} onClick={() => openLesson(module.id, lesson)}>
                        <div className="font-medium truncate">{lesson.title}</div>
                        <div className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">{lesson.type || "video"} • {lesson.duration}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="col-span-12 xl:col-span-9 space-y-8">
          <div className="flex gap-3 overflow-x-auto">
            {[
              ["overview", "Overview"],
              ["learners", "Learners"],
              ["questions", "Q&A"],
              ["curriculum", "Curriculum"],
              ["lesson", "Lesson"],
            ].map(([id, label]) => (
              <button key={id} className={activeTab === id ? "px-5 py-3 rounded-full bg-primary-container text-white font-bold whitespace-nowrap" : "px-5 py-3 rounded-full bg-surface-container-high text-on-surface whitespace-nowrap"} onClick={() => setActiveTab(id)}>{label}</button>
            ))}
          </div>

          {activeTab === "overview" ? (
            <>
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-4 bg-gradient-to-br from-primary to-primary-container p-6 rounded-2xl shadow-lg shadow-orange-900/10 text-white">
                  <p className="text-white/70 text-label font-black uppercase tracking-widest">Published Lessons</p>
                  <h3 className="text-5xl font-extrabold font-headline mt-1">{totalLessons}</h3>
                  <div className="flex items-center gap-1 text-white/90 text-xs font-bold mt-2"><span className="material-symbols-outlined icon">library_books</span>{course.modules.length} modules in this course</div>
                </div>
                <div className="col-span-12 md:col-span-4 demo-kpi p-6"><div className="text-sm text-on-surface-variant mb-1">Enrolled Students</div><div className="text-4xl font-black text-primary">{course.students}</div><div className="text-xs uppercase tracking-widest text-on-surface-variant mt-2">Total learners in this course</div></div>
                <div className="col-span-12 md:col-span-4 demo-kpi p-6"><div className="text-sm text-on-surface-variant mb-1">Open Questions</div><div className="text-4xl font-black text-primary">{openQuestionCount}</div><div className="text-xs uppercase tracking-widest text-on-surface-variant mt-2">Student questions awaiting review</div></div>
              </div>

              <div className="demo-kpi p-8">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="font-headline font-bold text-2xl tracking-tight">Course Overview</h2>
                    <p className="text-on-surface-variant mt-1">Edit the basic course information while keeping the course editor open.</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => {
                    actions.updateCourse(course.id, {
                      ...courseForm,
                      price: Number(courseForm.price),
                      skills: courseForm.skills.split(",").map((item) => item.trim()).filter(Boolean),
                    });
                  }}>Save Overview</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input className="demo-input" value={courseForm.title} onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))} />
                  <input className="demo-input" value={courseForm.subtitle} onChange={(e) => setCourseForm((prev) => ({ ...prev, subtitle: e.target.value }))} />
                  <input className="demo-input" value={courseForm.category} onChange={(e) => setCourseForm((prev) => ({ ...prev, category: e.target.value }))} />
                  <input className="demo-input" value={courseForm.level} onChange={(e) => setCourseForm((prev) => ({ ...prev, level: e.target.value }))} />
                  <input className="demo-input" type="number" value={courseForm.price} onChange={(e) => setCourseForm((prev) => ({ ...prev, price: e.target.value }))} />
                  <input className="demo-input" value={courseForm.duration} onChange={(e) => setCourseForm((prev) => ({ ...prev, duration: e.target.value }))} />
                  <select className="demo-select" value={courseForm.certificateType} onChange={(e) => setCourseForm((prev) => ({ ...prev, certificateType: e.target.value }))}><option value="standard">standard</option><option value="verified">verified</option></select>
                  <input className="demo-input" value={courseForm.skills} onChange={(e) => setCourseForm((prev) => ({ ...prev, skills: e.target.value }))} />
                </div>
              </div>
            </>
          ) : null}

          {activeTab === "learners" ? (
            <div className="space-y-6">
              <div className="demo-kpi p-8">
                <h2 className="font-headline text-3xl font-bold tracking-tight mb-6">Who is studying this course</h2>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="bg-surface-container-low rounded-2xl p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                          <div className="font-bold text-lg">{student.name}</div>
                          <div className="text-sm text-on-surface-variant">{student.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-primary">{student.progress}%</div>
                          <div className="text-xs uppercase tracking-widest text-on-surface-variant">{student.completedCount} lessons complete</div>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-primary-fixed rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-primary-container rounded-full" style={{ width: `${student.progress}%` }} />
                      </div>
                      <div className="text-sm text-on-surface-variant">Current position: {flattenLessons(course)[student.completedCount]?.title ?? "Completed course path"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "questions" ? (
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-5 demo-kpi p-6">
                <h2 className="font-headline text-2xl font-bold tracking-tight mb-4">Questions needing attention</h2>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {discussions.map((post) => (
                    <button key={post.id} className="w-full text-left p-4 bg-surface-container-lowest rounded-xl border-l-4 border-primary-container shadow-sm" onClick={() => setActiveTab("lesson")}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="font-bold">{post.author}</div>
                          <div className="text-xs uppercase tracking-widest text-on-surface-variant">{dateLabel(post.createdAt)}</div>
                        </div>
                        <span className="text-xs font-bold text-primary">{post.lessonTitle}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{post.content}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-7 demo-kpi p-6">
                <h2 className="font-headline text-2xl font-bold tracking-tight mb-4">Thread summary</h2>
                <div className="space-y-4">
                  {discussions.slice(0, 8).map((post) => (
                    <div key={post.id} className="bg-surface-container-low rounded-2xl p-4">
                      <div className="flex justify-between gap-4 mb-2">
                        <div>
                          <div className="font-bold">{post.author}</div>
                          <div className="text-xs uppercase tracking-widest text-on-surface-variant">{post.lessonTitle}</div>
                        </div>
                        <div className="text-sm text-on-surface-variant">{dateLabel(post.createdAt)}</div>
                      </div>
                      <p className="text-sm leading-relaxed text-on-surface-variant">{post.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "curriculum" ? (
            <div className="space-y-6">
              <div className="demo-kpi p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-headline text-3xl font-bold tracking-tight">Chapters and lessons</h2>
                  <div className="flex gap-3">
                    <input className="demo-input w-64" placeholder="New chapter title" value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} />
                    <button className="btn btn-primary" onClick={() => { if (!newModuleTitle.trim()) return; actions.addModule(course.id, newModuleTitle); setNewModuleTitle(""); }}>Add Chapter</button>
                  </div>
                </div>
                <div className="space-y-5">
                  {course.modules.map((module) => (
                    <div key={module.id} className="bg-surface-container-low rounded-3xl p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                          <div className="font-bold text-xl">{module.title}</div>
                          <div className="text-sm text-on-surface-variant">{module.lessons.length} lessons</div>
                        </div>
                        <div className="flex gap-3">
                          <button className="btn btn-surface btn-sm" onClick={() => { const title = window.prompt("Rename chapter", module.title); if (title) actions.renameModule(course.id, module.id, title); }}>Rename</button>
                          <button className="btn btn-surface btn-sm" onClick={() => actions.deleteModule(course.id, module.id)}>Delete</button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-[1fr_140px_120px_auto] gap-3 mb-4">
                        <input className="demo-input" placeholder="Lesson title" value={selectedModuleId === module.id ? newLesson.title : ""} onChange={(e) => { setSelectedModuleId(module.id); setNewLesson((prev) => ({ ...prev, title: e.target.value })); }} />
                        <input className="demo-input" value={selectedModuleId === module.id ? newLesson.duration : "08:00"} onChange={(e) => { setSelectedModuleId(module.id); setNewLesson((prev) => ({ ...prev, duration: e.target.value })); }} />
                        <select className="demo-select" value={selectedModuleId === module.id ? newLesson.type : "video"} onChange={(e) => { setSelectedModuleId(module.id); setNewLesson((prev) => ({ ...prev, type: e.target.value })); }}>
                          <option value="video">video</option>
                          <option value="text">text</option>
                          <option value="pdf">pdf</option>
                          <option value="quiz">quiz</option>
                        </select>
                        <button className="btn btn-primary" onClick={() => { if (!newLesson.title.trim()) return; actions.addLesson(course.id, module.id, newLesson); setNewLesson({ title: "", duration: "08:00", type: "video" }); }}>Add Lesson</button>
                      </div>
                      <div className="space-y-3">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="bg-white rounded-2xl px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="font-bold">{lesson.title}</div>
                              <div className="text-sm text-on-surface-variant">{lesson.type || "video"} • {lesson.duration}</div>
                            </div>
                            <div className="flex gap-3">
                              <button className="btn btn-surface btn-sm" onClick={() => openLesson(module.id, lesson)}>Open Editor</button>
                              <NavLink className="btn btn-surface btn-sm" to={`/instructor/courses/${course.id}/lessons/${lesson.id}/quiz`}>Edit Quiz</NavLink>
                              <button className="btn btn-surface btn-sm" onClick={() => actions.deleteLesson(course.id, module.id, lesson.id)}>Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "lesson" && selectedModule && lessonForm ? (
            <div className="space-y-6">
              <div className="demo-kpi p-8">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">{selectedModule.title}</div>
                    <h2 className="font-headline text-3xl font-bold tracking-tight">Lesson editor</h2>
                  </div>
                  <div className="flex gap-3">
                    <NavLink className="btn btn-surface" to={selectedLesson ? `/instructor/courses/${course.id}/lessons/${selectedLesson.id}/quiz` : "#"}>Edit Quiz</NavLink>
                    <button className="btn btn-primary" onClick={() => {
                      actions.updateLesson(course.id, selectedModule.id, selectedLesson.id, lessonForm);
                    }}>Save Lesson</button>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <input className="demo-input md:col-span-2" value={lessonForm.title} onChange={(e) => setLessonForm((prev) => ({ ...prev, title: e.target.value }))} />
                  <input className="demo-input" value={lessonForm.duration} onChange={(e) => setLessonForm((prev) => ({ ...prev, duration: e.target.value }))} />
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <select className="demo-select" value={lessonForm.type} onChange={(e) => setLessonForm((prev) => ({ ...prev, type: e.target.value }))}>
                    <option value="video">video</option>
                    <option value="text">text</option>
                    <option value="pdf">pdf</option>
                    <option value="quiz">quiz</option>
                  </select>
                  <input className="demo-input" placeholder="Video URL" value={lessonForm.videoUrl} onChange={(e) => setLessonForm((prev) => ({ ...prev, videoUrl: e.target.value }))} />
                </div>
                <textarea className="demo-textarea mb-4" placeholder="Short lesson description" value={lessonForm.description} onChange={(e) => setLessonForm((prev) => ({ ...prev, description: e.target.value }))} />
                <textarea className="demo-textarea" placeholder="Lesson content / notes" value={lessonForm.content} onChange={(e) => setLessonForm((prev) => ({ ...prev, content: e.target.value }))} />
              </div>

              <div className="demo-kpi p-8">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-headline text-2xl font-bold">Materials</h3>
                  <span className="text-sm text-on-surface-variant">{lessonForm.materials.length} file(s)</span>
                </div>
                <div className="material-draft-grid mb-4">
                  <input className="demo-input" placeholder="Material title" value={materialDraft.title} onChange={(e) => setMaterialDraft((prev) => ({ ...prev, title: e.target.value }))} />
                  <select className="demo-select" value={materialDraft.type} onChange={(e) => setMaterialDraft((prev) => ({ ...prev, type: e.target.value }))}>
                    <option>PDF</option>
                    <option>DOC</option>
                    <option>XLS</option>
                    <option>ZIP</option>
                  </select>
                  <input className="demo-input" value={materialDraft.size} onChange={(e) => setMaterialDraft((prev) => ({ ...prev, size: e.target.value }))} />
                  <button className="btn btn-primary" onClick={() => {
                    if (!materialDraft.title.trim()) return;
                    setLessonForm((prev) => ({
                      ...prev,
                      materials: [...prev.materials, { id: `mat-${Date.now()}`, ...materialDraft }],
                    }));
                    setMaterialDraft({ title: "", type: "PDF", size: "1.0 MB" });
                  }}>Add</button>
                </div>
                <div className="space-y-3">
                  {lessonForm.materials.map((material) => (
                    <div key={material.id} className="bg-surface-container-low rounded-2xl p-4 flex justify-between items-center gap-4">
                      <div>
                        <div className="font-bold">{material.title}</div>
                        <div className="text-sm text-on-surface-variant">{material.type} • {material.size}</div>
                      </div>
                      <button className="btn btn-surface btn-sm" onClick={() => setLessonForm((prev) => ({ ...prev, materials: prev.materials.filter((item) => item.id !== material.id) }))}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "lesson" && (!selectedModule || !lessonForm) ? (
            <div className="demo-kpi p-8">
              <h2 className="font-headline text-3xl font-bold tracking-tight mb-3">Lesson editor</h2>
              <p className="text-on-surface-variant">
                Select a lesson from the curriculum to start editing its content, materials, and quiz.
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export function InstructorCurriculumPage() {
  return <Navigate to="/instructor/courses" replace />;
}

export function InstructorQuizBuilderPage() {
  return <Navigate to="/instructor/courses" replace />;
}

function createQuestionByType(type) {
  const baseId = `lessonq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  if (type === "essay") {
    return {
      id: baseId,
      type,
      title: "Essay prompt",
      prompt: "",
      rubric: "",
      sampleAnswer: "",
      explanation: "",
    };
  }

  if (type === "matching") {
    return {
      id: baseId,
      type,
      title: "Matching prompt",
      prompt: "",
      pairs: [
        { id: `${baseId}-pair-1`, left: "", right: "" },
        { id: `${baseId}-pair-2`, left: "", right: "" },
      ],
      explanation: "",
    };
  }

  if (type === "true_false") {
    return {
      id: baseId,
      type,
      title: "True / False prompt",
      prompt: "",
      options: ["True", "False"],
      answer: 0,
      explanation: "",
    };
  }

  return {
    id: baseId,
    type: "single_choice",
    title: "Multiple choice prompt",
    prompt: "",
    options: ["", "", "", ""],
    answer: 0,
    explanation: "",
  };
}

export function InstructorLessonQuizEditorPage() {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const { ownedCourses, actions } = useInstructorData();
  const course = ownedCourses.find((item) => item.id === courseId);
  const selectedModule = course?.modules.find((module) => module.lessons.some((lesson) => lesson.id === lessonId));
  const lessonRaw = selectedModule?.lessons.find((lesson) => lesson.id === lessonId);
  const lesson = lessonRaw ? ensureLesson(lessonRaw) : null;
  const [quizForm, setQuizForm] = useState(() => lesson?.quiz ?? []);

  useEffect(() => {
    setQuizForm(lesson?.quiz ?? []);
  }, [lessonId, lessonRaw]);

  if (!course || !selectedModule || !lesson) return <Navigate to="/instructor/courses" replace />;

  const updateQuestion = (questionId, patch) => {
    setQuizForm((prev) => prev.map((question) => (question.id === questionId ? { ...question, ...patch } : question)));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuizForm((prev) => prev.map((question) => (
      question.id !== questionId
        ? question
        : { ...question, options: question.options.map((option, index) => (index === optionIndex ? value : option)) }
    )));
  };

  const updatePair = (questionId, pairId, field, value) => {
    setQuizForm((prev) => prev.map((question) => (
      question.id !== questionId
        ? question
        : {
            ...question,
            pairs: question.pairs.map((pair) => (pair.id === pairId ? { ...pair, [field]: value } : pair)),
          }
    )));
  };

  const addPair = (questionId) => {
    setQuizForm((prev) => prev.map((question) => (
      question.id !== questionId
        ? question
        : {
            ...question,
            pairs: [...question.pairs, { id: `${question.id}-pair-${Date.now()}`, left: "", right: "" }],
          }
    )));
  };

  const removeQuestion = (questionId) => {
    setQuizForm((prev) => prev.filter((question) => question.id !== questionId));
  };

  const saveQuiz = () => {
    actions.updateLesson(course.id, selectedModule.id, lesson.id, { quiz: quizForm });
  };

  return (
    <div className="space-y-8">
      <section className="quiz-editor-hero">
        <div className="quiz-editor-hero-copy">
          <div className="demo-chip demo-chip-primary mb-4">Lesson Quiz Workspace</div>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight">{lesson.title}</h1>
          <p className="quiz-editor-hero-text">
            Build a dedicated assessment flow for this lesson with multiple question formats, clearer grading notes,
            and enough room to author realistic quiz content.
          </p>
          <div className="quiz-editor-hero-actions">
            <button className="btn btn-surface" onClick={() => navigate(`/instructor/courses/${course.id}`)}>Back to Lesson</button>
            <button className="btn btn-primary" onClick={saveQuiz}>Save Quiz</button>
          </div>
        </div>
        <div className="quiz-editor-hero-stats">
          <div className="quiz-editor-stat">
            <span className="quiz-editor-stat-label">Course</span>
            <span className="quiz-editor-stat-value">{course.title}</span>
          </div>
          <div className="quiz-editor-stat">
            <span className="quiz-editor-stat-label">Module</span>
            <span className="quiz-editor-stat-value">{selectedModule.title}</span>
          </div>
          <div className="quiz-editor-stat">
            <span className="quiz-editor-stat-label">Questions</span>
            <span className="quiz-editor-stat-value">{quizForm.length}</span>
          </div>
        </div>
      </section>

      <div className="quiz-editor-shell">
        <aside className="demo-kpi p-6 quiz-editor-sidebar">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">{course.title}</div>
            <div className="text-2xl font-headline font-bold">{selectedModule.title}</div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="rounded-2xl bg-surface-container-low p-4">
              <div className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Lesson</div>
              <div className="font-bold">{lesson.title}</div>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-4">
              <div className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Question Count</div>
              <div className="font-bold">{quizForm.length}</div>
            </div>
          </div>
          <div className="space-y-3">
            <button className="btn btn-surface btn-w-full" onClick={() => setQuizForm((prev) => [...prev, createQuestionByType("single_choice")])}>Add Multiple Choice</button>
            <button className="btn btn-surface btn-w-full" onClick={() => setQuizForm((prev) => [...prev, createQuestionByType("true_false")])}>Add True / False</button>
            <button className="btn btn-surface btn-w-full" onClick={() => setQuizForm((prev) => [...prev, createQuestionByType("matching")])}>Add Matching</button>
            <button className="btn btn-surface btn-w-full" onClick={() => setQuizForm((prev) => [...prev, createQuestionByType("essay")])}>Add Essay</button>
          </div>
        </aside>

        <section className="space-y-6">
          {quizForm.map((question, questionIndex) => (
            <div key={question.id} className="demo-kpi p-8 quiz-question-card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <div>
                  <div className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Question {questionIndex + 1}</div>
                  <div className="quiz-question-head">
                    <input
                      className="demo-input quiz-question-title"
                      value={question.title || ""}
                      onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                    />
                    <span className="demo-chip demo-chip-primary quiz-type-chip">{question.type.replace("_", " ")}</span>
                  </div>
                </div>
                <button className="btn btn-surface btn-sm" onClick={() => removeQuestion(question.id)}>Delete</button>
              </div>

              <textarea
                className="demo-textarea mb-4"
                placeholder="Question prompt"
                value={question.prompt}
                onChange={(e) => updateQuestion(question.id, { prompt: e.target.value })}
              />

              {(question.type === "single_choice" || question.type === "true_false") ? (
                <>
                  <div className="quiz-options-grid mb-4">
                    {question.options.map((option, optionIndex) => (
                      <input
                        key={optionIndex}
                        className="demo-input quiz-option-input"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                        disabled={question.type === "true_false"}
                      />
                    ))}
                  </div>
                  <div className="quiz-answer-grid">
                    <select
                      className="demo-select"
                      value={question.answer}
                      onChange={(e) => updateQuestion(question.id, { answer: Number(e.target.value) })}
                    >
                      {question.options.map((_, optionIndex) => (
                        <option key={optionIndex} value={optionIndex}>Correct answer {optionIndex + 1}</option>
                      ))}
                    </select>
                    <input
                      className="demo-input"
                      placeholder="Explanation"
                      value={question.explanation || ""}
                      onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                    />
                  </div>
                </>
              ) : null}

              {question.type === "essay" ? (
                <div className="space-y-4">
                  <textarea
                    className="demo-textarea"
                    placeholder="Rubric / grading guide"
                    value={question.rubric || ""}
                    onChange={(e) => updateQuestion(question.id, { rubric: e.target.value })}
                  />
                  <textarea
                    className="demo-textarea"
                    placeholder="Sample answer"
                    value={question.sampleAnswer || ""}
                    onChange={(e) => updateQuestion(question.id, { sampleAnswer: e.target.value })}
                  />
                  <input
                    className="demo-input"
                    placeholder="Instructor note"
                    value={question.explanation || ""}
                    onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                  />
                </div>
              ) : null}

              {question.type === "matching" ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {question.pairs.map((pair, pairIndex) => (
                      <div key={pair.id} className="matching-pair-grid">
                        <input
                          className="demo-input"
                          placeholder={`Left item ${pairIndex + 1}`}
                          value={pair.left}
                          onChange={(e) => updatePair(question.id, pair.id, "left", e.target.value)}
                        />
                        <input
                          className="demo-input"
                          placeholder={`Right item ${pairIndex + 1}`}
                          value={pair.right}
                          onChange={(e) => updatePair(question.id, pair.id, "right", e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col md:flex-row gap-3">
                    <button className="btn btn-surface btn-sm" onClick={() => addPair(question.id)}>Add Pair</button>
                    <input
                      className="demo-input"
                      placeholder="Instructor note"
                      value={question.explanation || ""}
                      onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export function InstructorCompliancePage() {
  const { currentUser, state, ownedCourses, actions } = useInstructorData();
  const organization = currentUser.organizationProfile ?? {
    accountType: "organization",
    businessName: "",
    centerDecision: "",
    licenseNumber: "",
    issuingAuthority: "",
    representative: currentUser.name,
    notes: "",
    documents: [],
  };
  const [orgForm, setOrgForm] = useState({
    businessName: organization.businessName || "",
    centerDecision: organization.centerDecision || "",
    licenseNumber: organization.licenseNumber || "",
    issuingAuthority: organization.issuingAuthority || "",
    representative: organization.representative || currentUser.name,
    notes: organization.notes || "",
  });
  const [requestForm, setRequestForm] = useState({
    courseId: ownedCourses[0]?.id ?? "",
    organizationName: organization.businessName || "",
    complianceStandard: "TT 10/2026",
    archivePlan: "Store issued certificate IDs in the center ledger and retain the digital master book.",
    verificationMethod: "QR code + lookup ID",
  });
  const requests = ownedLegalRequests(state, currentUser.id);
  return (
    <div className="space-y-8">
      <SectionHeader chip="Legal Certificate Workflow" title="Prepare legal certificate review" description="Mock flow for organization verification, course compliance submission, and Verified by Skill Forge approval." />
      <div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-8">
        <section className="demo-kpi p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-headline font-black mb-2">Step 1: Verify legal entity status</h2>
            <p className="text-on-surface-variant">Instructor accounts requesting legal certificates must represent an organization or training center and upload state-issued proof.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input className="demo-input" placeholder="Organization / Business name" value={orgForm.businessName} onChange={(e) => setOrgForm((prev) => ({ ...prev, businessName: e.target.value }))} />
            <input className="demo-input" placeholder="Decision / establishment number" value={orgForm.centerDecision} onChange={(e) => setOrgForm((prev) => ({ ...prev, centerDecision: e.target.value }))} />
            <input className="demo-input" placeholder="Vocational license number" value={orgForm.licenseNumber} onChange={(e) => setOrgForm((prev) => ({ ...prev, licenseNumber: e.target.value }))} />
            <input className="demo-input" placeholder="Issuing authority" value={orgForm.issuingAuthority} onChange={(e) => setOrgForm((prev) => ({ ...prev, issuingAuthority: e.target.value }))} />
            <input className="demo-input" placeholder="Legal representative" value={orgForm.representative} onChange={(e) => setOrgForm((prev) => ({ ...prev, representative: e.target.value }))} />
            <input className="demo-input" placeholder="Upload note" value={orgForm.notes} onChange={(e) => setOrgForm((prev) => ({ ...prev, notes: e.target.value }))} />
          </div>
          <div className="mt-5 rounded-3xl bg-surface-container-low p-5">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant mb-2">Required scans</div>
            <div className="space-y-2 text-sm text-on-surface-variant">
              <div>1. Vocational education activity license / training center operating permit</div>
              <div>2. Establishment decision or organization registration proof</div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => actions.saveOrganizationProfile(orgForm)}>Save organization profile</button>
            <span className={`demo-chip ${organization.status === "approved" ? "demo-chip-success" : "demo-chip-primary"}`}>{organization.status === "approved" ? "Organization approved" : "Awaiting verification"}</span>
          </div>
        </section>
        <section className="demo-kpi p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-headline font-black mb-2">Step 2: Request legal certificate approval for a course</h2>
            <p className="text-on-surface-variant">Explain how the center will grade, archive, and verify digitally issued certificates before admins approve the badge.</p>
          </div>
          <div className="space-y-4">
            <select className="demo-select" value={requestForm.courseId} onChange={(e) => setRequestForm((prev) => ({ ...prev, courseId: e.target.value }))}>
              {ownedCourses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
            </select>
            <input className="demo-input" placeholder="Organization name for certificate" value={requestForm.organizationName} onChange={(e) => setRequestForm((prev) => ({ ...prev, organizationName: e.target.value }))} />
            <input className="demo-input" placeholder="Compliance standard" value={requestForm.complianceStandard} onChange={(e) => setRequestForm((prev) => ({ ...prev, complianceStandard: e.target.value }))} />
            <textarea className="demo-textarea" placeholder="Archive and master ledger plan" value={requestForm.archivePlan} onChange={(e) => setRequestForm((prev) => ({ ...prev, archivePlan: e.target.value }))} />
            <textarea className="demo-textarea" placeholder="Verification method (QR / ID / DB)" value={requestForm.verificationMethod} onChange={(e) => setRequestForm((prev) => ({ ...prev, verificationMethod: e.target.value }))} />
            <button className="btn btn-primary btn-w-full" onClick={() => actions.submitLegalCertificateRequest(requestForm)}>Submit legal certificate request</button>
          </div>
        </section>
      </div>
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-headline font-black tracking-tight">Request queue</h2>
          <p className="text-on-surface-variant mt-2">One approved course is preloaded for demo, plus one pending request waiting for admin review.</p>
        </div>
        <div className="grid gap-6">
          {requests.map((request) => (
            <div key={request.id} className="demo-kpi p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant mb-2">{request.organizationName}</div>
                  <h3 className="text-2xl font-headline font-black mb-2">{request.courseTitle}</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant mb-4">Archive plan: {request.archivePlan}</p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="rounded-2xl bg-surface-container-low p-4"><div className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2">Standard</div><div className="font-bold">{request.complianceStandard}</div></div>
                    <div className="rounded-2xl bg-surface-container-low p-4"><div className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2">Verification</div><div className="font-bold">{request.verificationMethod}</div></div>
                    <div className="rounded-2xl bg-surface-container-low p-4"><div className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2">Submitted</div><div className="font-bold">{dateLabel(request.submittedAt)}</div></div>
                  </div>
                </div>
                <div className="min-w-[260px] space-y-3">
                  <div className={`demo-chip ${request.status === "approved" ? "demo-chip-success" : request.status === "pending" ? "demo-chip-primary" : "demo-chip-muted"}`}>{request.status === "approved" ? "Verified by Skill Forge" : request.status === "pending" ? "Pending Admin Review" : "Rejected"}</div>
                  <div className="rounded-2xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
                    {request.status === "approved" ? `Approved by ${request.reviewedBy} on ${dateLabel(request.reviewedAt)}.` : "Waiting for admin approval and badge activation."}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function InstructorGradingPage() {
  const { state, ownedCourses, actions } = useInstructorData();
  const courseIds = ownedCourses.map((course) => course.id);
  const submissions = ownedGradingSubmissions(state, courseIds);
  const [selectedId, setSelectedId] = useState(submissions[0]?.id ?? "");
  const selected = submissions.find((submission) => submission.id === selectedId) ?? submissions[0] ?? null;
  const [gradeForm, setGradeForm] = useState(() => ({ score: selected?.score ?? "", instructorFeedback: selected?.instructorFeedback ?? "" }));

  useEffect(() => {
    setGradeForm({ score: selected?.score ?? "", instructorFeedback: selected?.instructorFeedback ?? "" });
  }, [selectedId, selected?.score, selected?.instructorFeedback]);

  const pendingManual = submissions.filter((submission) => submission.manualRequired && submission.status !== "graded");
  const manualDone = submissions.filter((submission) => submission.manualRequired && submission.status === "graded");

  return (
    <div className="space-y-8">
      <SectionHeader chip="Manual Grading" title="Grade instructor-reviewed submissions" description="Objective quizzes can be auto-graded, but essay and open-response lessons need explicit instructor review with course, lesson, learner, and status context." />
      <div className="demo-grid demo-grid-3">
        <MetricCard title="Pending Manual" value={String(pendingManual.length)} caption="Essay or open response submissions waiting for review" />
        <MetricCard title="Already Graded" value={String(manualDone.length)} caption="Instructor-reviewed submissions completed" />
        <MetricCard title="Auto Graded" value={String(submissions.filter((submission) => !submission.manualRequired).length)} caption="Objective submissions that did not require human review" />
      </div>
      <div className="grid xl:grid-cols-[0.95fr_1.05fr] gap-8">
        <section className="space-y-4">
          {submissions.map((submission) => (
            <button key={submission.id} className={`w-full text-left demo-kpi p-6 ${selected?.id === submission.id ? "border border-primary/20 bg-primary-fixed/20" : ""}`} onClick={() => setSelectedId(submission.id)}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant mb-2">{submission.courseTitle}</div>
                  <h3 className="text-xl font-headline font-black mb-2">{submission.lessonTitle}</h3>
                  <p className="text-sm text-on-surface-variant">{submission.studentName} submitted on {dateLabel(submission.submittedAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`demo-chip ${submission.status === "graded" ? "demo-chip-success" : submission.manualRequired ? "demo-chip-primary" : "demo-chip-muted"}`}>{submission.status === "graded" ? "Graded" : submission.manualRequired ? "Needs manual grading" : "Auto graded"}</span>
                  <span className="demo-chip demo-chip-muted">{submission.assessmentType}</span>
                </div>
              </div>
            </button>
          ))}
        </section>
        <aside className="demo-kpi p-8 h-fit sticky top-28">
          {selected ? (
            <>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant mb-2">{selected.courseTitle}</div>
              <h2 className="text-3xl font-headline font-black mb-2">{selected.lessonTitle}</h2>
              <p className="text-on-surface-variant mb-6">{selected.studentName} • {selected.assessmentType} • {selected.manualRequired ? "Manual grading required" : "Objective / auto-graded"}</p>
              <div className="rounded-3xl bg-surface-container-low p-5 text-sm leading-relaxed text-on-surface-variant mb-6">{selected.answerExcerpt}</div>
              <div className="space-y-4">
                <input className="demo-input" type="number" placeholder={`Score / ${selected.maxScore}`} value={gradeForm.score} onChange={(e) => setGradeForm((prev) => ({ ...prev, score: e.target.value }))} disabled={!selected.manualRequired} />
                <textarea className="demo-textarea" placeholder="Instructor feedback" value={gradeForm.instructorFeedback} onChange={(e) => setGradeForm((prev) => ({ ...prev, instructorFeedback: e.target.value }))} disabled={!selected.manualRequired} />
                {selected.manualRequired ? (
                  <button className="btn btn-primary btn-w-full" onClick={() => actions.gradeSubmission(selected.id, gradeForm)}>Save Grade</button>
                ) : (
                  <div className="rounded-2xl bg-surface-container-low p-4 text-sm text-on-surface-variant">This submission was objective and did not require manual grading.</div>
                )}
              </div>
            </>
          ) : (
            <div className="text-on-surface-variant">No submissions available.</div>
          )}
        </aside>
      </div>
    </div>
  );
}

export function InstructorStudentsPage() {
  const { ownedCourses, instructorOrders, state } = useInstructorData();
  const students = state.users.filter((user) =>
    user.role === "student" && user.enrolledCourseIds.some((courseId) => ownedCourses.some((course) => course.id === courseId)),
  );
  const totalLearners = ownedCourses.reduce((sum, course) => sum + (course.students || 0), 0);
  const totalOrders = ownedCourses.reduce((sum, course) => sum + Math.round((course.students || 0) * 0.38), 0);
  const totalRevenue = ownedCourses.reduce((sum, course) => sum + Math.round((course.price || 0) * (course.students || 0) * 0.72), 0);
  return (
    <div className="space-y-8">
      <SectionHeader chip="Student Analytics & Management" title="Monitor learners and revenue" description="Student counts, enrollments, certificates, and order-derived revenue are tied to instructor-owned courses." />
      <div className="demo-grid demo-grid-3">
        <MetricCard title="Students" value={String(totalLearners)} caption="Total learners across your published courses" />
        <MetricCard title="Orders" value={String(totalOrders)} caption="Estimated paid orders across your course catalog" />
        <MetricCard title="Revenue" value={currency(totalRevenue)} caption="Estimated gross revenue from your published courses" />
      </div>
      <div className="space-y-3">{ownedCourses.map((course) => <NavLink key={course.id} to={`/instructor/courses/${course.id}`} className="block demo-kpi p-6"><div className="font-bold mb-2">{course.title}</div><div className="text-sm text-on-surface-variant">Students: {course.students} • Rating: {course.rating}</div></NavLink>)}</div>
    </div>
  );
}

export function InstructorCouponsPage() {
  const { state, actions } = useInstructorData();
  const [form, setForm] = useState({ code: "", type: "percent", value: 15, description: "" });
  return (
    <div className="space-y-8">
      <SectionHeader chip="Promotions & Coupons" title="Manage conversion incentives" description="Coupon creation and status updates are persisted in the shared mock state and reused in student checkout." />
      <div className="demo-kpi p-8">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="demo-input" placeholder="Coupon code" value={form.code} onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))} />
          <select className="demo-select" value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}><option value="percent">percent</option><option value="fixed">fixed</option></select>
          <input className="demo-input" type="number" value={form.value} onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))} />
          <input className="demo-input" placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
        </div>
        <button className="btn btn-primary mt-5" onClick={() => { if (!form.code.trim()) return; actions.createCoupon(form); setForm({ code: "", type: "percent", value: 15, description: "" }); }}>Create Coupon</button>
      </div>
      <div className="space-y-3">{state.coupons.map((coupon) => <div key={coupon.code} className="demo-kpi p-6 flex justify-between items-center"><div><div className="font-bold">{coupon.code}</div><div className="text-sm text-on-surface-variant">{coupon.description}</div></div><div className="flex gap-2 items-center"><span className="demo-chip demo-chip-muted">{coupon.status}</span><button className="btn btn-surface btn-sm" onClick={() => actions.updateCoupon(coupon.code, { status: coupon.status === "Active" ? "Paused" : "Active" })}>{coupon.status === "Active" ? "Pause" : "Activate"}</button></div></div>)}</div>
    </div>
  );
}
