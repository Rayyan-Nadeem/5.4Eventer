# Letip Convention App - Backend

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [Running the Backend](#running-the-backend)
6. [API Documentation](#api-documentation)
7. [Common Issues](#common-issues)

## Introduction

This is the backend part of the Letip Convention App, built using Node.js, Express, and MongoDB.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed. You can download it from [Node.js](https://nodejs.org/).
- MongoDB installed and running locally. Instructions can be found at [MongoDB Installation](https://docs.mongodb.com/manual/installation/).

## Project Structure
backend/
├── src/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ └── attendeeController.js
│ ├── models/
│ │ └── Attendee.js
│ ├── routes/
│ │ └── attendee.js
│ ├── index.js
│ └── .env
├── package.json
├── package-lock.json
└── node_modules/


## Installation

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Install the necessary packages:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `src` directory and add the following content:

    ```env
    PORT=5001
    MONGO_URI=mongodb://localhost:27017/letip-convention
    ```

## Running the Backend

1. Ensure MongoDB is installed and running:

    ```bash
    mongod --dbpath ~/mongodb/data/db
    ```

2. Start the backend server:

    ```bash
    npm start
    ```

3. The backend server should now be running on `http://localhost:5001`.

## API Documentation

### Endpoints

- `POST /api/attendees` - Create a new attendee
- `GET /api/attendees` - Get all attendees
- `GET /api/attendees/:id` - Get a specific attendee by ID
- `PUT /api/attendees/:id` - Update a specific attendee by ID
- `DELETE /api/attendees/:id` - Delete a specific attendee by ID

## Common Issues

1. **MongoDB connection error**: Ensure MongoDB is running and the `MONGO_URI` in your `.env` file is correct.
2. **Port already in use**: Ensure no other application is using the port `5001`.

