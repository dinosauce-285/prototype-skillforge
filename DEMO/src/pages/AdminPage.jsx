import { useMemo, useState } from "react";
import { MetricCard, SectionHeader } from "../components/ui";
import { currency, dateLabel } from "../lib/utils";
import { useAppState } from "../state/AppState";

function moderationStatus(course) {
  if (course.legalCertificate?.status === "approved") return "Verified by Skill Forge";
  if (course.legalCertificate?.status === "pending") return "Pending Review";
  return course.rating >= 4.8 ? "Approved" : "Review";
}

function userRoleTone(role) {
  if (role === "instructor") return "demo-chip-primary";
  if (role === "student") return "demo-chip-muted";
  return "demo-chip-success";
}

export function AdminPage() {
  const { state } = useAppState();
  const totalRevenue = state.orders.reduce((sum, order) => sum + order.total, 0);
  const activeStudents = state.users.filter((user) => user.role === "student").length;
  const instructorCount = state.users.filter((user) => user.role === "instructor").length;
  const pendingApprovals = state.legalApprovalRequests.filter((request) => request.status === "pending").length;
  const recentActivity = [
    "New instructor legal certificate request submitted for Instructor Operations Masterclass.",
    "Bulk learner certificate issuance completed for Regulated Assessment Operations.",
    "Coupon SPRING25 was paused after campaign review.",
    "Suspicious login alert generated for one student account.",
  ];

  return (
    <div className="space-y-8">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface">Admin Dashboard</h2>
          <p className="max-w-lg text-on-surface-variant">Monitor platform health, pending approvals, community growth, and system-wide control surfaces from one operational dashboard.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard title="Total Users" value={String(state.users.length)} caption="All roles across the demo platform" />
        <MetricCard title="Active Students" value={String(activeStudents)} caption="Current learner accounts" />
        <MetricCard title="Verified Instructors" value={String(instructorCount)} caption="Instructor and organization entities in the system" />
        <MetricCard title="Pending Approvals" value={String(pendingApprovals)} caption="Urgent certificate and moderation actions" />
      </div>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="demo-kpi p-8">
          <h3 className="mb-6 text-2xl font-headline font-black">Recent Platform Activity</h3>
          <div className="space-y-5">
            {recentActivity.map((item, index) => (
              <div key={item} className="flex gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${index === 0 ? "bg-primary-container/10 text-primary" : index === 1 ? "bg-tertiary-container/10 text-tertiary" : index === 2 ? "bg-secondary-container/10 text-secondary" : "bg-error-container/10 text-error"}`}>
                  <span className="material-symbols-outlined icon">{index === 0 ? "person_add" : index === 1 ? "verified" : index === 2 ? "local_offer" : "report"}</span>
                </div>
                <div>
                  <p className="text-sm font-bold">{item}</p>
                  <p className="mt-1 text-xs text-on-surface-variant">{`${index * 2 + 2} hours ago`}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 text-white">
          <h3 className="mb-4 text-2xl font-headline font-black">Platform Health</h3>
          <p className="text-sm text-white/80">Revenue is stable, moderation throughput is on target, and certificate verification workflow is operational.</p>
          <div className="mt-8 flex items-end gap-3">
            <span className="text-6xl font-black">94%</span>
            <span className="pb-2 text-sm font-bold uppercase tracking-[0.2em] text-white/80">Stability</span>
          </div>
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[94%] rounded-full bg-tertiary-fixed" />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-white/70">Gross Revenue</div>
              <div className="mt-2 text-2xl font-black">{currency(totalRevenue)}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-white/70">Legal Queue</div>
              <div className="mt-2 text-2xl font-black">{pendingApprovals}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function AdminUsersPage() {
  const { state } = useAppState();
  const filteredUsers = state.users;
  return (
    <div className="space-y-8">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface">User Management</h2>
          <p className="max-w-lg text-on-surface-variant">Manage roles, monitor onboarding status, and inspect which users are students, instructors, or administrators.</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-6 py-3 font-bold text-on-surface transition-all hover:bg-surface-container-low">Export CSV</button>
          <button className="btn btn-primary">Invite User</button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard title="Total Users" value={String(state.users.length)} caption="Across all learner and operator roles" />
        <MetricCard title="Students" value={String(state.users.filter((user) => user.role === "student").length)} caption="Learners enrolled in at least one course" />
        <MetricCard title="Instructors" value={String(state.users.filter((user) => user.role === "instructor").length)} caption="Course creators and grading staff" />
        <MetricCard title="Pending Review" value={String(state.users.filter((user) => user.organizationProfile?.status === "submitted").length)} caption="Organizations awaiting admin review" />
      </div>
      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/10 p-6">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-xl bg-surface-container-low px-4 py-2 text-sm font-bold hover:bg-surface-container-high">
              <span className="material-symbols-outlined icon">filter_list</span>
              Filter
            </button>
            <div className="flex rounded-xl bg-surface-container-low p-1">
              <button className="rounded-md bg-white px-4 py-1.5 text-xs font-bold text-primary shadow-sm">All Users</button>
              <button className="px-4 py-1.5 text-xs font-bold text-on-surface-variant">Instructors</button>
              <button className="px-4 py-1.5 text-xs font-bold text-on-surface-variant">Students</button>
            </div>
          </div>
          <div className="text-sm font-medium text-on-surface-variant">Showing <span className="text-on-surface">1-{filteredUsers.length}</span> of {filteredUsers.length}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">User Details</th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Role & ID</th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Enrollments</th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group transition-colors hover:bg-surface-container-low/30">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img alt={user.name} className="h-11 w-11 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwY1B9wpSRqxXzXAJh8DbdA4HfEw05owBnOJtCrM7a_WfsnRdus3WMxAwlVWPPHLYY6fUkWwsnRfeWtCLR78mjvm6HKRrtczbvGHqUYRTIWms7R9saUi18oT7DkX_kNb0i4bKDgdZyFNtu-pGHOdww86fCmQZGCTgJBqNbLQiBVdkQZmT43xoxxBAgEn8PVA1qIY9JUNZVIFdqd4da5woJgnyACzw4Yg_Hgt5GN4Ukl1UJZSuM0Sh9toKSm6z_2T4eIikR6hNgUzkO" />
                        <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${user.role === "student" ? "bg-green-500" : user.role === "instructor" ? "bg-tertiary-fixed" : "bg-primary"}`} />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{user.name}</p>
                        <p className="text-sm text-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className={`text-xs font-bold flex items-center ${user.role === "instructor" ? "text-primary" : user.role === "student" ? "text-secondary" : "text-primary-container"}`}>
                        <span className="material-symbols-outlined icon mr-1">{user.role === "instructor" ? "school" : user.role === "student" ? "person" : "shield"}</span>
                        {user.role}
                      </span>
                      <span className="text-xs font-medium text-on-surface-variant">{user.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`demo-chip ${user.organizationProfile?.status === "submitted" ? "demo-chip-primary" : "demo-chip-success"}`}>{user.organizationProfile?.status === "submitted" ? "Pending Review" : "Active"}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-on-surface">{user.enrolledCourseIds?.length ?? 0} Courses</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="rounded-xl p-2 text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-primary">
                        <span className="material-symbols-outlined nav-icon">edit</span>
                      </button>
                      <button className="rounded-xl p-2 text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-primary">
                        <span className="material-symbols-outlined nav-icon">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminCoursesPage() {
  const { courses, state, actions } = useAppState();
  const [notesById, setNotesById] = useState(() => Object.fromEntries(state.legalApprovalRequests.map((request) => [request.id, request.adminNotes || ""])));
  const pending = state.legalApprovalRequests.filter((request) => request.status === "pending");
  const approved = state.legalApprovalRequests.filter((request) => request.status === "approved");
  const avgWaitHours = pending.length ? "4.2" : "0.0";
  const moderationCards = state.legalApprovalRequests.map((request) => {
    const course = courses.find((item) => item.id === request.courseId);
    return { ...request, course };
  });
  return (
    <div className="space-y-8">
      <div className="mb-10 flex items-end justify-between">
        <div className="max-w-2xl">
          <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface">Course Moderation Queue</h2>
          <p className="max-w-lg text-on-surface-variant">Review pending submissions for legal certificate credibility, course quality, and issuance traceability before approval.</p>
        </div>
        <div className="flex gap-3">
          <span className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-2 font-bold text-on-surface">{pending.length} Pending</span>
          <span className="rounded-xl bg-primary/10 px-4 py-2 font-bold text-primary">Priority: High</span>
        </div>
      </div>
      <section className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6">
          <p className="mb-2 text-sm font-semibold text-on-surface-variant">Wait Time</p>
          <h3 className="text-3xl font-bold">{avgWaitHours} <span className="text-lg font-normal">hrs</span></h3>
          <div className="mt-4 h-1 w-full rounded-full bg-surface-container"><div className="h-full w-2/3 rounded-full bg-primary" /></div>
        </div>
        <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6">
          <p className="mb-2 text-sm font-semibold text-on-surface-variant">Daily Goal</p>
          <h3 className="text-3xl font-bold">82<span className="text-lg font-normal">%</span></h3>
          <div className="mt-4 h-1 w-full rounded-full bg-surface-container"><div className="h-full w-[82%] rounded-full bg-tertiary-fixed-dim" /></div>
        </div>
        <div className="col-span-1 row row-between rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 lg:col-span-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-on-surface-variant">Quality Index</p>
            <h3 className="text-3xl font-bold text-primary">Excellent</h3>
          </div>
          <div className="relative h-16 w-16">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <path className="text-surface-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3" />
              <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="92, 100" strokeLinecap="round" strokeWidth="3" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-label font-bold">92%</div>
          </div>
        </div>
      </section>
      <div className="mb-8 flex items-center space-x-4">
        <button className="btn btn-primary btn-pill">All Submissions</button>
        <button className="btn btn-surface btn-pill btn-sm">Verified Legal</button>
        <button className="btn btn-surface btn-pill btn-sm">Pending Review</button>
        <button className="btn btn-surface btn-pill btn-sm">Rejected</button>
        <div className="ml-auto flex items-center text-sm font-semibold text-on-surface-variant">
          <span>Sort by:</span>
          <select className="ml-2 cursor-pointer border-none bg-transparent font-bold text-on-surface focus:ring-0">
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Complexity</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {moderationCards.map((request) => (
          <div key={request.id} className="group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest transition-all duration-300 hover:shadow-xl">
            <div className="relative h-48 overflow-hidden">
              <img alt={request.courseTitle} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src={request.course?.image} />
              <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-1 text-xs font-bold text-on-surface shadow-sm">ID: {request.courseId}</div>
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <span className="material-symbols-outlined icon cursor-pointer rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition-colors hover:bg-primary">play_circle</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-2 flex items-start justify-between">
                <h4 className="text-xl font-bold leading-tight transition-colors group-hover:text-primary">{request.courseTitle}</h4>
                <span className="material-symbols-outlined icon text-outline">more_vert</span>
              </div>
              <div className="mb-4 flex items-center text-sm text-on-surface-variant">
                <span className="font-bold text-secondary">{request.instructorName}</span>
                <span className="mx-2">•</span>
                <span>{request.course?.duration}</span>
              </div>
              <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-on-surface-variant">{request.archivePlan}</p>
              <div className="mt-auto space-y-4">
                <div className="rounded-2xl bg-surface-container-low p-4">
                  <div className="mb-2 text-label font-extrabold uppercase tracking-widest text-on-surface-variant">Verification Method</div>
                  <div className="text-sm font-bold text-on-surface">{request.verificationMethod}</div>
                  <div className="mt-2 text-xs text-on-surface-variant">Submitted {dateLabel(request.submittedAt)} • {request.complianceStandard}</div>
                </div>
                <textarea className="demo-textarea" placeholder="Moderator note" value={notesById[request.id] ?? ""} onChange={(e) => setNotesById((prev) => ({ ...prev, [request.id]: e.target.value }))} />
                <div className="flex space-x-3">
                  <button className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary transition-all hover:bg-primary-dim active:scale-[0.98]" onClick={() => actions.reviewLegalCertificateRequest(request.id, { status: "approved", adminNotes: notesById[request.id] ?? "" })}>Approve</button>
                  <button className="rounded-xl border border-outline-variant/30 px-4 py-3 text-on-surface transition-all hover:bg-surface-container" onClick={() => actions.reviewLegalCertificateRequest(request.id, { status: "rejected", adminNotes: notesById[request.id] ?? "" })}>
                    <span className="material-symbols-outlined icon">feedback</span>
                  </button>
                </div>
                <div className={`demo-chip ${request.status === "approved" ? "demo-chip-success" : request.status === "pending" ? "demo-chip-primary" : "demo-chip-muted"}`}>{request.status === "approved" ? `Approved by ${request.reviewedBy}` : request.status === "pending" ? "Awaiting action" : "Rejected"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="relative h-64 overflow-hidden rounded-2xl group">
          <img className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9R3wKFRyDL7DeN2EGpvcMvfI09sBEsnJ2wKXvBY7UtZ6yglw9viUtrjmedO4za92BovY015KTkcoINB40Ow-tjlLA1Ut7-J7sc-6B4ii4DPUzvtKdjbcqE4gpMsu-6vvVocFS0reoVL7nCMm2ARbZhv-2nZvpI2h-r1MZcXs15YC87SLeJvrFIU7mf7giARHYawzVBwjB4i67G3OVGNcFVf2kyJRtyixN93yaNx5m8dPdscTO-OrOWYwpyDEUkJwRoMUIi7q_Ebkp" />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-6">
            <h5 className="text-lg font-bold text-white">Document Assets</h5>
            <p className="text-xs text-white/70">License scans, archive plans, and issuance policy attachments.</p>
          </div>
        </div>
        <div className="relative h-64 overflow-hidden rounded-2xl group">
          <img className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUr5pFTvQeVyfdGLpmFrJofgNbWIbumxEdnMwEyaKCh4aZAIjLi5ZZNl-IMF7JEHwCsDDRLvsgLAbXncHIqX-QBmPfbsm0KmmvUrjsHQ_EF2s6PH2y4YbQTZaG6TRr8412FNBZjUIXSYDmM8ZPL21TkdZkZ9_djKQKBcLkxOAtYvZIPTY8HPtk1TgxalXqFyKaVxCTKSisUNcTDHiv1NG2Uerpa95cKCWuR2tqehBn6sgKIhK4NEP8Tb_KqLJqZ7rjntEmqMzyVVDT" />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-6">
            <h5 className="text-lg font-bold text-white">Review Heatmaps</h5>
            <p className="text-xs text-white/70">See where moderation volume and approval risk cluster.</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-primary p-8 text-center">
          <span className="material-symbols-outlined icon icon-xl mb-4 text-white icon-filled">hub</span>
          <h5 className="mb-2 text-xl font-black text-white">Partner Integration</h5>
          <p className="text-sm text-white/80">Courses approved here can expose QR / lookup IDs for later certificate verification.</p>
        </div>
      </div>
    </div>
  );
}

export function AdminCouponsPage() {
  const { state, actions } = useAppState();
  const [form, setForm] = useState({ code: "", type: "percent", value: 15, description: "" });
  return (
    <div className="space-y-8">
      <div className="mb-10 flex items-end justify-between">
        <div className="space-y-1">
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">Coupon Manager</h2>
          <p className="max-w-lg text-on-surface-variant">Design, launch, and monitor promotional performance from a single admin interface.</p>
        </div>
        <div className="flex gap-4">
          <button className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-6 py-3 font-bold text-on-surface transition-all hover:bg-surface-container-low">Export Report</button>
          <button className="btn btn-primary">Create New Coupon</button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 lg:col-span-4">
          <p className="mb-2 text-sm font-semibold text-on-surface-variant">Total Active Savings</p>
          <h3 className="text-3xl font-black text-on-surface">$12,450.00</h3>
          <div className="mt-4 flex items-center font-bold text-primary"><span className="material-symbols-outlined icon mr-1">trending_up</span><span>14% vs last month</span></div>
        </div>
        <div className="col-span-12 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 lg:col-span-4">
          <p className="mb-2 text-sm font-semibold text-on-surface-variant">Redemption Rate</p>
          <h3 className="text-3xl font-black text-on-surface">68.2%</h3>
          <div className="mt-4 flex items-center font-bold text-tertiary-fixed-dim"><span className="material-symbols-outlined icon mr-1">bolt</span><span>High Engagement</span></div>
        </div>
        <div className="col-span-12 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 lg:col-span-4">
          <p className="mb-2 text-sm font-semibold text-on-surface-variant">Expiring Soon</p>
          <h3 className="text-3xl font-black text-on-surface">{state.coupons.filter((coupon) => coupon.status === "Paused").length}</h3>
          <div className="mt-4 flex items-center font-bold text-error"><span className="material-symbols-outlined icon mr-1">schedule</span><span>Action Required</span></div>
        </div>
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <div className="row row-between">
            <h4 className="font-headline text-xl font-bold">Active Promotions</h4>
            <div className="flex gap-2">
              <button className="rounded-xl bg-surface-container-high p-2 text-on-surface-variant"><span className="material-symbols-outlined icon">filter_list</span></button>
            </div>
          </div>
          <div className="stack-md">
            {state.coupons.map((coupon) => (
              <div key={coupon.code} className="row row-between rounded-xl border border-outline-variant/5 bg-surface-container-lowest p-6 transition-all hover:border-primary/20">
                <div className="navbar-logo">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${coupon.status === "Active" ? "bg-primary-container/10 text-primary" : "bg-surface-container text-outline"}`}>
                    <span className="material-symbols-outlined icon icon-lg">{coupon.status === "Active" ? "confirmation_number" : "history"}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h5 className="text-lg font-bold text-on-surface">{coupon.code}</h5>
                      <span className={`px-2 py-1 text-label font-black uppercase tracking-tighter rounded ${coupon.status === "Active" ? "bg-primary/10 text-primary" : "bg-outline-variant/20 text-on-surface-variant"}`}>{coupon.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-on-surface-variant">{coupon.description}</p>
                  </div>
                </div>
                <div className="navbar-logo text-right">
                  <div>
                    <p className="text-label font-bold uppercase tracking-widest text-on-surface-variant">Discount</p>
                    <p className="text-lg font-black text-on-surface">{coupon.type === "percent" ? `${coupon.value}%` : currency(coupon.value)}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <button className="rounded-xl p-2 transition-colors hover:bg-surface-container" onClick={() => actions.updateCoupon(coupon.code, { status: coupon.status === "Active" ? "Paused" : "Active" })}>
                      <span className="material-symbols-outlined icon text-on-surface-variant">more_vert</span>
                    </button>
                    <p className="mt-2 text-xs italic text-on-surface-variant">{coupon.status === "Active" ? "Live campaign" : "Paused campaign"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 h-fit rounded-xl border border-outline-variant/10 bg-surface-container-low p-8 lg:col-span-4">
          <h4 className="mb-6 font-headline text-xl font-bold">Quick Config</h4>
          <form className="space-y-5">
            <div className="stack-xs">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Coupon Code</label>
              <input className="demo-input" placeholder="e.g. SKILLUP2024" value={form.code} onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))} />
            </div>
            <div className="stack-xs">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Discount Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button className={`rounded-xl py-2 text-sm font-bold ${form.type === "percent" ? "bg-primary text-white" : "bg-surface-container-lowest text-on-surface border border-outline-variant/20"}`} type="button" onClick={() => setForm((prev) => ({ ...prev, type: "percent" }))}>Percentage</button>
                <button className={`rounded-xl py-2 text-sm font-bold ${form.type === "fixed" ? "bg-primary text-white" : "bg-surface-container-lowest text-on-surface border border-outline-variant/20"}`} type="button" onClick={() => setForm((prev) => ({ ...prev, type: "fixed" }))}>Fixed Amount</button>
              </div>
            </div>
            <div className="stack-xs">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Value</label>
              <input className="demo-input" type="number" value={form.value} onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))} />
            </div>
            <div className="stack-xs">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Description</label>
              <input className="demo-input" placeholder="Campaign description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
            </div>
            <button className="btn btn-secondary btn-lg btn-w-full" type="button" onClick={() => { if (!form.code.trim()) return; actions.createCoupon(form); setForm({ code: "", type: "percent", value: 15, description: "" }); }}>
              <span>Forge Link</span>
              <span className="material-symbols-outlined icon">auto_fix_high</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AdminSettingsPage() {
  const [settings] = useState({
    commission: 20,
    payoutThreshold: 100,
    automation: {
      reminders: true,
      digest: false,
      verification: true,
    },
  });
  return (
    <div className="space-y-8">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface">System Settings</h2>
          <p className="max-w-lg text-on-surface-variant">Configure global system parameters, branding, automation logic, and operational resilience.</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-6 py-3 font-bold text-on-surface transition-all hover:bg-surface-container-low">Discard Changes</button>
          <button className="btn btn-primary">Publish Updates</button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <section className="relative col-span-12 overflow-hidden rounded-3xl bg-surface-container-lowest p-8 lg:col-span-8">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-bl-full bg-primary/5" />
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined icon icon-filled">payments</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Economic Model</h3>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <div className="stack">
              <div>
                <label className="mb-3 block text-sm font-bold text-on-surface-variant">Default Platform Commission (%)</label>
                <div className="relative">
                  <input className="w-full rounded-2xl border-2 border-transparent bg-surface p-4 text-xl font-bold transition-all focus:border-primary focus:ring-0" type="number" value={settings.commission} readOnly />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-primary">%</span>
                </div>
              </div>
              <div>
                <label className="mb-3 block text-sm font-bold text-on-surface-variant">Minimum Payout Threshold</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">$</span>
                  <input className="w-full rounded-2xl border-2 border-transparent bg-surface p-4 pl-10 text-xl font-bold transition-all focus:border-primary focus:ring-0" type="number" value={settings.payoutThreshold} readOnly />
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-surface-container-low p-6 space-y-4">
              <h4 className="flex items-center gap-2 font-bold"><span className="material-symbols-outlined icon text-tertiary-fixed-dim">analytics</span>Projected Monthly Revenue</h4>
              <div className="row row-between"><span className="text-sm text-on-surface-variant">Est. Platform Share</span><span className="text-xl font-black text-primary">$42,850</span></div>
              <div className="pt-4 flex justify-center">
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <svg className="h-full w-full -rotate-90">
                    <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8" />
                    <circle className="text-primary-fixed-dim" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364" strokeDashoffset="100" strokeLinecap="round" strokeWidth="10" />
                    <circle className="text-tertiary-fixed" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364" strokeDashoffset="240" strokeLinecap="round" strokeWidth="6" />
                  </svg>
                  <div className="absolute text-center"><span className="block text-lg font-black">72%</span><span className="text-label uppercase tracking-tighter opacity-60">Growth</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="col-span-12 flex flex-col rounded-3xl bg-surface-container-highest p-8 lg:col-span-4">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary">
              <span className="material-symbols-outlined icon">palette</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Visual Identity</h3>
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <label className="mb-3 block text-sm font-bold text-on-surface-variant">Primary Brand Color</label>
              <div className="flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-3">
                <div className="h-10 w-10 rounded-xl bg-primary" />
                <span className="font-mono text-sm font-bold">#a13a00</span>
                <button className="ml-auto text-sm font-bold text-primary">Change</button>
              </div>
            </div>
            <div>
              <label className="mb-3 block text-sm font-bold text-on-surface-variant">Typography Set</label>
              <div className="stack-xs">
                <div className="rounded-2xl border-2 border-primary/20 bg-surface-container-lowest p-3">
                  <p className="font-headline font-bold">Plus Jakarta Sans</p>
                  <p className="text-xs text-on-surface-variant">Headlines & Display</p>
                </div>
                <div className="rounded-2xl bg-surface-container-lowest p-3">
                  <p className="font-body font-bold">Manrope</p>
                  <p className="text-xs text-on-surface-variant">Body & Interface</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="col-span-12 rounded-3xl bg-surface-container-lowest p-8 md:col-span-6">
          <h3 className="mb-8 text-2xl font-bold tracking-tight">Automation Anchors</h3>
          <div className="stack-md">
            {[
              ["Smart Reminders", "Trigger nudge for inactive students", settings.automation.reminders, "auto_awesome"],
              ["Email Digest", "Weekly performance reports", settings.automation.digest, "mark_email_unread"],
              ["Auto-Verification", "Verify top-rated instructors", settings.automation.verification, "verified_user"],
            ].map(([title, description, enabled, icon]) => (
              <div key={title} className="row row-between cursor-pointer rounded-3xl bg-surface p-5 transition-all hover:bg-primary-container/10">
                <div className="flex items-center gap-4">
                  <span className={`material-symbols-outlined icon ${enabled ? "text-primary" : "text-on-surface-variant"}`}>{icon}</span>
                  <div>
                    <p className="font-bold">{title}</p>
                    <p className="text-xs text-on-surface-variant">{description}</p>
                  </div>
                </div>
                <div className={`relative h-6 w-12 rounded-full ${enabled ? "bg-primary" : "bg-surface-container-highest"}`}>
                  <div className={`absolute top-1 h-4 w-4 rounded-full bg-white ${enabled ? "right-1" : "left-1"}`} />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="col-span-12 rounded-3xl bg-primary-container p-8 text-on-primary-container md:col-span-6">
          <div className="flex h-full flex-col">
            <h3 className="mb-4 text-2xl font-black">System Resilience</h3>
            <p className="mb-8 font-medium opacity-80">Configure high-availability parameters and automated backup frequencies for the primary database clusters.</p>
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4"><span className="h-2 w-2 rounded-full bg-on-primary-container" /><span className="font-bold">Backup frequency: 6 hours</span></div>
              <div className="flex items-center gap-4"><span className="h-2 w-2 rounded-full bg-on-primary-container" /><span className="font-bold">Retention period: 90 days</span></div>
              <button className="row-xs row-center mt-6 w-full rounded-2xl bg-on-primary-container py-4 font-bold text-white">
                <span className="material-symbols-outlined icon">cloud_download</span>
                Download Audit Logs
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
