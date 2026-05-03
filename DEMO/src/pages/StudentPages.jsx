import { useMemo, useState } from "react";
import { NavLink, Navigate, useNavigate, useParams } from "react-router-dom";
import { CourseCard, MetricCard, SectionHeader, TimelineItem } from "../components/ui";
import { courseProgress, currency, dateLabel } from "../lib/utils";
import { useAppState } from "../state/AppState";

function certificateLabel(type) {
  return type === "verified" ? "Verified Legal" : "Standard";
}

function certificateBlurb(type) {
  return type === "verified"
    ? "Partner-backed credential with compliance reference, ledger verification, and formal issuance data."
    : "Clean completion certificate for portfolio sharing, milestone tracking, and learner recognition.";
}

function isLegalCertificateApproved(course) {
  return course.legalCertificate?.status === "approved";
}

function reviewStatus(currentUser, course, reviews) {
  const enrolled = currentUser.enrolledCourseIds.includes(course.id);
  const completed = courseProgress(currentUser, course) === 100;
  const alreadyReviewed = reviews.some((review) => review.userId === currentUser.id);
  return { enrolled, completed, alreadyReviewed, canReview: enrolled && completed && !alreadyReviewed };
}

function lessonMaterials(lesson) {
  return lesson?.materials ?? [];
}

function lessonQuiz(lesson) {
  return lesson?.quiz ?? [];
}

