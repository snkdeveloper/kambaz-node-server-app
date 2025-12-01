import mongoose from "mongoose";
import modukeSchema from "../Modules/schema.js";
const courseSchema = new mongoose.Schema({
   _id: String,
   name: String,
   number: String,
   credits: Number,
   description: String,
    modules: [modukeSchema]
 },
 { collection: "courses" }
);
export default courseSchema;