# Costruire una dashboard con GraphQL e React

[Link slide del talk](https://docs.google.com/presentation/d/1hY6oVJSPujvnBYfFrGeRi_MyafQjkbiobfK23ASHtXw/edit?usp=sharing)
[Video talk](https://youtu.be/U41lUJCs5H4?t=1768)

Questo repository contiene il codice mostrato durante il talk del 21/11/2018 al meetup RomaJS per la parte client.

Ad ogni modo è stata inclusa una configurazione Docker (mediante `docker-compose`) con tutto il necessario per far girare la dashboard in locale.

Per informazioni riguardo la prima parte del talk (cioè come ottimizzare GraphQL lato server) fare riferimento a questo repository: https://github.com/GraphRM/graphql-graphdb

### Requisiti

* NodeJS > 8
* Docker con `docker-compose`

## Setup

Il repository contiene già uno snapshot dei dati per il database, mentre il server GraphQL è stato creato mediante `Apollo Server`.

Per avviare i container Docker andare sulla cartella principale del progetto ed eseguire:

```sh
docker-compose up -d
```

Al termine dell'installazione:
* il database Neo4J sarà disponibile su `localhost:7474` - può richiedere qualche minuto per il primo avvio
* il server GraphQL sarà disponibile su `localhost:4000` - in questo caso una versione Apollo dell'editor GraphiQL sarà disponibile, dove sarà mostrato anche lo schema.

Il codice del server GraphQL è disponibile nella cartella `server` di questo repository.
I dati del database sono stati pre-caricati tramite la cartella `data` in questo repository.

## Server -> Database

Un file `.env` è stato incluso in questo repository all'interno della cartella `server` di proposito, in modo da mostrare come è stato configurato il database.
La connessione tra il server GraphQL ed il database Neo4J avviene mediante l'adapter ufficiale Neo4J.
Per maggiori informazioni consultare anche il file `docker-compose.yml`.

## Dashboard

La dashboard in questo repository è stata creata con il seguente comando:

```
npx create-react-app dashboard
cd dashboard
npm install apollo-boost react-apollo graphql graphql-tag
```

## Next steps

I diversi branch in questo repository sono stati numerati per mostrare passo dopo passo come è stato costruito il progetto.