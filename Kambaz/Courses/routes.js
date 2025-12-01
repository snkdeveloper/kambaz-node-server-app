import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
import UsersDao from "../Users/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);
  const usersDao = UsersDao();

  const findAllCourses = (req, res) => {
    const courses = dao.findAllCourses();
    res.json(courses);
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = dao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = dao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const deleteCourse = (req, res) => {
    const { courseId } = req.params;
    dao.deleteCourse(courseId);
    res.sendStatus(204);
  };

  const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const status = dao.updateCourse(courseId, req.body);
    res.json(status);
  };

  const findUsersForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const userIds = enrollmentsDao.findUsersForCourse(courseId);
      // Map user IDs to user objects; handle both sync and async dao implementations
      const userPromises = userIds.map((uid) => usersDao.findUserById(uid));
      const users = await Promise.all(userPromises);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  app.get("/api/courses", findAllCourses);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/users/current/courses", createCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.put("/api/courses/:courseId", updateCourse);
}