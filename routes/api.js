const { Router } = require("express");
const { deleteTemporal, insertTemporal } = require("../controllers/api");

const router = Router();

router.get("/deleteTemporal", deleteTemporal);

router.get("/insertTemporal", insertTemporal);

module.exports = router;
