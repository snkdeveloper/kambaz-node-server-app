import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao(db) {

  // Find all assignments for a specific course
  async function findAssignmentsForCourse(courseId) {
    return model.find({ course: courseId });
  }

  // Find a single assignment by ID
  async function findAssignmentById(assignmentId) {
    return model.findById(assignmentId);
  }

  // Create a new assignment for a course
  async function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  }

  // Update an existing assignment
  async function updateAssignment(assignmentId, assignmentUpdates) {
    return model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
  }

  // Delete an assignment
  async function deleteAssignment(assignmentId) {
    return model.deleteOne({ _id: assignmentId });
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}