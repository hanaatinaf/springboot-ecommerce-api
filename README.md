

# 🛒 Grocery App – Spring Boot E-Commerce API

A full-stack **Spring Boot grocery store application** that allows users to browse products, filter by category and price, manage a shopping cart, and update their user profile.
The backend is built with **Spring Boot + MySQL**, secured using **JWT authentication**, and serves a simple frontend using **HTML, CSS, and JavaScript**.

---


## 🧑‍💻 Author

**Hana Atinaf**
*Built as part of the Year Up Java Focus Academy to demonstrate REST APIs, Spring Security, JWT, and database integration.*

---

## 🎥 Demo Video 



---

## 📋 Table of Contents

* [Features](#features)
* [Project Structure](#project-structure)
* [Frontend Screens](#frontend-screens)
* [API Overview](#api-overview)
* [Usage](#usage)
* [Technologies Used](#technologies-used)
* [Key Skills Demonstrated](#key-skills-demonstrated)
* [Future Improvements](#future-improvements)

---

## ✨ Features

### 🏠 **Product Browsing**

* View all grocery products
* Filter by **category**
* Filter by **minimum and maximum price**
* Filter by **type**
* Product images and descriptions displayed

### 🔐 **Authentication**

* User login with username and password
* JWT token used to protect secure endpoints
* Login modal integrated into frontend

### 🛒 **Shopping Cart**

* Add products to cart
* Update item quantity
* Remove items from cart
* Clear entire cart
* Automatic subtotal, tax, and total calculation

### 👤 **User Profile**

* View profile information
* Update name, email, phone, and address
* Profile changes saved to database

---

## 🗂️ Project Structure

```
org.yearup
├── controllers        # REST API controllers
├── models             # User, Product, Category, Cart, Profile
├── dao                # Database access layer (MySQL)
├── security           # JWT & Spring Security configuration
├── resources
│   ├── static         # Frontend (HTML/CSS/JS)
│   └── application.properties
└── Application.java
```

---

## 📸 Frontend Screens

### 🛒 Product Browsing & Filters

<img width="1700" height="939" alt="Screenshot 2025-12-18 at 10 34 28 PM" src="https://github.com/user-attachments/assets/2158c1d9-fae5-4541-b3d7-7eead6bf8ba6" />



### 🔐 Login
<img width="1700" height="408" alt="Screenshot 2025-12-18 at 10 35 31 PM" src="https://github.com/user-attachments/assets/0b44ed90-eee8-48a7-ada2-6462a972da72" />


### 🧾 Shopping Cart
<img width="1700" height="940" alt="Screenshot 2025-12-18 at 10 36 53 PM" src="https://github.com/user-attachments/assets/97766fbb-ecc9-4ccc-9ad7-6c4ab0d4ba47" />

<img width="1700" height="940" alt="Screenshot 2025-12-18 at 10 36 18 PM" src="https://github.com/user-attachments/assets/d1a3f4cc-4fe2-4b73-a840-e8fdbcecf325" />


### 👤 User Profile
<img width="1700" height="940" alt="Screenshot 2025-12-18 at 10 37 27 PM" src="https://github.com/user-attachments/assets/b609d4e8-0aae-481c-91b9-3cc3990db573" />



---

## 🔧 API Overview

### Authentication

* `POST /register`
* `POST /login`

### Products

* `GET /products`
* `GET /products/{id}`
* `GET /products?cat=&minPrice=&maxPrice=&subCategory=`

### Categories

* `GET /categories`
* `GET /categories/{id}`

### Shopping Cart *(JWT Required)*

* `GET /cart`
* `POST /cart/products/{id}`
* `PUT /cart/products/{id}`
* `DELETE /cart/products/{id}`
* `DELETE /cart`

### Profile *(JWT Required)*

* `GET /profile`
* `PUT /profile`

---

## ▶️ Usage

1. Create MySQL database
2. Configure `application.properties`
3. Run Spring Boot application
4. Open browser:

```
http://localhost:63342 
```

5. Test APIs using **Insomnia** or **Postman**

---

## 🛠️ Technologies Used

* **Java**
* **Spring Boot**
* **Spring Security**
* **JWT Authentication**
* **MySQL**
* **Maven**
* **HTML / CSS / JavaScript**
* **Insomnia / Postman**

---

## 🧠 Key Skills Demonstrated

1. REST API design
2. JWT authentication and authorization
3. Secure backend development
4. Database design and MySQL integration
5. MVC architecture
6. Shopping cart logic
7. API testing and debugging
8. Full-stack development workflow

---

## 🚀 Future Improvements

* Checkout and order processing
* Admin dashboard
* Product search
* Pagination
* Unit and integration testing
* Improved frontend UI

---


