# GraphQL-ToDo

Simple to-do app, testing GraphQL capabilities.

## Container commands

Run manually each for testing

```sh
# PostgreSQL
podman run -d --name pg-todo -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tododb -p 5432:5432 docker.io/postgres:15

# Server (Apollo)
cd server/
podman build -t graphql-server .
podman run -d --name gql-server --env-file .env -p 4000:4000 graphql-server

# Client (React)
cd client/
podman build -t graphql-client .
podman run -d --name client -p 3000:80 graphql-client

```
