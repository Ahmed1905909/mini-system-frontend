# Mini System Frontend - Vue.js Dashboard

A modern, responsive e-commerce management dashboard built with Vue 3, featuring JWT authentication and products/orders management.

## Features

- **JWT Authentication**: Secure login/register with token stored in localStorage
- **Dashboard**: View total products and orders statistics
- **Products Management**: Create, read, update, and delete products
- **Orders Management**: View order list and detailed order information
- **Modern UI**: Clean design with Tailwind CSS and smooth animations

## Technologies

- Vue 3 (Composition API)
- Vue Router
- Pinia (State Management)
- Axios (HTTP Client)
- Tailwind CSS v4
- Vite

## Setup Instructions

### Prerequisites

- Node.js >= 16.x
- npm or yarn

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd mini-system-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   The frontend is configured to connect to the Laravel backend at `http://127.0.0.1:8000`.
   
   If your backend runs on a different URL, update the axios calls in:
   - `src/stores/auth.js`
   - `src/views/Dashboard.vue`
   - `src/views/Products.vue`
   - `src/views/Orders.vue`

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173` (or the port shown in terminal)

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
mini-system-frontend/
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Reusable components
│   ├── router/
│   │   └── index.js      # Vue Router configuration
│   ├── stores/
│   │   └── auth.js       # Pinia auth store
│   ├── views/
│   │   ├── Login.vue     # Login page
│   │   ├── Register.vue  # Register page
│   │   ├── Dashboard.vue # Dashboard with statistics
│   │   ├── Products.vue  # Products management
│   │   └── Orders.vue    # Orders management
│   ├── App.vue           # Root component
│   ├── main.js           # App entry point
│   └── style.css         # Global styles (Tailwind)
├── public/               # Public static files
├── index.html            # HTML entry point
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── postcss.config.js     # PostCSS configuration
```

## Usage

### 1. Authentication

**Register a new account:**
1. Navigate to the Register page (`/register`)
2. Fill in your name, email, and password
3. Click "Create Account"
4. You'll be automatically logged in and redirected to the dashboard

**Login:**
1. Navigate to the Login page (`/login`)
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the dashboard

### 2. Dashboard

- View total number of products
- View total number of orders
- Access navigation to Products and Orders pages

### 3. Products Management

**View Products:**
- List displays all products with name, price, and stock
- Shows the `out_of_stock` status when stock is 0

**Add Product:**
1. Click "Add Product" button
2. Fill in the form (name, description, price, stock)
3. Click "Save"

**Edit Product:**
1. Click "Edit" on any product row
2. Modify the fields
3. Click "Save"

**Delete Product:**
1. Click "Delete" on any product row
2. Confirm the deletion

### 4. Orders Management

**View Orders:**
- List displays all orders with ID, address, total, and status

**View Order Details:**
1. Click "View Details" on any order row
2. See complete order information including:
   - Delivery address
   - Phone number
   - Order total
   - List of items with quantities and prices

## State Management

The app uses Pinia for state management with the following stores:

### Auth Store (`src/stores/auth.js`)

**State:**
- `user`: Current user object
- `token`: JWT authentication token

**Actions:**
- `login(email, password)`: Authenticate user
- `register(name, email, password)`: Register new user
- `fetchUser()`: Fetch current user data
- `logout()`: Clear authentication state

**Token Storage:**
- JWT token is stored in `localStorage` for persistence
- Token is automatically included in API requests via Authorization header

## API Integration

All API calls are made using Axios with the following pattern:

```javascript
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Authenticated request
const response = await axios.get('http://127.0.0.1:8000/api/products', {
  headers: { Authorization: `Bearer ${authStore.token}` }
})
```

## Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | Login.vue | Login page |
| `/register` | Register.vue | Register page |
| `/` | Dashboard.vue | Dashboard (protected) |
| `/products` | Products.vue | Products management (protected) |
| `/orders` | Orders.vue | Orders management (protected) |

**Route Protection:**
Routes are protected by checking for authentication token in the auth store.

## Styling

The app uses Tailwind CSS v4 for styling with custom configurations:

- **Color Scheme**: Indigo/purple accents with gray backgrounds
- **Spacing**: Generous padding and margins for readability
- **Shadows**: Subtle shadows with hover effects
- **Animations**: Smooth fade-in transitions for modals

Custom styles are defined in `src/style.css`.

## Key Features

### Modal Animations
Product and order modals use Vue's `<Transition>` component with custom fade effects:
```vue
<Transition name="fade">
  <div v-if="showModal">
    <!-- Modal content -->
  </div>
</Transition>
```

### Error Handling
Errors from API calls are displayed to users with appropriate messaging.

### Responsive Design
The dashboard is fully responsive and works on desktop, tablet, and mobile devices.

## Development

### Hot Module Replacement (HMR)
Vite provides instant hot reloading during development for a smooth developer experience.

### Code Organization
- **Composition API**: All components use Vue 3 Composition API with `<script setup>`
- **Single File Components**: Each view is a self-contained `.vue` file
- **Reactive State**: Uses Vue 3's `ref()` and `reactive()` for state management

## Troubleshooting

**Issue: "Login failed" or "Token not saved"**
- Solution: Ensure the backend is running and JWT is properly configured

**Issue: "CORS error"**
- Solution: Add CORS middleware to your Laravel backend

**Issue: "Tailwind styles not loading"**
- Solution: Ensure Tailwind v4 is properly installed and `style.css` is imported in `main.js`

## License

MIT License
