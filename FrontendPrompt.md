# DUSK RIOT — FRONTEND DEVELOPMENT

## PROJECT CONTEXT

We are developing a modern streetwear e-commerce platform named DUSK RIOT.

The UI designs have ALREADY been created using Google Stitch. The exported designs, code, and assets are available inside the existing project folder.

Your task is to transform the existing designs into a fully functional frontend application.

IMPORTANT:
- Do NOT start the project from scratch.
- Do NOT create another project or unnecessary frontend directory.
- Do NOT regenerate the UI designs.
- First inspect the existing project structure, code, assets, dependencies, and configuration.
- Reuse and preserve the existing Stitch designs.
- Do not make significant design changes without a technical reason.
- Do not develop the backend during this phase.

## 1. BRAND IDENTITY

Brand: DUSK RIOT

Tagline: BREAK THE ORDINARY.

Brand personality:
- Bold
- Rebellious
- Urban
- Youthful
- Experimental
- Contemporary streetwear

Design direction:
Dark editorial streetwear with premium fashion photography, bold typography, large imagery, and modern layouts.

### Color palette

- Primary background: #0B0B0B
- Secondary background: #151515
- Card background: #191919
- Primary text: #F5F5F0
- Secondary text: #A1A1A1
- Accent: #C7FF3D
- Borders: #292929

Use bold condensed typography for headings and Inter or a similar font for body text.

Avoid generic e-commerce templates, excessive gradients, glassmorphism, and unnecessary animations.

## 2. TECH STACK

Use the existing project framework wherever possible.

Preferred stack:
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Framer Motion for subtle animations
- Zustand for shared frontend state if needed

Use mock TypeScript/JSON data and localStorage for frontend persistence.

Do not introduce backend technologies in this phase.

## 3. CUSTOMER STOREFRONT

Implement the following pages:

- Homepage
- Shop
- Category pages
- Collection pages
- Product details
- Search
- Cart
- Wishlist
- Checkout
- Order success
- Login
- Registration
- Customer account
- Order history
- Order details
- Address management
- Order tracking
- About
- Contact

### Homepage

Hero heading:
NOT MADE TO FIT IN.

Supporting text:
Streetwear for those who refuse to follow the crowd.

CTA:
EXPLORE THE DROP.

Include:
- Hero banner
- Featured products
- New arrivals
- Collections
- Promotional sections
- Brand manifesto
- Newsletter UI
- Footer

### Product browsing

Implement:
- Product grid
- Category filtering
- Size filtering
- Color filtering
- Minimum and maximum price
- Availability filtering
- Collection filtering
- Search functionality

Sorting:
- Newest
- Featured
- Price low to high
- Price high to low
- Best selling

### Product details

Include:
- Product image gallery
- Image zoom
- Product name
- Price and sale price
- Product description
- Material information
- Size selection
- Color selection
- Quantity selector
- Stock availability
- Size guide
- Add to cart
- Wishlist
- Related products

Support multiple variants per product. Each variant should have its own SKU, price, size, color, and stock quantity.

## 4. CART AND WISHLIST

Implement a functional cart.

Requirements:
- Add products to cart.
- Remove products.
- Update quantities.
- Select product sizes and colors.
- Calculate subtotal.
- Calculate discounts.
- Calculate shipping.
- Calculate final total.
- Persist cart using localStorage.

Wishlist:
- Add/remove products.
- Persist wishlist using localStorage.

## 5. CHECKOUT

Build a complete frontend checkout experience.

Include:
- Customer information
- Shipping address
- Order summary
- Coupon application
- Shipping charges
- Final total
- Place order button

IMPORTANT:

This phase uses simulated checkout only.

No real payment gateway or transaction should be implemented.

When the customer places an order:
1. Validate customer information.
2. Validate address.
3. Check available stock.
4. Validate coupon.
5. Calculate final amount.
6. Create a demo order.
7. Store the order in frontend state/localStorage.
8. Clear the cart.
9. Redirect to order success.

Clearly indicate that this is a demo checkout and no payment is collected.

## 6. CUSTOMER ACCOUNT

Implement frontend customer functionality:

- Demo login and registration.
- Account dashboard.
- Profile information.
- Saved addresses.
- Order history.
- Order details.
- Order tracking.
- Eligible order cancellation.

