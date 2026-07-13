'use client'
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/features/user/authSlice";
import { CircleUserRound } from "lucide-react";

export default function ProfilePage() {
    const { name, isLoggedIn, checkingAuth } = useSelector((state: any) => state.user);
    const dispatch = useDispatch<any>();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logoutUser());
        router.push('/login');
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Loading...</p>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">You are not logged in.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
                <div className="flex justify-center mb-4">
                    <CircleUserRound size={64} className="text-indigo-500" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-800 mb-8">{name}</h1>

                <button
                    onClick={handleLogout}
                    className="w-full rounded-2xl bg-red-500 px-4 py-3 text-white text-sm font-medium hover:bg-red-600 transition"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}