'use client'
import { Search, ShoppingCart, CircleUserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {

    const router = useRouter();

    const [search, setSearch] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const searchRef = useRef(null)

    const cartCount = useSelector(state => state.cart.total)
    const isLoggedIn = useSelector(state => state.user.isLoggedIn)
    const products = useSelector(state => state.product.list)

    const suggestions = search.trim()
        ? products.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
        ).slice(0, 6)
        : []

    const handleSearch = (e) => {
        e.preventDefault()
        setShowSuggestions(false)
        router.push(`/shop?search=${search}`)
    }

    const handleSuggestionClick = (productId) => {
        setShowSuggestions(false)
        setSearch('')
        router.push(`/product/${productId}`)
    }

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">

                    <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                        <span className="text-green-600">Yo</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                        <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>

                        <div ref={searchRef} className="relative hidden xl:block">
                            <form onSubmit={handleSearch} className="flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                                <Search size={18} className="text-slate-600" />
                                <input
                                    className="w-full bg-transparent outline-none placeholder-slate-600"
                                    type="text"
                                    placeholder="Search products"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                        setShowSuggestions(true)
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    required
                                />
                            </form>

                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                    {suggestions.map((product) => (
                                        <div
                                            key={product._id}
                                            onClick={() => handleSuggestionClick(product._id)}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer"
                                        >
                                            <div className="bg-slate-100 rounded-md w-10 h-10 flex items-center justify-center shrink-0">
                                                <Image src={product.images[0]} alt="" width={30} height={30} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-700">{product.name}</p>
                                                <p className="text-xs text-slate-400">{product.category}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        {isLoggedIn ? (
                            <Link href="/profile" className="flex items-center gap-2 text-slate-600">
                                <CircleUserRound size={22} />
                                Profile
                            </Link>
                        ) : (
                            <>
                                <Link href="/signup" className="px-6 py-2 border border-slate-300 text-slate-600 rounded-full hover:bg-slate-100 transition">
                                    Sign Up
                                </Link>
                                <Link href="/login" className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                    Login
                                </Link>
                            </>
                        )}

                    </div>

                    {/* Mobile User Buttons  */}
                    <div className="sm:hidden flex items-center gap-2">
                        {isLoggedIn ? (
                            <Link href="/profile" className="flex items-center gap-1 px-4 py-1.5 text-sm text-slate-700">
                                <CircleUserRound size={20} />
                                Profile
                            </Link>
                        ) : (
                            <>
                                <Link href="/signup" className="px-4 py-1.5 border border-slate-300 text-sm text-slate-700 rounded-full hover:bg-slate-100 transition">
                                    Sign Up
                                </Link>
                                <Link href="/login" className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar