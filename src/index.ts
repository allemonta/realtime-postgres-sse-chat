import postgres from "postgres"
import { config } from "dotenv"
import { join } from "path"
import Express from "express"
import { createSSEManager } from "@soluzioni-futura/sse-manager"

config({
    path: join(__dirname, "../.env")
})

void(async() => {
    const sql = postgres()
    const app = Express()
    const sseManager = await createSSEManager()

    app.use(Express.json())

    app.get("/realtime", async(_, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        await sseStream.addToRoom(`realtime`)
    })

    app.get("items", async(req, res) => {})
    app.get("/item/:id", async (req, res) => {})
    app.post("/item", async (req, res) => {})
    app.delete("/item/:id", async (req, res) => {})
    app.put("/item/:id", async (req, res) => {})

    await sql.listen("realtime", (data) => {
        sseManager.broadcast("live/messages", { data })
    })

    app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`)
    })
})()
    .catch(console.error)