// dado de entrada (mundo externo → nossa API)
// é o que esperamos que seja recebido
import z from 'zod'
export interface CreateVideoInputDTO {
    id: string,
    title: string,
    duration: number,
}
// dado de saída (nossa API → mundo externo)
// é o que devolveremos como resposta
// aqui temos um exemplo onde uma propriedade é removida (password)
// assim protegemos o dado e só enviamos o que é necessário para o front
export interface CreateVideoOutputDTO {
    message: string,
    video: {
        id: string,
        title: string,
        duration: number
    }
}

// Aqui validamos os dados via Zod. 
// string() espera que a propriedade seja do tipo string
// .min(1) espera que essa mesma string tenha ao menos 1 caractere

export const CreateVideoSchema = z.object({
    id: 
        z.string({
        invalid_type_error: "'id' deve ser do tipo string"})
        .min(1),
    title: 
        z.string({
        invalid_type_error: "'title' deve ser do tipo string"})
        .min(1,"'title' deve ter ao menos 2 caracteres"),
    duration:
        z.number(),
    }).transform
        (data => data as CreateVideoInputDTO)

