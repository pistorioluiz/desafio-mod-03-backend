import { NextFunction, Request, Response } from "express"
import bancoDeDados from "../bancoDeDados"

export const validarIdEvento = (req: Request, res: Response, next: NextFunction) => {
    const { idEvento } = req.body
    const { comprovante } = req.query

    if (!idEvento) {
        return res.status(400).json({
        "mensagem": "O identificador do evento é obrigatório"
        })
    }

    const idInvalido = comprovante as string
    
    const idInvalidoSeparado = idInvalido.split('/')

    const idValido = idInvalidoSeparado[idInvalidoSeparado.length -1]

    const identificadorDoEvento = bancoDeDados.usuarios.find(idUsuario => {
        return idUsuario.id === idValido
    })

    if (!identificadorDoEvento) {
        return res.status(400).json({
        "mensagem": "O identificador do evento é obrigatório"
        })
    }

    next()
}

export const procurarEvento = (req: Request, res: Response, next: NextFunction) => {
    const { idEvento } = req.body

    const buscarEvento = bancoDeDados.eventos.find(procurarEvento => {
        return procurarEvento.id === idEvento
    })

    if (!buscarEvento) {
        return res.status(404).json({
        "mensagem": "Evento não encontrado"
        })
    }

    next()
}
