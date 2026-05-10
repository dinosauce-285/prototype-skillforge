import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { STORAGE_KEY } from "../lib/utils";
import { useAppState } from "../state/AppState";
import { homePathForRole } from "../lib/utils";

const demoAccounts = [
  { label: "Student", email: "student@demo.com", password: "demo123" },
  { label: "Instructor", email: "instructor@demo.com", password: "demo123" },
  { label: "Admin", email: "admin@demo.com", password: "demo123" },
];

export function LoginWorkspacePage() {
  return <AuthPage mode="login" />;
}

export function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { actions } = useAppState();
  const [form, setForm] = useState({ name: "", email: "", password: "demo123" });
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const result =
      mode === "login"
        ? actions.login(form.email, form.password)
        : actions.register({ name: form.name, email: form.email, password: form.password });
    if (!result.ok) return setError(result.message);
    navigate(homePathForRole(result.user.role));
  }

  function useDemoAccount(account) {
    setError("");
    setForm((prev) => ({
      ...prev,
      email: account.email,
      password: account.password,
      name: prev.name || "Alex Forge",
    }));
  }

  function signInWithDemo(account) {
    const result = actions.login(account.email, account.password);
    if (!result.ok) return setError(result.message);
    navigate(homePathForRole(result.user.role));
  }

  function resetDemoState() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  return (
    mode === "login" ? (
      <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
        <section className="hidden md:flex md:w-1/2 lg:w-7/12 relative bg-surface-container-low p-16 items-center justify-center">
          <div className="z-10 max-w-xl">
            <div className="mb-12">
              <span className="sf-brand text-3xl">SkillForge</span>
            </div>
            <h1 className="font-headline font-bold text-6xl lg:text-7xl text-on-surface leading-[1.1] mb-8">
              Craft your <br />
              <span className="text-primary">future self.</span>
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed mb-12 max-w-md">
              Access premium editorial courses designed by industry titans. Move beyond standard learning.
            </p>
            <div className="flex gap-4 items-center">
              <div className="flex -space-x-4">
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYxIezaZNjZLnhkYh6ssz8Y_rmDYr5JOv8Njv80aElAbv4oxPRYwcIoafFuPptbwQ2uJzmNSJboiJf_SiDCew3jOQTiJ3rRLcprkvrm_wcVJe9KWSW-4z_hwPbUBKBCZ5wsP4NYzZRM330xVepvMdwF1lZE5Ug5i9ELO_LFyng7GAIUAmYEn1r-LLE62YWDRcMRMY5PGPdloKtOIKjgUyO3q9yoP31_c4AgqSJ105zLhyMAhgKyr07ifvJN7H_SMDAZ2eL8fe8ReAc",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBDvBr1pepeFOs8M8-z_o5ojAiYmpaR9rht4p-fT3td0U6NZObOx32tqhYJR9RTj9jI4BV9ThtOEOU3JzY1Pkaenb2v2AzPu-251REHCyF4yE6Ud1X_N4_-Wt2L6pV0AvKWStr2Hl6LNo9OKt3RE8Wxtat4HQYXA5fc1BjYfskDwjzbwRVvDuIzZVfKscZ1Nin3R5ZaCBrWFOtLcljW0W4QW73mWJrY3KaozdF7426NcwaTPVxqsw_ECVoFyK6Ol-FxNkghlZP25NeF",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCBLsnVV_jeSy-I8mGaA_dJASttDnw8o5NiiYKVTFeGNNWRlPKuvZhy6ne3Kgf7WypY_3uPYF5iBJheVqSiqWRsE9lll9KqV61TSqmrJsYilXSnL3faDm1wAfb6F3O_lvZc1d3U1M5CHFU0PB-Z-MqtOkRz3HlXnniXeq_P6c6Kp9vHe1YbmtyeW5pPRfOLv1LRVJMt5-4hOUC7VTwSTDgVYaU0uFeS-OvllZPnjAIHHpGo-qTR0pbOkNep7kyv2feZq3p8Jq55o45c",
                ].map((src) => <img key={src} className="w-12 h-12 rounded-full border-4 border-surface-container-low object-cover" src={src} alt="" />)}
              </div>
              <span className="text-sm font-label font-semibold text-on-surface-variant tracking-wide">Joined by 12,000+ learners this month</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed opacity-20 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-container opacity-10 blur-[120px] rounded-full -ml-48 -mb-48" />
          <div className="absolute bottom-16 right-16 overflow-hidden rounded-xl shadow-md w-48 aspect-square">
            <img className="w-full h-full object-cover grayscale opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_-Mlz_y1pARawUnh3Feo_a96b_LVJ5Z-q2Q0MEw-uneYWn1Q7lNgZt1Uofwv2Qcse_nVDEaDz11OlESwD2yV46S6JiljoPZVz-ZhiQPCCzbq60flbiHSbBeJFrmLv7-PMCUeR8PZBzgrCqQsj0pjyNoQdGYpEhgKVnKxRR-bEn2Z81NS-sMLroqZFjQU11KRJgY9ULT4C0wwhA_FMdxHgJuz7ImoY71F3kZIReLsEaD0cDpBpEOHjJJJ3qTqSkqMpz9Y4Xi_x6fYv" alt="" />
          </div>
        </section>
        <section className="flex-1 bg-surface-container-lowest flex items-center justify-center p-8 md:p-16 lg:p-24 overflow-y-auto">
          <div className="w-full max-w-md space-y-10">
            <div className="md:hidden flex justify-center mb-8">
              <span className="font-headline font-black text-3xl text-primary-container italic tracking-tight">SkillForge</span>
            </div>
            <header className="stack-sm">
              <h2 className="font-headline font-bold text-4xl text-on-surface tracking-tight">Welcome back</h2>
              <p className="text-on-surface-variant font-medium">Continue your editorial learning journey.</p>
            </header>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl font-label font-bold text-on-surface">Google</button>
              <button className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl font-label font-bold text-on-surface">Facebook</button>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-outline-variant opacity-30" />
              <span className="text-xs font-label font-bold text-outline uppercase tracking-[0.2em]">Or with email</span>
              <div className="h-[1px] flex-1 bg-outline-variant opacity-30" />
            </div>
            <form className="stack" onSubmit={submit}>
              <div className="space-y-5">
                <div className="stack-xs">
                  <label className="block text-sm font-label font-bold text-on-surface-variant" htmlFor="email">Email Address</label>
                  <input className="w-full h-14 px-6 bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container rounded-xl text-on-surface placeholder:text-outline/50 transition-all" id="email" placeholder="name@company.com" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
                </div>
                <div className="stack-xs">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-label font-bold text-on-surface-variant" htmlFor="password">Password</label>
                    <button className="text-xs font-label font-bold text-primary hover:underline underline-offset-4 tracking-wide" type="button">Forgot Password?</button>
                  </div>
                  <input className="w-full h-14 px-6 bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container rounded-xl text-on-surface placeholder:text-outline/50 transition-all" id="password" placeholder="••••••••" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
                </div>
              </div>
              {error ? <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm font-medium">{error}</div> : null}
              <button className="btn btn-primary btn-lg btn-pill btn-w-full" type="submit">Sign In</button>
            </form>
            <div className="space-y-3">
              <p className="text-xs font-label font-bold text-outline uppercase tracking-[0.2em]">Demo Accounts</p>
              <div className="grid gap-3">
                {demoAccounts.map((account) => (
                  <div key={account.label} className="rounded-2xl bg-surface-container-low px-4 py-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="font-bold">{account.label}</div>
                        <div className="text-sm text-on-surface-variant">{account.email}</div>
                        <div className="text-xs text-on-surface-variant">Password: {account.password}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="btn btn-surface btn-w-full" onClick={() => useDemoAccount(account)} type="button">Use</button>
                      <button className="btn btn-primary btn-w-full" onClick={() => signInWithDemo(account)} type="button">Login Fast</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-4 text-sm text-on-surface-variant">
                <p className="mb-3">If `admin@demo.com` cannot log in, your saved local demo state is probably stale.</p>
                <button className="btn btn-surface btn-w-full" onClick={resetDemoState} type="button">Reset Local Demo Data</button>
              </div>
            </div>
            <div className="pt-6 text-center">
              <p className="text-on-surface-variant font-medium">
                Don&apos;t have an account?
                <button className="text-primary font-bold hover:underline underline-offset-4 ml-1" onClick={() => navigate("/register")} type="button">Create Account</button>
              </p>
            </div>
          </div>
        </section>
      </main>
    ) : (
      <main className="min-h-screen flex flex-col md:flex-row">
        <section className="hidden md:flex md:w-1/2 lg:w-3/5 bg-surface-container-low relative overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0 z-0">
            <img alt="" className="w-full h-full object-cover opacity-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfvyg6DJFpWl0q5tHLzBSlNFmYSa5kVOowa6483KBHfSlCK79NmX2vI93RvL9PRfnTk149YyeananxT3MR0BZBGSpUlY178ezXc7EKDx1gwfJaQPVqDrQgiNsS21wFqvZhoS0v19ZD1g2FTAqSX_qR09p2chP6o6xy1MvnHmeKlaRyuxjk1Usw-wHHHVXcwXF-PimN7K2uruQ-jyYIOrKylT97kiI3fxpS7HnAMjxezfvnTeeQeLppufWi7reUEBmJjQPsHx2IcdVI" />
          </div>
          <div className="relative z-10 max-w-xl">
            <div className="mb-8 flex items-center gap-2">
              <span className="sf-brand text-3xl">SkillForge</span>
            </div>
            <h1 className="font-headline font-bold text-6xl lg:text-7xl text-on-surface leading-[1.1] mb-6 tracking-tight">
              Master your <br />
              <span className="text-primary-container">intellectual</span> <br />
              craft.
            </h1>
            <p className="text-xl text-on-surface-variant font-light leading-relaxed max-w-md">
              Join a community of dedicated learners. Access curated content designed for deep focus and high-end professional growth.
            </p>
            <div className="mt-12 flex gap-4">
              <div className="h-1 w-12 bg-primary-container rounded-full" />
              <div className="h-1 w-4 bg-outline-variant rounded-full" />
              <div className="h-1 w-4 bg-outline-variant rounded-full" />
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-fixed/20 rounded-full blur-3xl" />
        </section>
        <section className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 bg-surface-bright">
          <div className="container-xs">
            <header className="mb-10">
              <h2 className="font-headline font-bold text-3xl text-on-surface mb-2">Create your account</h2>
              <p className="text-on-surface-variant">Start your journey toward mastery today.</p>
            </header>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-lowest hover:bg-surface-container-low rounded-xl transition-all duration-200 shadow-md active:scale-[0.98]">Google</button>
              <button className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-lowest hover:bg-surface-container-low rounded-xl transition-all duration-200 shadow-md active:scale-[0.98]">Facebook</button>
            </div>
            <div className="relative flex py-4 items-center mb-8">
              <div className="flex-grow border-t border-outline-variant/30" />
              <span className="flex-shrink mx-4 text-sm font-label font-medium text-on-surface-variant uppercase tracking-widest">or email</span>
              <div className="flex-grow border-t border-outline-variant/30" />
            </div>
            <form className="stack" onSubmit={submit}>
              <div className="stack-xs">
                <label className="block font-label font-bold text-sm text-on-surface ml-1 tracking-wide" htmlFor="full_name">Full Name</label>
                <input className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/40" id="full_name" placeholder="Alex Forge" type="text" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
              </div>
              <div className="stack-xs">
                <label className="block font-label font-bold text-sm text-on-surface ml-1 tracking-wide" htmlFor="register_email">Email Address</label>
                <input className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/40" id="register_email" placeholder="alex@example.com" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
              </div>
              <div className="stack-xs">
                <label className="block font-label font-bold text-sm text-on-surface ml-1 tracking-wide" htmlFor="register_password">Password</label>
                <input className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/40" id="register_password" placeholder="••••••••" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
              </div>
              {error ? <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm font-medium">{error}</div> : null}
              <div className="flex items-start gap-3 px-1">
                <input className="h-5 w-5 rounded-md border-none bg-surface-container-high text-primary-container focus:ring-primary-container mt-0.5" id="terms" name="terms" type="checkbox" required />
                <label className="text-sm text-on-surface-variant leading-relaxed" htmlFor="terms">
                  I agree to the <span className="text-primary font-semibold">Terms of Service</span> and <span className="text-primary font-semibold">Privacy Policy</span>.
                </label>
              </div>
              <button className="btn btn-primary btn-lg btn-pill btn-w-full mt-4" type="submit">Create Account</button>
            </form>
            <div className="rounded-2xl bg-surface-container-low px-4 py-4 text-sm text-on-surface-variant">
              Existing demo accounts are available on the sign-in screen:
              <span className="font-semibold text-on-surface"> `student@demo.com`, `instructor@demo.com`, `admin@demo.com`</span>
            </div>
            <footer className="mt-10 text-center">
              <p className="text-on-surface-variant">
                Already have an account?
                <button className="text-primary font-bold ml-1 hover:underline tracking-tight" onClick={() => navigate("/login")} type="button">Sign In</button>
              </p>
            </footer>
          </div>
          <div className="mt-auto pt-12 md:hidden text-center">
            <span className="text-primary-container font-headline font-black text-xl italic tracking-tighter">SkillForge</span>
          </div>
        </section>
      </main>
    )
  );
}
