# Pen Feed Backend

This is a capstone project built at General Assembly's Web Development Immersive.

This repository is the backend or API side of the project. The frontend or client of the
project is [here](https://github.com/sparrowr/pen-feed-client).

## Components of this Project

The frontend client repository is [here](https://github.com/sparrowr/pen-feed-client).

The backend API repository is [here](https://github.com/sparrowr/pen-feed-backend).

The deployed frontend client is [here](https://sparrowr.github.io/pen-feed-client/).

The deployed backend API is [here](https://evening-falls-18430.herokuapp.com/).

## What this app does and how it works

This app allows users to record information about fountain pens, and then retrieve
that information later. It automatically calculates how soon pens should be cleaned
based on when they were filled with ink and what kind of ink it was, and lists pens
that need cleaning more badly ahead of pens that don't need to be cleaned yet.

I hope to eventually have this tool track ink use and overall pen activity history.
Ultimately, I would like to use it as a replacement for a Google Drive spreadsheet
I'm currently using for this hobby.

## Structure of this Repository

Dependencies are stored in [`package.json`](package.json).

The most important file for understanding the structure of the template is
[`server.js`](server.js). This is where the actual Express [`app`](app) object
is created, where the middlewares and routes are registered, and more.

The [`app`](app) directory contains models and route files. Models are simply
Mongoose models. Route files are somewhat similar to controllers in Rails, but
they cover more functionality, including serialization and deciding which HTTP
verbs to accept and what to do with them.

The [`config`](config) directory holds just `db.js`, which is where we specify the name
and URL of our database.

The [`lib`](lib) directory is for code that will be used in other places in the
application. The token authentication code is stored in [`lib/auth.js`](lib/auth.js). The
other files in [`lib`](lib) deal with error handling. [`custom_errors.js`](lib/custom_errors.js) is where all
the different custom classes of errors are created. There are also some functions
defined here that are used elsewhere to check for errors. [`lib/error_handler.js`](lib/error_handler.js)
is a function that is used in all the client's `.catch`es. It catches errors, and
sets the response status code based on what type of error got thrown.

## Setting Up and Installing This Project

1. Install a local copy of this repository on your computer.
1.  Install dependencies with `npm install`.
1.  Ensure that you have `nodemon` installed by running `npm install -g nodemon`.
1. From the root of your repository, run the following commands. They will set a SECRET_KEY for development and testing.
 ```sh
 echo SECRET_KEY_BASE_TEST=$(openssl rand -base64 66 | tr -d '\n') >>.env
 echo SECRET_KEY_BASE_DEVELOPMENT=$(openssl rand -base64 66 | tr -d '\n') >> .env
 ```
1. To deploy this API locally on your computer, run `npm run server`. To interact with the backend without using curl scripts, you will also need to set up the frontend client.
1. To deploy a version of this API to Heroku, follow the steps in [express-api-deployment-guide](https://git.generalassemb.ly/ga-wdi-boston/express-api-deployment-guide)

## Planning, Process, and Problem-Solving

I tracked my progress using handwritten notes and Google Drive documents.I started
by taking notes on the way I have been using the spreadsheet I'd like to eventually
replace with this project. Then I created the ERD, wireframes, and user stories.

Since I knew I'd need date math for this project, I looked into how dates work
in Rails and in Express, and decided to use Express (in part because this means only
dealing with date math in one language).

I set up authentication, deployed the frontend and backend, and made sure the
authentication was working before working on anything specific to this project.

On this project, I built the pens resource on the backend, used curl scripts to make
sure it ran properly, then deployed it. Since I began working on the frontend, I've
only made minor changes to the backend.

On the frontend, I started by setting up the Create action for the pens resource,
then Read, then Update and finally Destroy. Create, Read, and Update were all
moderately complex, but Destroy was very simple.

## Unsolved Problems and Possible Future Tasks

1. Authentication is currently done through code hand-rolled by General Assembly instructors. Among other problems, this code never checks if the content in the "password" and "confirm password" boxes on the signup page are the same.
1. There's no history/logging, so it's not possible to see past events or trends.
1. There's no way to share pen information with other users.
1. Users cannot store information about ink use anywhere in this app.
1. The "Inked" and "Cleaned" check-boxes are somewhat small and could be improved.
1. There is no CSS/styling at all.

## Entity Relationship Diagram (ERD)

The Entity Relationship Diagram for this project is on Google Drive [here](https://docs.google.com/drawings/d/1ZC4q8jW3dd27X7Ebk6hY4JCRKuwoxET5IasnLiqf1J8/edit?usp=sharing).

## API Specifications and Routes

### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/` | `users#changepw`  |
| DELETE | `/sign-out/`        | `users#signout`   |

#### POST /sign-up

Request:

```sh
curl --include --request POST http://localhost:4741/sign-up \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "an@example.email",
      "password": "an example password",
      "password_confirmation": "an example password"
    }
  }'
```

```sh
scripts/auth/sign-up.sh
```

Response:

```md
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 1,
    "email": "an@example.email"
  }
}
```

#### POST /sign-in

Request:

```sh
curl --include --request POST http://localhost:4741/sign-in \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "an@example.email",
      "password": "an example password"
    }
  }'
```

```sh
scripts/auth/sign-in.sh
```

Response:

```md
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 1,
    "email": "an@example.email",
    "token": "33ad6372f795694b333ec5f329ebeaaa"
  }
}
```

#### PATCH /change-password/

Request:

```sh
curl --include --request PATCH http://localhost:4741/change-password/ \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "passwords": {
      "old": "an example password",
      "new": "super sekrit"
    }
  }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa scripts/auth/change-password.sh
```

Response:

```md
HTTP/1.1 204 No Content
```

#### DELETE /sign-out/

Request:

```sh
curl --include --request DELETE http://localhost:4741/sign-out/ \
  --header "Authorization: Token token=$TOKEN"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa scripts/auth/sign-out.sh
```

Response:

```md
HTTP/1.1 204 No Content
```

### Pens

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/pens`             | `pens#create`    |
| GET   | `/pens`             | `pens#find`    |
| PATCH | `/pens/:id`        | `pens#update`   |
| DELETE | `/pens/:id`        | `pens#remove`   |

#### POST /pens

Request:

```sh
curl --include --request POST http://localhost:4741/create \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "pen": {
      "name": "'"${NAME}"'",
      "isInked": true,
      "isClean": false,
      "changedYear": 2018,
      "changedMonth": 3,
      "changedDay": 11,
      "inkName": "curl test ink",
      "inkType": "Water-Soluble"
    }
  }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa NAME=TestPen sh scripts/pens/create.sh
```

Response:

```md
HTTP/1.1 201 Created
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:7165
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 310
ETag: W/"136-qIoAs9GWTp6mPe7FrSrPx2s34jQ"
Date: Wed, 30 May 2018 22:44:07 GMT
Connection: keep-alive

{"pen":
  {"__v":0,
  "updatedAt":"2018-05-30T22:44:07.646Z",
  "createdAt":"2018-05-30T22:44:07.646Z",
  "name":"TestPen",
  "isInked":true,
  "isClean":false,
  "changedYear":2018,
  "changedMonth":3,
  "changedDay":11,
  "inkName":"curl test ink",
  "inkType":"Water-Soluble",
  "owner":"5b0dba9c6bb1d84c2ea2e47a",
  "_id":"5b0f2937c069e51d3640b0db"}
}
```

#### GET /pens

Request:

```sh
curl --include --request GET http://localhost:4741/pens \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa sh scripts/pens/index.sh
```

Response:

```md
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:7165
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 2402
ETag: W/"962-KPZ99qwoPJ0mmrvKiKHzFWIkSF4"
Date: Wed, 30 May 2018 22:46:13 GMT
Connection: keep-alive

{"pens":
  [{"_id":"5b0e031c37e23e12c3b94c7b",
    "updatedAt":"2018-05-30T21:15:07.288Z",
    "createdAt":"2018-05-30T01:49:16.813Z",
    "name":"TestPen","isInked":false,
    "isClean":true,
    "inkedYear":2018,
    "inkedMonth":3,
    "inkedDay":11,
    "inkName":"curl test ink",
    "inkType":"Water-Soluble",
    "owner":"5b0dba9c6bb1d84c2ea2e47a",
    "__v":0
  },{"_id":"5b0f0900c069e51d3640b0d4",
    "updatedAt":"2018-05-30T20:26:40.753Z",
    "createdAt":"2018-05-30T20:26:40.753Z",
    "name":"another pen",
    "isInked":true,
    "inkName":"Noodler's Operation Overlord",
    "inkType":"Bulletproof",
    "isClean":false,
    "changedYear":2018,
    "changedMonth":5,
    "changedDay":23,
    "owner":"5b0dba9c6bb1d84c2ea2e47a",
    "__v":0
  }
}
```

#### PATCH `/pens/:id`

Request:

```sh
curl --include --request PATCH "http://localhost:4741/pens/${ID}" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}"
  --data '{
      "pen": {
        "isInked": false,
        "isClean": true
      }
  }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa ID=5b0f2937c069e51d3640b0db sh scripts/pens/update.sh
```

Response:

```md
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:7165
Vary: Origin
ETag: W/"a-bAsFyilMr4Ra1hIU5PyoyFRunpI"
Date: Wed, 30 May 2018 22:53:10 GMT
Connection: keep-alive
```

#### DELETE `/pens/:id`

Request:

```sh
curl --include --request PATCH "http://localhost:4741/pens/${ID}" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa ID=5b0f2937c069e51d3640b0db sh scripts/pen/destroy.sh
```

Response:

```md
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:7165
Vary: Origin
ETag: W/"a-bAsFyilMr4Ra1hIU5PyoyFRunpI"
Date: Wed, 30 May 2018 22:54:14 GMT
Connection: keep-alive
```

## Credits and Technologies Used

- This was derived from the [GA template](https://git.generalassemb.ly/ga-wdi-boston/browser-template)
- It was designed based on [this list of requirements](https://git.generalassemb.ly/ga-wdi-boston/capstone-project/blob/master/requirements.md)
- This project uses JavaScript, and the JavaScript tools Bootstrap 3, Express, Handlebars, NPM, and JQuery.
- Express uses Mongoose in order to store documents in MongoDB.
- Some pen cleaning recommendations came from [Jetpens](https://www.jetpens.com)

## [License](LICENSE)

1. All content is licensed under a CC­BY­NC­SA 4.0 license.
1. All software code is licensed under GNU GPLv3. For commercial use or
    alternative licensing, please contact legal@ga.co.
