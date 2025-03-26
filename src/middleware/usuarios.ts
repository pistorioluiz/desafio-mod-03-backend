import { NextFunction, Request, Response } from "express"
import bancoDeDados from "../bancoDeDados"

export const validarEmailSenhaObrigatorios = (req: Request, res: Response, next: NextFunction) => {
    
    const { email, senha } = req.body
    
        if (!email || !senha) {
        return res.status(400).json({
            "mensagem": "Todos os campos são obrigatórios"
        })
        }
    
        next()
}

export const validarCamposObrigatorios = (req: Request, res: Response, next: NextFunction) => {
    const {
        nome,
        email,
        senha
    } = req.body

    if (!nome || !email || !senha) {
    return res.status(400).json({
        "mensagem": "Todos os campos são obrigatórios"
    })
    }

    next()
}

export const validarEmailJaCadastrado = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    
    const buscarEmail = bancoDeDados.usuarios.find(usuario => usuario.email === email)

    if (buscarEmail) {
        return res.status(404).json({
        "mensagem": "E-mail já cadastrado"
        })
    }

    next()
}
