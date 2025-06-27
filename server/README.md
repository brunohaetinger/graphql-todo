# GraphQL-ToDo Server

Server for this GraphQL project

## sequilize-cli commands

```sh
# Initialize sequelize on the project
npx sequelize-cli init

# Generate User model
npx sequelize-cli model:generate --name User --attributes email:string,password:string

# Generate Task model
npx sequelize-cli model:generate --name Task --attributes title:string,done:boolean,userId:integer

# Run migrations
npx sequelize-cli db:migrate
```