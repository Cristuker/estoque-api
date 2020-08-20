# estoque-api

# Docker commands

```
# To create a postgres container
$ docker container run --name materials -e POSTGRES_PASSWORD=materials123 -p 5432:5432 -d postgres

# To run database
$ docker container start materials
```
