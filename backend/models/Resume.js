import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  name: String,
  text: String,
  skills: [String],
  embedding: [Number],
});

export default mongoose.model("Resume", resumeSchema);
