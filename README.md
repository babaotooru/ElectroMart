# ElectroMart 🛒
**Enterprise E-Commerce Web Application**

> Final Course Project – Java Full Stack Development  
> Submitted by: Nagesh Babu | AchieversIT, Bengaluru  
> Stack: React JS | Spring Boot | MySQL

---

## 📁 Project Structure

```
electromart/
├── backend/                  ← Spring Boot Application
│   ├── src/main/java/com/electromart/
│   │   ├── ElectroMartApplication.java
│   │   ├── config/
│   │   │   ├── SecurityConfig.java     ← JWT + CORS + Role-based auth
│   │   │   └── WebConfig.java          ← Static resource serving
│   │   ├── controller/
│   │   │   ├── AuthController.java     ← /api/auth/*
│   │   │   ├── ProductController.java  ← /api/products/*
│   │   │   ├── CartController.java     ← /api/cart/*
│   │   │   └── UserController.java     ← /api/users/*
│   │   ├── dto/
│   │   │   ├── RegisterRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   └── AuthResponse.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Product.java
│   │   │   └── CartItem.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── ProductRepository.java
│   │   │   └── CartItemRepository.java
│   │   ├── security/
│   │   │   ├── JwtUtil.java
│   │   │   ├── JwtAuthFilter.java
│   │   │   └── CustomUserDetailsService.java
│   │   └── service/
│   │       ├── AuthService.java
│   │       ├── ProductService.java
│   │       └── CartService.java
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/                 ← React Application
│   ├── public/
│   │   ├── index.html
│   │   └── images/           ← Product images (extracted from zip)
│   └── src/
│       ├── App.js            ← Router + route guards
│       ├── index.css         ← All global styles
│       ├── context/
│       │   └── AuthContext.js
│       ├── services/
│       │   └── api.js        ← Axios API calls
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── Footer.js
│       │   └── Toast.js
│       └── pages/
│           ├── UserLoginPage.js
│           ├── AdminLoginPage.js
│           ├── UserDashboard.js
│           ├── AdminDashboard.js
│           ├── CartPage.js
│           ├── UserProfilePage.js
│           └── AdminProfilePage.js
│
└── database/
    └── schema.sql            ← MySQL DDL + seed data
```

---

## ⚙️ Technology Stack

| Layer       | Technology                             |
|-------------|----------------------------------------|
| Frontend    | React JS 18, React Router v6, Axios    |
| Backend     | Spring Boot 3.2, Spring Security, JPA  |
| Database    | MySQL 8.x                              |
| ORM         | Spring Data JPA + Hibernate            |
| Security    | JWT (jjwt), BCrypt password encryption |
| Build Tool  | Maven (backend), npm (frontend)        |

---

## 🚀 Setup & Run Instructions

### 1. MySQL Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema
SOURCE /path/to/electromart/database/schema.sql;
```

### 2. Backend – Spring Boot

**Configure DB credentials** in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

**Run the application:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend starts on: **http://localhost:8080**

### 3. Frontend – React JS

```bash
cd frontend
npm install
npm start
```
Frontend starts on: **http://localhost:3000**

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint                  | Description            | Auth     |
|--------|---------------------------|------------------------|----------|
| POST   | /api/auth/register        | Register new user      | Public   |
| POST   | /api/auth/login           | User login (JWT)       | Public   |
| POST   | /api/auth/admin/register  | Register admin         | Public   |
| POST   | /api/auth/admin/login     | Admin login (JWT)      | Public   |

### Products
| Method | Endpoint                  | Description            | Auth      |
|--------|---------------------------|------------------------|-----------|
| GET    | /api/products             | Get all products       | Public    |
| GET    | /api/products/{id}        | Get product by ID      | Public    |
| GET    | /api/products/search?q=   | Search products        | Public    |
| GET    | /api/products/categories  | List categories        | Public    |
| POST   | /api/products             | Add product            | ADMIN     |
| PUT    | /api/products/{id}        | Update product         | ADMIN     |
| DELETE | /api/products/{id}        | Soft-delete product    | ADMIN     |

### Cart
| Method | Endpoint                  | Description            | Auth      |
|--------|---------------------------|------------------------|-----------|
| GET    | /api/cart/{userId}        | View cart              | USER      |
| POST   | /api/cart                 | Add to cart            | USER      |
| PUT    | /api/cart/{cartItemId}    | Update quantity        | USER      |
| DELETE | /api/cart/{cartItemId}    | Remove item            | USER      |
| DELETE | /api/cart/clear/{userId}  | Clear cart             | USER      |

### Users
| Method | Endpoint                  | Description            | Auth      |
|--------|---------------------------|------------------------|-----------|
| GET    | /api/users/{id}           | Get user profile       | USER      |
| PUT    | /api/users/{id}           | Update profile         | USER      |

---

## 🖥️ Pages & Features

### User Side
- **Login/Signup** – Split-panel design with ElectroMart blue banner
- **Dashboard** – Product grid with category tabs (All/Mobiles/Laptops/Appliances/Headphones/Watches), pagination
- **Cart** – Quantity controls (+ / -), remove items, live total calculation
- **Profile** – Avatar upload, name/email/role display

### Admin Side
- **Login/Signup** – Same design, separate auth endpoint
- **Dashboard** – Add Product form (title, price, category, image, description) + product grid with Edit/Delete
- **Profile** – Admin profile management

### Shared Features
- 🌙 **Dark Mode** toggle (moon/sun icon in navbar)
- 🔒 **JWT Authentication** with role-based route protection
- 🍞 **Toast Notifications** for cart/product actions
- 📱 **Responsive** grid layout

---

## 🔑 Default Credentials (Demo / Seed Data)

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | admin@electromart.com    | admin123   |
| User  | Register via Signup page | (your own) |

---

## 🏗️ Architecture

```
React Frontend (Port 3000)
        │
        │  HTTP/REST (JSON)
        ▼
Spring Boot Backend (Port 8080)
        │  JWT Auth Filter → SecurityContext
        │
        ├── AuthController  → AuthService
        ├── ProductController → ProductService
        ├── CartController  → CartService
        └── UserController
                │
                │  Spring Data JPA
                ▼
         MySQL Database (electromart_db)
              ├── users
              ├── products
              └── cart_items
```

---

## 📦 Deployment

| Component | Option                          |
|-----------|---------------------------------|
| Backend   | Apache Tomcat / AWS EC2 / Railway |
| Frontend  | Netlify / Vercel / GitHub Pages |
| Database  | PlanetScale / AWS RDS / Local   |

```bash
# Build frontend for production
cd frontend && npm run build

# Build backend JAR
cd backend && mvn clean package
java -jar target/electromart-backend-1.0.0.jar
```

---

*© 2026 ElectroMart. All rights reserved By AchieversIT.*
