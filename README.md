
# NTUAflix

NTUAflix is a film database where users can navigate through a big catalogue of Movies and TV-Series (AKA titles). NTUAflix allows its users to preview movies and TV shows by providing their identifying characteristics. 

It has three main use cases. 
1. The users can browse the provided collection of titles and filter their genre through the “Search By Genre“ button.
2. The users can look for a title based on its rating by selecting the “Search By Rating” button and then providing the desired minimul rating value.
3. NTUAflix provides users the option to browse the catalogue through each title’s contributing members with the “Search By Person” button.


Once a title or a person has been selected, NTUAflix displays a detailed page containing the key characteristics of the selected item (title or person) as well as active links to related content(similar titles and contributors for titles - title appearances, best rated and latest appearance for people).


![Logo](https://github.com/ntua-el20098/NTUAflix/blob/main/public/NTUAflix.png?raw=true)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Back-End](#back-end)
  - [API Documentation](#api-documentation)
  - [Front-End](#front-end)
  - [CLI Client](#cli-client)
  - [Testing](#testing)
- [Diagrams](#diagrams)
- [AI Assistance Log](#ai-assistance-log)


## Creators

- [Διονύσης Αδαμόπουλος](https://www.github.com/octokatherine)
- [Γεωργιάδη Δάφνη](https://www.github.com/octokatherine)
- [Καμπουγέρης Χαράλαμπος](https://www.github.com/octokatherine)
- [Χρίστος Κουστένης](https://www.github.com/octokatherine)
- [Άρης Μιτσάκος](https://www.github.com/octokatherine)
- [Χριστοδουλάκης Σταύρος](https://www.github.com/octokatherine)



## Tech Stack

**Backend / cli-client:** Node.js 

**Frontend:** Next.js

**Database** MySQL, XAMPP 

**Testing:** Node.js, Postman




## Installation

#### Clone the repository

```sh
   git clone https://github.com/ntua-el20098/NTUAflix
```

```sh
   cd NTUAflix
```

```sh
   npm install
```

#### Database Setup

Make sure mySQL is running. (For example make sure XAMPP is running with Apache and MySQL active)


```sh
   npm install
```
```sh
   npm install
```
```sh
   npm install
```

#### CLI Setup

```sh
   cd cli_client
```
```sh
   npm install
```


## Run Locally

To run NTUAflix Locally we will need to have 2 terminals that:

1. runs the frontend server using the command:

```sh
   npm start
```

2. runs the backend server using the command:
```sh
   node ./api-backend/server.js
```


Commands:
  healthcheck|hc [options]   Confirms end-to-end connectivity between the user and the database
  title|t [options]          Returns the title with the specified tconst
  searchtitle|st [options]   Returns the title with the specified primaryTitle
  bygenre|bg [options]       Returns the titles with the specified genre
  name|n [options]           Returns the name with the specified nconst
  searchname|sn [options]    Returns the name with the specified primaryName
  resetall|rsall [options]   Deletes all data from the database
  newtitles|nt [options]     Adds a new title to the database
  newakas|na [options]       Adds a new alternate title to the database
  newnames|nn [options]      Adds a new name to the database
  newcrew|nc [options]       Adds a new crew member to the database
  newepisode|ne [options]    Adds a new episode to the database
  newprincipals|s [options]  Adds a new principal to the database
  newratings|nr [options]    Adds a new rating to the database
  help                       Shows help
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY`

`ANOTHER_API_KEY`


## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## Documentation

NTUAflix Project [Documentation](https://linktodocumentation)

Our API Documentation is made using OpenAPI and is available through the file  `openapi.yaml` 

You can open the file using a program like Swagger to vizualize the API.
## License

[MIT](https://choosealicense.com/licenses/mit/)

