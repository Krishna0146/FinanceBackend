import mongoose from "mongoose";

const ScenarioSchema = new mongoose.Schema({
  Scenario: Number,
  Questions: [
    {
      Q_NO: Number,
      Question: String,
      Options: {
        O1: String,
        O2: String
      },
      Responses: {
        OR1: String,
        OR2: String
      }
    }
  ]
});

const Scenario = mongoose.model("Scenario", ScenarioSchema);
export default Scenario;
