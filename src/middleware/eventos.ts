import { NextFunction, Request, Response } from "express"


export const validarFiltroMaxPreco = (req: Request, res: Response, next: NextFunction) => {

    const { maxPreco } = req.query
    
    if (maxPreco) {
        const maxPrecoNumerico = Number(maxPreco)
        if (maxPrecoNumerico < 0 || Number.isNaN(maxPrecoNumerico)) {
            return res.status(400).json({
            "mensagem": "O preço máximo do evento deve conter apenas números e deve ser positivo"})
        }
    }

    next()
}
