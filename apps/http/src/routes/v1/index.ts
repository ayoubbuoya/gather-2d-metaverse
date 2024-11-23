import { Router } from "express";
import { userRouter } from "./user";

export const router = Router();

router.post("/register", (req, res) => {
  res.json({
    message: "Register",
  });
});

router.post("/login", (req, res) => {
  res.json({
    message: "Login",
  });
});

router.use("/user", userRouter);
