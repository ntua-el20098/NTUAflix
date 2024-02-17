# NTUAflix


![Logo](https://github.com/ntua-el20098/NTUAflix/blob/main/public/NTUAflix.png?raw=true)


NTUAflix is a film database where users can navigate through a big catalogue of Movies and TV-Series (AKA titles). NTUAflix allows its users to preview movies and TV shows by providing their identifying characteristics. 

It has three main use cases. 
1. The users can browse the provided collection of titles and filter their genre through the “Search By Genre“ button.
2. The users can look for a title based on its rating by selecting the “Search By Rating” button and then providing the desired minimul rating value.
3. NTUAflix provides users the option to browse the catalogue through each title’s contributing members with the “Search By Person” button.


Once a title or a person has been selected, NTUAflix displays a detailed page containing the key characteristics of the selected item (title or person) as well as active links to related content(similar titles and contributors for titles - title appearances, best rated and latest appearance for people).


## Creators

- [Αδαμόπουλος Διονύσης](https://github.com/ntua-el20061)
- [Γεωργιάδη Δάφνη](https://github.com/ntua-el20189)
- [Καμπουγέρης Χαράλαμπος](https://github.com/ntua-el20098)
- [Κουστένης Χρίστος](https://github.com/ntua-el20227)
- [Μητσάκος Άρης](https://github.com/ntua-el20123)
- [Χριστοδουλάκης Σταύρος](https://github.com/ntua-el20890)


## Table of Contents

- [Tech Requirements](#Tech-Stack)
- [Installations](#Installation)
  - [Clone the repository](#Clone-the-repository)
  - [Database Setup](#Database-Setup)
  - [CLI Setup](#CLI-Setup)
- [Environment Variables](#Environment-Variables)
- [Self Signed SSL Key](#Generate-a-Self-Signed-SSL-key)
- [Run Locally](#Run-Locally)
- [Running Tests](#Running-Tests)
- [Documentation](#Documentation)
- [License](#License)



## Tech Stack

**Backend / cli-client:** Node.js 

**Frontend:** Next.js

**Database** MySQL, XAMPP 

**Testing:** Node.js, Postman



## Installation

### Clone the repository
```sh
git clone https://github.com/ntua-el20098/NTUAflix
```
go to the project directory
```sh
cd NTUAflix
```
install dependencies 
```sh
npm install
```

### Database Setup

Make sure mySQL is running. (For example make sure XAMPP is running with Apache and MySQL active)

create a new database
```sh
npm install
```
populate the database with data
```sh
node script.js
```
```sh
npm install
```

### CLI Setup

```sh
cd cli_client
```
```sh
npm install
```

## Environment Variables

To run this project, you will need to create an .env file in the root of the project and add the following environment variables in it.

`DB_HOST`
`DB_PORT`
`DB_USER`
`DB_PASSWORD`
`DB_NAME`
`KEY_PATH`
`CERT_PATH`

it should look like this: 
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=tl
KEY_PATH=/path/to/your/key.pem
CERT_PATH=/path/to/your/cert.pem
```

### Generate a Self Signed SSL key

Make sure Git is installed in your device and locate the Git Installation Folder.
It should look something like this: 
```sh
C:\Program Files\Git
```

Inside it, locate the `usr` folder and then the `ssl` folder.
Make sure a file named `openss.cnf` is inside the ssl folder. 
Copy the path.


The full path to the file should look something like this: 
```sh
C:\Program Files\Git\usr\ssl\openssl.cnf
```

Go to a secure directory or create a new one where you would like to store your self signed ssl key
```sh
cd path_to_your_secure_folder
```

Create `key.pem` and  `csr.pem` files
```sh
openssl genrsa -out key.pem 
```


for the next command replace "path" with the path to the `openssl.cnf` file
```sh
openssl req -new -key key.pem -out csr.pem -config "path"
```
If you are using a path with spaces, try wrapping it with quotes.


Generate the key and the `cert.pem` file
```sh
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

Add the `cert.pem` and `key.pem` paths to the .env file. It should be like this:
```
KEY_PATH=/path/to/your/key.pem
CERT_PATH=/path/to/your/cert.pem
```
If you are using a path with spaces, try wrapping it with quotes.



## Run locally

To run NTUAflix locally you will need to have 2 terminals open.

1. One is for the frontend server and it runs using the command:

```sh
npm start
```

2. The other one is for the backend server and it runs using the command:
```sh
node ./api-backend/server.js
```


### CLI Commands
The following commands are available for the CLI:

Commands:

-  `healthcheck` | hc [options] - Confirms end-to-end connectivity between the user and the database
-  `title` | t [options]         - Returns the title with the specified tconst
-  `searchtitle` | st [options]  - Returns the title with the specified primaryTitle
-  `bygenre` | bg [options]      - Returns the titles with the specified genre
-  `name` | n [options]          - Returns the name with the specified nconst
-  `searchname` | sn [options]   - Returns the name with the specified primaryName
-  `resetall` | rsall [options]  - Deletes all data from the database
-  `newtitles` | nt [options]    - Adds a new title to the database
-  `newakas` | na [options]      - Adds a new alternate title to the database
-  `newnames` | nn [options]     - Adds a new name to the database
-  `newcrew` | nc [options]      - Adds a new crew member to the database
-  `newepisode` | ne [options]   - Adds a new episode to the database
-  `newprincipals` | s [options] - Adds a new principal to the database
-  `newratings` | nr [options]   - Adds a new rating to the database
-  `help`                     - Shows help

  
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

