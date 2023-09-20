import { Router } from "express";
import { DataTransferController } from "../controllers";
import { asyncHandler } from "../utils/functions";


const router = Router()

router.get("/generatesCode", asyncHandler(DataTransferController.generatesCode))
router.delete("/removeCode/:code", asyncHandler(DataTransferController.removeCode))
router.get("/obtainTransferredData/:type(code|user)", asyncHandler(DataTransferController.obtainTransferredData))

export default router
