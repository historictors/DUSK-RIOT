# DUSK RIOT — PHASE 1.5: UI OPTIMIZATION & RESPONSIVE DESIGN SPECIFICATION

## Project Context
The DUSK RIOT frontend is developed with Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Zustand, and Lucide React.
The goal of Phase 1.5 is to optimize the UI, refine visual consistency, and ensure every page is fully responsive across:
- Small mobile: 320px–375px
- Standard mobile: 376px–430px
- Large mobile: 431px–767px
- Tablet: 768px–1023px
- Laptop: 1024px–1439px
- Desktop: 1440px+

## Key Areas of Work
1. **Mobile-First Header & Navigation**:
   - Touch-friendly 44px+ targets
   - Responsive header layout that fits on 320px screens without overflow
   - Full mobile navigation drawer with backdrop, links, and route-change auto-closing
2. **Responsive Product Grid**:
   - 2-column mobile layout (`grid-cols-2`) for editorial streetwear feel
   - Balanced product cards with responsive typography and touch buttons
3. **Product Listing Filter Drawer**:
   - Mobile bottom sheet / slide-over drawer for category, size, price, and stock filters
4. **Product Details Mobile Experience**:
   - Touch-optimized image gallery
   - Responsive size selectors
   - Mobile Sticky Add to Bag bar for quick conversion
   - Interactive Size Guide modal optimized for mobile viewports
5. **Cart & Checkout Mobile Layout**:
   - Stacked line items with large touch steppers
   - Easy input fields with mobile keyboard attributes
   - Sticky or clear summary section
6. **Customer Account & Tracking on Mobile**:
   - Horizontal scrollable or stacked account tab navigation
   - Mobile vertical timeline progress indicator for parcel tracking
   - Responsive address cards and modals
7. **Admin Dashboard Mobile Accessibility**:
   - Mobile admin header with hamburger drawer for `< lg` screens
   - Responsive KPI card grid (1-col mobile, 2-col tablet, 4-col desktop)
   - Horizontally scrollable tables with sticky headers/actions
   - Large touch targets for +/- inventory adjustments
8. **Reusable DuskImage Component**:
   - Consistent aspect ratios (`aspect-[3/4]`, `aspect-[16/9]`, `aspect-[4/5]`)
   - Neutral dark streetwear placeholder fallbacks
   - Prevents container collapse and layout shifts
