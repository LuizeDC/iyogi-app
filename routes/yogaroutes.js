const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const YogaRetreat = require("../models/yogaretreat");
const { isLoggedIn, originalYogi, validateRetreat } = require("../middleware");
const retreatsControl = require("../controllers/retreatsControl");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(retreatsControl.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateRetreat,
    catchAsync(retreatsControl.createRetreat)
  );

router.get("/new", isLoggedIn, retreatsControl.renderNewPage);

router.post(
  "/",
  validateRetreat,
  isLoggedIn,
  catchAsync(retreatsControl.createRetreat)
);

router
  .route("/:id")
  .get(catchAsync(retreatsControl.showRetreat))
  .put(
    isLoggedIn,
    originalYogi,
    upload.array("image"),
    validateRetreat,
    catchAsync(retreatsControl.updateRetreat)
  )
  .delete(isLoggedIn, catchAsync(retreatsControl.deleteRetreat));

router.get(
  "/:id/edit",
  isLoggedIn,
  originalYogi,
  catchAsync(retreatsControl.renderEditForm)
);

module.exports = router;
