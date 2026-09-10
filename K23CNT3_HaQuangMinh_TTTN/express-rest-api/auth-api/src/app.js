const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit =
  require("express-rate-limit");

const authRoutes =
  require("./routes/auth.routes");

const userRoutes =
  require("./routes/user.routes");

const errorMiddleware =
  require("./middleware/error.middleware");

const app =
  express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

const authLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
      success: false,
      message:
        "Quá nhiều request. Vui lòng thử lại sau.",
    },
  });

app.use(
  "/api/auth",
  authLimiter,
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      message: "API is running",
    });
  }
);

app.use(errorMiddleware);

module.exports = app;
