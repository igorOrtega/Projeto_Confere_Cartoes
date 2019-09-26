module.exports = app => {
    function existsOrError(value, msg) {
        // se não existe emite mensagem
        if(!value) throw msg
        // se for arryz vazio
        if(Array.isArray(value) && value.length === 0) throw msg
        // se for string com espaços apenas
        if(typeof value === 'string' && !value.trim()) throw msg
    }
    
    function notExistsOrError(value, msg) {
        try {
            existsOrError(value, msg)
        } catch(msg) {
            return
        }
        throw msg
    }
    
    function isIntegerOrError(value, msg) {
        if (!(value === parseInt(value, 10))) throw msg
    }

    function isNumberOrError(value, msg) {
        if (!(typeof value === 'number')) throw msg
    }

    return { existsOrError, notExistsOrError, isIntegerOrError, isNumberOrError }
}