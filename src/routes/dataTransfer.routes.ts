import { Router } from "express";
import { DataTransferController } from "../controllers";


const router = Router()

router.post("/storeData", DataTransferController.onStoreData)
router.get("/getDataCode", DataTransferController.getDataCode)
router.get("/obtainTransferData", DataTransferController.obtainTransferredData)

export default router
