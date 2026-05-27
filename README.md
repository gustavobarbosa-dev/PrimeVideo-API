# Prime Video Rental API

An API developed for a movie rental management system, inspired by Prime Video. This project allows you to manage clients, movies, and rental transactions, including automated email notifications.

## 🚀 Technologies

This project was built using the following technologies:

* **Node.js** & **Express**: For building the REST API server.
* **Prisma ORM**: For database modeling, migrations, and type-safe queries.
* **MySQL / MariaDB**: Relational database used to store the data.
* **TypeScript**: To ensure static typing and a better development experience.
* **Zod**: For robust data validation.
* **Nodemailer**: To handle automated email notifications (e.g., rental receipts or return reminders).

## 🗂️ Features

The API consists of the following core entities:

* **Clients (`/clientes`)**: Manage customer data, including their name, email, and available account balance.
* **Movies (`/filmes`)**: Manage the movie catalog, including title, genre, and rental price.
* **Rentals (`/alugueis`)**: Register rental transactions linking a client to a movie. It tracks the rental date, expected return date, rental cost, and payment method (PIX, Credit Card, or Account Balance).

## 🛠️ Getting Started

### Prerequisites

* Node.js (v18 or higher)
* MySQL or MariaDB running locally or via Docker.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/primevideo-api.git](https://github.com/your-username/primevideo-api.git)
   cd primevideo-api
