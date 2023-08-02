import express from "express";
import { VideosController } from "../controller/VideoController";

export const videoRouter = express.Router()

const videoController = new VideosController()

videoRouter.get("/",videoController.getVideos)
videoRouter.post("/",videoController.createVideo)
videoRouter.put("/:id", videoController.updateVideo)
videoRouter.delete("/:id",videoController.deleteVideo)