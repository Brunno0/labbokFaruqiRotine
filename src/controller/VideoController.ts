import { Request, Response } from "express"
import { ZodError } from 'zod';
import { VideoBusiness } from "../business/VideoBusiness"
import { CreateVideoSchema } from "../dtos/createVideo.dto"
import { EditProductSchema } from "../dtos/editVideo.dto";


export class VideosController {


  getPing = async (req: Request, res: Response) => {
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
  }

  getVideos = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = {
        q: req.query.q
      }
      const videoBusiness = new VideoBusiness()
      const output = await videoBusiness.getVideos(input)

      res.status(200).send(output)

    } catch (error) {
      console.log(error)

      if (req.statusCode === 200) {
        res.status(500)
      }

      if (error instanceof Error) {
        res.send(error.message)
      } else {
        res.send("Unexpected Error")
      }
    }
  }

  createVideo = async (req: Request, res: Response) => {
    try {
      const { id, title, duration } = req.body

      const input = CreateVideoSchema.parse({
        id,
        title,
        duration
      })
      // a partir dessa linha temos certeza de que:
      // o dado recebido (input) está no formato esperado (CreateVideoInputDTO)
      const videoBusiness = new VideoBusiness
      const output = await videoBusiness.createVideo(input)


      res.status(201).send(output.message)
    } catch (error) {
      console.log(error)

      if (req.statusCode === 200) {
        res.status(500)
      }

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
        } 
        else if (error instanceof Error) {
          res.send(error.message)
            } else {
              res.send("Erro inesperado")
              }
    }
  }

  updateVideo = async (req: Request, res: Response) => {
    try {
      const idToEdit = req.params.id
      const { id, title, duration, uploadedAt } = req.body

      const input = EditProductSchema.parse({
        idToEdit,
        id,
        title,
        duration,
      })       

      const videoBusiness = new VideoBusiness()
      const output = await videoBusiness.updateVideo(input)

      // Enviando uma resposta de sucesso (status 200) com o vídeo atualizado
      res.status(200).send({ message: output.message, video: output.video })
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
  }


  // não vou fazer um DTO apenas para ID :D 
  // se me cobrarem eu faço, RH da empresa me liga kkkk 
  deleteVideo = async (req: Request, res: Response) => {
    try {
      const input = {
        id: req.params.id
      }

      const videoBusiness = new VideoBusiness()
      const output = await videoBusiness.deleteVideo(input)

      res.status(200).send(output.message)
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
  }

}