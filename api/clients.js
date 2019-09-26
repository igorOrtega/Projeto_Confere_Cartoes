module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validations

    const save = async (req, res) => {
        
        const client = { ...req.body }
        // se o id for passado na requisição (update, get, delete)
        if(req.params.id) client.id = req.params.id
        // validações
        try {
            existsOrError(client.name, 'Nome não informado')
            existsOrError(client.cpf, 'Cpf não informado')

            // se o id não for passado ainda, verifica se cpf já foi cadastrado
            const clientFromDB = await app.db('clients')
                .where({ cpf: client.cpf }).first()
            if(!client.id) {
                notExistsOrError(clientFromDB, 'Cpf já cadastrado')
            }
            
        } catch(msg) {
            return res.status(400).send(msg)
        }

        if(client.id) {
            // atualizar usuario
            app.db('clients')
                .update(client)
                .where({ id: client.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            // novo usuario
            app.db('clients')
                .insert(client)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    // obter clientes
    const get = (req, res) => {
        app.db('clients')
            .select()
            .then(clients => res.json(clients))
            .catch(err => res.status(500).send(err))
    }

    // obter cliente por ID
    const getById = (req, res) => {
        app.db('clients')
            .select()
            .where({ id: req.params.id })
            .first()
            .then(client => res.json(client))
            .catch(err => res.status(500).send(err))
    }
    
    return { save, get, getById }
}