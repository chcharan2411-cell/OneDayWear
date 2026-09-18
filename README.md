One Day Wear 👗

Rent the look. Wear the moment.

One Day Wear is a full-stack clothing rental e-commerce platform for renting outfits for weddings, parties, college events, and other occasions instead of purchasing them.

Built with React + Vite on the frontend and Java Spring Boot microservices on the backend.

✨ Features

Customer

User registration, login, JWT authentication and role-based access

Product browsing, categories, types, sizes and product details

Shopping cart and wishlist

Rental-date based order placement and validation

Order history and order status tracking

Razorpay payment integration

Product reviews

Admin

Admin dashboard

User, product and inventory management

Order and payment management

Review management

Dashboard data aggregated from multiple services

🏗️ Architecture

                    React + Vite
                         │
                         ▼
                   API Gateway
                         │
                         ▼
                 Eureka Discovery
                         │
       ┌─────────────────┼─────────────────┐
       ▼        ▼        ▼        ▼        ▼
     Auth    Product    Cart   Inventory   Order
       │        │        │        │        │
       └────────┴────────┴────────┴────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Payment         Review        Wishlist
          │
          ▼
     Notification

                   Admin Service

Services communicate through REST APIs, with Eureka for service discovery and OpenFeign for service-to-service communication.

🧩 Backend Services

Service

Purpose

API Gateway

Central backend entry point

Discovery Server

Eureka service discovery

Auth Service

Users, authentication, roles and JWT

Product Service

Products, categories, sizes and images

Cart Service

Shopping cart and stock validation

Inventory Service

Stock management

Order Service

Rental orders and order workflow

Payment Service

Payments and Razorpay integration

Review Service

Product reviews

Wishlist Service

Customer wishlist

Notification Service

Application notifications

Admin Service

Admin dashboard and management

🛠️ Technology Stack

Frontend

React 19

Vite 8

React Router

Axios

JavaScript / JSX

CSS

Backend

Java 17

Spring Boot

Spring Security

Spring Data JPA / Hibernate

Spring Cloud

Netflix Eureka

OpenFeign

JWT / JJWT

MySQL

Maven

Bean Validation

Tools & Services

Razorpay

Postman

MySQL Workbench

Spring Tool Suite

VS Code

Git & GitHub

📂 Project Structure

OneDayWear/
├── backend/
│   ├── admin-service/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── cart-service/
│   ├── discovery-server/
│   ├── inventory-service/
│   ├── notification-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── product-service/
│   ├── review-service/
│   └── wishlist-service/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
│
├── .gitignore
└── README.md

🔄 Rental Flow

Register / Login
      ↓
Browse Products
      ↓
Select Product & Rental Details
      ↓
Add to Cart
      ↓
Checkout
      ↓
Razorpay Payment
      ↓
Order Confirmation
      ↓
Rental & Order Tracking
      ↓
Return
      ↓
Review

🚀 Getting Started

Prerequisites

Java 17

Node.js & npm

MySQL

Git

Maven / Maven Wrapper

Clone

git clone https://github.com/chcharan2411-cell/OneDayWear.git
cd OneDayWear

Backend

Configure the required MySQL, JWT, Eureka, Razorpay and notification settings in each service's local configuration.

Start the discovery server first:

cd backend/discovery-server
.\mvnw.cmd spring-boot:run

Then start the remaining services individually using:

.\mvnw.cmd spring-boot:run

Frontend

cd frontend
npm install
npm run dev

Vite will provide the local development URL.

Security: Never commit database passwords, JWT secrets, Razorpay secret keys, API keys or other credentials to GitHub.

🤖 Future Enhancements

AI-powered virtual try-on using customer-uploaded photos

Improved rental availability calculations

Automated late / damaged-return charges

Advanced inventory and rental tracking

Expanded notifications

Admin analytics

Cloud deployment and containerization

More automated testing

📌 Project Status

Active Development 🚧

The repository contains the React frontend and Spring Boot microservices backend for the One Day Wear rental platform. Features and integrations are being developed incrementally.

👨‍💻 Developer

Charan Chadalavada

GitHub: https://github.com/chcharan2411-cell

One Day Wear — Affordable fashion for every occasion.
