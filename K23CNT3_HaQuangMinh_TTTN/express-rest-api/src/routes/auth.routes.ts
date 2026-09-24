import express from "express";

import * as controller from "../controllers/auth.controller";

import authMiddleware from "../middleware/auth.middleware";

const router =
  express.Router();

router.post(
  "/signup",
  controller.signup
);

router.post(
  "/verify-email",
  controller.verifyEmail
);

router.post(
  "/signin",
  controller.signin
);

router.post(
  "/refresh-token",
  controller.refreshToken
);

router.post(
  "/forgot-password",
  controller.forgotPassword
);

router.post(
  "/verify-forgot-password",
  controller.verifyForgotPassword
);

router.post(
  "/reset-password",
  controller.resetPassword
);

router.post(
  "/change-password",
  authMiddleware,
  controller.changePassword
);

router.post(
  "/signout",
  authMiddleware,
  controller.signout
);

export default router;
