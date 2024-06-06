# BookShop

## Overview

This project is a book ecommerce web application developed during a one-month training program at Nashtech.

Document and more information can be found here: https://github.com/Pill50/BookShop/wiki

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Contributor](#contributor)
- [License](#license)

## Features

- User Authentication
- Book, Category, Author, Publisher, Feedback, Order, Promotion Management (CRUD operations)
- Image Uploading via Cloudinary
- Using MVC for admin page
- Integrate payment methods using COD and MOMO

## Tech Stack

- **Frontend:** [ReactJS, Redux Toolkit, TailwindCSS, TypeScript, Flowbite, Formik]
- **Backend:** NestJS, GraphQL, Handlebars, NodeMailer
- **Database:** Prisma with PostgreSQL
- **Image Storage:** Cloudinary
- **Oauth Provider:** Firebase
- **Container:** Docker
- **Document:** Github wiki

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0.0)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (optional, for running the database)

## Backend Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Pill50/BookShop.git
   cd Bookshop/server
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up the database:**

   - If using Docker, start the database container:
     ```sh
     docker-compose up -d
     ```
   - If not using Docker, ensure your database is running and update your `.env` file with the correct database credentials.

4. **Run database migrations:**

   ```sh
   npx prisma migrate dev
   ```

5. **Copy the example environment file and configure the necessary parameters:**

   ```sh
   cp .env.example .env
   ```

6. **Start the backend server:**
   ```sh
   npm run start:dev
   ```

## Frontend Setup

1. **Navigate to the frontend directory:**

   ```sh
   cd ../frontend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the frontend development server:**
   ```sh
   npm run dev
   ```

## Running the Application

1. **Ensure both backend and frontend servers are running:**

   - Backend: `npm run start:dev` (in `backend` directory)
   - Frontend: `npm run dev` (in `frontend` directory)

2. **Access the server:**
   Open your browser and navigate to `http://localhost:3000` (or the port your server server is running on).

3. **Access the application:**
   Open your browser and navigate to `http://localhost:8080` (or the port your frontend server is running on).

## Testing

### Backend Tests

Run the following command in the `backend` directory to execute backend tests:

```sh
npm run test
```

## Contributor

Tran Vinh Phuc

## License

Feel free to customize this further if necessary, and add any other information that might be helpful for users or contributors.
