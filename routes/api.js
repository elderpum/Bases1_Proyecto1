const { Router } = require("express");
const {
  deleteTemporal,
  createTemporal,
  insertTemporal,
  deleteModelo,
  createModelo,
  insertModelo,
} = require("../controllers/api");

const router = Router();

router.get("/deleteTemporal", deleteTemporal);

router.get("/createTemporal", createTemporal);

router.get("/insertTemporal", insertTemporal);

router.get("/deleteModelo", deleteModelo);

router.get("/createModelo", createModelo);

router.get("/insertModelo", insertModelo);

module.exports = router;
