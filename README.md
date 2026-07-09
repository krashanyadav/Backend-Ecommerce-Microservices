#  MERN Microservices E-Commerce Backend

A scalable **E-Commerce Backend** built using the **MERN Stack** and **Microservices Architecture**. The project is designed by separating each business domain into independent services, making the application modular, maintainable, and scalable.
The backend follows industry practices such as JWT Authentication, Redis Caching, API Gateway, Cloudinary Image Storage, and REST-based inter-service communication using Axios and docker using to all service compose/run at the same time and redis use with the help of docker (image pull)

---
## 📚 Additional Documentation
- System Design
- Redis
- Docker
- nodejs
- express
- mongoDb
- Authentication
- API Gateway
- Cloudinary
- Inter-Service Communication
- Deployment

#  Features

### 🔐 Authentication Service
- User Registration & Login
- JWT Authentication
- Role-Based Authorization (Admin/User)
- Profile Management
- Password Reset & Change Password
- Email Verification
- Redis Rate Limiting
- Dockerized Microservices
- Docker Compose Support

###  Product Service
- Category Management
- Brand Management
- Product CRUD Operations
- Multiple Image Upload
- Cloudinary Integration
- Search, Filter & Pagination
- Redis Product Caching
- Soft Delete

### 🛒 Cart Service
- Add Product to Cart
- Update Quantity
- Remove Product
- Clear Cart
- Get User Cart

###  Order Service
- Create Order
- Get User Orders
- Order Details
- Cancel Order
- Update Order Status

### 🌐 API Gateway
- Centralized Request Routing
- Authentication Middleware
- Service Forwarding

###  Payment Service *(In Progress)*
- Payment APIs Designed
- Razorpay Integration (Pending)

---



#  Architecture

```
                    Client
                       │
                       ▼
                 API Gateway
                       │
 ┌─────────────┬──────────────┬──────────────┬──────────────┐
 ▼             ▼              ▼              ▼
Auth       Product         Cart          Order
Service    Service         Service        Service
               │               │              │
               │               │              ▼
               │               └──────────► Payment
               │
               ▼
        MongoDB + Redis + Cloudinary


---
```
### ⚙️ Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

## Docker
- image pull
- redis image
- run multi container simultaneously

### Authentication
- JWT
- bcryptjs

### Caching
- Redis

### File Upload
- Multer
- Cloudinary

### Validation
- Express Validator

### Service Communication
- Axios

### API Gateway
- http-proxy-middleware

---
#  Docker 
```
Docker support  this project. Each microservice will be containerized using Docker, and Docker Compose will be used to manage and run all services together in a single environment.

 Features:
- Dockerfile for each microservice
- Docker Compose for multi-container setup
- Containerized MongoDB and Redis
- Simplified local development and deployment

# 🔄 Inter-Service Communication

The project follows synchronous communication using REST APIs.

- Cart Service fetches product information from Product Service.
- Order Service retrieves cart data from Cart Service.
- Services communicate through Axios instead of directly accessing another service's database.

---

#  Project Structure

Ecommerce-Microservices/

├── api-gateway/
├── auth-service/
├── product-service/
├── cart-service/
├── order-service/
├── payment-service/
├── docs/
└── README.md

```
#  Getting Started

```

### Install Dependencies

```bash
npm install
```

Install dependencies separately inside every microservice.

### Run Project

```bash
npm run dev
```

Start each microservice individually.

---

#  Security

- JWT Authentication
- Role-Based Authorization
- Password Hashing using bcryptjs
- Express Validator
- Redis Rate Limiting

---

#  Performance Optimizations

- Redis Caching
- Cloudinary Image Storage
- Pagination
- Search & Filtering
- Soft Delete
- Database Population

---

#  Current Project Status

| Service | Status |
|----------|--------|
| Authentication | ✅ Completed |
| Product | ✅ Completed |
| Cart | ✅ Completed |
| Order | ✅ Completed |
| API Gateway | ✅ Completed |
| Payment | 🚧 In Progress |

---

#  Future Improvements

- Razorpay Payment Integration
- Notification Service
- Kubernetes Deployment
- CI/CD Pipeline
- Swagger API Documentation

---

# 👨‍💻 Author

**Krashangopal Yadav**

Backend Developer | MERN Stack Developer

---

⭐ If you found this project useful, consider giving it a star on GitHub.
