import { Router } from "express";
import { userRouter } from "./user";
import { SigninSchema, SignupSchema } from "../../types";
import { prisma as client } from "@repo/db/client";
import { JWT_PASSWORD } from "../../lib/config";
import jwt from "jsonwebtoken";
import { compare, hash } from "../../lib/scrypt";

export const router = Router();

router.post("/register", async (req, res) => {
  // check the user
  const parsedData = SignupSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log("parsed data incorrect");
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  const hashedPassword = await hash(parsedData.data.password);

  try {
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.type === "admin" ? "Admin" : "User",
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    console.log("erroer thrown");
    console.log(e);
    res.status(400).json({ message: "User already exists" });
  }
});

// router.post("/login", async (req, res) => {
//   const parsedData = SigninSchema.safeParse(req.body);
//   if (!parsedData.success) {
//     res.status(403).json({ message: "Validation failed" });
//     return;
//   }

//   try {
//     const user = await client.user.findUnique({
//       where: {
//         username: parsedData.data.username,
//       },
//     });

//     if (!user) {
//       res.status(403).json({ message: "User not found" });
//       return;
//     }
//     const isValid = await compare(parsedData.data.password, user.password);

//     if (!isValid) {
//       res.status(403).json({ message: "Invalid password" });
//       return;
//     }

//     const token = jwt.sign(
//       {
//         userId: user.id,
//         role: user.role,
//       },
//       JWT_PASSWORD
//     );

//     res.json({
//       token,
//     });
//   } catch (e) {
//     res.status(400).json({ message: "Internal server error" });
//   }
// });

router.use("/user", userRouter);
