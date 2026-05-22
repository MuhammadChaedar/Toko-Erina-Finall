import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

export type CartItem = {
  product: any
  quantity: number
}

function AppRoutes() {
  const [cart, setCart] = useState<CartItem[]>([])
  const navigate = useNavigate()

  const addToCart = (product: any) => {
    if (product.stock_status === 'out_of_stock') return

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.product.id === product.id
      )

      if (existingItem) {
        return currentCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...currentCart, { product, quantity: 1 }]
    })
  }

  const buyNow = (product: any) => {
    if (product.stock_status === 'out_of_stock') return

    setCart([{ product, quantity: 1 }])
    navigate('/pembayaran')
  }

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      setCart((currentCart) =>
        currentCart.filter((item) => item.product.id !== productId)
      )
      return
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.product.id !== productId)
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              addToCart={addToCart}
              buyNow={buyNow}
              cartItemCount={cartItemCount}
            />
          }
        />
        <Route
          path="/keranjang"
          element={
            <CartPage
              cart={cart}
              cartItemCount={cartItemCount}
              updateCartQuantity={updateCartQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />
        <Route
          path="/pembayaran"
          element={
            <CheckoutPage
              cart={cart}
              cartItemCount={cartItemCount}
              clearCart={clearCart}
            />
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
