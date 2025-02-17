import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  response: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [optionSchema]
});

const scenarioSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  questions: [questionSchema]
});

const Scenario = mongoose.model('Scenario', scenarioSchema);

export default Scenario;