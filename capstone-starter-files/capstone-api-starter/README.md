# Grocery App API

A simple Spring Boot + MySQL REST API for a grocery storefront. This README walks through setup, running, testing with Insomnia, and what to expect from the responses.

## 1) Prerequisites
- Java 17+ (project built for 17; Java 21 also works)
- Maven (or the Maven wrapper if present)
- MySQL running locally
- Insomnia/Postman (optional for manual testing)

## 2) Database setup
1. Open MySQL and run the script at `database/create_database_groceryapp.sql`.
2. Default connection (see `src/main/resources/application.properties`):
   - url: `jdbc:mysql://localhost:3306/groceryapp`
   - username: `root`
   - password: `yearup24`
3. The script seeds sample users and products.
   - Users: `user`, `admin`, `george` (password hash is in the script; easiest is to register a new user for known password).

## 3) Run the app
From the project root:
```sh
mvn spring-boot:run
```
The API starts on `http://localhost:8080`.

## 4) Quick auth flow (with Insomnia/Postman)
1. Register (optional if you prefer seeded users):
   - POST `http://localhost:8080/register`
   - Body (JSON):
```json
{
  "username": "tester",
  "password": "Test123!",
  "role": "ROLE_USER"
}
```
2. Login to get JWT:
   - POST `http://localhost:8080/login`
   - Body:
```json
{
  "username": "tester",
  "password": "Test123!"
}
```
   - Copy the token from the response. Use it as: `Authorization: Bearer <token>`

## 5) Key endpoints (all paths are under `http://localhost:8080`)
- Products
  - GET `/products` — list products
  - GET `/products/{id}` — product details
- Categories
  - GET `/categories` — list categories
- Profile (requires auth)
  - GET `/profile` — view current user profile
  - PUT `/profile` — update current user profile
- Cart (requires auth)
  - GET `/cart` — view cart
  - POST `/cart/products/{productId}` — add item
  - PUT `/cart/products/{productId}` — update quantity (body has `quantity`)
  - DELETE `/cart/products/{productId}` — remove item
  - DELETE `/cart` — clear cart

## 6) Example cart calls (with Bearer token)
- Add item:
  - POST `/cart/products/1`
- Update quantity:
```json
PUT /cart/products/1
{
  "quantity": 2
}
```
- Get cart:
  - GET `/cart`

## 7) Frontend assets
Static client assets are served from `src/main/resources/static/capstone-client-groceryapp/`. When the backend runs, open `http://localhost:8080` to see the storefront UI.

## 8) Common issues
- 401 Unauthorized: Missing or invalid `Authorization: Bearer <token>` header.
- DB connection errors: Verify MySQL is running and credentials match `application.properties`.
- Port conflict: Change `server.port` in `application.properties` if 8080 is in use.

## 9) How to present the project
- Explain: "This is a Spring Boot + MySQL grocery API with JWT auth. Users can browse products, manage a cart, and edit their profile."
- Demo steps:
  1) Show login/registration in Insomnia.
  2) Show GET `/products` results.
  3) Add an item to cart, then GET `/cart` to show totals and images.
  4) Update profile via PUT `/profile` and show GET `/profile` response.

That’s it—run the app, log in, and try the endpoints above. Good luck on your presentation!"}