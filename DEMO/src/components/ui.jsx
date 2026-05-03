import { NavLink } from "react-router-dom";

export function MetricCard({ title, value, caption }) {
  return (
    <div className="demo-kpi p-8">
      <div className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-2">{title}</div>
      <div className="text-5xl font-black text-primary mb-2">{value}</div>
      <div className="text-sm text-on-surface-variant">{caption}</div>
    </div>
  );
}

export function TimelineItem({ title, subtitle }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-black">•</div>
      <div>
        <div className="font-bold">{title}</div>
        <div className="text-sm text-on-surface-variant">{subtitle}</div>
      </div>
    </div>
  );
}

export function CourseCard({ course, cta, to, footer }) {
  return (
    <div className="bg-white rounded-[28px] p-5 shadow-[0_20px_60px_rgba(84,38,10,0.06)] border border-black/5">
      <img className="w-full h-52 object-cover rounded-3xl mb-5" src={course.image} alt={course.title} />
      <div className="flex justify-between items-center mb-2">
        <span className="demo-chip demo-chip-muted">{course.category}</span>
        <span className="font-bold text-primary">${course.price}</span>
      </div>
      <h3 className="text-2xl font-headline font-black mb-2">{course.title}</h3>
      <p className="text-on-surface-variant mb-4">{course.subtitle}</p>
      <div className="flex justify-between text-sm text-on-surface-variant mb-5">
        <span>{course.level}</span>
        <span>{course.duration}</span>
      </div>
      {footer}
      <NavLink className="btn btn-primary btn-w-full" to={to}>{cta}</NavLink>
    </div>
  );
}

export function SectionHeader({ chip, title, description, action }) {
  return (
    <section className="card-feature">
      {chip ? <div className="demo-chip demo-chip-primary mb-4">{chip}</div> : null}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-headline font-black mb-2">{title}</h1>
          {description ? <p className="text-on-surface-variant max-w-3xl">{description}</p> : null}
        </div>
        {action}
      </div>
    </section>
  );
}
