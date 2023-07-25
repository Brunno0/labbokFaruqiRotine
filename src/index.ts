import express, { Request, Response } from 'express'
import cors from 'cors'
import { VideoDatabase } from './database/VideoDatabase'
import { Video } from './models/Video'
import { TVideoDB } from './types'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" })
  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

app.get("/videos", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string

    const videoDatabase = new VideoDatabase()

    const videoDB = await videoDatabase.findVideos(q)

    const videos: Video[] = videoDB.map((videoDB) => new Video(
      videoDB.id,
      videoDB.title,
      videoDB.duration,
      videoDB.uploaded_at
    ))

    res.status(200).send(videos)
  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

app.post("/videos", async (req: Request, res: Response) => {
  try {
    const { id, title, duration } = req.body

    if (typeof id !== "string") {
      res.status(400)
      throw new Error("'id' deve ser string")
    }

    if (typeof title !== "string") {
      res.status(400)
      throw new Error("'title' deve ser string")
    }

    if (typeof duration !== "number") {
      res.status(400)
      throw new Error("'duration' deve ser number")
    }

    const videoDatabase = new VideoDatabase()

    const videoDBExists = await videoDatabase.findVideoById(id)

    if (videoDBExists) {
      res.status(400)
      throw new Error("'id' já existe")
    }

    const newVideo = new Video(
      id,
      title,
      duration,
      new Date().toISOString()
    )

    const newVideoDB: TVideoDB = {
      id: newVideo.getId(),
      title: newVideo.getTitle(),
      duration: newVideo.getDuration(),
      uploaded_at: newVideo.getUploadedAt()
    }

    await videoDatabase.insertVideo(newVideoDB)

    res.status(201).send(newVideo)
  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

app.put("/videos/:id", async (req: Request, res: Response) => {
  try {
    //Recebendo valores da idToEdit e body
    const idToEdit = req.params.id
    const {id, title,duration,uploadedAt} = req.body

    // Validando o campo 'id'
    if (id !== undefined) {
      if (typeof id !== "string") {
        res.status(400)
        throw new Error("'id' deve ser string")
      }
    }

    // Validando o campo 'title'
    if (title !== undefined) {
      if (typeof title !== "string") {
        res.status(400)
        throw new Error("'title' deve ser string")
      }
    }

    // Validando o campo 'duration'
    if (duration !== undefined) {
      if (typeof duration !== "number") {
        res.status(400)
        throw new Error("'duration' deve ser number")
      }
    }

    // Validando o campo 'uploadedAt'
    if (uploadedAt !== undefined) {
      if (typeof uploadedAt !== "string") {
        res.status(400)
        throw new Error("'uploadedAt' deve ser string")
      }
    }

    // Instanciando um objeto da classe 'VideoDatabase'
    const videoDatabase = new VideoDatabase()

    // Buscando o vídeo no banco de dados com o id fornecido via params
    const videoDB = await videoDatabase.findVideoById(idToEdit)

    // Verificando se o vídeo foi encontrado no banco de dados
    if (!videoDB) {
      res.status(404)
      throw new Error("'id' não encontrado")
    }

    // Criando um novo objeto 'Video' com os dados do vídeo encontrado no banco
    const video = new Video(
      videoDB.id,
      videoDB.title,
      videoDB.duration,
      videoDB.uploaded_at
    )

    // Atualizando os campos do objeto 'video' com os novos valores (se existirem)
    id && video.setId(id)
    title && video.setTitle(title)
    duration && video.setDuration(duration)
    uploadedAt && video.setUploadedAt(uploadedAt)

    // Criando um objeto 'updatedVideoDB' com os dados atualizados do vídeo
    const updatedVideoDB: TVideoDB = {
      id: video.getId(),
      title: video.getTitle(),
      duration: video.getDuration(),
      uploaded_at: video.getUploadedAt()
    }

    // Atualizando as informações do vídeo no banco de dados
    await videoDatabase.updateVideo(idToEdit, updatedVideoDB)

    // Enviando uma resposta de sucesso (status 200) com o vídeo atualizado
    res.status(200).send(video)
  } catch (error) {
    console.log(error)

    // Se a requisição tiver status 200, muda para status 500 (erro interno do servidor)
    if (req.statusCode === 200) {
      res.status(500)
    }

    // Tratamento de erros - se o erro for uma instância de 'Error', envia a mensagem de erro associada
    if (error instanceof Error) {
      res.send(error.message)
    } else {
      // Caso contrário, envia uma mensagem genérica de erro
      res.send("Erro inesperado")
    }
  }
})

app.delete("/videos/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id

    // Instanciando um objeto da classe 'VideoDatabase'
    const videoDatabase = new VideoDatabase()

    // Buscando o vídeo no banco de dados com o id fornecido
    const videoDB = await videoDatabase.findVideoById(id)

    // Verificando se o vídeo foi encontrado no banco de dados
    if (!videoDB) {
      res.status(404)
      throw new Error("'id' não encontrado")
    }

    // Excluindo o vídeo do banco de dados com o ID fornecido
    await videoDatabase.deleteVideo(id)

    // Enviando uma resposta de sucesso (status 200) com a resposta vazia (sem conteúdo)
    res.status(200).end()
  } catch (error) {
    console.log(error)

    // Se a requisição tiver status 200, muda para status 500 (erro interno do servidor)
    if (req.statusCode === 200) {
      res.status(500)
    }

    // Tratamento de erros - se o erro for uma instância de 'Error', envia a mensagem de erro associada
    if (error instanceof Error) {
      res.send(error.message)
    } else {
      // Caso contrário, envia uma mensagem genérica de erro
      res.send("Erro inesperado")
    }
  }
})
