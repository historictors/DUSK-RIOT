# DUSK RIOT — BACKEND DEVELOPMENT AND DATABASE INTEGRATION

## PROJECT CONTEXT

The DUSK RIOT frontend has already been completed.

The project includes:
- Customer storefront
- Product listing and details
- Cart
- Wishlist
- Checkout interface
- Customer account
- Order history
- Order tracking
- Admin dashboard
- Product management
- Inventory management
- Coupon management
- Order management

The frontend currently uses mock data and localStorage.

Your task is to develop the backend, connect a persistent database, implement authentication, build APIs, and integrate everything with the existing frontend.

IMPORTANT:
- Continue working in the existing DUSK RIOT project.
- Do not create a new project.
- Do not rebuild the frontend.
- Do not redesign existing pages.
- Preserve existing UI, components, layouts, and styling.
- Replace mock data with real API/database operations.
- Maintain existing frontend functionality.
- Inspect the completed frontend architecture before implementation.

## 1. BACKEND TECH STACK

Preferred stack:

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- Auth.js or a suitable secure authentication solution
- Zod for validation
- REST API architecture

Choose compatible, stable versions and inspect existing dependencies before installing anything.

Keep the architecture modular and maintainable.

## 2. DATABASE DESIGN

Design a normalized PostgreSQL database.

Create appropriate models for:

- User
- Account
- Session
- Address
- Product
- ProductImage
- Category
- Collection
- ProductVariant
- Inventory
- InventoryTransaction
- Cart
- CartItem
- Wishlist
- WishlistItem
- Order
- OrderItem
- Payment
- Coupon
- CouponUsage
- Review
- Shipping
- Notification
- StoreSettings

Add:
- Primary keys
- Foreign keys
- Relationships
- Unique constraints
- Indexes
- Timestamps
- Appropriate enums
- Data validation

Product variants must support individual SKU, size, color, price, and stock.

Order items must preserve product details and prices at the time of purchase, even if the original product is modified later.

## 3. AUTHENTICATION AND AUTHORIZATION

Implement secure authentication.

Customer functionality:
- Registration
- Login
- Logout
- Password hashing
- Session management
- Profile management
- Password reset
- Address management

Admin functionality:
- Admin login
- Role-based access control
- Protected admin routes
- Protected admin APIs

Roles:
- CUSTOMER
- ADMIN

Never trust frontend role checks alone.

Verify permissions on the server for every protected operation.

## 4. PRODUCT AND CATEGORY APIs

Create APIs for:

- Fetch all products
- Fetch product by ID or slug
- Create product
- Update product
- Delete product
- Search products
- Filter products
- Sort products
- Fetch categories
- Create/update/delete categories
- Fetch collections
- Create/update/delete collections

Implement pagination.

Support filtering by:
- Category
- Collection
- Size
- Color
- Price range
- Availability

Support sorting by:
- Newest
- Featured
- Price ascending
- Price descending
- Best selling

## 5. INVENTORY MANAGEMENT

Implement server-side inventory management.

Requirements:
- Variant-level inventory.
- Stock adjustments.
- Stock transaction history.
- Low-stock alerts.
- Out-of-stock handling.
- Prevention of negative inventory.

Inventory updates must be handled safely during order placement.

Use database transactions to prevent overselling and inconsistent stock.

## 6. CART AND WISHLIST APIs

Implement:

- Fetch cart
- Add cart item
- Update cart quantity
- Remove cart item
- Clear cart
- Merge guest cart after login
- Fetch wishlist
- Add wishlist item
- Remove wishlist item

Persist customer carts and wishlists in PostgreSQL.

Support guest cart functionality through the frontend and merge it with the customer's account cart after authentication.

## 7. ORDER MANAGEMENT

Implement order creation and management.

Customer APIs:
- Place order
- Fetch customer orders
- Fetch order details
- Cancel eligible orders
- Track order

Admin APIs:
- Fetch all orders
- Filter orders
- Fetch order details
- Update order status
- Add courier details
- Add tracking number
- Cancel orders

Order statuses:

PLACED
CONFIRMED
PROCESSING
SHIPPED
OUT_FOR_DELIVERY
DELIVERED
CANCELLED

