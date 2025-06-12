import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { verifyRole, verifyUserId } from "../middlewares/user.middleware";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", verifyToken, verifyRole, userController.getUsersInfos);                         // Route to get all users information
router.post("/", verifyToken, verifyRole, userController.createUser);                           // Route to create user
router.get("/:id", verifyToken, verifyUserId, userController.getUserInfos);                     // Route to get user information by id
router.put("/:id", verifyToken, verifyUserId, userController.modifyUserInfos);                  // Route to modify user information by id
router.put("/:id/password", verifyToken, verifyUserId, userController.modifyUserPassword);      // Route to modify user password by id
router.put("/:id/role", verifyToken, verifyRole, userController.modifyUserRole);                // Route to modify user role by id
router.delete("/:id", verifyToken, verifyRole, userController.deleteUser);                      // Route to delete user by id


export default router;