import { Router } from "express";
import { cadastrarCompra, cadastrarUsuarios, cancelarCompra, listarCompras, listarEventos, loginUsuario, mensagemVendaIngressos } from "../controller/controladores";
import { validarCamposObrigatorios, validarEmailJaCadastrado, validarEmailSenhaObrigatorios } from "../middleware/usuarios";
import { validarFiltroMaxPreco } from "../middleware/eventos";
import { validarComprovante } from "../middleware/comprovante";
import { procurarEvento, validarIdEvento } from "../middleware/compras";

const rotas = Router();

rotas.get('/', mensagemVendaIngressos )

rotas.get('/eventos', validarFiltroMaxPreco, listarEventos)

rotas.post('/usuarios', validarCamposObrigatorios, validarEmailJaCadastrado, cadastrarUsuarios)

rotas.post('/login', validarEmailSenhaObrigatorios, loginUsuario)

rotas.use(validarComprovante)

rotas.post('/compras',validarIdEvento, procurarEvento, cadastrarCompra)

rotas.get('/compras', listarCompras)

rotas.delete('/compras/:id', validarComprovante, cancelarCompra)

export default rotas;
