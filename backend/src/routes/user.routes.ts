import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { verifyRole, verifyUserId } from "../middlewares/user.middleware";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();
router.use(verifyToken);

router.get("/", verifyRole, userController.getUsersInfos);                         // Route to get all users information
router.post("/", verifyRole, userController.createUser);                           // Route to create user
router.get("/:id", verifyUserId, userController.getUserInfos);                     // Route to get user information by id
router.put("/:id", verifyUserId, userController.updateUserProfile);                // Route to update user profile (info and/or password)
router.put("/:id/role", verifyRole, userController.modifyUserRole);                // Route to modify user role by id
router.delete("/:id", verifyRole, userController.deleteUser);                      // Route to delete user by id


export default router;