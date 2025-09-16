const express = require('express');
const Entrance = require('../models/entrance');
const Exam = require('../models/exam');
const mongoose = require("mongoose");
const router = express.Router();

// Fetch all entrances
router.get('/entrances', async (req, res) => {
  try {
    const entrances = await Entrance.find();
    res.json(entrances);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Fetch exams by entrance ID
router.get('/exams/:entranceId', async (req, res) => {
  try {
    const { entranceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(entranceId)) {
      return res.status(400).json({ msg: "Invalid entranceId" });
    }

    const exams = await Exam.find({ entrance: new mongoose.Types.ObjectId(entranceId) });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


// Save or update exam content
// Save content + sections
router.post("/exams/:examId/content", async (req, res) => {
  try {
    const { examId } = req.params;
    const { content, sections } = req.body; // now expecting sections as array

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ msg: "Invalid examId" });
    }

    // Optional: validate sections array
    if (!Array.isArray(sections)) {
      return res.status(400).json({ msg: "Sections must be an array" });
    }

    const updatedExam = await Exam.findByIdAndUpdate(
      examId,
      { content, sections },
      { new: true }
    );


    res.json(updatedExam);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.get("/exams/:examId/content", async (req, res) => {
  try {
    const { examId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ msg: "Invalid examId" });
    }

    const exam = await Exam.findById(examId).select("content sections");
    if (!exam) {
      return res.status(404).json({ msg: "Exam not found" });
    }

    res.json({
      content: exam.content || "",
      sections: exam.sections || [],
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


module.exports = router;
