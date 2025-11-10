const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const CoursePackage = require("../models/CoursePackage");

const router = express.Router();

/* ==========================================================
   MULTER CONFIGURATION
========================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Temporarily save in a general folder before knowing _id
    const tempDir = path.join("public", "coursepackages", "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `temp-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

/* ==========================================================
   VALIDATION HELPER
========================================================== */
function validateCoursePackage(body) {
  const errors = [];

  if (!body.entranceID) errors.push("Entrance ID is required");
  if (!mongoose.Types.ObjectId.isValid(body.entranceID))
    errors.push("Invalid entrance ID");

  if (!body.courseName || body.courseName.trim() === "")
    errors.push("Course name is required");

  if (!body.title || body.title.trim() === "")
    errors.push("Title is required");

  if (body.price == null || isNaN(body.price))
    errors.push("Price must be a number");

  if (body.discountedPrice != null && isNaN(body.discountedPrice))
    errors.push("Discounted price must be a number");

  if (body.duration != null && isNaN(body.duration))
    errors.push("Duration must be a number");

  return errors;
}

/* ==========================================================
   @route   GET /api/course-packages
   @desc    Get all course packages (optional filter by entranceID)
========================================================== */
router.get("/", async (req, res) => {
  try {
    const { entranceID } = req.query;
    const filter = entranceID ? { entranceID } : {};

    const packages = await CoursePackage.find(filter)
      .populate("entranceID", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching course packages:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

/* ==========================================================
   @route   GET /api/course-packages/:id
   @desc    Get a single course package by ID
========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid course package ID" });

    const pkg = await CoursePackage.findById(id).populate("entranceID", "title");
    if (!pkg) return res.status(404).json({ message: "Course package not found" });

    res.status(200).json(pkg);
  } catch (error) {
    console.error("Error fetching course package:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

/* ==========================================================
   @route   POST /api/course-packages
   @desc    Create new course package with image upload
========================================================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const validationErrors = validateCoursePackage(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Step 1: Create course package without image first
    const coursePackage = new CoursePackage({
      entranceID: req.body.entranceID,
      courseName: req.body.courseName,
      title: req.body.title,
      content: req.body.content || "",
      price: req.body.price,
      discountedPrice: req.body.discountedPrice || null,
      teacher: req.body.teacher || "",
      duration: req.body.duration || 0,
      features: req.body.features || "",
      examsCovered: req.body.examsCovered || [],
      type: req.body.type || "",
      image: "", // temporary
    });

    const savedPackage = await coursePackage.save();

    // Step 2: Move uploaded image to course-specific folder
    if (req.file) {
      const courseDir = path.join("public", "coursepackages", savedPackage._id.toString());
      if (!fs.existsSync(courseDir)) fs.mkdirSync(courseDir, { recursive: true });

      const ext = path.extname(req.file.originalname);
      const newPath = path.join(courseDir, `image${ext}`);

      fs.renameSync(req.file.path, newPath);
      const relativePath = `/coursepackages/${savedPackage._id}/image${ext}`;

      // Step 3: Update DB with image path
      savedPackage.image = relativePath;
      await savedPackage.save();
    }

    res.status(201).json({
      message: "Course package created successfully",
      data: savedPackage,
    });
  } catch (error) {
    console.error("Error creating course package:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
