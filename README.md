# Online Paper Grading System

## Description

The goal of the project “Online Paper Grading System” lies in providing a convenient, effective solution to solve problems of managing assignments, classes and students in an educational environment.
The system is designed for users who are teachers and students. It is built using [ReactJS](https://react.dev)

## Installation

1. Client

- Clone the repository

```bash
[git clone https://github.com/OPGS-project/online-paper-grading-system_CAP1.git](https://github.com/OPGS-project/online-paper-grading-system_CAP1.git)
```

- Checkout brach `developer_han`
- Run `npm install` in the client(website) directory

```bash
cd client
npm install

```

2. Server

- Clone the repository (server)
- Run `npm install` in the server(website) directory

```bash
cd server
npm install
```

3. Database

- Download [xampp](https://www.apachefriends.org/download.html)
- Open `xampp`, click on `start` of `Apache` and `MySQL`, click on `Admin` of `MySQL`
- Create new database with name `cap1_opgs`
- Open folder ONLINE-PAPER-GRADING-SYSTEM_CAP1(server)
- Create a file with name `.env` Copy and save

```bash
PORT = 8081
CLIENT_URL = http://localhost:3000
JWT_SECRET = dasdafasfhfaiygddhabhavbsdjbgasgkijcnbaoiwlbnfcakcbnaljjks
LIMIT_NUMBER = 7
JWT_SECRET_REFRESH_TOKEN = ahjksfbyuiasgfubasfgnoiasjodisdafd

GOOGLE_CLIENT_ID= 162581959963-p7jteoulvoiqekntbehrb53m5gc7oc3v.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET= 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

EMAIL_NAME = cap1opgs@gmail.com
EMAIL_PASSWORD = ieso nixf gyek ayhd

CLOUDINARY_NAME=dpkkfverq
CLOUDINARY_KEY=732374836242417
CLOUDINARY_SECRET=8ogUHlOTcdoPgn-uXFE-PuO30Zo

```

- Open terminal of folder ONLINE-PAPER-GRADING-SYSTEM_CAP1(server)
- Run `cd src`
- Run `npx sequelize-cli db:migrate`

## Usage

- Run the server in development mode

1. Open folder ONLINE-PAPER-GRADING-SYSTEM_CAP1(server)
2. Run the server

```bash
cd server
npm start
```

- Run the website in development mode

1. Open folder ONLINE-PAPER-GRADING-SYSTEM_CAP1(client)
2. Run the website

```bash
cd client
npm start
```

## Authors (C1SE01)

- [Trinh Phu Tan](https://github.com/trinhphutan)
- [Huynh Nguyen Bao Han](https://github.com/huynhbaohan02)
- [Nguyen Huu Linh](https://github.com/Huulinh25)
- [Le Van Anh Duy](https://github.com/anhduy9102)
- [Do Duc Binh](https://github.com/doducbinh)
