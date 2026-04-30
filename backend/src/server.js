const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ status: "Nivara API running" }));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/riskRoutes"));
app.use("/", require("./routes/appointmentRoutes"));
app.use("/", require("./routes/reportRoutes"));
app.use("/", require("./routes/chatRoutes"));
app.use("/", require("./routes/dashboardRoutes"));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
