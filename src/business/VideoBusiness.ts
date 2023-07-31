import { throws } from "assert"
import { VideoDatabase } from "../database/VideoDatabase"
import { Video } from "../models/Video"
import { TVideoDB } from "../types"

export class VideoBusiness {
    getVideos =async (input:any) => {
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
            return videos

    }
    createVideo = async (input:any) => {

        const { id, title, duration } = input

        if (typeof id !== "string") {
            throw new Error("'id' deve ser string")
          }
      
          if (typeof title !== "string") {
            throw new Error("'title' deve ser string")
          }
      
          if (typeof duration !== "number") {
            throw new Error("'duration' deve ser number")
          }
      
          const videoDatabase = new VideoDatabase()
      
          const videoDBExists = await videoDatabase.findVideoById(id)
      
          if (videoDBExists) {
             throw new Error("Vídeo já cadastrado")
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

          const output ={
            massage:"Cadastrado com sucesso"
          }

          return output

    }
    updateVideo = async (input:any, idToEdit:any)=>{
           //Recebendo valores da idToEdit e body
           const {id, title,duration,uploadedAt} = input

            // Validando o campo 'id'
           if (id !== undefined) {
             if (typeof id !== "string") {
            
               throw new Error("'id' deve ser string")
             }
           }
       
           // Validando o campo 'title'
           if (title !== undefined) {
             if (typeof title !== "string") {
             
               throw new Error("'title' deve ser string")
             }
           }
       
           // Validando o campo 'duration'
           if (duration !== undefined) {
             if (typeof duration !== "number") {
       
               throw new Error("'duration' deve ser number")
             }
           }
       
           // Validando o campo 'uploadedAt'
           if (uploadedAt !== undefined) {
             if (typeof uploadedAt !== "string") {
      
               throw new Error("'uploadedAt' deve ser string")
             }
           }
       
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
           uploadedAt && video.setUploadedAt(uploadedAt)
            
          

           // Criando um objeto 'updatedVideoDB' com os dados atualizados do vídeo
           const updatedVideoDB: TVideoDB = {
             id: video.getId(),
             title: video.getTitle(),
             duration: video.getDuration(),
             uploaded_at: video.getUploadedAt()
           }
       
           // Atualizando as informações do vídeo no banco de dados
           await videoDatabase.updateVideo(idToEdit)

           const output= {
            message: "Atuzalizado com sucesso",
            video
        }

            return output;

    }
    //POST
    deleteVideo =  async (input:any) => {

        const { id } = input

        if (!id) {
            throw new Error("'id' não informada")
        }
        if (typeof id !== "string") {
            throw new Error("'id' precisa ser uma string")
        }

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