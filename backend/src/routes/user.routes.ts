import { Router } from "express";
import { getUsersInfos, getUserInfos, modifyUserInfos, deleteUser, modifyUserPassword, createUser, modifyUserRole } from "../controllers/user.controller";
import { verifyRole, verifyUserId } from "../middlewares/user.middleware";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", verifyToken, verifyRole, getUsersInfos);                         // Route to get all users information
router.post("/", verifyToken, verifyRole, createUser);                           // Route to create user
router.get("/:id", verifyToken, verifyUserId, getUserInfos);                     // Route to get user information by id
router.put("/:id", verifyToken, verifyUserId, modifyUserInfos);                  // Route to modify user information by id
router.put("/:id/password", verifyToken, verifyUserId, modifyUserPassword);      // Route to modify user password by id
router.put("/:id/role", verifyToken, verifyRole, modifyUserRole);              // Route to modify user role by id
router.delete("/:id", verifyToken, verifyRole, deleteUser);                    // Route to delete user by id


export default router;