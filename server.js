import express from "express";
import helmet from "helmet";
import homeController from "./controllers/homeController.js";
import converterController from "./controllers/converterController.js";
import chartsController from "./controllers/chartsController.js";

const app = express();
const port = 3000;

// Helmet for more secure HTTP headers
app.use(helmet());

// Serve static files from the public directory
app.use(express.static("public"));

// Set the view engine to ejs
app.set("view engine", "ejs");

// Routes

app.use("/", homeController);
app.use("/", converterController);
app.use("/", chartsController);

// 404 page route
app.use((req, res) => {
  res.status(404).render("404");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
