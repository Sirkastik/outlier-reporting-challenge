module.exports = {
  filterStudentGrades,
  generateCourseReport,
};

function filterStudentGrades(allStudentGrades, studentId) {
  return allStudentGrades.filter(
    (studentGrade) => studentGrade.id === studentId
  );
}

function generateCourseReport(allStudentGrades) {
  const courseNames = [
    ...new Set(allStudentGrades.map((studentGrade) => studentGrade.course)),
  ];
  return courseNames.map((courseName) => {
    const allCourseGrades = allStudentGrades
      .filter((studentGrade) => studentGrade.course === courseName)
      .map((studentGrade) => studentGrade.grade);
    const { highestGrade, lowestGrade } =
      getLowestAndHighestGrades(allCourseGrades);
    const averageGrade = calculateAverageGrade(allCourseGrades);
    return { course: courseName, highestGrade, lowestGrade, averageGrade };
  });
}

function getLowestAndHighestGrades(allCourseGrades) {
  const sortedGrades = allCourseGrades.sort((a, b) => a - b);
  const lowestGrade = sortedGrades[0];
  const highestGrade = sortedGrades[sortedGrades.length - 1];
  return { lowestGrade, highestGrade };
}

function calculateAverageGrade(allCourseGrades) {
  const sumOfCourseGrades = allCourseGrades.reduce(
    (sum, grade) => sum + grade,
    0
  );
  return sumOfCourseGrades / allCourseGrades.length;
}
