import express from "express";

const router = express.Router();

// Define a route specific to the converter
router.get("/", (req, res) => {
  res.render("index");
});

export default router;
