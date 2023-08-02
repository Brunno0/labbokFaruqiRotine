

import z from 'zod'
// Quando recebemos um Video para deletar, teremos uma entrada com essa assinatura: 
export interface DeleteVideoInputDTO {
   id:string 
}
// Na hora de entregar a resposta ao consumer da nossa API,
// enviaremos a resposta seguindo a assinatura: 

export interface DeleteVideoOutputDTO {
    //message com a mensagem do código
    message: string,
}


export const DeleteVideoSchema = z.object({
    
      //Verifico se id é do tipo string
    id:
        z.string({
            invalid_type_error: "'id' deve ser do tipo string"
        }).min(2, "'id' deve possuir ao menos 2 caracteres"),
   
}).transform
    (data => data as DeleteVideoInputDTO)// por fim, os dados são tipados com a tipagem do EditVideoInputDTO