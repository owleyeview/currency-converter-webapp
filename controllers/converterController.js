import express from "express";

const router = express.Router();

// Define a route specific to the converter
router.get("/converter", (req, res) => {
  res.render("converter");
});

export default router;
