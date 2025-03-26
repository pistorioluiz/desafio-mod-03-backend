function criptografarSenha(senha:string) {
    let criptografia = 'yy' + senha + 'zz'
    let senhaCriptografada = criptografia.split('').reverse().join('')
    return senhaCriptografada
}

export default criptografarSenha
