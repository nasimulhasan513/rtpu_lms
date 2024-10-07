import { z } from "zod";

const dashboardSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["admin","contributor"]);
  const { startDate, endDate } = dashboardSchema.parse(getQuery(event));

  const dateFilter =
    startDate && endDate
      ? {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }
      : {};

  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalAssignments,
    totalAssignmentSubmissions,
    totalExams,
    totalExamSubmissions,
    recentEnrollments,
    recentExamSubmissions,
  ] = await Promise.all([
    db.user.count(),
    db.course.count(),
    db.enrollment.count(),
    db.assignment.count(),
    db.assignmentSubmission.count(),
    db.exam.count(),
    db.submission.count(),
    db.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: "desc" },
      include: { user: true, course: true },
    }),
    db.submission.findMany({
      take: 5,
      orderBy: { submittedAt: "desc" },
      include: { user: true, exam: true },
    }),
  ]);

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalAssignments,
    totalAssignmentSubmissions,
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
