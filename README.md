# FY_Project - E-Commerce Platform

A full-featured e-commerce application with a Node.js/Express backend and modern web technologies.

## Project Structure

```
FY_Project/
├── Client/          # Frontend application
└── Server/          # Backend API server
    ├── config/      # Database and Razorpay configuration
    ├── controllers/ # Request handlers and business logic
    ├── middleware/  # Authentication middleware
    ├── models/      # MongoDB schemas (User, Product, Order, etc.)
    ├── routes/      # API route definitions
    ├── services/    # External services (Shiprocket integration)
    ├── server.js    # Main server file
    └── package.json # Dependencies
```

## Quick Start

### Backend Setup

```bash
cd Server
npm install
```

Create a `.env` file in the Server directory:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the server:
```bash
npm run dev    # Development mode with auto-reload
npm start      # Production mode
```

The server will run on `http://localhost:5000`

## API Overview

### Core Features

| Feature | Endpoints |
|---------|-----------|
| **Authentication** | POST /register, POST /login |
| **Products** | GET, POST, PUT, DELETE /products |
| **Categories** | GET, POST /categories |
| **Shopping Cart** | GET, POST, PUT, DELETE /cart |
| **Orders** | POST /orders |
| **Payments** | POST /payment/create-order, POST /payment/verify |
| **Addresses** | GET, POST /addresses |

### Authentication

All protected endpoints require a JWT token in the header:
```
Authorization: Bearer <token>
```

### Admin Routes

Certain routes require admin privileges:
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/categories` - Create category
- `GET /api/test/admin` - Admin test endpoint

## Key Technologies

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Razorpay** - Payment gateway
- **Nodemon** - Auto-reload during development

## API Documentation

For detailed API documentation, refer to [API_DOCUMENTATION.md](./Server/API_DOCUMENTATION.md)

This comprehensive guide includes:
- All endpoint descriptions
- Request/response examples
- Authentication requirements
- Error handling
- Database schema details
- Complete usage flow

## Project Features

### 1. User Management
- Secure registration with password hashing
- JWT-based authentication
- Role-based access (User/Admin)

### 2. Product Catalog
- Product management (CRUD operations)
- Category organization
- Stock tracking
- Product images support

### 3. Shopping Experience
- Shopping cart with item management
- Persistent cart per user
- Real-time total calculation

### 4. Order Management
- Cart to order conversion
- Automatic inventory management
- Order number generation
- Address snapshot at purchase

### 5. Payment Processing
- Razorpay payment gateway integration
- Secure payment verification
- Payment status tracking

### 6. Shipping Integration
- Shiprocket service integration
- Automatic shipment creation after payment
- Order status tracking

## Development Tips

### Database Commands
- Make sure MongoDB is running
- Use MongoDB Compass for GUI database management

### Testing APIs
- Use Postman or Insomnia to test endpoints
- Remember to include JWT token in Authorization header for protected routes

### Common Issues
- **Port already in use**: Change PORT in .env file
- **Database connection failed**: Check MONGODB_URI in .env
- **JWT token errors**: Ensure JWT_SECRET is set and token format is correct
- **Payment errors**: Verify Razorpay credentials

## Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests (currently no test setup)
```

## API Base URL

- Development: `http://localhost:5000`
- Make all requests to `/api/*` endpoints

## Example API Calls

### Authentication APIs

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "password":"pass123",
    "mobileNumber":"9876543210"
  }'

# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"pass123"
  }'
```

### Product APIs

```bash
# Get all products (public)
curl -X GET http://localhost:5000/api/products

# Get single product by ID (public)
curl -X GET http://localhost:5000/api/products/product_id_here

# Add new product (admin only)
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token_here" \
  -d '{
    "name":"Laptop",
    "slug":"laptop",
    "sku":"SKU123",
    "description":"High performance laptop",
    "categoryId":"category_id_here",
    "price":49999,
    "images":["https://example.com/image1.jpg"],
    "stock":25
  }'

# Update product (admin only)
curl -X PUT http://localhost:5000/api/products/product_id_here \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token_here" \
  -d '{
    "price":45999,
    "stock":20
  }'

# Delete/Deactivate product (admin only)
curl -X DELETE http://localhost:5000/api/products/product_id_here \
  -H "Authorization: Bearer admin_token_here"
```

### Category APIs

```bash
# Get all categories (public)
curl -X GET http://localhost:5000/api/categories

# Create category (admin only)
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token_here" \
  -d '{
    "name":"Electronics",
    "description":"Electronic products and gadgets"
  }'
```

### Shopping Cart APIs

```bash
# Get user cart (requires token)
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer your_jwt_token"

# Add item to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "productId":"product_id_here",
    "quantity":2
  }'

# Update item quantity in cart
curl -X PUT http://localhost:5000/api/cart/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "productId":"product_id_here",
    "quantity":5
  }'

# Remove item from cart
curl -X DELETE http://localhost:5000/api/cart/remove \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "productId":"product_id_here"
  }'
```

### Address APIs

```bash
# Add delivery address
curl -X POST http://localhost:5000/api/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "fullName":"John Doe",
    "mobileNumber":"9876543210",
    "addressLine1":"123 Main Street, Apt 4B",
    "city":"New York",
    "state":"NY",
    "postalCode":"10001"
  }'

# Get all user addresses
curl -X GET http://localhost:5000/api/addresses \
  -H "Authorization: Bearer your_jwt_token"
```

### Order APIs

```bash
# Create order from cart (checkout)
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "addressId":"address_id_here"
  }'
```

### Payment APIs

```bash
# Create payment order (Razorpay)
curl -X POST http://localhost:5000/api/payment/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "orderId":"order_id_here"
  }'

# Verify payment after Razorpay payment
curl -X POST http://localhost:5000/api/payment/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "razorpay_order_id":"order_DBJepzybf123",
    "razorpay_payment_id":"pay_EAznOHGVDv8ksn",
    "razorpay_signature":"9ef4dffbfd84f1318f6739a13ce19f9d85851857",
    "orderId":"order_id_here"
  }'
```

### Test APIs

```bash
# Test protected route (requires token)
curl -X GET http://localhost:5000/api/test/profile \
  -H "Authorization: Bearer your_jwt_token"

# Test admin-only route (requires admin token)
curl -X GET http://localhost:5000/api/test/admin \
  -H "Authorization: Bearer admin_token_here"
```

### Complete Purchase Flow Example

```bash
# 1. Register/Login to get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}' | jq -r '.token')

# 2. Get all products
curl -X GET http://localhost:5000/api/products

# 3. Add product to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":"product_id","quantity":2}'

# 4. View cart
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer $TOKEN"

# 5. Add delivery address
curl -X POST http://localhost:5000/api/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "fullName":"John Doe",
    "mobileNumber":"9876543210",
    "addressLine1":"123 Main Street",
    "city":"New York",
    "state":"NY",
    "postalCode":"10001"
  }'

# 6. Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"addressId":"address_id"}'

# 7. Initiate payment
curl -X POST http://localhost:5000/api/payment/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"orderId":"order_id"}'

# 8. Verify payment (after Razorpay payment is complete)
curl -X POST http://localhost:5000/api/payment/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "razorpay_order_id":"razorpay_order_id",
    "razorpay_payment_id":"razorpay_payment_id",
    "razorpay_signature":"razorpay_signature",
    "orderId":"order_id"
  }'
```

## Contact & Support

For issues or questions, please check the GitHub repository or contact the development team.

## License

ISC