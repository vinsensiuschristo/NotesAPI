## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [API Documentation](#api-documentation)
### General Info
***
NotesAPI is a backend application that allows users to store books. This application is built using Typescript and Express.
## Technologies
***
A list of technologies used within the project:
* [Typescript](https://www.typescriptlang.org/): Version 5.3.3
* [Express](https://expressjs.com/): Version 4.18.2
* [Mongoose](https://mongoosejs.com/): Version 8.1.1
## Installation
***
A little intro about the installation.
```
$ npm install
$ npm start:js
```


## API Documentation
***

### Create Notes

* Methods : POST
* URL : /notes
* Body Request : 
```JSON
{
  "name": string,
  "year": number,
  "author": string,
  "summary": string,
  "publisher": string,
  "pageCount": number,
  "readPage": number,
  "reading": boolean
}
```
* Response
```JSON
{
    "id": "65c45925e1b257cb87bb5044",
    "name": "Buku A",
    "year": 2010,
    "author": "John Doe",
    "summary": "Lorem ipsum dolor sit amet",
    "publisher": "Dicoding Indonesia",
    "pageCount": 100,
    "readPage": 25,
    "finished": false,
    "reading": false,
    "insertedAt": "2021-03-04T09:11:44.598Z",
    "updatedAt": "2021-03-04T09:11:44.598Z"
}
```
Some properties are processed and obtained on the server side. Here is the explanation:

* id: the id value must be unique. 
* finished: is a boolean property that describes whether the book has been read or not. The finished value is obtained from the observation pageCount === readPage.
* insertedAt : is a property that holds the date the book was inserted. You can use new Date().toISOString() to generate the value.
* updatedAt : is a property that holds the date the book was updated. When a new book is inserted, give this property the same value as insertedAt.


#### Error Response
* The client did not attach the name property to the request body. When this happens, the server will respond with:
    * Status Code : 400
    * Response Body :
        ```JSON
        {
          "status": "fail",
          "message": "Gagal menambahkan buku. Mohon isi nama buku"
        }
        ```
* The client attaches a readPage property value that is greater than the pageCount property value. When this happens, the server will respond with:
  * Status Code : 400
  * Response Body :
    ```JSON
    {
      "status": "fail",
      "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    }
    ```
#### Success Response
* Status Code : 201
* Response Body :
```JSON
{
    "status": "success",
    "message": "Buku berhasil ditambahkan",
    "data": {
        "noteId": "65c45925e1b257cb87bb5044"
    }
}
```
### Get Notes

* Methods : GET
* URL : /notes
* Response
```JSON
{
  "status": "success",
  "data": {
    "books": [
      {
        "id": "Qbax5Oy7L8WKf74l",
        "name": "Buku A",
        "publisher": "Dicoding Indonesia"
      },
      {
        "id": "1L7ZtDUFeGs7VlEt",
        "name": "Buku B",
        "publisher": "Dicoding Indonesia"
      },
      {
        "id": "K8DZbfI-t3LrY7lD",
        "name": "Buku C",
        "publisher": "Dicoding Indonesia"
      }
    ]
  }
}
```
### Get Detail Notes

* Methods : GET
* URL : /notes/{noteId}

#### Success Response
* Status Code : 200
* Response Body :
```JSON
{
  "status": "success",
  "data": {
    "book": {
      "id": "aWZBUW3JN_VBE-9I",
      "name": "Buku A Revisi",
      "year": 2011,
      "author": "Jane Doe",
      "summary": "Lorem Dolor sit Amet",
      "publisher": "Dicoding",
      "pageCount": 200,
      "readPage": 26,
      "finished": false,
      "reading": false,
      "insertedAt": "2021-03-05T06:14:28.930Z",
      "updatedAt": "2021-03-05T06:14:30.718Z"
    }
  }
}
```

#### Error Response
* If the note with the id attached by the client is not found
    * Status Code : 404
    * Response Body :
        ```JSON
        {
          "status": "fail",
          "message": "Buku tidak ditemukan"
        }
      ```
### Update Notes

* Methods : PUT
* URL : /notes/{noteId}
* Body Request :
```JSON
{
  "name": string,
  "year": number,
  "author": string,
  "summary": string,
  "publisher": string,
  "pageCount": number,
  "readPage": number,
  "reading": boolean
}
```
#### Error Response
* The client did not attach the name property to the request body. When this happens, the server will respond with:
  * Status Code : 400
  * Response Body :
    ```JSON
    {
      "status": "fail",
      "message": "Gagal memperbarui buku. Mohon isi nama buku"
    }
    ```
* The client attaches a readPage property value that is greater than the pageCount property value. When this happens, the server will respond with:
    * Status Code : 400
    * Response Body :
      ```JSON
      {
        "status": "fail",
        "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
      }
      ```
* The id attached by the client is not found by the server. When this happens, the server will respond with:
    * Status Code : 404
    * Response Body :
      ```JSON
      {
        "status": "fail",
        "message": "Gagal memperbarui buku. Id tidak ditemukan"
      }
      ```
      

#### Success Response
* Status Code : 200
* Response Body :
    ```JSON
    {
    "status": "success",
    "message": "Buku berhasil diperbarui"
    }
    ```
### Delete Notes

* Methods : DELETE
* URL : /notes/{noteId}
#### Error Response
* If the attached id is not owned by any book, then the server should return the following response
    * Status Code : 404
    * Response Body :
        ```JSON
        {
          "status": "fail",
          "message": "Buku gagal dihapus. Id tidak ditemukan"
        }
      ```

#### Success Response
* Status Code : 200
* Response Body :
```JSON
{
  "status": "success",
  "message": "Buku berhasil dihapus"
}
```