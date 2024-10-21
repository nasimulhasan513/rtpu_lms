import { z } from "zod";

const dashboardSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  // await validateRequest(event, ["ADMIN"]);

  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalExams,
    totalExamSubmissions,
    recentEnrollments,
    recentExamSubmissions,
  ] = await Promise.all([
    db.user.count(),
    db.course.count(),
    db.courseEnrollment.count(),
    db.exam.count(),
    db.submission.count(),
    db.courseEnrollment.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      include: { user: true, course: true },
    }),
    db.submission.findMany({
      take: 5,
      orderBy: { submitted_at: "desc" },
      include: { user: true, exam: true },
    }),
  ]);

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalExams,
    totalExamSubmissions,
    recentEnrollments: recentEnrollments.map((e) => ({
      student: e.user.name,
      email: e.user.email,
      course: e.course.name,
      date: e.enrolledAt,
    })),
    recentExamSubmissions: recentExamSubmissions.map((s) => ({
      student: s.user.name,
      email: s.user.email,
      exam: s.exam.title,
      date: s.submittedAt,
      marks: s.marks,
    })),
  };
});
