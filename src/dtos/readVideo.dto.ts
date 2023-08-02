

import z from 'zod'
import { Video } from '../models/Video'
// Quando recebemos um Video para pegar, teremos uma entrada com essa assinatura: 
export interface ReadVideoInputDTO {
   q:string | undefined
}
// Na hora de entregar a resposta ao consumer da nossa API,
// enviaremos a resposta seguindo a assinatura: 

export interface ReadVideoOutputDTO {
    //message com a mensagem do código
    message: string,
    result: Video | Video[]
}


export const ReadVideoSchema = z.object({
    
      //Verifico se id é do tipo string
    q:
        z.string({
            invalid_type_error: "'id' deve ser do tipo string"
        }).min(2, "'id' deve possuir ao menos 2 caracteres"),
   
}).transform
    (data => data as ReadVideoInputDTO)// por fim, os dados são tipados com a tipagem do EditVideoInputDTO