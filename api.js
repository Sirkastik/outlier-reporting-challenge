const { Worker } = require("worker_threads");
const knex = require("./db");

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
    handleGetGrades(res, student);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getCourseGradesReport(req, res, next) {
  try {
    handleGetGrades(res);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getStudentById(studentId) {
  return await knex("students").where({ id: studentId }).first();
}

function handleGetGrades(res, student = null) {
  const worker = new Worker("./fetch-grades.js", {
    workerData: { student },
  });
  worker.on("message", (value) => res.json(value));
}
