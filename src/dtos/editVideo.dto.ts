

import z from 'zod'
// Quando recebemos um Video para editar, teremos uma entrada com essa assinatura: 
export interface EditVideoInputDTO {
    idToEdit: string,
    id: string,
    title: string,
    duration: number
}
// Na hora de entregar a resposta ao consumer da nossa API, enviaremos a resposta seguindo a assinatura: 

export interface EditVideoOutputDTO {
    //message com a mensagem do código
    message: string,
    // o video já com os dados editados
    video: {
        id: string,
        title: string,
        duration: number,
        uplodatedAt: string
    }
}

// Faça um schema para validar os dados do edit:

export const EditProductSchema = z.object({
    
    idToEdit:
        z.string(),

    //Verifico se id é do tipo string
    id:
        z.string({
            invalid_type_error: "'id' deve ser do tipo string"
        }).optional(),

    //title é uma string?
    title:
        z.string({
            invalid_type_error: "'title' deve ser do tipo string"
        }).optional(),
    //duration é um number? 
    duration:
        z.number({
            invalid_type_error: "'duration' deve ser do tipo number"
        })
            .gte(0) //gte(0) "greater than or equal" (maior ou igual) em inglês. Esse método é usado para garantir que o valor do campo "duration" seja maior ou igual a 0.
            .optional(),

}).transform
    (data => data as EditVideoInputDTO)// por fim, os dados são tipados com a tipagem do EditVideoInputDTO