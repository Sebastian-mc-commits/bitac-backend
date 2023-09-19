import { Router } from "express";
import { UserController } from "../controllers";
import { AuthenticationMiddleware } from "../middlewares";
import { asyncHandler } from "../utils/functions";

const router = Router();

router.use(AuthenticationMiddleware.isAuthenticated);

router.post("/createUser", asyncHandler(UserController.createUser));
router.get("/getUserByCredentials", asyncHandler(UserController.getUserByCredentials));

export default router;
