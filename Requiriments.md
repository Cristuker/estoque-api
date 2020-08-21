# Tables

- Materials
- Users
- Requests

# Usuários

## Estoquista

- Pode apenas adicionar materiais

## Padeiro

- Pode buscar materiais
- Pode retirar materiais

## Gerente

- Pode buscar materiais
- Pode retirar materiais
- Visualizar todas as retiradas
- Pode criar novos usuários

# Rotas

```
 /user
```

- POST: Criar usuários
- GET: Listar usuários

#

```
 /rawMaterials
```

- POST: Adicionar novos materiais
- GET: Buscar materiais
- PUT: Atualizar materiais

#

```
 /rawMaterials?user=Fulano
```

- GET: Buscar request de materiais

#

```
 /login
```

- POST: Autenticar usuários
