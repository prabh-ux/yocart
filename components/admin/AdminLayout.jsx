'use client'
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"
import { verifyUser } from "@/lib/features/user/authSlice"

const AdminLayout = ({ children }) => {

    const dispatch = useDispatch()
    const { isLoggedIn, role, checkingAuth } = useSelector((state) => state.user)

    useEffect(() => {
        // Only verify if we don't already have a confirmed session
        if (!isLoggedIn) {
            dispatch(verifyUser())
        }
    }, [dispatch, isLoggedIn])

    const isAdmin = isLoggedIn && role === 'admin'

    // Only show the full-page loader on the very first check,
    // not every time this layout remounts
    if (checkingAuth && !isLoggedIn) {
        return <Loading />
    }

    return isAdmin ? (
        <div className="flex flex-col h-screen">
            <AdminNavbar />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <AdminSidebar />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
            <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full">
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default AdminLayout