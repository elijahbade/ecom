
import express from "express";
import getAllUsers, {getUserById, searchUsers } from "../../../controllers/admin.controllers";
import { updateUserRole, updateUserType } from "../../../controllers/userRoleControlelrs";
import { protect, rbac } from "../../../middleware/auth.mw";
const router = express.Router();


router.get("/all-users", getAllUsers);
router.post("/update-role/:userId", updateUserType);
router.get("/search-users", searchUsers);

router.get ('/user-details/:userId', getUserById)



export default router;
