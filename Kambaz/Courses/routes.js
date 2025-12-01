import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
import UsersDao from "../Users/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);
  const usersDao = UsersDao();

  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  };

  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  const createCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.sendStatus(401);
      }
      const { name } = req.body || {};
      if (!name || typeof name !== "string") {
        return res.status(400).json({ message: "Course name is required" });
      }
      const newCourse = await dao.createCourse(req.body);
      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
      return res.json(newCourse);
    } catch (err) {
      console.error("Error creating course:", err);
      return res.sendStatus(500);
    }
  };

  const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await dao.deleteCourse(courseId);
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);

    if (result.deletedCount === 0) {
      return res.sendStatus(404); // course not found
    }

    return res.sendStatus(200); // success
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};


  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
      const result = await dao.updateCourse(courseId, req.body);
      
      if (result.matchedCount === 0) {
        return res.sendStatus(404);
      }
      
      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  };

  const findUsersForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const users = await enrollmentsDao.findUsersForCourse(courseId);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };

  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  };

  app.get("/api/courses", findAllCourses);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/users/current/courses", createCourse);
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.put("/api/courses/:courseId", updateCourse);
}