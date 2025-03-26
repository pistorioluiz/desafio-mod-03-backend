import { NextFunction, Request, Response } from "express"
import bancoDeDados from "../bancoDeDados"
import fraseSecreta from "../fraseSecreta"

export const validarComprovante = (req: Request, res: Response, next: NextFunction) => {
    const { comprovante } = req.query
    
    if (!comprovante) {
        return res.status(401).json({
            "mensagem": "Falha na autenticação"
        })
    }

    const idEncontrado = bancoDeDados.usuarios.find((idUsuario) => {
        return `${fraseSecreta}/${idUsuario.id}` === comprovante
    })

    if (!idEncontrado) {
        return res.status(401).json({
            "mensagem": "Falha na autenticação"
        })
    }
    
    next()
}
