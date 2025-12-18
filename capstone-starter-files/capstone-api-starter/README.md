# Grocery App API (simple guide)

A Spring Boot + MySQL backend for a grocery storefront. Basic English, step by step, with class map and demo script.

## 1) What this app does
- Shows products and categories
- Lets users register, log in (JWT), edit profile
- Lets users build a cart (add, update qty, delete, clear)
- Serves a small frontend (HTML/CSS/JS) from the same server

## 2) How pieces connect (plain words)
- Controllers (handle HTTP)
  - Auth: [src/main/java/org/yearup/controllers/AuthenticationController.java](src/main/java/org/yearup/controllers/AuthenticationController.java)
    - POST /register, POST /login
  - Products: [src/main/java/org/yearup/controllers/ProductsController.java](src/main/java/org/yearup/controllers/ProductsController.java)
    - GET /products, GET /products/{id}
  - Categories: [src/main/java/org/yearup/controllers/CategoriesController.java](src/main/java/org/yearup/controllers/CategoriesController.java)
    - GET /categories
  - Profile: [src/main/java/org/yearup/controllers/ProfileController.java](src/main/java/org/yearup/controllers/ProfileController.java)
    - GET /profile, PUT /profile (needs auth)
  - Cart: [src/main/java/org/yearup/controllers/ShoppingCartController.java](src/main/java/org/yearup/controllers/ShoppingCartController.java)
    - GET /cart, POST /cart/products/{id}, PUT /cart/products/{id}, DELETE /cart/products/{id}, DELETE /cart (needs auth)

- DAO layer (talks to MySQL)
  - Interfaces in [src/main/java/org/yearup/data](src/main/java/org/yearup/data)
  - MySQL implementations in [src/main/java/org/yearup/data/mysql](src/main/java/org/yearup/data/mysql)
  - Examples: [MySqlProductDao](src/main/java/org/yearup/data/mysql/MySqlProductDao.java), [MySqlCategoryDao](src/main/java/org/yearup/data/mysql/MySqlCategoryDao.java), [MySqlProfileDao](src/main/java/org/yearup/data/mysql/MySqlProfileDao.java), [MySqlShoppingCartDao](src/main/java/org/yearup/data/mysql/MySqlShoppingCartDao.java)

- Models (data shapes)
  - In [src/main/java/org/yearup/models](src/main/java/org/yearup/models): Product, Category, Profile, ShoppingCart, ShoppingCartItem, User
  - Auth DTOs in [src/main/java/org/yearup/models/authentication](src/main/java/org/yearup/models/authentication)

- Security (JWT)
  - Config: [src/main/java/org/yearup/security/WebSecurityConfig.java](src/main/java/org/yearup/security/WebSecurityConfig.java)
  - Token: [src/main/java/org/yearup/security/jwt/TokenProvider.java](src/main/java/org/yearup/security/jwt/TokenProvider.java)
  - Filter: [src/main/java/org/yearup/security/jwt/JWTFilter.java](src/main/java/org/yearup/security/jwt/JWTFilter.java)

- Frontend (static)
  - Lives in [src/main/resources/static/capstone-client-groceryapp](src/main/resources/static/capstone-client-groceryapp)
  - Key JS: [js/application.js](src/main/resources/static/capstone-client-groceryapp/js/application.js), [js/template-builder.js](src/main/resources/static/capstone-client-groceryapp/js/template-builder.js), services under [js/services](src/main/resources/static/capstone-client-groceryapp/js/services)

## 3) Data flow (example request)
1. Client calls controller (e.g., GET /products)
2. Controller asks DAO for data
3. DAO runs SQL against MySQL
4. Controller returns JSON
5. Frontend renders it (Mustache templates + JS services)

## 4) Setup (DB)
1. Start MySQL
2. Run `database/create_database_groceryapp.sql`
3. Defaults (see [src/main/resources/application.properties](src/main/resources/application.properties)):
   - url: jdbc:mysql://localhost:3306/groceryapp
   - user: root
   - pass: yearup24

## 5) Run the app
From project root:
```sh
mvn spring-boot:run
```
Then open `http://localhost:8080` for the UI.

## 6) Quick auth + test (Insomnia/Postman)
1) Register (optional):
   - POST http://localhost:8080/register
   - JSON body:
```json
{
  "username": "tester",
  "password": "Test123!",
  "role": "ROLE_USER"
}
```
2) Login and get JWT:
   - POST http://localhost:8080/login
   - Body:
```json
{
  "username": "tester",
  "password": "Test123!"
}
```
   - Copy token, use header `Authorization: Bearer <token>`

3) Try endpoints (with token):
   - Products: GET /products
   - Categories: GET /categories
   - Profile: GET /profile, PUT /profile (send Profile JSON)
   - Cart: GET /cart; POST /cart/products/1; PUT /cart/products/1 with `{ "quantity": 2 }`; DELETE /cart/products/1; DELETE /cart

## 7) Presenting the project (simple script)
1. Say what it is: "Spring Boot + MySQL grocery API with JWT login; serves a small frontend."
2. Show login/register in Insomnia, copy token.
3. Show GET /products response.
4. Add to cart (POST /cart/products/1), then GET /cart to show items and totals.
5. Update profile (PUT /profile), then GET /profile to show changes.
6. Open the UI at `http://localhost:8080` and click through products and cart.

## 8) Common issues
- 401 Unauthorized: add `Authorization: Bearer <token>`
- DB errors: check MySQL is running and credentials match application.properties
- Port busy: change `server.port` in application.properties

## 9) What you built (one-liners)
- Controllers: map URLs to logic
- DAOs: run SQL for controllers
- Models: carry data between layers
- Security: protects routes with JWT
- Frontend: renders products, cart, profile using the API

## 10) File map (quick jump)
- Config: [application.properties](src/main/resources/application.properties)
- DB script: [database/create_database_groceryapp.sql](database/create_database_groceryapp.sql)
- Controllers: [src/main/java/org/yearup/controllers](src/main/java/org/yearup/controllers)
- DAOs: [src/main/java/org/yearup/data](src/main/java/org/yearup/data) and [src/main/java/org/yearup/data/mysql](src/main/java/org/yearup/data/mysql)
- Models: [src/main/java/org/yearup/models](src/main/java/org/yearup/models)
- Security: [src/main/java/org/yearup/security](src/main/java/org/yearup/security)
- Frontend: [src/main/resources/static/capstone-client-groceryapp](src/main/resources/static/capstone-client-groceryapp)

Talk through these steps and you will have a clear, simple presentation.