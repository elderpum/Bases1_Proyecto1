const { Router } = require("express");
const {
  deleteTemporal,
  createTemporal,
  insertTemporal,
  deleteModelo,
  createModelo,
  insertModelo,
  consulta1,
  consulta2,
  consulta3,
  consulta4,
  consulta5,
  consulta6,
  consulta7,
  consulta8,
  consulta9,
  consulta10,
} = require("../controllers/api");

const router = Router();

router.get("/deleteTemporal", deleteTemporal);

router.get("/createTemporal", createTemporal);

router.get("/insertTemporal", insertTemporal);

router.get("/deleteModelo", deleteModelo);

router.get("/createModelo", createModelo);

router.get("/insertModelo", insertModelo);

router.get("/consulta1", consulta1);

router.get("/consulta2", consulta2);

router.get("/consulta3", consulta3);

router.get("/consulta4", consulta4);

router.get("/consulta5", consulta5);

router.get("/consulta6", consulta6);

router.get("/consulta7", consulta7);

router.get("/consulta8", consulta8);

router.get("/consulta9", consulta9);

router.get("/consulta10", consulta10);

module.exports = router;
