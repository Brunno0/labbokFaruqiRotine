import { Request, Response } from "express"
import { VideoDatabase } from "../database/VideoDatabase"
import { Video } from "../models/Video"
import { TVideoDB } from "../types"
import { VideoBusiness } from "../business/VideoBusiness"


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
         const input ={
              q:req.query.q
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

     createVideo =  async (req: Request, res: Response) => {
        try {
          const { id, title, duration } = req.body
          
          const input = {
            id,
            title,
            duration
          }
          const videoBusiness = new VideoBusiness
          const output = await videoBusiness.createVideo(input)
         
      
          res.status(201).send(output.massage)
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

      updateVideo = async (req: Request, res: Response) => {
        try {
          const idToEdit = req.params.id
          const {id, title,duration,uploadedAt} = req.body
          
            const input ={
              id,
              title,
              duration,
              uploadedAt
            }

          const videoBusiness = new VideoBusiness()
          const output = await videoBusiness.updateVideo(input,idToEdit)

          // Enviando uma resposta de sucesso (status 200) com o vídeo atualizado
          res.status(200).send({message:output.message, video:output.video})
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

      deleteVideo =  async (req: Request, res: Response) => {
        try {
         const input ={
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