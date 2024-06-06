<h2 align="center">
  Sam Olusola
</h2>

## Requirements
- Node v18.17.0 or above
- Redis
- MySql

### Installation
- In project folder `yarn install`
- Run `yarn migrate` to run pending migrations
- Run `yarn start:dev`

## Creating New Migrations
Say you have created a new entity file e.g `activity.entity.ts`, you can generate a migration file for it with the following commands:

### Generate Migration file
Say you have choosing the name `CreateActivityEntity` to be the name of he migration file, run:

```bash
yarn migration:generate
```

A file will be generated into the `./src/database/migrations/` folder with the timestamp prepended e.g `./src/database/migrations/1713280153289-CreateActivityEntity.ts`

## Run the migration file
After inspecting the generated file and verifying that all is well, run the migration:
```bash
yarn migration:run   
 ```

