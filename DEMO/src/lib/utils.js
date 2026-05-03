export const STORAGE_KEY = "skillforge-demo-state";

export function currency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function dateLabel(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function flattenLessons(course) {
  return course.modules.flatMap((module) =>
    module.lessons.map((lesson, lessonIndex) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title,
      lessonIndex,
    })),
  );
}

export function courseProgress(user, course) {
  const done = user.completedLessons?.[course.id] ?? [];
  const total = flattenLessons(course).length || 1;
  return Math.round((done.length / total) * 100);
}

export function homePathForRole(role) {
  if (role === "instructor") return "/instructor";
  if (role === "admin") return "/admin";
  return "/";
}