Important:
- Validate stock on the server.
- Calculate prices on the server.
- Never trust totals received from the frontend.
- Validate coupons on the server.
- Use database transactions for order creation and stock reduction.
- Prevent duplicate order creation.
- Preserve order item snapshots.

## 8. PAYMENT INTEGRATION

Keep payment integration modular.

First implement a secure payment abstraction and support a Cash on Delivery option if appropriate.

If an online payment gateway is introduced, use Razorpay or another suitable provider.

Requirements:
- Server-side order creation.
- Payment verification.
- Webhook verification.
- Payment status tracking.
- Secure handling of payment secrets.
- Never store sensitive card information.

Do not mark an order as paid based only on frontend confirmation.

## 9. COUPON SYSTEM

Implement coupon management.

Support:
- Percentage discounts
- Fixed discounts
- Minimum order amount
- Expiry dates
- Usage limits
- Per-customer limits
- Active/inactive status

Validate all coupons on the server.

Prevent invalid or repeated coupon usage.

## 10. IMAGE STORAGE

Integrate Cloudinary or another suitable image storage provider.

Requirements:
- Product image upload.
- Multiple product images.
- Image deletion.
- Image URL storage in the database.
- Image optimization.

Keep credentials in environment variables.

## 11. CUSTOMER AND ADMIN DASHBOARD INTEGRATION

Connect existing frontend screens to real APIs.

Customer dashboard:
- Profile
- Addresses
- Orders
- Order details
- Tracking
- Wishlist

Admin dashboard:
- Dashboard analytics
- Product CRUD
- Categories
- Collections
- Inventory
- Orders
- Customers
- Coupons
- Settings

All admin changes must persist in PostgreSQL and immediately reflect in the storefront after data refresh or appropriate cache revalidation.

## 12. API SECURITY

Implement:
- Server-side validation
- Authentication middleware
- Role-based authorization
- Rate limiting where appropriate
- Secure password hashing
- Input sanitization
- Safe error handling
- Environment variable protection
- Protection against unauthorized access
- Proper CORS configuration if needed

Never expose database credentials or secret keys to the client.

## 13. DATA MIGRATION

Replace frontend mock data with API-driven data.

Requirements:
- Preserve existing UI.
- Create database seed data based on existing mock products and categories.
- Migrate initial demo products.
- Replace localStorage cart persistence with database persistence for authenticated customers.
- Maintain guest cart functionality.
- Replace simulated authentication with real authentication.
- Replace demo order creation with actual backend order creation.

Do not remove localStorage functionality where it is still useful for guest sessions or non-sensitive preferences.

## 14. TESTING

Test the complete system.

Backend:
- Database connections
- CRUD operations
- Authentication
- Authorization
- API validation
- Inventory consistency
- Order creation
- Coupon validation
- Payment verification
- Error handling

Frontend integration:
- Registration and login
- Product browsing
- Search and filters
- Cart
- Wishlist
- Checkout
- Order placement
- Order tracking
- Admin product management
- Inventory management
- Order management
- Coupon management

Test both successful and failed scenarios.

Fix all major errors before declaring the integration complete.

## 15. DEVELOPMENT WORKFLOW

Follow this order:

PHASE 1: Inspect existing frontend architecture and data models.

PHASE 2: Design the database schema.

PHASE 3: Configure PostgreSQL and Prisma.

PHASE 4: Create migrations and seed data.

PHASE 5: Implement authentication and authorization.

PHASE 6: Implement product, category, and collection APIs.

PHASE 7: Implement cart and wishlist APIs.

PHASE 8: Implement inventory and order APIs.

PHASE 9: Implement coupon and payment functionality.

PHASE 10: Implement image storage.

PHASE 11: Integrate APIs with the existing frontend.

PHASE 12: Test the complete application.

Before implementation, inspect the existing project and present:
- Current frontend architecture
- Existing data models
- Required database schema
- Backend architecture
- API structure
- Integration plan

Do not begin by rebuilding the frontend.

The final goal is to transform the existing DUSK RIOT frontend into a complete, secure, database-backed e-commerce application without damaging its existing UI.