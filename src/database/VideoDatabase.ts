import { TVideoDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class VideoDatabase extends BaseDatabase {
  public static TABLE_VIDEOS = "videos"

  public findVideos = async (q?: string): Promise<TVideoDB[]> => {
    let result: TVideoDB[]

    if (q) {
      result = await BaseDatabase
        .connection(VideoDatabase.TABLE_VIDEOS)
        .where("name", "LIKE", `%${q}%`)
    } else {
      result = await BaseDatabase
        .connection(VideoDatabase.TABLE_VIDEOS)
    }

    return result
  }

  public async findVideoById(id: string): Promise<TVideoDB | undefined>  {
    const [response]: TVideoDB[] = await BaseDatabase
      .connection(VideoDatabase.TABLE_VIDEOS)
      .where({ id })

    return response
  }

  public insertVideo = async (videoDB: TVideoDB): Promise<void> => {
    await BaseDatabase
      .connection(VideoDatabase.TABLE_VIDEOS)
      .insert(videoDB)
  }

  public updateVideo = async (idToEdit: string): Promise<void> => {
    await BaseDatabase
      .connection(VideoDatabase.TABLE_VIDEOS)
      .where({ id: idToEdit })
  }

  public deleteVideo = async (id: string): Promise<void> => {
    await BaseDatabase
      .connection(VideoDatabase.TABLE_VIDEOS)
      .delete()
      .where({ id })
  }
}