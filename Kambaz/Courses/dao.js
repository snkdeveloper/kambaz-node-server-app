import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import enrollmentModel from "../Enrollments/model.js";

export default function CoursesDao(db) {
  function findAllCourses() {
    return model.find({},{name:1,description:1,img:1});
  }

  async function findCoursesForEnrolledUser(userId) {
    const enrollments = await enrollmentModel.find({ user: userId });
    const courseIds = enrollments.map(e => e.course);
    const courses = await model.find(
      { _id: { $in: courseIds } },
      { name: 1, description: 1, img: 1 }
    );
    return courses;
  }

  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
   
    return model.create(newCourse);
  }

  function updateCourse(courseId, courseUpdates) {
   return model.updateOne({ _id: courseId }, { $set: courseUpdates });
  }

  async function deleteCourse(courseId) {
    
    return model.deleteOne({ _id: courseId });
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}