export function DashboardPage() {
  const { currentUser, courses, state } = useAppState();
  const enrolled = courses.filter((course) => currentUser.enrolledCourseIds.includes(course.id));
  const recommended = courses.filter((course) => !currentUser.enrolledCourseIds.includes(course.id)).slice(0, 2);
  const completedCertificates = courses
    .filter((course) => currentUser.certificates.includes(course.id))
    .slice(0, 2);
  const latestOrder = state.orders.find((order) => order.userId === currentUser.id);
  const focusCourse = enrolled[0];
  return (
    <>
      <section className="mb-12">
        <h1 className="text-h1 leading-tight font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Welcome back, <span className="text-primary-container">{currentUser.name.split(" ")[0]}.</span>
        </h1>
        <p className="text-lg text-on-surface-variant font-medium max-w-2xl">
          You&apos;ve completed <span className="text-primary font-bold">{focusCourse ? `${courseProgress(currentUser, focusCourse)}%` : "0%"}</span> of your weekly goal. Keep the momentum going!
        </p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-8 space-y-12">
          <div className="card-feature relative overflow-hidden">
            <div className="relative h-48 w-full md:w-64 rounded-2xl overflow-hidden shrink-0">
              <img className="w-full h-full object-cover" src={focusCourse?.image} alt={focusCourse?.title} />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <NavLink className="h-14 w-14 rounded-full bg-white text-primary-container flex items-center justify-center shadow-xl active:scale-90 transition-transform" to={focusCourse ? `/learning/${focusCourse.id}` : "/courses"}>
                  <span className="material-symbols-outlined icon icon-lg icon-filled">play_arrow</span>
                </NavLink>
              </div>
            </div>
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full font-bold text-xs tracking-wider mb-4 font-headline">CONTINUE LEARNING</span>
              <h2 className="text-3xl font-headline font-black tracking-tight mb-3">{focusCourse?.title ?? "Start your first course"}</h2>
              <p className="text-on-surface-variant leading-relaxed mb-6">{focusCourse?.subtitle ?? "Explore the course catalog and enroll into a learning path."}</p>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">Progress</span>
                <span className="text-sm font-black text-primary">{focusCourse ? `${courseProgress(currentUser, focusCourse)}%` : "0%"}</span>
              </div>
              <div className="h-2 w-full bg-primary-fixed rounded-full overflow-hidden mb-6">
                <div className="h-full bg-primary-container rounded-full" style={{ width: `${focusCourse ? courseProgress(currentUser, focusCourse) : 0}%` }} />
              </div>
              <div className="flex flex-wrap gap-3">
                <NavLink className="btn btn-primary btn-lg btn-pill" to={focusCourse ? `/learning/${focusCourse.id}` : "/courses"}>{focusCourse ? "Resume Course" : "Explore Courses"}</NavLink>
                <NavLink className="btn btn-surface btn-lg btn-pill" to="/progress">Manage Learning</NavLink>
              </div>
            </div>
          </div>
          <section>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-headline font-extrabold tracking-tight">My Courses</h2>
                <p className="text-on-surface-variant mt-2">Editorial-grade learning experiences already in your library.</p>
              </div>
              <NavLink to="/courses" className="text-sm font-bold text-primary">Browse More</NavLink>
            </div>
            <div className="grid gap-6">
              {enrolled.map((course) => (
                <div key={course.id} className="card-interactive">
                  <div className="w-full md:w-56 h-40 shrink-0 overflow-hidden rounded-xl">
                    <img className="w-full h-full object-cover" src={course.image} alt={course.title} />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">{course.level}</span>
                      <h3 className="text-2xl font-bold font-headline text-on-surface leading-tight mb-2">{course.title}</h3>
                      <p className="text-on-surface-variant font-body text-sm leading-relaxed mb-4">{course.instructorName} • {course.modules.length} Modules</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                        <span>Completed</span>
                        <span>{courseProgress(currentUser, course)}%</span>
                      </div>
                      <div className="h-2 w-full bg-primary-fixed rounded-full overflow-hidden">
                        <div className="h-full bg-primary-container rounded-full" style={{ width: `${courseProgress(currentUser, course)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-headline font-extrabold tracking-tight">Recommended For You</h2>
              <NavLink to="/courses" className="text-sm font-bold text-primary">View Catalog</NavLink>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recommended.map((course) => (
                <NavLink key={course.id} to={`/courses/${course.id}`} className="group bg-surface-container-lowest rounded-3xl overflow-hidden transition-all hover:-translate-y-2 shadow-md">
                  <div className="h-56 relative overflow-hidden">
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={course.image} alt={course.title} />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-label font-bold uppercase tracking-widest text-primary">{course.category}</div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">{course.instructorName}</span>
                    </div>
                    <h3 className="font-headline font-bold text-xl leading-tight mb-4 group-hover:text-primary-container transition-colors">{course.title}</h3>
                    <div className="row row-between mt-6">
                      <div className="flex items-center gap-1 text-tertiary">
                        <span className="material-symbols-outlined nav-icon icon-filled">star</span>
                        <span className="font-bold text-on-surface">{course.rating}</span>
                      </div>
                      <span className="text-2xl font-black text-on-surface">{currency(course.price)}</span>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </section>
          <section>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-headline font-extrabold tracking-tight">Certificates Ready</h2>
                <p className="text-on-surface-variant mt-2">Two completed mock courses are preloaded so you can compare the standard and verified certificate experiences.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedCertificates.map((course) => (
                <NavLink key={course.id} to={`/certificate/${course.id}`} className="group rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_20px_60px_rgba(84,38,10,0.06)] transition-all hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.25em] ${course.certificateType === "verified" ? "bg-amber-100 text-amber-800" : "bg-primary-fixed text-primary"}`}>
                        <span className="material-symbols-outlined icon text-base">{course.certificateType === "verified" ? "verified" : "workspace_premium"}</span>
                        {certificateLabel(course.certificateType)}
                      </div>
                      <h3 className="mt-4 text-2xl font-headline font-black leading-tight text-on-surface">{course.title}</h3>
                    </div>
                    <span className="rounded-2xl bg-surface-container-low px-3 py-2 text-sm font-bold text-on-surface-variant">100%</span>
                  </div>
                  <p className="min-h-[72px] text-sm leading-relaxed text-on-surface-variant">{certificateBlurb(course.certificateType)}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-5">
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Issued</div>
                      <div className="font-bold text-on-surface">{dateLabel(currentUser.quizResults?.[course.id]?.createdAt ?? new Date().toISOString())}</div>
                    </div>
                    <span className="btn btn-surface btn-pill min-w-0 group-hover:bg-primary-fixed/60">Open Certificate</span>
                  </div>
                </NavLink>
              ))}
            </div>
          </section>
        </div>
        <aside className="md:col-span-4 space-y-8">
          <div className="card p-8">
            <h3 className="font-headline text-2xl font-bold mb-6">Recent Activity</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-1">Latest Purchase</p>
                <p className="font-bold">{latestOrder ? dateLabel(latestOrder.createdAt) : "No recent orders"}</p>
              </div>
              <div>
                <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-1">Certificates</p>
                <p className="font-bold">{currentUser.certificates.length} unlocked</p>
              </div>
              <div>
                <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-1">Cart Ready</p>
                <p className="font-bold">{state.cart.length} item(s) waiting for checkout</p>
              </div>
            </div>
          </div>
          <div className="bg-primary-container rounded-xl p-8 flex flex-col justify-between text-on-primary shadow-lg overflow-hidden relative min-h-[260px]">
            <div className="relative z-10">
              <span className="material-symbols-outlined icon icon-lg mb-4">local_fire_department</span>
              <h3 className="font-headline text-2xl font-bold mb-2">Learning Streak</h3>
              <p className="text-primary-fixed/80 text-sm leading-relaxed">You are keeping consistent progress across learning, quizzes, and checkout flows.</p>
            </div>
            <div className="mt-8 relative z-10">
              <span className="text-5xl font-black italic">{Math.max(enrolled.length + 1, 4)} days</span>
              <p className="text-xs font-bold uppercase tracking-widest mt-2">Focused Momentum</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>
        </aside>
      </div>
    </>
  );
}

export function CatalogPage() {
  const { currentUser, courses, state, actions } = useAppState();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [maxPrice, setMaxPrice] = useState(250);
  const categories = ["All", ...new Set(courses.map((course) => course.category))];
  const levels = ["All", ...new Set(courses.map((course) => course.level))];
  const filtered = courses.filter((course) => {
    const text = `${course.title} ${course.subtitle}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (category === "All" || course.category === category) && (level === "All" || course.level === level) && course.price <= maxPrice;
  });
  return (
    <>
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <h1 className="font-headline font-extrabold text-5xl lg:text-6xl tracking-tight text-on-surface mb-4">
              Discover <span className="text-primary-container italic">Your Next</span> Mastery
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed">Explore thousands of editorial-grade courses curated by industry leaders.</p>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <span className="material-symbols-outlined icon text-outline">search</span>
          </div>
          <input className="w-full bg-surface-container-low border-none rounded-2xl py-6 pl-16 pr-8 text-xl focus:ring-2 focus:ring-primary-container transition-all placeholder:text-outline/60 shadow-md" placeholder="What do you want to learn today?" value={query} onChange={(e) => setQuery(e.target.value)} type="text" />
        </div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="hidden lg:block lg:col-span-3 space-y-10">
          <div>
            <h3 className="font-headline font-bold text-sm tracking-widest uppercase text-outline mb-6">Topic</h3>
            <div className="stack-sm">
              {categories.map((item) => (
                <label key={item} className="flex items-center gap-3 group cursor-pointer">
                  <input checked={category === item} className="w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-primary-container" onChange={() => setCategory(item)} type="checkbox" />
                  <span className="text-on-surface group-hover:text-primary transition-colors">{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-headline font-bold text-sm tracking-widest uppercase text-outline mb-6">Difficulty</h3>
            <div className="grid grid-cols-1 gap-2">
              {levels.map((item) => (
                <button key={item} className={level === item ? "text-left px-4 py-3 rounded-xl bg-primary-fixed text-on-primary-fixed-variant font-bold transition-all" : "text-left px-4 py-3 rounded-xl hover:bg-surface-container-low text-on-surface transition-all"} onClick={() => setLevel(item)}>{item}</button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-headline font-bold text-sm tracking-widest uppercase text-outline mb-6">Price Range</h3>
            <div className="stack-md">
              <input className="w-full accent-primary-container" max="250" min="0" onChange={(e) => setMaxPrice(Number(e.target.value))} type="range" value={maxPrice} />
              <div className="flex justify-between text-sm font-medium">
                <span>$0</span>
                <span>{currency(maxPrice)}</span>
              </div>
            </div>
          </div>
        </aside>
        <div className="lg:col-span-9">
          <div className="flex lg:hidden overflow-x-auto gap-3 pb-6 no-scrollbar">
            <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary-container text-white whitespace-nowrap">
              <span className="material-symbols-outlined icon">filter_list</span>
              <span>Filters</span>
            </button>
            <button className="px-5 py-3 rounded-full bg-surface-container-high text-on-surface whitespace-nowrap">{category}</button>
            <button className="px-5 py-3 rounded-full bg-surface-container-high text-on-surface whitespace-nowrap">{level}</button>
          </div>
          <div className="flex justify-between items-center mb-8">
            <p className="text-on-surface-variant font-medium">Showing <span className="text-on-surface font-bold">{filtered.length}</span> courses for your search</p>
            <div className="icon-text">
              <span className="text-sm font-bold text-outline uppercase tracking-wider">Sort by:</span>
              <select className="bg-transparent border-none text-on-surface font-bold focus:ring-0 cursor-pointer">
                <option>Most Popular</option>
                <option>Newest First</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((course) => (
              <div key={course.id} className="group flex h-full flex-col overflow-hidden rounded-3xl bg-surface-container-lowest shadow-md transition-all hover:-translate-y-2">
                <NavLink to={`/courses/${course.id}`}>
                  <div className="h-56 relative overflow-hidden">
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={course.image} alt={course.title} />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-label font-bold uppercase tracking-widest text-primary">{course.category}</div>
                    {isLegalCertificateApproved(course) ? <div className="absolute right-4 top-4 rounded-full bg-emerald-600/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg">{course.legalCertificate.badgeLabel}</div> : null}
                  </div>
                </NavLink>
                <div className="flex flex-1 flex-col p-8">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">{course.instructorName}</span>
                    <span className="rounded-full bg-surface-container-low px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">{course.level}</span>
                  </div>
                  <h3 className="min-h-[96px] font-headline text-[2rem] font-black leading-[1.05] tracking-tight transition-colors group-hover:text-primary-container">{course.title}</h3>
                  <p className="min-h-[78px] text-sm leading-relaxed text-on-surface-variant">{course.subtitle}</p>
                  <div className="mt-6 grid grid-cols-[1fr_auto] items-end gap-4">
                    <div className="space-y-2">
                      <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant">{isLegalCertificateApproved(course) ? "Compliance" : "Course Access"}</div>
                      {currentUser.enrolledCourseIds.includes(course.id) ? (
                        <div className="flex items-center gap-2 text-sm font-bold text-primary">
                          <span className="material-symbols-outlined icon text-base">school</span>
                          In your learning library
                        </div>
                      ) : isLegalCertificateApproved(course) ? (
                        <div className="text-sm text-on-surface-variant">Legal certificate badge approved under {course.legalCertificate.policy}.</div>
                      ) : (
                        <div className="text-sm text-on-surface-variant">Reviews and certificate unlock after enrollment.</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant">Price</div>
                      <span className="text-3xl font-black text-on-surface">{currency(course.price)}</span>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <NavLink className="btn btn-surface btn-w-full min-w-0 justify-center text-center" to={`/courses/${course.id}`}>Details</NavLink>
                    {currentUser.enrolledCourseIds.includes(course.id) ? <NavLink className="btn btn-primary btn-w-full min-w-0 justify-center text-center" to={`/learning/${course.id}`}>Learn</NavLink> : <button className="btn btn-primary btn-w-full min-w-0 justify-center text-center" onClick={() => actions.addToCart(course.id)}>{state.cart.includes(course.id) ? "In Cart" : "Add to Cart"}</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function CourseDetailPage() {
  const { courseId } = useParams();
  const { currentUser, courses, state, actions } = useAppState();
  const [activeTab, setActiveTab] = useState("overview");
  const course = courses.find((item) => item.id === courseId);
  if (!course) return <Navigate to="/courses" replace />;
  const reviews = state.reviews[course.id] ?? [];
  const enrolled = currentUser.enrolledCourseIds.includes(course.id);
  const progress = courseProgress(currentUser, course);
  const certificateUnlocked = currentUser.certificates.includes(course.id);
  const reviewMeta = reviewStatus(currentUser, course, reviews);
  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const totalResources = course.modules.reduce((sum, module) => sum + module.lessons.reduce((lessonSum, lesson) => lessonSum + lessonMaterials(lesson).length, 0), 0);
  const tabItems = [
    ["overview", "Overview"],
    ["curriculum", "Curriculum"],
    ["instructor", "Instructor"],
    ...(enrolled ? [["reviews", "Reviews"]] : []),
  ];
  return (
    <>
      <section className="relative bg-on-background text-white pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img className="w-full h-full object-cover" src={course.image} alt={course.title} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-on-background via-on-background/80 to-transparent" />
        <div className="relative sf-container px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="stack">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/20 border border-primary-container/30 rounded-full">
              <span className="material-symbols-outlined icon text-primary-container icon-filled">star</span>
              <span className="text-xs font-bold tracking-widest uppercase text-primary-fixed">Bestseller</span>
            </div>
            <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 ${course.certificateType === "verified" ? "border-amber-400/30 bg-amber-500/15" : "border-white/15 bg-white/10"}`}>
              <span className="material-symbols-outlined icon icon-filled text-primary-fixed">{course.certificateType === "verified" ? "verified" : "workspace_premium"}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-white">{certificateLabel(course.certificateType)} Certificate</span>
            </div>
            {isLegalCertificateApproved(course) ? (
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/15 px-3 py-1">
                <span className="material-symbols-outlined icon text-emerald-100">verified_user</span>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-50">{course.legalCertificate.badgeLabel}</span>
              </div>
            ) : null}
            <h1 className="text-5xl md:text-6xl font-headline font-black leading-[1.1] tracking-tight">
              {course.title} <span className="text-primary-container">{course.level}</span>
            </h1>
            <p className="text-lg text-surface-variant max-w-xl font-body leading-relaxed">{course.subtitle}</p>
            <div className="flex flex-wrap items-center gap-6 pt-4">
              {enrolled ? <NavLink className="sf-gradient px-8 py-4 rounded-full font-headline font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20" to={`/learning/${course.id}`}>Open Learning</NavLink> : <button className="sf-gradient px-8 py-4 rounded-full font-headline font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20" onClick={() => actions.addToCart(course.id)}>{state.cart.includes(course.id) ? "Already In Cart" : `Enroll Now — ${currency(course.price)}`}</button>}
              {certificateUnlocked ? (
                <NavLink className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-4 font-headline font-bold backdrop-blur-md transition-all hover:bg-white/20" to={`/certificate/${course.id}`}>
                  <span className="material-symbols-outlined icon">workspace_premium</span>
                  Open Certificate
                </NavLink>
              ) : enrolled ? (
                <NavLink className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-4 font-headline font-bold backdrop-blur-md transition-all hover:bg-white/20" to={`/reviews/${course.id}`}>
                  <span className="material-symbols-outlined icon">reviews</span>
                  Learner Reviews
                </NavLink>
              ) : null}
            </div>
            <div className="navbar-logo pt-4 text-sm font-medium text-surface-variant">
              <div className="icon-text"><span className="material-symbols-outlined icon text-primary-container">groups</span><span>{course.students} Students</span></div>
              <div className="icon-text"><span className="material-symbols-outlined icon text-primary-container">schedule</span><span>{course.duration}</span></div>
              <div className="icon-text"><span className="material-symbols-outlined icon text-primary-container">workspace_premium</span><span>{certificateLabel(course.certificateType)} certificate</span></div>
              {isLegalCertificateApproved(course) ? <div className="icon-text"><span className="material-symbols-outlined icon text-emerald-200">fact_check</span><span>{course.legalCertificate.referenceId}</span></div> : null}
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="relative z-10 aspect-video rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={course.image} alt={course.title} />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center text-primary-container shadow-2xl">
                  <span className="material-symbols-outlined icon icon-lg icon-filled">play_arrow</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>
      <section className="sf-container px-6 -mt-10 relative z-20">
        <div className="card-feature">
          <div className="flex overflow-x-auto no-scrollbar border-b border-surface-variant mb-12">
            {tabItems.map(([value, label]) => (
              <button
                key={value}
                className={activeTab === value ? "px-8 py-4 text-primary font-headline font-bold border-b-4 border-primary-container whitespace-nowrap" : "px-8 py-4 text-outline font-headline font-medium whitespace-nowrap"}
                onClick={() => setActiveTab(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              {activeTab === "overview" ? (
                <div className="stack">
                  <h2 className="text-3xl font-headline font-extrabold tracking-tight">About this Course</h2>
                  <p className="text-on-surface-variant font-body leading-relaxed text-lg">{course.subtitle} The student detail view now separates overview, curriculum, instructor context, and reviews into dedicated tabs so each section has enough space.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {course.skills.map((skill) => (
                      <div key={skill} className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl">
                        <span className="material-symbols-outlined icon text-primary-container">check_circle</span>
                        <span className="text-sm font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {activeTab === "curriculum" ? (
                <div className="stack">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <h2 className="text-3xl font-headline font-extrabold tracking-tight">Curriculum</h2>
                    <span className="text-sm font-bold text-primary">{course.modules.length} Sections • {totalLessons} Lessons</span>
                  </div>
                  <div className="stack-sm">
                    {course.modules.map((module, index) => (
                      <div key={module.id} className="bg-surface-container-low rounded-2xl overflow-hidden border border-primary-container/20">
                        <div className="p-5 row row-between bg-primary-container/5">
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 flex items-center justify-center bg-primary-container rounded-xl font-headline font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
                            <div>
                              <h3 className="font-headline font-bold">{module.title}</h3>
                              <p className="text-xs text-primary">{module.lessons.length} lessons</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest text-primary">{module.lessons.reduce((sum, lesson) => sum + lessonMaterials(lesson).length, 0)} files</span>
                        </div>
                        <div className="p-4 space-y-3">
                          {module.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex flex-col gap-4 rounded-2xl bg-white p-4 md:flex-row md:items-center md:justify-between">
                              <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined icon text-primary-container icon-filled">play_circle</span>
                                <div>
                                  <div className="font-bold">{lesson.title}</div>
                                  <div className="text-sm text-on-surface-variant">{lesson.duration} • {lessonMaterials(lesson).length} resources • {lessonQuiz(lesson).length} quiz item(s)</div>
                                </div>
                              </div>
                              {enrolled ? <NavLink className="btn btn-primary" to={`/learning/${course.id}/${lesson.id}`}>Learn</NavLink> : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {activeTab === "instructor" ? (
                <div className="stack">
                  <h2 className="text-3xl font-headline font-extrabold tracking-tight">Instructor</h2>
                  <div className="card p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                      <div className="max-w-2xl">
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-3">Course Mentor</p>
                        <h3 className="text-3xl font-headline font-black mb-2">{course.instructorName}</h3>
                        <p className="text-on-surface-variant leading-relaxed">Teaching across {course.category.toLowerCase()} with a practical focus on self-paced learners, production details, and real course workflows.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 min-w-[220px]">
                        <div className="bg-surface-container-low rounded-2xl p-4">
                          <div className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-2">Level</div>
                          <div className="text-xl font-black">{course.level}</div>
                        </div>
                        <div className="bg-surface-container-low rounded-2xl p-4">
                          <div className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-2">Learners</div>
                          <div className="text-xl font-black">{course.students}+</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {activeTab === "reviews" ? (
                <div className="stack">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h2 className="text-3xl font-headline font-extrabold tracking-tight">Reviews</h2>
                      <p className="text-on-surface-variant mt-2">{reviews.length} learner review(s) from enrolled students who finished the course.</p>
                    </div>
                    <NavLink className="btn btn-primary" to={`/reviews/${course.id}`}>{reviewMeta.canReview ? "Write a Review" : "Open Reviews"}</NavLink>
                  </div>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="card p-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-3">
                          <div>
                            <div className="font-bold">{review.author}</div>
                            <div className="text-sm text-on-surface-variant">{dateLabel(review.createdAt)}</div>
                          </div>
                          <div className="text-primary font-bold">{Array.from({ length: review.rating }, () => "★").join("")}</div>
                        </div>
                        <p className="text-on-surface-variant">{review.content}</p>
                      </div>
                    ))}
                    {!reviews.length ? <div className="card p-8 text-on-surface-variant">Reviews appear after enrolled learners complete the course and submit feedback.</div> : null}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="stack-lg">
              <div className="p-8 bg-surface-container-high rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="material-symbols-outlined icon text-primary-container/10 icon-hero icon-filled">auto_awesome</span>
                </div>
                <div className="relative z-10 space-y-4">
                  {enrolled ? (
                    <>
                      <div className="text-5xl font-headline font-black text-primary">{course.rating}</div>
                      <div className="flex text-tertiary-container">{Array.from({ length: 5 }).map((_, index) => <span key={index} className="material-symbols-outlined icon icon-filled">{index < Math.round(course.rating) ? "star" : "star_half"}</span>)}</div>
                      <p className="text-sm font-headline font-bold uppercase tracking-widest text-outline">Learner Snapshot</p>
                      <p className="text-on-surface-variant leading-relaxed">Trusted by {course.students}+ learners across {totalLessons} lessons and {totalResources} attached resources.</p>
                    </>
                  ) : (
                    <>
                      <div className="text-5xl font-headline font-black text-primary">{currency(course.price)}</div>
                      <p className="text-sm font-headline font-bold uppercase tracking-widest text-outline">{isLegalCertificateApproved(course) ? "Verified by Skill Forge" : "Enrollment Access"}</p>
                      <p className="text-on-surface-variant leading-relaxed">{isLegalCertificateApproved(course) ? `Legal badge approved under ${course.legalCertificate.policy}. Learners will receive a traceable certificate flow after completion.` : "Reviews stay hidden until purchase. Certificate eligibility begins after you finish the full course and pass the assessment."}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="card p-8">
                <h3 className="font-headline text-2xl font-bold mb-4">Student Access</h3>
                <p className="text-on-surface-variant mb-6">{enrolled ? `Progress is synced across learning, quiz, review, and certificate flows. You are currently at ${progress}% completion.` : isLegalCertificateApproved(course) ? "This course already passed legal review. Enroll to unlock the accredited learning path, assessments, and verified certificate issuance flow." : "Enroll first to unlock learning workspace, completion progress, certificates, and eligible review submission."}</p>
                <div className="space-y-3">
                  {enrolled ? <NavLink className="btn btn-primary btn-w-full" to={`/learning/${course.id}`}>Open Learning</NavLink> : <button className="btn btn-primary btn-w-full" onClick={() => actions.addToCart(course.id)}>{state.cart.includes(course.id) ? "Already In Cart" : `Enroll Now — ${currency(course.price)}`}</button>}
                  <button className="btn btn-surface btn-w-full" onClick={() => setActiveTab("curriculum")}>Browse Curriculum</button>
                  {certificateUnlocked ? <NavLink className="btn btn-surface btn-w-full" to={`/certificate/${course.id}`}>Open Certificate</NavLink> : null}
                </div>
              </div>
              <div className="card p-8">
                <h3 className="font-headline text-2xl font-bold mb-4">Certificate Path</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Modules</span><span className="font-bold">{course.modules.length}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Resources</span><span className="font-bold">{totalResources}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Certificate</span><span className="font-bold">{certificateLabel(course.certificateType)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Legal Review</span><span className="font-bold capitalize">{course.legalCertificate?.status ?? "not requested"}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Review Access</span><span className="font-bold">{reviewMeta.canReview ? "Open" : reviewMeta.alreadyReviewed ? "Submitted" : reviewMeta.completed ? "Eligible" : "Locked"}</span></div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-on-surface-variant">{isLegalCertificateApproved(course) ? `${certificateBlurb(course.certificateType)} Approved reference: ${course.legalCertificate.referenceId}.` : certificateBlurb(course.certificateType)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function LearningPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { currentUser, courses, state, actions, helpers } = useAppState();
  const [content, setContent] = useState("");
  const course = courses.find((item) => item.id === courseId);
  if (!course) return <Navigate to="/courses" replace />;
  if (!currentUser.enrolledCourseIds.includes(course.id)) return <Navigate to={`/courses/${course.id}`} replace />;
  const lessons = helpers.flattenLessons(course);
  const activeLesson = lessonId ? lessons.find((item) => item.id === lessonId) ?? lessons[0] : lessons[0];
  const activeLessonMaterials = lessonMaterials(activeLesson);
  const done = currentUser.completedLessons?.[course.id] ?? [];
  const thread = state.discussions[`${course.id}:${activeLesson.id}`] ?? [];
  const completed = done.includes(activeLesson.id);
  return (
    <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-8">
      <section className="space-y-8">
        <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-[0_30px_80px_rgba(84,38,10,0.12)]">
          <img className="absolute inset-0 w-full h-full object-cover" src={course.image} alt={activeLesson.title} />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white/90 text-primary-container shadow-2xl transition-transform hover:scale-105 active:scale-95">
              <span className="material-symbols-outlined icon icon-xl icon-filled">play_arrow</span>
            </button>
          </div>
          <div className="absolute inset-0 bg-black/45 flex flex-col justify-between p-8 text-white">
            <div className="flex justify-between"><span className="demo-chip bg-white/15 text-white">{activeLesson.moduleTitle}</span><span className="text-sm font-bold">{activeLesson.duration}</span></div>
            <div><h1 className="text-4xl font-headline font-black mb-3">{activeLesson.title}</h1><p className="text-white/80 max-w-2xl">This lesson page keeps the video shell, instructor resources, quiz access, and discussion in one continuous workspace for self-paced learning.</p></div>
          </div>
        </div>
        <div className="demo-kpi p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-headline font-black">Lesson Overview</h2>
              <p className="text-on-surface-variant mt-2">{activeLesson.moduleTitle} • {activeLesson.duration} • {activeLessonMaterials.length} attached resources.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <NavLink className="btn btn-primary" to={`/quiz/${course.id}`}>Take Quiz</NavLink>
              <button className="btn btn-primary" onClick={() => actions.markLessonComplete(course.id, activeLesson.id)}>{completed ? "Completed" : "Mark Complete"}</button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-surface-container-low p-5">
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-2">Course Progress</div>
              <div className="text-3xl font-black text-primary">{courseProgress(currentUser, course)}%</div>
              <div className="text-sm text-on-surface-variant mt-2">{done.length} of {lessons.length} lessons done</div>
            </div>
            <div className="rounded-3xl bg-surface-container-low p-5">
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-2">Lesson Files</div>
              <div className="text-3xl font-black text-primary">{activeLessonMaterials.length}</div>
              <div className="text-sm text-on-surface-variant mt-2">PDF, docs, and lesson assets</div>
            </div>
            <div className="rounded-3xl bg-surface-container-low p-5">
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-2">Discussion Posts</div>
              <div className="text-3xl font-black text-primary">{thread.length}</div>
              <div className="text-sm text-on-surface-variant mt-2">Contextual thread for this lesson</div>
            </div>
          </div>
        </div>
        <div className="demo-kpi p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-headline font-black">Materials</h2>
              <p className="text-on-surface-variant mt-2">Resources uploaded by the instructor stay visible directly in the lesson page.</p>
            </div>
            <span className="demo-chip demo-chip-muted">{activeLessonMaterials.length} file(s)</span>
          </div>
          <div className="space-y-4">
            {activeLessonMaterials.map((material) => (
              <div key={material.id} className="flex flex-col gap-4 rounded-3xl bg-surface-container-low p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined icon icon-filled">{material.type === "PDF" ? "picture_as_pdf" : "description"}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{material.title}</h3>
                    <p className="text-sm text-on-surface-variant">{material.type} • {material.size}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="btn btn-surface">Preview</button>
                  <button className="btn btn-primary">Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="demo-kpi p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-headline font-black">Discussion</h2>
              <p className="text-on-surface-variant mt-2">Instead of a note box, the lesson now drops straight into the active discussion thread below the content.</p>
            </div>
            <span className="demo-chip demo-chip-muted">{thread.length} post(s)</span>
          </div>
          <div className="space-y-4 mb-6">
            {thread.map((post) => (
              <div key={post.id} className="rounded-3xl bg-surface-container-low p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-3">
                  <div>
                    <div className="font-bold">{post.author}</div>
                    <div className="text-sm text-on-surface-variant capitalize">{post.role}</div>
                  </div>
                  <div className="text-sm text-on-surface-variant">{dateLabel(post.createdAt)}</div>
                </div>
                <p className="text-on-surface-variant">{post.content}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl bg-surface-container-low p-5">
            <h3 className="text-xl font-headline font-black mb-4">Ask a Question</h3>
            <textarea className="demo-textarea" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Post a question about this lesson..." />
            <button className="btn btn-primary mt-4" onClick={() => { if (!content.trim()) return; actions.addDiscussion(course.id, activeLesson.id, content); setContent(""); }}>Publish Comment</button>
          </div>
        </div>
      </section>
      <aside className="demo-kpi p-8 h-fit sticky top-28">
        <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-headline font-black">Course Content</h3><NavLink to={`/courses/${course.id}`} className="demo-link">Details</NavLink></div>
        <div className="space-y-6">
          {course.modules.map((module) => (
            <div key={module.id}>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-3">{module.title}</p>
              <div className="space-y-2">
                {module.lessons.map((lesson) => <button key={lesson.id} className={`w-full text-left rounded-2xl px-4 py-3 transition ${lesson.id === activeLesson.id ? "bg-primary-fixed text-primary" : "bg-surface-container-low hover:bg-surface-container"}`} onClick={() => navigate(`/learning/${course.id}/${lesson.id}`)}><div className="flex justify-between items-center gap-4"><span className="font-semibold">{lesson.title}</span><span className="text-xs font-bold">{done.includes(lesson.id) ? "Done" : lesson.duration}</span></div></button>)}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export function ProgressPage() {
  const { currentUser, courses } = useAppState();
  const enrolled = courses.filter((course) => currentUser.enrolledCourseIds.includes(course.id));
  const inProgress = enrolled.filter((course) => courseProgress(currentUser, course) > 0 && courseProgress(currentUser, course) < 100);
  const completed = enrolled.filter((course) => courseProgress(currentUser, course) >= 100);
  const notStarted = enrolled.filter((course) => courseProgress(currentUser, course) === 0);
  return (
    <>
      <section className="mb-12">
        <div className="max-w-3xl">
          <span className="font-headline font-bold text-primary tracking-widest uppercase text-sm mb-4 block">Learning Management</span>
          <h1 className="text-5xl font-black text-on-surface tracking-tight leading-tight mb-6">Track What You&apos;re <br /><span className="text-primary-container">Learning Next</span></h1>
          <p className="text-xl text-on-surface-variant leading-relaxed">This page now focuses on self-paced course ownership: what is active, what is finished, and where the learner should continue or leave a review.</p>
        </div>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="card p-8">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-3">In Progress</div>
          <div className="text-5xl font-black text-primary mb-3">{inProgress.length}</div>
          <p className="text-on-surface-variant">Courses already started and ready to resume from the learner workspace.</p>
        </div>
        <div className="card p-8">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-3">Completed</div>
          <div className="text-5xl font-black text-primary mb-3">{completed.length}</div>
          <p className="text-on-surface-variant">Courses finished end-to-end and ready for a star rating and written review.</p>
        </div>
        <div className="card p-8">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-3">Not Started</div>
          <div className="text-5xl font-black text-primary mb-3">{notStarted.length}</div>
          <p className="text-on-surface-variant">Purchased courses still waiting for the learner to begin.</p>
        </div>
      </div>
      <div className="space-y-12">
        <section>
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-headline text-3xl font-bold tracking-tight">Continue Learning</h2>
              <p className="text-on-surface-variant mt-2">Courses with partial progress stay here so the learner can jump right back into the next lesson.</p>
            </div>
            <span className="text-primary font-bold text-sm">{inProgress.length} active course(s)</span>
          </div>
          <div className="grid gap-6">
            {inProgress.map((course) => (
              <div key={course.id} className="card-feature">
                <div className="w-full md:w-64 h-44 rounded-2xl overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" src={course.image} alt={course.title} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="demo-chip demo-chip-muted">{course.category}</span>
                    <span className="demo-chip demo-chip-muted">{course.level}</span>
                  </div>
                  <h3 className="text-2xl font-headline font-black mb-2">{course.title}</h3>
                  <p className="text-on-surface-variant mb-5">{course.subtitle}</p>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                    <span>Progress</span>
                    <span>{courseProgress(currentUser, course)}%</span>
                  </div>
                  <div className="h-2 w-full bg-primary-fixed rounded-full overflow-hidden mb-5">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: `${courseProgress(currentUser, course)}%` }} />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <NavLink className="btn btn-primary" to={`/learning/${course.id}`}>Resume</NavLink>
                    <NavLink className="btn btn-surface" to={`/courses/${course.id}`}>Course Tabs</NavLink>
                  </div>
                </div>
              </div>
            ))}
            {!inProgress.length ? <div className="card p-8 text-on-surface-variant">No active courses right now.</div> : null}
          </div>
        </section>
        <section>
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-headline text-3xl font-bold tracking-tight">Completed Courses</h2>
              <p className="text-on-surface-variant mt-2">Finished courses can jump straight into the review page to leave stars and written feedback.</p>
            </div>
            <span className="text-primary font-bold text-sm">{completed.length} completed course(s)</span>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {completed.map((course) => (
              <div key={course.id} className="card p-8">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined icon text-primary">workspace_premium</span>
                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Completed</span>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${course.certificateType === "verified" ? "bg-amber-100 text-amber-800" : "bg-primary-fixed text-primary"}`}>{certificateLabel(course.certificateType)}</span>
                </div>
                <h3 className="text-2xl font-headline font-black mb-2">{course.title}</h3>
                <p className="text-on-surface-variant mb-6">{course.subtitle}</p>
                <div className="flex flex-wrap gap-3">
                  <NavLink className="btn btn-primary" to={`/certificate/${course.id}`}>Open Certificate</NavLink>
                  <NavLink className="btn btn-primary" to={`/reviews/${course.id}`}>Review Course</NavLink>
                  <NavLink className="btn btn-surface" to={`/courses/${course.id}`}>View Course</NavLink>
                </div>
              </div>
            ))}
            {!completed.length ? <div className="card p-8 text-on-surface-variant lg:col-span-2">No fully completed courses yet.</div> : null}
          </div>
        </section>
        <section>
          <div className="mb-8">
            <h2 className="font-headline text-3xl font-bold tracking-tight">Not Started Yet</h2>
            <p className="text-on-surface-variant mt-2">Purchased courses with zero completed lessons still need an entry point.</p>
          </div>
          <div className="grid gap-6">
            {notStarted.map((course) => (
              <div key={course.id} className="card p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-headline font-black mb-2">{course.title}</h3>
                  <p className="text-on-surface-variant">{course.subtitle}</p>
                </div>
                <div className="flex gap-3">
                  <NavLink className="btn btn-primary" to={`/learning/${course.id}`}>Start Course</NavLink>
                  <NavLink className="btn btn-surface" to={`/courses/${course.id}`}>View Details</NavLink>
                </div>
              </div>
            ))}
            {!notStarted.length ? <div className="card p-8 text-on-surface-variant">Every enrolled course has already been started.</div> : null}
          </div>
        </section>
      </div>
    </>
  );
}

export function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser, courses, actions } = useAppState();
  const course = courses.find((item) => item.id === courseId);
  const [answers, setAnswers] = useState({});
  if (!course) return <Navigate to="/courses" replace />;
  if (!currentUser.enrolledCourseIds.includes(course.id)) return <Navigate to={`/courses/${course.id}`} replace />;
  function submit(event) {
    event.preventDefault();
    const result = actions.submitQuiz(course.id, course.quiz.map((_, i) => answers[i] ?? -1));
    if (result) navigate(`/results/${course.id}`);
  }
  return (
    <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8">
      <form className="space-y-8" onSubmit={submit}>
        <SectionHeader chip="Quiz System" title={`${course.title} Assessment`} description="Question state, answers, scoring, and persistence are all wired." />
        {course.quiz.map((question, index) => (
          <section key={question.id} className="demo-kpi p-8">
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-3">Question {index + 1}</div>
            <h2 className="text-2xl font-headline font-black mb-6">{question.prompt}</h2>
            <div className="space-y-3">{question.options.map((option, optionIndex) => <label key={option} className={`block rounded-2xl border p-4 cursor-pointer transition ${String(answers[index]) === String(optionIndex) ? "border-primary bg-primary-fixed/50" : "border-black/5 bg-white hover:bg-surface-container-low"}`}><input type="radio" className="mr-3" name={`q-${index}`} value={optionIndex} checked={String(answers[index]) === String(optionIndex)} onChange={(e) => setAnswers((prev) => ({ ...prev, [index]: e.target.value }))} />{option}</label>)}</div>
          </section>
        ))}
        <button className="btn btn-primary btn-lg" type="submit">Submit Quiz</button>
      </form>
      <aside className="demo-kpi p-8 h-fit sticky top-28">
        <h3 className="text-2xl font-headline font-black mb-5">Question Map</h3>
        <div className="grid grid-cols-4 gap-3 mb-6">{course.quiz.map((question, index) => <div key={question.id} className={`h-12 rounded-full flex items-center justify-center font-bold ${answers[index] !== undefined ? "bg-primary-container text-white" : "bg-surface-container-high text-on-surface-variant"}`}>{index + 1}</div>)}</div>
        <p className="text-on-surface-variant text-sm mb-5">Passing score is 70%. Certificates unlock automatically after a passing attempt.</p>
      </aside>
    </div>
  );
}

export function ResultsPage() {
  const { courseId } = useParams();
  const { currentUser, courses } = useAppState();
  const course = courses.find((item) => item.id === courseId);
  const result = currentUser.quizResults?.[courseId];
  if (!course || !result) return <Navigate to={`/quiz/${courseId}`} replace />;
  return (
    <div className="space-y-8">
      <SectionHeader chip="Results & Feedback" title="Assessment complete" description="Every answer is scored against the mock quiz definition, with immediate explanation feedback." />
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8">
        <div className="demo-kpi p-8 text-center">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-4">Score</div>
          <div className="text-7xl font-black text-primary mb-3">{result.percent}%</div>
          <p className="text-on-surface-variant mb-5">{result.score} correct out of {result.total}</p>
          {result.percent >= 70 ? <NavLink className="btn btn-primary btn-w-full" to={`/certificate/${course.id}`}>Open Certificate</NavLink> : <NavLink className="btn btn-surface btn-w-full" to={`/quiz/${course.id}`}>Retry Quiz</NavLink>}
        </div>
        <div className="space-y-4">{course.quiz.map((question, index) => { const selected = Number(result.answers[index]); const correct = selected === question.answer; return <div key={question.id} className="demo-kpi p-6"><div className="flex justify-between items-center mb-3"><span className={`demo-chip ${correct ? "demo-chip-success" : "demo-chip-primary"}`}>{correct ? "Correct" : "Needs Review"}</span><span className="text-sm text-on-surface-variant">Question {index + 1}</span></div><h3 className="text-xl font-headline font-black mb-2">{question.prompt}</h3><p className="text-sm text-on-surface-variant mb-1">Your answer: {question.options[selected] ?? "No answer"}</p><p className="text-sm text-on-surface-variant mb-3">Correct answer: {question.options[question.answer]}</p><p className="text-sm font-medium">{question.explanation}</p></div>; })}</div>
      </div>
    </div>
  );
}

export function CertificatePage() {
  const { courseId } = useParams();
  const { currentUser, courses } = useAppState();
  const course = courses.find((item) => item.id === courseId);
  if (!course || !currentUser.certificates.includes(courseId)) return <Navigate to={`/results/${courseId}`} replace />;
  const issuedAt = currentUser.quizResults?.[course.id]?.createdAt ?? new Date().toISOString();
  const isVerified = course.certificateType === "verified";
  return (
    <div className="space-y-8">
      <SectionHeader chip="Certification" title={isVerified ? "Verified credential ready" : "Certificate ready"} description="Standard and verified certificate variants are both supported with distinct mock layouts and issuance metadata." />
      {isVerified ? (
        <div className="overflow-hidden rounded-[40px] border-[18px] border-double border-amber-400/80 bg-[#faf7f0] p-6 shadow-[0_32px_100px_rgba(84,38,10,0.12)] md:p-10">
          <div className="rounded-[28px] border border-slate-300/80 bg-white/80 p-8 text-center md:p-12">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="text-left">
                <div className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">SkillForge Executive Authority</div>
                <h2 className="mt-3 font-serif text-4xl font-bold uppercase tracking-[0.18em] text-slate-900">Verified Legal Credential</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">Issued in partnership with the Global Design Licensure Board with mock compliance, ledger verification, and reference tracking.</p>
              </div>
              <div className="rounded-3xl border border-amber-300 bg-amber-50 px-5 py-4 text-left">
                <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Reference ID</div>
                <div className="mt-2 font-mono text-sm font-bold text-slate-900">REF-{course.id.toUpperCase()}-2026</div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">Compliant: TT 10/2026</div>
              </div>
            </div>
            <div className="mb-10 flex justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-double border-amber-500 bg-amber-50 text-amber-700">
                <span className="material-symbols-outlined icon text-5xl">verified</span>
              </div>
            </div>
            <p className="font-serif text-xl text-slate-600">This official document certifies that</p>
            <div className="mt-6 font-serif text-5xl font-bold text-slate-950 md:text-6xl">{currentUser.name}</div>
            <p className="mx-auto mt-8 max-w-3xl font-serif text-xl leading-relaxed text-slate-700">has successfully completed all statutory requirements for <span className="font-bold italic">{course.title}</span> and is eligible for partner-backed verification in the SkillForge demo environment.</p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white px-5 py-6">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Document Hash</div>
                <div className="mt-3 font-mono text-sm font-bold text-slate-900">SKF-{course.id.toUpperCase()}-8829</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white px-5 py-6">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Verification</div>
                <div className="mt-3 text-sm font-bold text-slate-900">Ledger + institutional signature</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white px-5 py-6">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Issued</div>
                <div className="mt-3 text-sm font-bold text-slate-900">{dateLabel(issuedAt)}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[40px] bg-gradient-to-br from-[#fff7f0] via-white to-[#fff4e8] p-6 shadow-[0_32px_100px_rgba(84,38,10,0.12)] md:p-10">
          <div className="rounded-[28px] border-[4px] border-primary-fixed/40 bg-white/80 p-8 text-center md:p-12">
            <div className="mb-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-fixed text-primary">
                <span className="material-symbols-outlined icon icon-lg icon-filled">workspace_premium</span>
              </div>
            </div>
            <div className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant">Standard Certificate of Completion</div>
            <h2 className="mt-5 font-headline text-5xl font-black tracking-tight text-primary">SkillForge</h2>
            <p className="mt-8 text-lg italic text-on-surface-variant">This acknowledges that</p>
            <div className="mt-6 font-headline text-5xl font-black tracking-tight text-on-surface md:text-6xl">{currentUser.name}</div>
            <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-on-surface-variant">has successfully finished all requirements for the professional course <span className="font-bold text-on-surface">{course.title}</span>.</p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl bg-surface-container-low px-5 py-6">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant">Certificate</div>
                <div className="mt-3 text-sm font-bold text-on-surface">Portfolio-friendly completion proof</div>
              </div>
              <div className="rounded-3xl bg-surface-container-low px-5 py-6">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant">Issued</div>
                <div className="mt-3 text-sm font-bold text-on-surface">{dateLabel(issuedAt)}</div>
              </div>
              <div className="rounded-3xl bg-surface-container-low px-5 py-6">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant">Course Type</div>
                <div className="mt-3 text-sm font-bold text-on-surface">{course.category}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="demo-kpi p-6">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant">Course</div>
          <div className="mt-3 text-2xl font-headline font-black">{course.title}</div>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{certificateBlurb(course.certificateType)}</p>
        </div>
        <div className="demo-kpi p-6">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant">Assessment</div>
          <div className="mt-3 text-2xl font-headline font-black">{currentUser.quizResults?.[course.id]?.percent ?? 100}% passed</div>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">Certificate release is tied to the quiz result stored for this learner.</p>
        </div>
        <div className="demo-kpi p-6">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant">Next Step</div>
          <div className="mt-3 text-2xl font-headline font-black">{reviewStatus(currentUser, course, []).completed ? "Leave review" : "Keep learning"}</div>
          <div className="mt-4 flex gap-3">
            <NavLink className="btn btn-primary btn-w-full" to={`/reviews/${course.id}`}>Open Reviews</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartPage() {
  const { currentUser, courses, state, actions } = useAppState();
  const items = courses.filter((course) => state.cart.includes(course.id));
  const coupon = state.coupons.find((item) => item.code === state.appliedCoupon);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = coupon ? (coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value) : 0;
  const total = Math.max(subtotal - discount, 0);
  const [code, setCode] = useState(state.appliedCoupon ?? "");
  const [message, setMessage] = useState("");
  return (
    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
      <section className="space-y-6">
        <SectionHeader chip="Cart & Checkout System" title="Your selected learning" description="Cart state persists locally and feeds directly into checkout, payment, and receipts." />
        {items.length === 0 ? <div className="demo-kpi p-8"><p className="text-on-surface-variant mb-4">Your cart is empty.</p><NavLink to="/courses" className="btn btn-primary">Browse Courses</NavLink></div> : items.map((course) => <div key={course.id} className="demo-kpi p-6"><div className="flex flex-col md:flex-row gap-6"><img className="w-full md:w-56 h-40 object-cover rounded-3xl" src={course.image} alt={course.title} /><div className="flex-1"><div className="flex justify-between items-start mb-3"><span className="demo-chip demo-chip-muted">{course.category}</span><button className="text-sm font-bold text-red-600" onClick={() => actions.removeFromCart(course.id)}>Remove</button></div><h2 className="text-2xl font-headline font-black mb-2">{course.title}</h2><p className="text-on-surface-variant mb-4">{course.subtitle}</p><p className="text-2xl font-black text-primary">{currency(course.price)}</p></div></div></div>)}
      </section>
      <aside className="demo-kpi p-8 h-fit sticky top-28">
        <h3 className="text-2xl font-headline font-black mb-6">Promotions & Coupons</h3>
        <div className="space-y-3 mb-6 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{currency(subtotal)}</span></div><div className="flex justify-between"><span>Discount</span><span>-{currency(discount)}</span></div><div className="flex justify-between text-lg font-black pt-3 border-t border-black/5"><span>Total</span><span className="text-primary">{currency(total)}</span></div></div>
        <div className="space-y-3 mb-5"><input className="demo-input" placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} /><div className="flex gap-3"><button className="btn btn-surface btn-w-full" onClick={() => { const result = actions.applyCoupon(code); setMessage(result.message); }}>Apply</button><button className="btn btn-surface btn-w-full" onClick={() => { actions.clearCoupon(); setCode(""); setMessage("Coupon cleared."); }}>Clear</button></div><p className="text-xs text-on-surface-variant">Try `DEMO20` or `WELCOME10`.</p>{message ? <p className="text-sm font-medium text-primary">{message}</p> : null}</div>
        <NavLink className={`btn btn-primary btn-lg btn-w-full ${items.length === 0 ? "pointer-events-none opacity-50" : ""}`} to="/checkout">Proceed to Checkout</NavLink>
        <div className="mt-5 text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant">User: {currentUser.email}</div>
      </aside>
    </div>
  );
}

export function CheckoutPage() {
  const { currentUser, courses, state, actions } = useAppState();
  const navigate = useNavigate();
  const items = courses.filter((course) => state.cart.includes(course.id));
  const [method, setMethod] = useState("Card");
  const [form, setForm] = useState({ cardholder: currentUser.name, cardNumber: "4111 1111 1111 1111", expiry: "12/28", cvv: "123" });
  if (!items.length) return <Navigate to="/cart" replace />;
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const coupon = state.coupons.find((item) => item.code === state.appliedCoupon);
  const discount = coupon ? (coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value) : 0;
  const total = Math.max(subtotal - discount, 0);
  return (
    <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8">
      <section className="space-y-8">
        <SectionHeader chip="Payment Gateway Integration" title="Complete enrollment" description="Gateway selection, card data, and order creation are connected to the checkout flow with mock payment handling." />
        <div className="demo-kpi p-8">
          <h2 className="text-2xl font-headline font-black mb-6">Choose payment method</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">{["Card", "MoMo", "VNPay", "PayPal"].map((item) => <button key={item} className={`rounded-3xl p-5 border text-center font-bold ${method === item ? "border-primary bg-primary-fixed text-primary" : "border-black/5 bg-white"}`} onClick={() => setMethod(item)}>{item}</button>)}</div>
          <div className="grid md:grid-cols-2 gap-4"><input className="demo-input" value={form.cardholder} onChange={(e) => setForm((prev) => ({ ...prev, cardholder: e.target.value }))} /><input className="demo-input" value={form.cardNumber} onChange={(e) => setForm((prev) => ({ ...prev, cardNumber: e.target.value }))} /><input className="demo-input" value={form.expiry} onChange={(e) => setForm((prev) => ({ ...prev, expiry: e.target.value }))} /><input className="demo-input" value={form.cvv} onChange={(e) => setForm((prev) => ({ ...prev, cvv: e.target.value }))} /></div>
        </div>
      </section>
      <aside className="demo-kpi p-8 h-fit sticky top-28">
        <h3 className="text-2xl font-headline font-black mb-6">Order Summary</h3>
        <div className="space-y-4 mb-6">{items.map((course) => <div key={course.id} className="flex justify-between gap-4"><div><div className="font-bold">{course.title}</div><div className="text-sm text-on-surface-variant">{course.category}</div></div><div className="font-bold">{currency(course.price)}</div></div>)}</div>
        <div className="space-y-3 mb-6 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{currency(subtotal)}</span></div><div className="flex justify-between"><span>Discount</span><span>-{currency(discount)}</span></div><div className="flex justify-between text-lg font-black pt-3 border-t border-black/5"><span>Total</span><span className="text-primary">{currency(total)}</span></div></div>
        <button className="btn btn-primary btn-lg btn-w-full" onClick={() => { const order = actions.checkout(method); if (order) navigate("/orders"); }}>Complete Enrollment</button>
      </aside>
    </div>
  );
}

export function OrdersPage() {
  const { currentUser, courses, state } = useAppState();
  const orders = currentUser.role === "admin" ? state.orders : state.orders.filter((order) => order.userId === currentUser.id);
  return (
    <div className="space-y-8">
      <SectionHeader chip="Order History & Receipts" title="Transaction ledger" description="Every successful checkout writes an order here and grants course access immediately." />
      <div className="demo-kpi p-4 md:p-8 overflow-x-auto">
        <table className="demo-table"><thead><tr><th>Invoice</th><th>Date</th><th>Items</th><th>Method</th><th>Status</th><th>Total</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td className="font-bold">{order.id}</td><td>{dateLabel(order.createdAt)}</td><td>{order.courseIds.map((id) => courses.find((course) => course.id === id)?.title).join(", ")}</td><td>{order.method}</td><td><span className="demo-chip demo-chip-success">{order.status}</span></td><td className="font-bold text-primary">{currency(order.total)}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}

export function ReviewsPage() {
  const { courseId } = useParams();
  const { currentUser, courses, state, actions } = useAppState();
  const course = courses.find((item) => item.id === courseId);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  if (!course) return <Navigate to="/courses" replace />;
  const reviews = state.reviews[course.id] ?? [];
  const meta = reviewStatus(currentUser, course, reviews);
  return (
    <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8">
      <section className="space-y-4">
        <SectionHeader chip="Course Reviews & Ratings" title={course.title} description={meta.enrolled ? `${reviews.length} review(s) from enrolled learners who completed the course.` : "Reviews are hidden until the learner purchases the course."} />
        {!meta.enrolled ? <div className="demo-kpi p-8"><div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant mb-3">Locked</div><h2 className="text-3xl font-headline font-black mb-3">Enroll to unlock reviews</h2><p className="text-on-surface-variant mb-6">This keeps public catalog cards cleaner and prevents unpurchased courses from showing empty review UI.</p><NavLink className="btn btn-primary" to={`/courses/${course.id}`}>Back to Course</NavLink></div> : null}
        {meta.enrolled ? reviews.map((review) => <div key={review.id} className="demo-kpi p-6"><div className="flex justify-between items-center mb-3"><div className="font-bold">{review.author}</div><div className="text-sm text-on-surface-variant">{dateLabel(review.createdAt)}</div></div><div className="text-primary font-bold mb-2">{Array.from({ length: review.rating }, () => "★").join("")}</div><p className="text-on-surface-variant">{review.content}</p></div>) : null}
        {meta.enrolled && !reviews.length ? <div className="demo-kpi p-8 text-on-surface-variant">No learner feedback yet. Reviews will appear here after completed students submit them.</div> : null}
      </section>
      <aside className="demo-kpi p-8 h-fit sticky top-28">
        <h2 className="text-2xl font-headline font-black mb-6">{meta.canReview ? "Write a review" : "Review access"}</h2>
        {meta.canReview ? (
          <div className="space-y-4">
            <select className="demo-select" value={rating} onChange={(e) => setRating(Number(e.target.value))}>{[5, 4, 3, 2, 1].map((item) => <option key={item} value={item}>{item} stars</option>)}</select>
            <textarea className="demo-textarea" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your feedback..." />
            <button className="btn btn-primary btn-w-full" onClick={() => { if (!content.trim()) return; const result = actions.addReview(course.id, { rating, content }); setMessage(result?.message ?? "Review submitted."); if (result?.ok) setContent(""); }}>Submit Review</button>
            {message ? <p className="text-sm font-medium text-primary">{message}</p> : null}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-3xl bg-surface-container-low p-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant mb-2">Current status</div>
              <div className="text-lg font-bold text-on-surface">{!meta.enrolled ? "Purchase required" : meta.alreadyReviewed ? "Review already submitted" : meta.completed ? "Eligible from course page" : "Finish the course first"}</div>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{!meta.enrolled ? "Enroll in the course to unlock learner discussion, certificate progress, and review access." : meta.alreadyReviewed ? "This learner already left feedback for the course." : "Only completed learners can leave a review, which avoids empty states and keeps feedback meaningful."}</p>
            </div>
            <NavLink className="btn btn-surface btn-w-full" to={meta.enrolled ? `/courses/${course.id}` : "/courses"}>{meta.enrolled ? "Back to Course" : "Browse Courses"}</NavLink>
          </div>
        )}
      </aside>
    </div>
  );
}

export function DiscussionsPage() {
  const { courseId, lessonId } = useParams();
  const { courses, state, actions } = useAppState();
  const course = courses.find((item) => item.id === courseId);
  const lesson = useMemo(() => course?.modules.flatMap((module) => module.lessons).find((item) => item.id === lessonId), [course, lessonId]);
  const [content, setContent] = useState("");
  if (!course || !lesson) return <Navigate to="/courses" replace />;
  const thread = state.discussions[`${courseId}:${lessonId}`] ?? [];
  return (
    <div className="grid lg:grid-cols-[1fr_0.85fr] gap-8">
      <section className="space-y-4">
        <SectionHeader chip="Lesson Discussions & Comments" title={lesson.title} description={`Contextual thread for ${course.title}.`} />
        {thread.map((post) => <div key={post.id} className="demo-kpi p-6"><div className="flex justify-between items-center mb-3"><div><div className="font-bold">{post.author}</div><div className="text-sm text-on-surface-variant">{post.role}</div></div><div className="text-sm text-on-surface-variant">{dateLabel(post.createdAt)}</div></div><p className="text-on-surface-variant">{post.content}</p></div>)}
      </section>
      <aside className="demo-kpi p-8 h-fit sticky top-28"><h2 className="text-2xl font-headline font-black mb-5">Ask a question</h2><textarea className="demo-textarea" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Post a lesson question or comment..." /><button className="btn btn-primary btn-w-full mt-4" onClick={() => { if (!content.trim()) return; actions.addDiscussion(courseId, lessonId, content); setContent(""); }}>Publish Comment</button></aside>
    </div>
  );
}

export function ProfilePage() {
  const { currentUser, courses, actions } = useAppState();
  const [form, setForm] = useState({ name: currentUser.name, headline: currentUser.headline, bio: currentUser.bio });
  const enrolled = courses.filter((course) => currentUser.enrolledCourseIds.includes(course.id));
  return (
    <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8">
      <section className="demo-kpi p-8"><div className="demo-chip demo-chip-primary mb-4">User Profile</div><h1 className="text-4xl font-headline font-black mb-2">{currentUser.name}</h1><p className="text-primary font-bold mb-5">{currentUser.headline}</p><p className="text-on-surface-variant mb-6">{currentUser.bio}</p><div className="grid grid-cols-2 gap-4"><div className="bg-surface-container-low rounded-2xl p-4">Role: {currentUser.role}</div><div className="bg-surface-container-low rounded-2xl p-4">Certificates: {currentUser.certificates.length}</div></div></section>
      <section className="space-y-6">
        <div className="demo-kpi p-8"><h2 className="text-2xl font-headline font-black mb-6">Update profile</h2><div className="space-y-4"><input className="demo-input" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} /><input className="demo-input" value={form.headline} onChange={(e) => setForm((prev) => ({ ...prev, headline: e.target.value }))} /><textarea className="demo-textarea" value={form.bio} onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))} /><div className="flex gap-3"><button className="btn btn-primary" onClick={() => actions.updateProfile(form)}>Save</button><button className="btn btn-surface" onClick={() => actions.logout()}>Logout</button></div></div></div>
        {currentUser.role === "student" ? <div className="demo-kpi p-8"><h2 className="text-2xl font-headline font-black mb-5">My learning</h2><div className="space-y-3">{enrolled.map((course) => <div key={course.id} className="flex justify-between bg-surface-container-low rounded-2xl px-4 py-3"><span>{course.title}</span><NavLink className="demo-link" to={`/learning/${course.id}`}>Open</NavLink></div>)}</div></div> : null}
      </section>
    </div>
  );
}
