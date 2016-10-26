# Bazillionaire

Collaborative game development in HTML, CSS and JavaScript.

## Usage

Docker.

```shell
$ docker-compose up
```

###### App

* <http://localhost:3000>

###### API and Explorer

* <http://localhost:3000/api>
* <http://localhost:3000/explorer>

###### OpenAPI Schema

* <http://localhost:3000/explorer/swagger.json>

### API Queries

For more details on and examples of Loopback API query syntax, please reference
<http://loopback.io/doc/en/lb2/Querying-data.html>.

###### Find Ship by Company ID

REST syntax.

```http
GET /api/Ships?filter[where][companyId]=1 HTTP/1.1
```

"Stringified" JSON syntax.

Pass URL-encoded `{"where": {"companyId": 1}}` query object to `filter` GET
parameter.

```http
GET /api/Ships?filter=%7B%22where%22%3A%20%7B%22companyId%22%3A%201%7D%7D HTTP/1.1
```

###### Find First 3 Games in Reverse Chronological Order

REST syntax.

```http
GET /api/Players?filter[limit]=3&filter[order]=lastUpdated%20DESC HTTP/1.1
```

"Stringified" JSON syntax.

Pass URL-encoded `{"limit": 3, "order": "lastUpdated DESC"}` query object to
`filter` GET parameter.

```http
GET /api/Games?filter=%7B%22limit%22%3A%203%2C%20%22order%22%3A%20%22lastUpdated%20DESC%22%7D HTTP/1.1
```

## Roadmap

[Roadmap](ROADMAP.md)
