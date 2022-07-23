import auth from "../middlewares/auth.middleware";
import { Router } from "express";
import { login, signup, users } from "../controllers/user.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", auth, users);

export default router;
