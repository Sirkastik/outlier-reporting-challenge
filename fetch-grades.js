const { parentPort, workerData } = require("worker_threads");
const fsPromises = require("fs/promises");
const { filterStudentGrades, generateCourseReport } = require('./utils');

fsPromises.readFile("./grades.json", "utf-8").then((value) => {
  const allStudentGrades = JSON.parse(value);
  if (workerData.student) {
    const student = workerData.student;
    parentPort.postMessage({
      student: {
        ...student,
        grades: filterStudentGrades(allStudentGrades, student),
      },
    });
  } else {
    parentPort.postMessage({
      courseGradesReport: generateCourseReport(allStudentGrades),
    });
  }
});