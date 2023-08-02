import { VideoDatabase } from "../database/VideoDatabase"
import { Video } from "../models/Video"
import { TVideoDB } from "../types"
import { BadRequestError } from "../errors/BadRequestError"
import { CreateVideoInputDTO, CreateVideoOutputDTO } from "../dtos/createVideo.dto"
import { EditVideoInputDTO, EditVideoOutputDTO } from "../dtos/editVideo.dto"
import { DeleteVideoInputDTO, DeleteVideoOutputDTO } from "../dtos/deleteVideo.dto"
import { ReadVideoInputDTO, ReadVideoOutputDTO } from "../dtos/readVideo.dto"

export class VideoBusiness {
    getVideos =async (input:ReadVideoInputDTO) => {
        const {q} = input
   
        const database = new VideoDatabase()
        const videosDB = await database.findVideos(q)
        
        const videos: Video[] = videosDB.map(
          (element) =>
            new Video(
              element.id,
              element.title,
              element.duration,
              element.uploaded_at
            )
        )

        const output:ReadVideoOutputDTO = {
          message:"Busca realizada com sucesso",
          result: videos
        }
            return output

    }
    createVideo = async (input:CreateVideoInputDTO): Promise<CreateVideoOutputDTO> => {

        const { id, title, duration } = input

          const videoDatabase = new VideoDatabase()
          const videoDBExists = await videoDatabase.findVideoById(id)
      
          if (videoDBExists) {
             throw new BadRequestError("Vídeo já cadastrado")
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

          // Formatamos o output do vídeo seguindo a assinatura do CreateVideoOutputDTO
          const output: CreateVideoOutputDTO = {
            message:"Cadastrado com sucesso",
              video:{
              id: newVideo.getId(),
              title: newVideo.getTitle(),
              duration: newVideo.getDuration(),
            }
          }

          return output

    }
    updateVideo = async (input:EditVideoInputDTO): Promise<EditVideoOutputDTO>=>{
           //Recebendo valores da idToEdit e body
           const {idToEdit,id, title,duration} = input

           // Não faz sentido alterar a data de upload. Um vídeo não pode trocar data de up
           // ou pode? por enquanto não. heheh 

           // Validando o campo 'uploadedAt'
           //
          //  if (uploadedAt !== undefined) {
          //    if (typeof uploadedAt !== "string") {
      
          //      throw new Error("'uploadedAt' deve ser string")
          //    }
          //  }
       
           // Instanciando um objeto da classe 'VideoDatabase'
           const videoDatabase = new VideoDatabase()
       
           // Buscando o vídeo no banco de dados com o id fornecido via params
           const videoDB = await videoDatabase.findVideoById(idToEdit)
       
           // Verificando se o vídeo foi encontrado no banco de dados
           if (!videoDB) {
                   throw new Error("'Vídeo não encontrado")
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

              
           // Criando um objeto 'updatedVideoDB' com os dados atualizados do vídeo
           const updatedVideoDB: TVideoDB = {
             id: video.getId(),
             title: video.getTitle(),
             duration: video.getDuration(),
             uploaded_at: video.getUploadedAt()
           }
       
           // Atualizando as informações do vídeo no banco de dados
           await videoDatabase.updateVideo(idToEdit)

          
           const output: EditVideoOutputDTO= {

            message: "Atuzalizado com sucesso",
            video:{
              id: video.getId(),
              title: video.getTitle(),
              duration: video.getDuration(),
              uplodatedAt: video.getUploadedAt()
            }
        }

            return output;

    }
    //POST
    deleteVideo =  async (input:DeleteVideoInputDTO):Promise<DeleteVideoOutputDTO> => {

        const { id } = input

        const videoDatabase = new VideoDatabase()
        const videToDeleteDB = await videoDatabase.findVideoById(id)

       if(!videToDeleteDB){
        throw new Error("Vídeo não encontrado, verifique id")
        }

        await videoDatabase.deleteVideo(videToDeleteDB.id) 
            
        const output = {
            message:"Deletado com sucesso"
           }
        return output
     }      
   
    


}
     
// 1. index chama userController.getUsers
// 2. Na controller os dados são recebidos e chama a userBusiness.getUsers(input)
// 3. Chegando na business recebemos o input, fazemos a conexão o o database e chamamos camada do banco userDatabase.findUsers. 
// 4. A busca é realizada no banco de dados. São devolvidos os dados para userDatabase que retorna para userBussines,
// que por sua vez retorna os dados instanciados para UserController 

// :)