import { Router } from "express";
import { DataTransferController } from "../controllers";
import { asyncHandler } from "../utils/functions";
import { AuthenticationMiddleware, DataTransferMiddleware } from "../middlewares";


const router = Router()

router.post("/generatesCode", DataTransferMiddleware.isCodeSet, asyncHandler(DataTransferController.onInsertData(false)))
router.post("/storeDataByUserCredentials",
    asyncHandler(AuthenticationMiddleware.isNotAuthenticated),
    DataTransferMiddleware.isUserSet,
    asyncHandler(DataTransferController.onInsertData(true))
)
router.delete("/removeCode/:code", asyncHandler(DataTransferController.removeCode))
router.get("/obtainTransferredDataByCode", asyncHandler(DataTransferController.obtainTransferredData(false)))
router.get("/obtainTransferredDataByUser",
    asyncHandler(AuthenticationMiddleware.isNotAuthenticated),
    asyncHandler(DataTransferController.obtainTransferredData(true))
)

export default router
