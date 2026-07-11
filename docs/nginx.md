# ⚖️ Nginx Load Balancer

## Overview

To improve scalability and distribute incoming traffic efficiently, the project uses **Nginx** as a **Reverse Proxy** and **Load Balancer**. Instead of sending all client requests to a single API Gateway instance, Nginx forwards requests across multiple API Gateway containers using the **Round Robin** load balancing strategy.

---

# Why Nginx?

Nginx is used because it provides:

* Reverse Proxy
* Load Balancing
* High Availability
* Better Scalability
* Improved Performance
* Single Entry Point for Clients

---

# Project Architecture

```text
                 Client
                    │
                    ▼
          Nginx Load Balancer
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
 API Gateway 1             API Gateway 2
        │                       │
        └───────────┬───────────┘
                    ▼
   Authentication │ Product │ Cart │ Order │ Payment
                    │
                    ▼
      MongoDB • Redis • Cloudinary
```

---
# gateway-1
- http://localhost:5002
# gateway-2
- http://localhost:5003

# Request Flow

1. The client sends a request to Nginx.
2. Nginx receives the request on port **80**.
3. Nginx forwards the request to one of the API Gateway instances.
4. The selected API Gateway processes the request.
5. The API Gateway communicates with the required microservice.
6. The microservice returns the response back through the API Gateway and Nginx to the client.

---

# Load Balancing Strategy

This project uses the **Round Robin** algorithm.

Example:

```text
Request 1 → Gateway 1

Request 2 → Gateway 2

Request 3 → Gateway 1

Request 4 → Gateway 2
```

Round Robin distributes requests evenly across all available API Gateway instances without requiring additional configuration.

---

# Docker Integration

Nginx is deployed as a separate Docker container.

The Docker Compose configuration includes:

* Nginx Container
* API Gateway Instance 1
* API Gateway Instance 2
* Authentication Service
* Product Service
* Cart Service
* Order Service
* Payment Service
* MongoDB
* Redis

All services run together using Docker Compose.

---

# Benefits

* Improved Scalability
* Better Resource Utilization
* Reduced Load on a Single Gateway
* High Availability
* Easy Horizontal Scaling
* Centralized Request Routing

---

# Performance

The load balancer was tested locally with multiple API Gateway instances.

Test Configuration:

* Nginx Load Balancer
* 2 API Gateway Containers
* 100 Concurrent Users

Result:

* Successfully handled approximately **34,000 requests in 10 seconds** during local performance testing.

> Performance results may vary depending on system configuration and available hardware resources.

---

# Future Improvements

The current implementation can be extended with:

* Least Connections Load Balancing
* Health Checks
* HTTPS (SSL/TLS)
* Gzip Compression
* Security Headers
* Rate Limiting
* Kubernetes Ingress Controller
* Auto Scaling
