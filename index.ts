import express, { Express } from "express"
import config from "./src/config/config"
import { dataTransferRoutes, userRoutes } from "./src/routes"
import { ErrorMiddleware } from "./src/middlewares"

const app: Express = express()
const { PORT } = config

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/user", userRoutes)
app.use("/api/dataTransfer", dataTransferRoutes)
app.use(ErrorMiddleware)


app.listen(PORT, () => console.log("Server listening on port: " + PORT))
