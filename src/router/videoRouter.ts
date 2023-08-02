import express from "express";
import { VideosController } from "../controller/VideoController";
import { VideoBusiness } from "../business/VideoBusiness";
import { VideoDatabase } from "../database/VideoDatabase";

export const videoRouter = express.Router()

const videoController = new VideosController(
    new VideoBusiness (
        new VideoDatabase()
        ))

videoRouter.get("/",videoController.getVideos)
videoRouter.post("/",videoController.createVideo)
videoRouter.put("/:id", videoController.updateVideo)
videoRouter.delete("/:id",videoController.deleteVideo)