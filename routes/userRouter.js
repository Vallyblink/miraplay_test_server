import express from "express";

import validateBody  from "../decorators/validateBody.js";
import authController from "../controllers/authController.js";
import userSchema from "../schema/userSchema.js";
import authenticate from "../middlewars/authenticate.js";


const authRouter = express.Router();

authRouter.get(("/current"), authController.getCurrentUser);

authRouter.post("/register", validateBody(userSchema.userSingUpSchema), authController.register);

authRouter.post("/login", validateBody(userSchema.userSingInSchema), authController.login);

authRouter.post("/google", authController.google);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.get("/current", authenticate, authController.getCurrent);
// authRouter.post("/verify");
export default authRouter;