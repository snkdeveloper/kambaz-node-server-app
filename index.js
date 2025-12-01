import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import "dotenv/config";
import session from 'express-session';

import Lab5 from './Lab5/index.js';
import Hello from './Hello.js';
import db from './Kambaz/Database/index.js';

import UserRoutes from './Kambaz/Users/routes.js';
import CourseRoutes from "./Kambaz/Courses/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";

mongoose.connect(CONNECTION_STRING);

const app = express();

/* ------------------------ CORS (must be first) ------------------------ */
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

/* ------------------------ Session ------------------------ */
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "lax",
    secure: false   // IMPORTANT for localhost
  }
};

app.use(session(sessionOptions));

/* ------------------------ JSON Parser ------------------------ */
app.use(express.json());

/* ------------------------ Routes ------------------------ */
UserRoutes(app, db);
CourseRoutes(app, db);
EnrollmentRoutes(app, db);
ModuleRoutes(app, db);
AssignmentRoutes(app, db);
Hello(app);
Lab5(app);

/* ------------------------ Start Server ------------------------ */
app.listen(process.env.PORT || 4000, () =>
  console.log("Server running on port", process.env.PORT || 4000)
);
