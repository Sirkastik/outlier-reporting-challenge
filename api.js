const { Worker } = require("worker_threads");
const knex = require("./db");

const ENOENT_ERROR = "ENOENT";

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport,
};

async function getHealth(req, res, next) {
  try {
    await knex("students").first();
    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getStudent(req, res, next) {
  try {
    const studentId = parseInt(req.params.id);
    const student = await getStudentById(studentId);
    res.json({ student });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getStudentGradesReport(req, res, next) {
  try {
    const studentId = parseInt(req.params.id);
    const student = await getStudentById(studentId);
    workerGetGrades(sendStudentGradesReport(res, student), studentId);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getCourseGradesReport(req, res, next) {
  try {
    workerGetGrades(sendCourseGradesReport(res));
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getStudentById(studentId) {
  return await knex("students").where({ id: studentId }).first();
}

function workerGetGrades(onMessageCallback, studentId = null) {
  const worker = new Worker("./fetch-grades.js", {
    workerData: { studentId },
  });

  worker.on("message", onMessageCallback);

  worker.on("error", function (error) {
    if (error.message.startsWith(ENOENT_ERROR)) {
      throw new Error(
        "Error reading grades; did you initialize it by running `npm run init-db`?"
      );
    }
    throw new Error(error);
  });
}

function sendStudentGradesReport(res, student) {
  return (studentGrades) => {
    res.json({ student: { ...student, ...studentGrades } });
  };
}

function sendCourseGradesReport(res) {
  return (courseGradesReport) => res.json(courseGradesReport);
}
