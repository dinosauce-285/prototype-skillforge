import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { MetricCard, SectionHeader } from "../components/ui";
import { currency, dateLabel } from "../lib/utils";
import { useAppState } from "../state/AppState";

function useAdminData() {
  const app = useAppState();
  const { state, courses } = app;
  const students = state.users.filter((user) => user.role === "student");
  const instructors = state.users.filter((user) => user.role === "instructor");
  const pendingOrgProfiles = instructors.filter((user) => user.organizationProfile?.status === "submitted");
  const pendingLegalRequests = state.legalApprovalRequests.filter((request) => request.status === "pending");
  const approvedLegalRequests = state.legalApprovalRequests.filter((request) => request.status === "approved");
  const totalRevenue = state.orders.reduce((sum, order) => sum + order.total, 0);
  const totalCertificates = state.users.reduce((sum, user) => sum + (user.certificates?.length ?? 0), 0);
  const activeCoupons = state.coupons.filter((coupon) => coupon.status === "Active");
  const verifiedCourses = courses.filter((course) => course.legalCertificate?.status === "approved");

  const recentFeed = [
    ...state.legalApprovalRequests.map((request) => ({
      id: `legal-${request.id}`,
      date: request.reviewedAt || request.submittedAt,
      title: `${request.courseTitle} legal review ${request.status}`,
      detail: `${request.instructorName} • ${request.status === "approved" ? "certificate flow activated" : request.status === "pending" ? "awaiting admin decision" : "review completed"}`,
    })),
    ...state.orders.map((order) => ({
      id: `order-${order.id}`,
      date: order.createdAt,
      title: `Order ${order.id} paid`,
      detail: `${order.courseIds.length} course(s) • ${currency(order.total)} • ${order.method}`,
    })),
    ...Object.entries(state.reviews).flatMap(([courseId, reviews]) =>
      reviews.map((review) => ({
        id: `review-${review.id}`,
        date: review.createdAt,
        title: `New learner review on ${courses.find((course) => course.id === courseId)?.title ?? courseId}`,
        detail: `${review.author} left ${review.rating} star feedback`,
      })),
    ),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return {
    ...app,
    students,
    instructors,
    pendingOrgProfiles,
    pendingLegalRequests,
    approvedLegalRequests,
    totalRevenue,
    totalCertificates,
    activeCoupons,
    verifiedCourses,
    recentFeed,
  };
}

function userStatusLabel(user) {
  if (user.role === "instructor" && user.organizationProfile?.status === "submitted") return "Org review pending";
  if (user.role === "instructor" && user.organizationProfile?.status === "approved") return "Organization approved";
  if (user.role === "student" && (user.certificates?.length ?? 0) > 0) return "Certified learner";
  return "Active";
}

function userStatusChipClass(user) {
  if (user.role === "instructor" && user.organizationProfile?.status === "submitted") return "demo-chip-primary";
  if (user.role === "instructor" && user.organizationProfile?.status === "approved") return "demo-chip-success";
  if (user.role === "student" && (user.certificates?.length ?? 0) > 0) return "demo-chip-success";
  return "demo-chip-muted";
}

function requestTone(status) {
  if (status === "approved" || status === "graded") return "demo-chip-success";
  if (status === "pending" || status === "pending_manual") return "demo-chip-primary";
  return "demo-chip-muted";
}

function queueLabel(status) {
  if (status === "pending_manual") return "Manual grading pending";
  if (status === "graded") return "Graded";
  if (status === "approved") return "Approved";
  if (status === "pending") return "Pending admin review";
  return status;
}

function financeAccountFor(state, userId) {
  return state.financeAccounts?.find((account) => account.userId === userId) ?? {
    walletBalance: 0,
    payoutAvailable: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    totalEarned: 0,
    preferredPayoutMethod: "Bank transfer",
  };
}

export function AdminPage() {
  const {
    state,
    students,
    instructors,
    pendingOrgProfiles,
    pendingLegalRequests,
    totalRevenue,
    totalCertificates,
    activeCoupons,
    verifiedCourses,
    recentFeed,
  } = useAdminData();

  return (
    <div className="space-y-8">
      <SectionHeader
        chip="Admin Flow"
        title="Platform operations"
        description="Admin owns the cross-platform checkpoints that unblock trust and revenue: verifying instructor entities, approving legal certificates, monitoring paid orders, and controlling platform-wide coupons."
        action={<NavLink className="btn btn-primary" to="/admin/courses">Open Operations Console</NavLink>}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard title="Students" value={String(students.length)} caption="Learners moving through purchase, learning, quiz, review, and certificate steps" />
        <MetricCard title="Instructors" value={String(instructors.length)} caption="Creators, graders, and legal certificate request owners" />
        <MetricCard title="Gross Revenue" value={currency(totalRevenue)} caption={`${state.orders.length} paid orders recorded in mock checkout`} />
        <MetricCard title="Open Admin Tasks" value={String(pendingOrgProfiles.length + pendingLegalRequests.length)} caption="Organization verification and legal approval items awaiting action" />
      </div>
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="demo-kpi p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-headline font-black tracking-tight">Flow health</h2>
              <p className="mt-2 text-sm text-on-surface-variant">These are the admin-controlled checkpoints that directly unblock the student and instructor journeys.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-surface-container-low p-6">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Instructor verification</div>
              <div className="mt-3 text-3xl font-black text-primary">{pendingOrgProfiles.length}</div>
              <p className="mt-2 text-sm text-on-surface-variant">Pending organization profiles waiting before instructors can operate trusted legal certificate flows.</p>
            </div>
            <div className="rounded-3xl bg-surface-container-low p-6">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Legal approval queue</div>
              <div className="mt-3 text-3xl font-black text-primary">{pendingLegalRequests.length}</div>
              <p className="mt-2 text-sm text-on-surface-variant">Course-specific verification packages awaiting final admin signoff.</p>
            </div>
            <div className="rounded-3xl bg-surface-container-low p-6">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Verified courses</div>
              <div className="mt-3 text-3xl font-black text-primary">{verifiedCourses.length}</div>
              <p className="mt-2 text-sm text-on-surface-variant">Courses already cleared for trusted certificate issuance.</p>
            </div>
            <div className="rounded-3xl bg-surface-container-low p-6">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Credential output</div>
              <div className="mt-3 text-3xl font-black text-primary">{totalCertificates}</div>
              <p className="mt-2 text-sm text-on-surface-variant">{verifiedCourses.length} verified courses are actively feeding the learner certificate experience.</p>
            </div>
          </div>
        </section>
        <section className="demo-kpi p-8">
          <h2 className="text-3xl font-headline font-black tracking-tight">Admin shortcuts</h2>
          <div className="mt-6 grid gap-4">
            <NavLink className="rounded-3xl bg-surface-container-low px-5 py-5 transition-colors hover:bg-surface-container" to="/admin/users">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Users</div>
              <div className="mt-2 text-xl font-black text-on-surface">Verify instructors and audit learner state</div>
            </NavLink>
            <NavLink className="rounded-3xl bg-surface-container-low px-5 py-5 transition-colors hover:bg-surface-container" to="/admin/courses">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Moderation</div>
              <div className="mt-2 text-xl font-black text-on-surface">Work legal approvals and review order activity</div>
            </NavLink>
            <NavLink className="rounded-3xl bg-surface-container-low px-5 py-5 transition-colors hover:bg-surface-container" to="/admin/coupons">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Coupons</div>
              <div className="mt-2 text-xl font-black text-on-surface">Manage active platform promotions used in checkout</div>
            </NavLink>
            <NavLink className="rounded-3xl bg-surface-container-low px-5 py-5 transition-colors hover:bg-surface-container" to="/admin/finance">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Finance</div>
              <div className="mt-2 text-xl font-black text-on-surface">Review payouts and move treasury funds</div>
            </NavLink>
            <NavLink className="rounded-3xl bg-surface-container-low px-5 py-5 transition-colors hover:bg-surface-container" to="/admin/settings">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Settings</div>
              <div className="mt-2 text-xl font-black text-on-surface">Control platform economics, automation rules, and resilience defaults</div>
            </NavLink>
            <div className="rounded-3xl border border-emerald-200 bg-[linear-gradient(135deg,#f7fff8_0%,#ecfdf3_100%)] px-5 py-5">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Live platform state</div>
              <div className="mt-2 text-xl font-black text-on-surface">{activeCoupons.length} active coupons, {verifiedCourses.length} verified courses, {state.orders.length} total orders</div>
            </div>
          </div>
        </section>
      </div>
      <section className="demo-kpi p-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-black tracking-tight">Recent operational activity</h2>
            <p className="mt-2 text-sm text-on-surface-variant">A dense audit-style feed scales better than large cards when the system grows.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Date</th>
                <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Activity</th>
                <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {recentFeed.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4 text-sm font-bold text-on-surface">{dateLabel(item.date)}</td>
                  <td className="px-4 py-4 text-sm font-bold text-on-surface">{item.title}</td>
                  <td className="px-4 py-4 text-sm text-on-surface-variant">{item.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function AdminUsersPage() {
  const { state, students, instructors, pendingOrgProfiles, actions } = useAdminData();
  const [notesByUserId, setNotesByUserId] = useState(() =>
    Object.fromEntries(
      state.users
        .filter((user) => user.organizationProfile)
        .map((user) => [user.id, user.organizationProfile?.notes || ""]),
    ),
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        chip="User Oversight"
        title="Users and organization verification"
        description="Student and instructor records are visible here, but the key admin action is verifying instructor organization profiles so legal certificate requests can move forward."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard title="Total Users" value={String(state.users.length)} caption="All student, instructor, and admin accounts" />
        <MetricCard title="Students" value={String(students.length)} caption="Learners with enrollments, progress, reviews, and certificates" />
        <MetricCard title="Instructors" value={String(instructors.length)} caption="Course owners and grading operators" />
        <MetricCard title="Pending Org Reviews" value={String(pendingOrgProfiles.length)} caption="Instructor organizations waiting on admin verification" />
      </div>
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-headline font-black tracking-tight">Organization verification queue</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Approve these entities first, then their course-level legal certificate requests can be handled in the operations console.</p>
        </div>
        <div className="grid gap-6">
          {pendingOrgProfiles.map((user) => (
            <div key={user.id} className="demo-kpi p-6">
              <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant">{user.name}</div>
                  <h3 className="mt-2 text-2xl font-headline font-black">{user.organizationProfile.businessName}</h3>
                  <p className="mt-2 text-sm text-on-surface-variant">{user.email} • {user.organizationProfile.issuingAuthority}</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-surface-container-low p-4"><div className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2">Decision</div><div className="font-bold">{user.organizationProfile.centerDecision}</div></div>
                    <div className="rounded-2xl bg-surface-container-low p-4"><div className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2">License</div><div className="font-bold">{user.organizationProfile.licenseNumber}</div></div>
                    <div className="rounded-2xl bg-surface-container-low p-4"><div className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2">Submitted</div><div className="font-bold">{dateLabel(user.organizationProfile.submittedAt)}</div></div>
                  </div>
                  <div className="mt-5 rounded-2xl bg-surface-container-low p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2">Documents</div>
                    <div className="space-y-2">
                      {user.organizationProfile.documents.map((document) => (
                        <div key={document.id} className="flex items-center justify-between rounded-2xl bg-white px-3 py-3">
                          <div className="font-bold text-on-surface">{document.name}</div>
                          <div className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">{document.type}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <textarea className="demo-textarea" placeholder="Admin verification note" value={notesByUserId[user.id] ?? ""} onChange={(event) => setNotesByUserId((prev) => ({ ...prev, [user.id]: event.target.value }))} />
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <button className="btn btn-primary" onClick={() => actions.reviewOrganizationProfile(user.id, { status: "approved", notes: notesByUserId[user.id] ?? "" })}>Approve Organization</button>
                    <button className="btn btn-surface" onClick={() => actions.reviewOrganizationProfile(user.id, { status: "rejected", notes: notesByUserId[user.id] ?? "" })}>Reject</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!pendingOrgProfiles.length ? <div className="demo-kpi p-8 text-on-surface-variant">No pending organization verifications right now.</div> : null}
        </div>
      </section>
      <section className="demo-kpi overflow-hidden p-0">
        <div className="border-b border-black/5 px-6 py-5">
          <h2 className="text-3xl font-headline font-black tracking-tight">All platform users</h2>
          <p className="mt-2 text-sm text-on-surface-variant">This mirrors the actual lifecycle data coming from enrollments, certificates, and instructor verification state.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">User</th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Role</th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Lifecycle State</th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Courses</th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Certificates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {state.users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-5">
                    <div className="font-bold text-on-surface">{user.name}</div>
                    <div className="text-sm text-on-surface-variant">{user.email}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold capitalize text-on-surface">{user.role}</span>
                    <div className="text-xs text-on-surface-variant">{user.id}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`demo-chip ${userStatusChipClass(user)}`}>{userStatusLabel(user)}</span>
                  </td>
                  <td className="px-6 py-5 font-bold text-on-surface">{user.enrolledCourseIds?.length ?? 0}</td>
                  <td className="px-6 py-5 font-bold text-on-surface">{user.certificates?.length ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function AdminCoursesPage() {
  const { courses, state, pendingLegalRequests, approvedLegalRequests, verifiedCourses, actions } = useAdminData();
  const [notesByRequestId, setNotesByRequestId] = useState(() => Object.fromEntries(state.legalApprovalRequests.map((request) => [request.id, request.adminNotes || ""])));
  const recentOrders = useMemo(() => [...state.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6), [state.orders]);

  return (
    <div className="space-y-8">
      <SectionHeader
        chip="Operations Console"
        title="Compliance, grading, and transaction oversight"
        description="This admin surface stays focused on the highest-value checkpoints: legal certificate approval and paid order monitoring."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard title="Pending Legal" value={String(pendingLegalRequests.length)} caption="Course certificate packages waiting on admin signoff" />
        <MetricCard title="Approved Legal" value={String(approvedLegalRequests.length)} caption="Requests already activated for verified certificate issuance" />
        <MetricCard title="Verified Courses" value={String(verifiedCourses.length)} caption="Courses currently carrying approved legal certificate status" />
        <MetricCard title="Recent Orders" value={String(state.orders.length)} caption="Paid transactions feeding enrollments and revenue" />
      </div>
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-headline font-black tracking-tight">Legal certificate approvals</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Use a compact queue so the team can scan and process high request volume without oversized cards.</p>
        </div>
        <div className="demo-kpi overflow-x-auto p-0">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Course</th>
                <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Instructor</th>
                <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Submitted</th>
                <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Admin Note</th>
                <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
          {state.legalApprovalRequests.map((request) => {
            const course = courses.find((item) => item.id === request.courseId);
            return (
              <tr key={request.id}>
                <td className="px-4 py-4 align-top">
                  <div className="font-bold text-on-surface">{request.courseTitle}</div>
                  <div className="text-xs text-on-surface-variant">{course?.category} • {course?.level}</div>
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="font-bold text-on-surface">{request.instructorName}</div>
                  <div className="text-xs text-on-surface-variant">{request.organizationName}</div>
                </td>
                <td className="px-4 py-4 align-top text-sm text-on-surface">{dateLabel(request.submittedAt)}</td>
                <td className="px-4 py-4 align-top">
                  <span className={`demo-chip ${requestTone(request.status)}`}>{queueLabel(request.status)}</span>
                </td>
                <td className="px-4 py-4 align-top">
                  <textarea className="demo-textarea min-w-[220px]" placeholder="Decision note" value={notesByRequestId[request.id] ?? ""} onChange={(event) => setNotesByRequestId((prev) => ({ ...prev, [request.id]: event.target.value }))} />
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="flex min-w-[180px] flex-col gap-2">
                    <button className="btn btn-primary" disabled={request.status === "approved"} onClick={() => actions.reviewLegalCertificateRequest(request.id, { status: "approved", adminNotes: notesByRequestId[request.id] ?? "" })}>Approve</button>
                    <button className="btn btn-surface" disabled={request.status === "rejected"} onClick={() => actions.reviewLegalCertificateRequest(request.id, { status: "rejected", adminNotes: notesByRequestId[request.id] ?? "" })}>Reject</button>
                  </div>
                </td>
              </tr>
            );
          })}
            </tbody>
          </table>
        </div>
      </section>
      <section className="demo-kpi p-8">
          <h2 className="text-3xl font-headline font-black tracking-tight">Paid order ledger</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Orders are the bridge between the student cart flow and instructor/admin revenue visibility.</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low/60">
                  <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Order</th>
                  <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Date</th>
                  <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Method</th>
                  <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-4">
                      <div className="font-bold text-on-surface">{order.id}</div>
                      <div className="text-sm text-on-surface-variant">{order.courseIds.length} course(s)</div>
                    </td>
                    <td className="px-4 py-4 font-bold text-on-surface">{dateLabel(order.createdAt)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{order.method}</td>
                    <td className="px-4 py-4 font-black text-primary">{currency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </section>
    </div>
  );
}

export function AdminCouponsPage() {
  const { state, actions } = useAdminData();
  const [form, setForm] = useState({ code: "", type: "percent", value: 15, description: "" });
  const activeCoupons = state.coupons.filter((coupon) => coupon.status === "Active");
  const pausedCoupons = state.coupons.filter((coupon) => coupon.status !== "Active");
  const estimatedDiscountExposure = activeCoupons.reduce((sum, coupon) => sum + Number(coupon.value || 0), 0);

  return (
    <div className="space-y-8">
      <SectionHeader
        chip="Coupon Governance"
        title="Platform promotions"
        description="Coupons are shared across the student checkout flow, so admin only needs a lightweight creation and activation console."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard title="Total Coupons" value={String(state.coupons.length)} caption="All seeded and newly created promotions" />
        <MetricCard title="Active" value={String(activeCoupons.length)} caption="Currently available in checkout" />
        <MetricCard title="Paused" value={String(pausedCoupons.length)} caption="Campaigns held back from learners" />
        <MetricCard title="Exposure" value={String(estimatedDiscountExposure)} caption="Simple sum of active discount values for demo reporting" />
      </div>
      <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="demo-kpi p-8">
          <h2 className="text-3xl font-headline font-black tracking-tight">Create coupon</h2>
          <div className="mt-6 space-y-4">
            <input className="demo-input" placeholder="Coupon code" value={form.code} onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))} />
            <select className="demo-select" value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}>
              <option value="percent">percent</option>
              <option value="fixed">fixed</option>
            </select>
            <input className="demo-input" type="number" value={form.value} onChange={(event) => setForm((prev) => ({ ...prev, value: event.target.value }))} />
            <input className="demo-input" placeholder="Description" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
            <button className="btn btn-primary btn-w-full" type="button" onClick={() => { if (!form.code.trim()) return; actions.createCoupon(form); setForm({ code: "", type: "percent", value: 15, description: "" }); }}>Create Platform Coupon</button>
          </div>
        </section>
        <section className="demo-kpi p-8">
          <h2 className="text-3xl font-headline font-black tracking-tight">Coupon inventory</h2>
          <div className="mt-6 space-y-4">
            {state.coupons.map((coupon) => (
              <div key={coupon.code} className="rounded-3xl bg-surface-container-low p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-black text-on-surface">{coupon.code}</div>
                      <span className={`demo-chip ${coupon.status === "Active" ? "demo-chip-success" : "demo-chip-muted"}`}>{coupon.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-on-surface-variant">{coupon.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Discount</div>
                      <div className="font-black text-on-surface">{coupon.type === "percent" ? `${coupon.value}%` : currency(coupon.value)}</div>
                    </div>
                    <button className="btn btn-surface" onClick={() => actions.updateCoupon(coupon.code, { status: coupon.status === "Active" ? "Paused" : "Active" })}>{coupon.status === "Active" ? "Pause" : "Activate"}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function AdminFinancePage() {
  const { currentUser, state, actions } = useAdminData();
  const account = financeAccountFor(state, currentUser.id);
  const payoutRequests = state.payoutRequests ?? [];
  const financeTransactions = state.financeTransactions ?? [];
  const [fundForm, setFundForm] = useState({ amount: 500, method: "Bank transfer" });
  const [withdrawForm, setWithdrawForm] = useState({ amount: 250, method: "Bank transfer" });
  const [notesByRequestId, setNotesByRequestId] = useState(() => Object.fromEntries(payoutRequests.map((request) => [request.id, request.adminNotes || ""])));
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-8">
      <SectionHeader
        chip="Platform Finance"
        title="Treasury and payout operations"
        description="Manage platform cash reserves, release instructor withdrawals, and keep a shared ledger of money movement across the marketplace."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard title="Platform Reserve" value={currency(account.walletBalance)} caption="Cash currently held in the platform treasury" />
        <MetricCard title="Pending Payouts" value={String(payoutRequests.filter((request) => request.status === "pending").length)} caption="Instructor withdrawals waiting for admin review" />
        <MetricCard title="Treasury Inflow" value={currency(account.totalDeposited)} caption="Funding plus captured learner order money" />
        <MetricCard title="Treasury Outflow" value={currency(account.totalWithdrawn)} caption="Approved settlements and reserve withdrawals" />
      </div>
      <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="demo-kpi p-8">
          <h2 className="text-3xl font-headline font-black tracking-tight">Treasury actions</h2>
          <div className="mt-6 space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant">Fund reserve</div>
              <input className="demo-input" type="number" value={fundForm.amount} onChange={(event) => setFundForm((prev) => ({ ...prev, amount: event.target.value }))} />
              <select className="demo-select" value={fundForm.method} onChange={(event) => setFundForm((prev) => ({ ...prev, method: event.target.value }))}>
                <option value="Bank transfer">Bank transfer</option>
                <option value="Card">Card</option>
              </select>
              <button className="btn btn-primary btn-w-full" type="button" onClick={() => { const result = actions.topUpWallet(fundForm.amount, fundForm.method); setMessage(result.message); }}>Add Funds</button>
            </div>
            <div className="space-y-4 border-t border-black/5 pt-8">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-on-surface-variant">Withdraw reserve</div>
              <input className="demo-input" type="number" value={withdrawForm.amount} onChange={(event) => setWithdrawForm((prev) => ({ ...prev, amount: event.target.value }))} />
              <select className="demo-select" value={withdrawForm.method} onChange={(event) => setWithdrawForm((prev) => ({ ...prev, method: event.target.value }))}>
                <option value="Bank transfer">Bank transfer</option>
                <option value="Internal transfer">Internal transfer</option>
              </select>
              <button className="btn btn-surface btn-w-full" type="button" onClick={() => { const result = actions.withdrawFromWallet(withdrawForm.amount, withdrawForm.method); setMessage(result.message); }}>Withdraw Funds</button>
            </div>
            {message ? <p className="text-sm font-medium text-primary">{message}</p> : null}
          </div>
        </section>
        <section className="demo-kpi p-8">
          <h2 className="text-3xl font-headline font-black tracking-tight">Payout approval queue</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="demo-table">
              <thead>
                <tr>
                  <th>Instructor</th>
                  <th>Requested</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Admin Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payoutRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className="font-bold">{request.instructorName}</div>
                      <div className="text-sm text-on-surface-variant">{request.destination}</div>
                    </td>
                    <td>{dateLabel(request.requestedAt)}</td>
                    <td className="font-bold text-primary">{currency(request.amount)}</td>
                    <td>{request.method}</td>
                    <td><textarea className="demo-textarea min-w-[220px]" value={notesByRequestId[request.id] ?? ""} onChange={(event) => setNotesByRequestId((prev) => ({ ...prev, [request.id]: event.target.value }))} /></td>
                    <td>
                      {request.status === "pending" ? (
                        <div className="flex min-w-[180px] flex-col gap-2">
                          <button className="btn btn-primary" type="button" onClick={() => actions.reviewPayoutRequest(request.id, { status: "approved", adminNotes: notesByRequestId[request.id] ?? "" })}>Approve</button>
                          <button className="btn btn-surface" type="button" onClick={() => actions.reviewPayoutRequest(request.id, { status: "rejected", adminNotes: notesByRequestId[request.id] ?? "" })}>Reject</button>
                        </div>
                      ) : (
                        <span className={`demo-chip ${request.status === "approved" ? "demo-chip-success" : "demo-chip-muted"}`}>{request.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <section className="demo-kpi p-8">
        <h2 className="text-3xl font-headline font-black tracking-tight">Platform finance ledger</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="demo-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Role</th>
                <th>Type</th>
                <th>Method</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {financeTransactions.map((item) => (
                <tr key={item.id}>
                  <td>{dateLabel(item.createdAt)}</td>
                  <td>{item.userId}</td>
                  <td className="capitalize">{item.role}</td>
                  <td className="font-bold">{item.type.replaceAll("_", " ")}</td>
                  <td>{item.method}</td>
                  <td><span className={`demo-chip ${item.status === "completed" ? "demo-chip-success" : "demo-chip-primary"}`}>{item.status}</span></td>
                  <td className="font-bold text-primary">{currency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function AdminSettingsPage() {
  const { state, courses, actions } = useAdminData();
  const [settings, setSettings] = useState({
    platformCommission: state.platformSettings?.commissionRate ?? 30,
    minimumPayoutThreshold: state.platformSettings?.minimumPayoutThreshold ?? 100,
    legalReviewSlaDays: 3,
    backupFrequencyHours: 6,
    retentionDays: 90,
  });

  const totalRevenue = state.orders.reduce((sum, order) => sum + order.total, 0);
  const projectedPlatformShare = totalRevenue * (Number(settings.platformCommission) / 100);
  const verifiedCourses = courses.filter((course) => course.legalCertificate?.status === "approved").length;
  const pendingLegalRequests = state.legalApprovalRequests.filter((request) => request.status === "pending").length;

  return (
    <div className="space-y-8">
      <SectionHeader
        chip="System Settings"
        title="Platform policies"
        description="Keep settings limited to stable business rules and operational controls that an admin team would realistically own."
        action={<button className="btn btn-primary" type="button" onClick={() => actions.updatePlatformSettings({ commissionRate: Number(settings.platformCommission), minimumPayoutThreshold: Number(settings.minimumPayoutThreshold) })}>Save Finance Policy</button>}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard title="Commission" value={`${settings.platformCommission}%`} caption="Default platform share for new course revenue" />
        <MetricCard title="Payout Threshold" value={currency(settings.minimumPayoutThreshold)} caption="Minimum balance before instructor payout release" />
        <MetricCard title="Legal SLA" value={`${settings.legalReviewSlaDays} days`} caption="Target turnaround for pending legal certificate reviews" />
        <MetricCard title="Evidence Retention" value={`${settings.retentionDays} days`} caption="Minimum audit trail retention for compliance records" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="demo-kpi p-8">
          <h2 className="text-3xl font-headline font-black tracking-tight">Revenue policy</h2>
          <p className="mt-2 text-sm text-on-surface-variant">These defaults shape instructor economics across new course launches.</p>
          <div className="mt-6 space-y-6">
            <label className="block">
              <div className="mb-3 text-sm font-bold text-on-surface-variant">Default Platform Commission (%)</div>
              <div className="relative">
                <input
                  className="demo-input pr-10 text-xl font-black"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.platformCommission}
                  onChange={(event) => setSettings((prev) => ({ ...prev, platformCommission: event.target.value }))}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-primary">%</span>
              </div>
            </label>
            <label className="block">
              <div className="mb-3 text-sm font-bold text-on-surface-variant">Minimum Payout Threshold</div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">$</span>
                <input
                  className="demo-input pl-10 text-xl font-black"
                  type="number"
                  min="0"
                  value={settings.minimumPayoutThreshold}
                  onChange={(event) => setSettings((prev) => ({ ...prev, minimumPayoutThreshold: event.target.value }))}
                />
              </div>
            </label>
            <div className="rounded-3xl bg-surface-container-low p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Current gross revenue</span>
                <span className="text-lg font-black text-on-surface">{currency(totalRevenue)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Projected platform share</span>
                <span className="text-lg font-black text-primary">{currency(projectedPlatformShare)}</span>
              </div>
            </div>
          </div>
        </section>
        <section className="demo-kpi p-8">
          <h2 className="text-3xl font-headline font-black tracking-tight">Compliance policy</h2>
          <p className="mt-2 text-sm text-on-surface-variant">These settings support the legal certificate workflow and audit readiness.</p>
          <div className="mt-6 space-y-6">
            <label className="block">
              <div className="mb-3 text-sm font-bold text-on-surface-variant">Legal Review SLA (days)</div>
              <input
                className="demo-input text-xl font-black"
                type="number"
                min="1"
                value={settings.legalReviewSlaDays}
                onChange={(event) => setSettings((prev) => ({ ...prev, legalReviewSlaDays: event.target.value }))}
              />
            </label>
            <label className="block">
              <div className="mb-3 text-sm font-bold text-on-surface-variant">Evidence Retention (days)</div>
              <input
                className="demo-input text-xl font-black"
                type="number"
                min="1"
                value={settings.retentionDays}
                onChange={(event) => setSettings((prev) => ({ ...prev, retentionDays: event.target.value }))}
              />
            </label>
            <label className="block">
              <div className="mb-3 text-sm font-bold text-on-surface-variant">Backup Frequency (hours)</div>
              <input
                className="demo-input text-xl font-black"
                type="number"
                min="1"
                value={settings.backupFrequencyHours}
                onChange={(event) => setSettings((prev) => ({ ...prev, backupFrequencyHours: event.target.value }))}
              />
            </label>
            <div className="rounded-3xl bg-surface-container-low p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Pending legal requests</span>
                <span className="text-lg font-black text-on-surface">{pendingLegalRequests}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Verified courses</span>
                <span className="text-lg font-black text-primary">{verifiedCourses}</span>
              </div>
            </div>
            <button className="btn btn-surface" type="button">Download Audit Logs</button>
          </div>
        </section>
      </div>
    </div>
  );
}
