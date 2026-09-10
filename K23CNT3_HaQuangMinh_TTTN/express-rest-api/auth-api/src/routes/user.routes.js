const express = require("express");

const User =
  require("../models/user.model");

const authMiddleware =
  require("../middleware/auth.middleware");

const router =
  express.Router();

router.get(
  "/me",
  authMiddleware,
  async (req, res, next) => {
    try {
      const user =
        await User.findById(
          req.user.sub
        ).select(
          "-password -refreshTokenHash"
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User không tồn tại",
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
