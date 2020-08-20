# 📦 Estoque-api

Uma api criada para gerenciar estoque de uma padaria

<p aligin="center">
<img src="./.github/assets/Estoque.png" alt="Esquema">

</p>

# ▶ Como rodar

```
# To create a postgres container
$ docker container run --name materials -e POSTGRES_PASSWORD=materials123 -p 5432:5432 -d postgres

# Run api and database
$ npm run dev

# To create database
$ npx sequelize-cli db:create

# Run all migrations to create tables
$ npx sequelize-cli db:migrate
```

<p align="center">Made whit ❤️ by <strong><a href="http://linkedin.com/in/cristian-silva-dev" target="blank" >Cristian</></p></strong>
