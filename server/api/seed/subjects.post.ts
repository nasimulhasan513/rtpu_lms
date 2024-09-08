import subjects from "~/data/qsbank.subjects.json";

export default defineEventHandler(async (event) => {
  const subjectsData = subjects
    .map((subject) => ({
      name: subject.name,
      order: subject.order,
    }))
    .sort((a, b) => a.order - b.order);

  // const createdSubjects = await db.subject.createMany({
  //   data: subjectsData,
  // });

  return {
    statusCode: 201,
    // message: `${createdSubjects.count} subjects created successfully`,
  };
});
