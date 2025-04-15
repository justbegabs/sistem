# API CRUD Simples

API REST simples implementada com Node.js e Express, utilizando armazenamento em memória.

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor:
```bash
npm start
```

Para desenvolvimento, use:
```bash
npm run dev
```

## Endpoints

### Items

- `POST /items` - Criar novo item
- `GET /items` - Listar todos os items
- `GET /items/:id` - Buscar item por ID
- `PUT /items/:id` - Atualizar item
- `DELETE /items/:id` - Remover item

## Exemplo de uso

### Criar item
```bash
curl -X POST http://localhost:3000/items -H "Content-Type: application/json" -d '{"nome": "Item 1", "descricao": "Descrição do item 1"}'
```

### Listar items
```bash
curl http://localhost:3000/items
```

### Buscar item por ID
```bash
curl http://localhost:3000/items/1
```

### Atualizar item
```bash
curl -X PUT http://localhost:3000/items/1 -H "Content-Type: application/json" -d '{"nome": "Item 1 Atualizado"}'
```

### Deletar item
```bash
curl -X DELETE http://localhost:3000/items/1
``` 