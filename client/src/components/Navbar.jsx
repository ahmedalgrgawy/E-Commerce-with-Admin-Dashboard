import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/auth";

const Navbar = () => {

    const { user, isAdmin, logout, isLoading } = useAuthStore()
    const cart = [1, 3, 4, 5]

    return (
        <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
            <div className='container mx-auto px-4 py-4'>
                <div className="flex items-center justify-around">
                    <Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
                        E-Commerce
                    </Link>
                    <nav className='flex flex-wrap items-center gap-4 transition duration-300 ease-in-out'>
                        <Link to='/' className='text-white hover:text-emerald-400'>
                            Home
                        </Link>
                        {user && (
                            <Link to={'/cart'} className="relative group text-black hover:text-white bg-emerald-400 p-1">
                                <ShoppingCart />
                                {cart.length > 0 && (
                                    <span
                                        className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
                                    >
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {isAdmin && (
                            <Link to={'/admin-dashboard'} className="text-black hover:text-white bg-emerald-400 p-1 flex">
                                <Lock /> <span className="pl-2">Dashboard</span>
                            </Link>
                        )}

                        {user ? (
                            <button onClick={() => logout()} className="text-black hover:text-white bg-red-600 p-1 flex">
                                {isLoading ? <Loader /> : <><LogOut /> <span className="pl-2">Logout</span></>}
                            </button>
                        ) : (
                            <>
                                <Link to={'/login'} className="text-black hover:text-white bg-emerald-400 p-1 flex">
                                    <LogIn /> <span className="pl-2">Login</span>
                                </Link>
                                <Link to={'/signup'} className="text-black hover:text-white bg-emerald-400 p-1 flex">
                                    <UserPlus /> <span className="pl-2">Signup</span>
                                </Link>
                            </>
                        )}

                    </nav>
                </div>
            </div>
        </header >
    )
}

export default Navbar