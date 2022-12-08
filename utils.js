module.exports = {
  filterStudentGrades,
  generateCourseReport,
};

function filterStudentGrades(allStudentGrades, student) {
  return allStudentGrades.filter(
    (studentGrade) => studentGrade.id === student.id
  );
}

function generateCourseReport(allStudentGrades) {
  const courseNames = [
    ...new Set(allStudentGrades.map((studentGrade) => studentGrade.course)),
  ];
  return courseNames.map((courseName) => {
    const allCourseGrades = allStudentGrades
      .filter((studentGrade) => studentGrade.course === courseName)
      .map((studentGrade) => studentGrade.grade)
      .sort((a, b) => a - b);
    const lowestGrade = allCourseGrades[0];
    const highestGrade = allCourseGrades[allCourseGrades.length - 1];
    const averageGrade = calculateAverageGrade(allCourseGrades);
    return { course: courseName, highestGrade, lowestGrade, averageGrade };
  });
}

function calculateAverageGrade(allCourseGrades) {
  const sumOfCourseGrades = allCourseGrades.reduce(
    (sum, grade) => sum + grade,
    0
  );
  return sumOfCourseGrades / allCourseGrades.length;
}
