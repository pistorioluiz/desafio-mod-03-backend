import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import bancoDeDados from "../bancoDeDados";
import TUsuario from "../tipos/Usuario";
import criptografarSenha from "../../utils/criptografia";
import fraseSecreta from "../fraseSecreta";
import TCompra from "../tipos/Compra";

export const mensagemVendaIngressos = (req: Request, res: Response) => {
    res.status(200).json({"mensagem": "API de vendas de ingressos"})
}

export const listarEventos = (req: Request, res: Response) => {
    
    const { maxPreco } = req.query
    const maxPrecoNumerico = Number(maxPreco)

    const eventosFiltrados = bancoDeDados.eventos.filter(precoEvento => precoEvento.preco <= maxPrecoNumerico)

    if(maxPrecoNumerico >= 0) {
        return res.status(200).json(eventosFiltrados)
    }
    return res.send(bancoDeDados.eventos)
}

export const cadastrarUsuarios = (req: Request, res: Response) => {
    const {
        nome,
        email,
        senha
    } = req.body

    const senhaCriptografada = criptografarSenha(senha)

    const novoUsuario: TUsuario = {
        id: uuidv4(),
        nome,
        email,
        senha: senhaCriptografada
    }

    bancoDeDados.usuarios.push(novoUsuario)

    const { senha: _ , ...novoUsuarioSemSenha } = novoUsuario

    return res.status(201).json(novoUsuarioSemSenha)
}

export const loginUsuario = (req: Request, res: Response) => {
    const { email, senha } = req.body

    const usuarioEncontrado = bancoDeDados.usuarios.find((usuario) => usuario.email === email)

    if (!usuarioEncontrado) {
        return res.status(400).json({
        "mensagem": "E-mail ou senha inválidos"
        })
    }

    const senhaUsuarioCadastrado = usuarioEncontrado.senha
    const senhaUsuarioCadastradoCriptografada = criptografarSenha(senha)

    if (senhaUsuarioCadastradoCriptografada !== senhaUsuarioCadastrado) {        
        return res.status(400).json({
        "mensagem": "E-mail ou senha inválidos"
        })
    }

    const comprovante: string = `${fraseSecreta}/${usuarioEncontrado.id}`

    return res.status(200).json({ comprovante })
}

export const cadastrarCompra = (req: Request, res: Response) => {
    const { idEvento } = req.body
    const { comprovante } = req.query

    const idInvalido = comprovante as string
    
    const idInvalidoSeparado = idInvalido.split('/')

    const idValido = idInvalidoSeparado[idInvalidoSeparado.length -1]

    const novaCompra: TCompra = {
        id: uuidv4(),
        id_usuario: idValido,
        id_evento: idEvento
    }

    bancoDeDados.compras.push(novaCompra)

    return res.status(201).json(novaCompra)
}

export const listarCompras = (req: Request, res: Response) => {
    const { comprovante } = req.query

    const idInvalido = comprovante as string

    const idInvalidoSeparado = idInvalido.split('/')

    const idListaValido = idInvalidoSeparado[idInvalidoSeparado.length -1]

    const listagemDasCompras = bancoDeDados.compras.filter(usuario => {
        return usuario.id_usuario === idListaValido
    })

    const listaNova = listagemDasCompras.map(listagem => {
        const comprasListadas = bancoDeDados.eventos.find(eventoCompra => {
            return eventoCompra.id === listagem.id_evento
        })
        return {
            idCompra: listagem.id,
            idEvento: listagem.id_evento,
            nome: comprasListadas?.nome,
            endereco: comprasListadas?.endereco,
            data: comprasListadas?.data,
            preco: comprasListadas?.preco,
        }
})

    if (!listaNova) {
        return res.status(403).json({"mensagem": "O usuário não tem permissão para acessar esse recurso" })
    }

    return res.status(200).json(listaNova)
}

export const cancelarCompra = (req: Request, res: Response) => {
    const { id } = req.params
    const { comprovante } = req.query

    const idInvalido = comprovante as string
    
    const idInvalidoSeparado = idInvalido.split('/')
    
    const idValido = idInvalidoSeparado[idInvalidoSeparado.length -1]
    
    const buscarCompra = bancoDeDados.compras.findIndex(compra => compra.id ===
        id && compra.id_usuario === idValido)

    if (buscarCompra === -1) {
        return res.status(404).json({
        "mensagem": "Compra não encontrada"
        })
    }

    const excluirCompra = bancoDeDados.compras.splice(buscarCompra, 1)

    return res.status(204).send(excluirCompra)
}
