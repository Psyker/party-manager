### Party manager

To run the postgres docker container run :

```
$ docker run -d --name party-db -p 5432:5432 -e 'POSTGRES_PASSWORD=aSecretPassword' postgres
```

To create the database and create the schema run :

```
$ npm run initdb
```

To launch the application's build run :

```
$ npm run dev
```