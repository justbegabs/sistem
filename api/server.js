const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Banco de dados em memória
let items = [];

// Rotas CRUD
// CREATE - Criar novo item
app.post('/items', (req, res) => {
    const newItem = {
        id: Date.now(),
        ...req.body
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// READ - Listar todos os items
app.get('/items', (req, res) => {
    res.json(items);
});

// READ - Buscar item por ID
app.get('/items/:id', (req, res) => {
    const item = items.find(item => item.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).json({ message: 'Item não encontrado' });
    }
    res.json(item);
});

// UPDATE - Atualizar item
app.put('/items/:id', (req, res) => {
    const index = items.findIndex(item => item.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ message: 'Item não encontrado' });
    }
    items[index] = {
        ...items[index],
        ...req.body
    };
    res.json(items[index]);
});

// DELETE - Remover item
app.delete('/items/:id', (req, res) => {
    const index = items.findIndex(item => item.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ message: 'Item não encontrado' });
    }
    items.splice(index, 1);
    res.status(204).send();
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
}); 