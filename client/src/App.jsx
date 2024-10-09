import { Navigate, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./stores/auth"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner"
import AdminDashboard from "./pages/AdminDashboard"
import { CategoryPage } from "./pages/CategoryPage"

const App = () => {

  const { user, checkAuth, checkingAuth, isAdmin } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (checkingAuth) return <LoadingSpinner />

  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
        </div>
      </div>
      <div className='relative z-50 pt-20'>
        <Navbar />
        <Routes>
          <Route path="/" element={!user ? <Navigate to={'/login'} /> : <Home />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to={"/"} />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to={"/"} />} />
          <Route path="/admin-dashboard" element={user && isAdmin ? <AdminDashboard /> : <Navigate to={"/login"} />} />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App