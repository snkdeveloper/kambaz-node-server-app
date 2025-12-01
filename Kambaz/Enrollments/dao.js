import model from "./model.js";
export default function EnrollmentsDao(db) {
 async function findCoursesForUser(userId) {
   const enrollments = await model.find({ user: userId }).populate("course");
   return enrollments.map((enrollment) => enrollment.course).filter((course) => course !== null);
 }
 async function findUsersForCourse(courseId) {
   const enrollments = await model.find({ course: courseId }).populate("user");
   return enrollments.map((enrollment) => enrollment.user);
 }

 function unenrollAllUsersFromCourse(courseId) {
   return model.deleteMany({ course: courseId });
 }

 function enrollUserInCourse(userId, courseId) {
   return model.create({
     user: userId,
     course: courseId,
     _id: `${userId}-${courseId}`,
   });
   // const { enrollments } = db;
   // enrollments.push({
   //   _id: uuidv4(),
   //   user: userId,
   //   course: courseId,
   // });
 }
 function unenrollUserFromCourse(user, course) {
   return model.deleteOne({ user, course });
 }


 return {
   findCoursesForUser,
   findUsersForCourse,
   enrollUserInCourse,
   unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
 };
}