Use simulated authentication only. Do not implement real authentication yet.

## 7. ADMIN DASHBOARD

Create a separate admin interface with the following pages:

- Dashboard
- Products
- Add product
- Edit product
- Categories
- Collections
- Inventory
- Orders
- Order details
- Customers
- Coupons
- Analytics
- Settings

### Dashboard

Display:
- Total revenue (demo data)
- Total orders
- Total customers
- Total products
- Pending orders
- Low-stock products
- Best-selling products
- Recent orders
- Sales charts

### Product management

Implement:
- Create products
- Edit products
- Delete products
- Upload/select image previews locally
- Product descriptions
- Categories
- Collections
- Pricing
- Discount pricing
- Size variants
- Color variants
- SKU management
- Variant-level stock
- Featured status
- Published/unpublished status

### Inventory

Implement:
- Stock management
- Stock adjustments
- Low-stock indicators
- Out-of-stock indicators
- Inventory history
- Prevention of negative stock

### Order management

Implement:
- Order listing
- Order search
- Order filters
- Order details
- Order status updates
- Courier information
- Tracking number
- Order cancellation

Order statuses:

PLACED
CONFIRMED
PROCESSING
SHIPPED
OUT_FOR_DELIVERY
DELIVERED
CANCELLED

### Customers

Display:
- Customer information
- Contact details
- Order history
- Total spending

### Coupons

Implement:
- Percentage discounts
- Fixed discounts
- Minimum order amount
- Expiry dates
- Usage limits
- Active/inactive status

## 8. FRONTEND STATE MANAGEMENT

Use a centralized state-management approach.

Suggested structure:

- productsStore
- cartStore
- wishlistStore
- authStore
- orderStore
- adminStore
- couponStore

Use Zustand if appropriate.

Persist necessary state using localStorage.

IMPORTANT:
Admin changes must reflect on the customer storefront.

For example:
- Adding a product in admin should update the shop.
- Editing product prices should update product details and cart calculations.
- Updating stock should affect product availability.
- Creating a coupon should make it available at checkout.
- Updating order status should reflect in customer order tracking.

Keep data models and data access logic organized so the backend can replace mock data later.

## 9. RESPONSIVENESS

Ensure the complete application works on:

- Desktop
- Laptop
- Tablet
- Mobile

Maintain the visual identity across all screen sizes.

## 10. CODE ORGANIZATION

Use reusable components and a clean architecture.

Separate:
- Components
- Pages/routes
- Layouts
- Stores
- Mock data
- Types/interfaces
- Utilities
- Constants

Avoid unnecessary duplication.

Do not tightly couple UI components to mock data.

Create clean data access and service interfaces so they can later be connected to backend APIs.

## 11. BACKEND RESTRICTIONS

STRICTLY DO NOT IMPLEMENT:

- Backend APIs
- API routes
- Database
- PostgreSQL
- Prisma
- MongoDB
- Auth.js
- Real authentication
- Payment gateways
- Cloudinary
- Email services
- Shipping APIs
- Server-side business logic

These will be implemented in Phase 2.

## 12. TESTING

Before completing this phase, test:

- All routes
- Navigation
- Product browsing
- Search and filters
- Product variants
- Cart functionality
- Wishlist functionality
- Checkout simulation
- Demo order placement
- Customer account
- Admin login simulation
- Product CRUD
- Inventory management
- Coupon functionality
- Order management
- Storefront-admin synchronization
- Responsive layouts
- Browser console errors

Fix broken routes, dead buttons, and functional issues.

## 13. DEVELOPMENT WORKFLOW

Work in stages.

PHASE 1: Inspect existing project and Stitch-generated files.

PHASE 2: Report the existing structure and propose an implementation plan.

PHASE 3: Integrate existing designs into the current application.

PHASE 4: Complete the customer storefront.

PHASE 5: Implement customer-side interactions.

PHASE 6: Complete the admin dashboard.

PHASE 7: Connect admin and storefront using shared frontend state.

PHASE 8: Test all pages and functionality.

Do not skip inspection.

Do not overwrite existing code blindly.

Preserve the existing UI design as much as possible.

Start with project inspection and provide a clear implementation plan before modifying files.

The goal is to deliver a complete, responsive, functional frontend that uses mock data and is ready for backend integration.