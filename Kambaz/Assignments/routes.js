import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  // Get all assignments for a course
  const findAssignmentsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get a single assignment by ID
  const findAssignmentById = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignment = await dao.findAssignmentById(assignmentId);
      if (assignment) {
        res.json(assignment);
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Create a new assignment for a course
  const createAssignment = async (req, res) => {
    try {
      const { courseId } = req.params;
      const newAssignment = {
        ...req.body,
        course: courseId,
      };
      const assignment = await dao.createAssignment(newAssignment);
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Update an assignment
  const updateAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const result = await dao.updateAssignment(assignmentId, req.body);
      
      if (result.matchedCount === 0) {
        return res.sendStatus(404);
      }
      
      return res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Delete an assignment
  const deleteAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const result = await dao.deleteAssignment(assignmentId);
      
      if (result.deletedCount === 0) {
        return res.sendStatus(404);
      }
      
      return res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Register routes
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.post("/api/courses/:courseId/assignments", createAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}