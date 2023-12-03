import express from "express";

const router = express.Router();

// Define a route specific to the converter
router.get("/charts", (req, res) => {
  res.render("charts");
});

export default router;
