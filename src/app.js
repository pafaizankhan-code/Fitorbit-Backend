const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const gymRoutes = require("./routes/gym.routes");
const membershipRoutes = require("./routes/membership.routes");
const memberRoutes = require("./routes/member.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/gyms", gymRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/member", memberRoutes);

app.get("/", (req, res) => {
  res.send("FitOrbit API Running 🚀");
});
  
module.exports = app;
