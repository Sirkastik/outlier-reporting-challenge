const tape = require("tape");
const jsonist = require("jsonist");

const port = (process.env.PORT =
  process.env.PORT || require("get-port-sync")());
const endpoint = `http://localhost:${port}`;

const server = require("./server");

tape("health", async function (t) {
  const url = `${endpoint}/health`;
  try {
    const { data, response } = await jsonist.get(url);
    if (response.statusCode !== 200) {
      throw new Error(
        "Error connecting to sqlite database; did you initialize it by running `npm run init-db`?"
      );
    }
    t.ok(data.success, "should have successful healthcheck");
    t.end();
  } catch (e) {
    t.error(e);
  }
});

tape("getStudent", async function (t) {
  const studentId = 1;
  const url = `${endpoint}/student/${studentId}`;
  try {
    const { data } = await jsonist.get(url);
    const hasTheCorrectStudentId = data.student.id === studentId;
    t.ok(hasTheCorrectStudentId, "should have fetched the student with id");
    t.end();
  } catch (e) {
    t.error(e);
  }
});

tape("getStudentGradesReport", async function (t) {
  const studentId = 1;
  const url = `${endpoint}/student/${studentId}/grades`;
  try {
    const { data } = await jsonist.get(url);
    const hasGradesIncluded = data.student.grades[0].course === "Calculus";
    t.ok(
      hasGradesIncluded,
      "should have fetched the student with their grades"
    );
    const hasWrongStudentGrade = data.student.grades.some(
      (grade) => grade.id !== studentId
    );
    t.ok(
      !hasWrongStudentGrade,
      "should match the student with their respective grades"
    );
    t.end();
  } catch (e) {
    t.error(e);
  }
});

tape("getCourseGradesReport", async function (t) {
  const url = `${endpoint}/course/all/grades`;
  try {
    const { data } = await jsonist.get(url);
    const reports = data.courseGradesReport;
    const hasAllCoursesReport = reports.length === 5;
    t.ok(
      hasAllCoursesReport,
      "should have fetched the courses with the course report"
    );
    const hasCorrectReport = reports[0].highestGrade > reports[0].lowestGrade;
    t.ok(
      hasCorrectReport,
      "should have highest grade greater than lowest grade"
    );
    t.end();
  } catch (e) {
    t.error(e);
  }
});

tape("cleanup", function (t) {
  server.closeDB();
  server.close();
  t.end();
});
