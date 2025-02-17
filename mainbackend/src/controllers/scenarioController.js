import Scenario from "../models/Scenario.js";

export const getScenarios = async (req, res) => {
    try {
      const scenario = await Scenario.findOne({ topic: req.params.name });
      const questionIndex = parseInt(req.params.index);  // Get the current question index
      const question = scenario.questions[questionIndex];
  
      if (question) {
        res.json({
          questionText: question.questionText,
          options: question.options
        });
      } else {
        res.status(404).json({ message: 'No more questions available' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error fetching question' });
    }
  };
  