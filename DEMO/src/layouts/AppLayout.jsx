import { NavLink, matchPath, useLocation, useNavigate } from "react-router-dom";
import { homePathForRole } from "../lib/utils";

export function AppLayout({ currentUser, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const studentNav = [
    ["/", "Dashboard"],
    ["/courses", "Courses"],
    ["/progress", "My Learning"],
    ["/cart", "Cart"],
    ["/wallet", "Wallet"],
    ["/orders", "Orders"],
    ["/profile", "Profile"],
  ];
  const instructorNav = [
    ["/instructor", "Overview"],
    ["/instructor/courses", "Course Studio"],
    ["/instructor/grading", "Grading"],
    ["/instructor/students", "Students"],
    ["/instructor/earnings", "Earnings"],
    ["/instructor/coupons", "Coupons"],
    ["/profile", "Profile"],
  ];
  const adminNav = [
    ["/admin", "Dashboard", "dashboard"],
    ["/admin/users", "Users", "group"],
    ["/admin/courses", "Moderation", "school"],
    ["/admin/finance", "Finance", "account_balance_wallet"],
    ["/admin/coupons", "Coupons", "local_offer"],
    ["/admin/settings", "Settings", "settings"],
  ];
  const isStudent = currentUser.role === "student";
  const isInstructor = currentUser.role === "instructor";
  const isAdmin = currentUser.role === "admin";
  const instructorEditorMatch = matchPath("/instructor/courses/:courseId/*", location.pathname);
  const isInstructorEditor = Boolean(isInstructor && instructorEditorMatch);
  const nav = isStudent ? studentNav : isInstructor ? instructorNav : adminNav;
  const studentTopbar = currentUser.role === "student";
  const mainClassName = studentTopbar
    ? "pt-24 pb-32 px-6 sf-container"
    : isAdmin
      ? "ml-64 p-8 min-h-screen mt-16"
    : isInstructorEditor
      ? "pt-28 pb-16 px-4 md:px-6 sf-container"
      : "pt-24 pb-16 px-4 md:px-6 sf-container";

  if (isAdmin) {
    return (
      <>
        <aside className="fixed left-0 top-0 z-[60] flex h-screen w-64 flex-col bg-surface py-6">
          <div className="mb-10 px-6">
            <button className="sf-brand text-2xl" onClick={() => navigate("/admin")}>SkillForge</button>
            <p className="text-sm font-medium text-on-surface-variant">Admin Portal</p>
          </div>
          <nav className="flex-1 space-y-1">
            {adminNav.map(([to, label, icon]) => {
              const isActive = to === "/admin"
                ? location.pathname === to
                : location.pathname === to || location.pathname.startsWith(`${to}/`);
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={isActive ? "flex items-center bg-surface px-6 py-3 font-bold text-primary-container border-r-4 border-[#f46825]" : "flex items-center px-6 py-3 font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high"}
                >
                  <span className="material-symbols-outlined icon mr-3">{icon}</span>
                  <span>{label}</span>
                </NavLink>
              );
            })}
          </nav>
          <div className="mt-auto px-6 pt-6">
            <button className="flex w-full items-center rounded-xl bg-surface-container-high p-3 text-left transition-all hover:bg-surface-container-highest" onClick={() => navigate("/profile")}>
              <img
                alt={currentUser.name}
                className="mr-3 h-10 w-10 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwY1B9wpSRqxXzXAJh8DbdA4HfEw05owBnOJtCrM7a_WfsnRdus3WMxAwlVWPPHLYY6fUkWwsnRfeWtCLR78mjvm6HKRrtczbvGHqUYRTIWms7R9saUi18oT7DkX_kNb0i4bKDgdZyFNtu-pGHOdww86fCmQZGCTgJBqNbLQiBVdkQZmT43xoxxBAgEn8PVA1qIY9JUNZVIFdqd4da5woJgnyACzw4Yg_Hgt5GN4Ukl1UJZSuM0Sh9toKSm6z_2T4eIikR6hNgUzkO"
              />
              <div className="overflow-hidden">
                <p className="truncate text-sm font-bold">{currentUser.name}</p>
                <p className="truncate text-xs text-on-surface-variant">Master Admin</p>
              </div>
            </button>
          </div>
        </aside>
        <header className="navbar navbar-admin">
          <div className="mx-2 flex flex-1 items-center justify-around">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined icon absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="w-full rounded-xl border-none bg-surface-container-lowest py-2 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-primary" placeholder="Search system records..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant transition-all hover:text-primary active:scale-95">
              <span className="material-symbols-outlined icon">notifications</span>
            </button>
            <div className="mx-2 h-8 w-[1px] bg-outline-variant/20" />
            <button className="p-2 text-on-surface-variant transition-all hover:text-primary active:scale-95" onClick={() => navigate("/profile")}>
              <span className="material-symbols-outlined icon">account_circle</span>
            </button>
          </div>
        </header>
        <main className={mainClassName}>{children}</main>
      </>
    );
  }

  return (
    <>
      <header className={`navbar ${isInstructor ? "instructor-navbar" : ""} ${isInstructorEditor ? "instructor-navbar-editor" : ""}`}>
        <div className={`navbar-container ${isInstructorEditor ? "instructor-navbar-editor-container" : ""}`}>
          <div className={`navbar-logo ${isInstructorEditor ? "min-w-0" : ""}`}>
            <button className="sf-brand text-2xl" onClick={() => navigate(homePathForRole(currentUser.role))}>SkillForge</button>
            {isInstructorEditor ? (
              <div className="hidden md:flex items-center gap-3 min-w-0">
                <NavLink to="/instructor/courses" className="instructor-context-link">
                  <span className="material-symbols-outlined nav-icon">arrow_back</span>
                  Course Studio
                </NavLink>
                <span className="instructor-context-divider">/</span>
                <span className="instructor-workspace-badge truncate">Course Editor</span>
              </div>
            ) : (
              <nav className="hidden md:flex items-center gap-2">
                {nav.map(([to, label]) => {
                  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      className={isActive ? "nav-item nav-item-active" : "nav-item"}
                    >
                      {label}
                    </NavLink>
                  );
                })}
              </nav>
            )}
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            {studentTopbar ? (
              <div className="relative hidden sm:block">
                <span className="material-symbols-outlined icon absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input className="input-search w-64" placeholder="Search courses..." type="text" />
              </div>
            ) : (
              <>
                {isInstructorEditor ? (
                  <div className="hidden lg:flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                    <span className="material-symbols-outlined nav-icon">edit_square</span>
                    Editing workspace
                  </div>
                ) : (
                  <div className="hidden md:block rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                    {currentUser.role} workspace
                  </div>
                )}
              </>
            )}
            <button className="p-2 text-on-surface-variant hover:bg-primary-fixed/50 rounded-full transition-colors active:scale-95">
              <span className="material-symbols-outlined icon">notifications</span>
            </button>
            <button className="flex items-center gap-3" onClick={() => navigate("/profile")}>
              <img
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border-2 border-primary-container object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwY1B9wpSRqxXzXAJh8DbdA4HfEw05owBnOJtCrM7a_WfsnRdus3WMxAwlVWPPHLYY6fUkWwsnRfeWtCLR78mjvm6HKRrtczbvGHqUYRTIWms7R9saUi18oT7DkX_kNb0i4bKDgdZyFNtu-pGHOdww86fCmQZGCTgJBqNbLQiBVdkQZmT43xoxxBAgEn8PVA1qIY9JUNZVIFdqd4da5woJgnyACzw4Yg_Hgt5GN4Ukl1UJZSuM0Sh9toKSm6z_2T4eIikR6hNgUzkO"
              />
              {!studentTopbar ? <span className="hidden md:block font-bold text-sm">{currentUser.name}</span> : null}
            </button>
          </div>
        </div>
      </header>
      <main className={mainClassName}>{children}</main>
    </>
  );
}
