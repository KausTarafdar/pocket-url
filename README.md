# REST API for URL-Shortening

#### An API for URL shortening like tiny url using NodeJS.

***Deployed api base url*** :  https://poc-ket.onrender.com/

**URL shortener** is a service that converts long URLs into short aliases to save space when sharing URLs in messages, twitter, presentations, etc. The service redirects incoming short form URLs to the original URL.

**Technologies Used**
NodeJS Application written in Javascript
- **Server** : ExpressJS 
- **Database** : MongoDB

## Project Overview

\_baseURL_ : The continuous element of your website's address
***example*** - http://localhost:8000 for local development

### Routes

*Postman Collection provided to try and test the API locally*

#### **GET Routes for URLs**

- `_baseURL_/:shortID` :- Redirects the given *shortID* to the  appropriate redirect URL provided.

- `_baseURL_/c/:customID` :- Redirects the given *customID* to the appropriate redirect URL provided.

#### **POST Routes for URLs**

- `_baseURL_/url/short`  :- Generates a shortID for a provided redirect URL.

***Example Body :-***
```js
Request :
{
    "url": "https://google.com"
} 
```
- `_baseURL_/url/custom` :- Generates a custom ID based on the phrase and provided redirect URL.

***Example Body :-***
```js
{
    "url": "https://github.com/KausTarafdar/pocket-url" // Redirect URL
    "custom_phrase": "Link to my project" // Phrase for the custom URL
}
```

- `_baseURL_/url/qr` :- Returns an SVG of a QR code generated from the redirect URL provided.

***Example Body :-***
```js
{
    "url": "https://google.com"
    "color": "#e43212" // default : #000000
    "size": 12 // default : 10
}
```

#### **GET Route for analytics**

- `_baseURL_/analytics/frequency?type={_Type}&limit={_Limit}` :- Provides an array of information related to the paramaters passed. (*No Body*)

  `  _Type  ` <span style="font-size:0.8em;">default</span> *access*

  - *access* - To get the array of most accessed URLs.
  - *recent* - To get the array of most recently accessed URLs\


  `  _Limit  ` <span style="font-size:0.8em;">default</span> *10*

  To allow for *pagination* and let user to specify number of enteries required.

#### **POST Route for analytics**

- `_baseURL_/analytics/id` :- Provides information on *Number of Times Accessed*, *Creation timestamp* and *Most Recent access timestamp* for a single payload value.

***Example Body :-***
```js
{
    "type": "url" // short or custom or url
    "payload": "https://github.com/KausTarafdar/pocket-url" // shortID or customID or URL_to_website
}
```

## Installation

#### Steps for local usage

1. Clone this repository:

```sh
git clone https://github.com/KausTarafdar/pocket-url.git
```

2. Install dependencies:

```sh
npm install
```

3. Usage:
- Create a `.env` file in the root directory and add the following :- 

```
PORT=/Set your PORT no. - default - 8000 /
MONGO_URI=/Database connection URI/
```
- To start in production mode run :-

```sh
npm run start-dev
```
Starts the server using **nodemon** allowing the server to run constantly tracking file changes.

- To start in deployment run :-

```sh
npm start
```




