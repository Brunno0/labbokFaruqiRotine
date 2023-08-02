import express, { Request, Response } from 'express'
import cors from 'cors'
import { videoRouter } from './router/videoRouter'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})
app.use("/videos", videoRouter)


// app.get("/ping", videoController.getPing)
// app.get("/videos", videoController.getVideos)
// app.post("/videos", videoController.createVideo)
// app.put("/videos/:id", videoController.updateVideo)
// app.delete("/videos/:id", videoController.deleteVideo)
