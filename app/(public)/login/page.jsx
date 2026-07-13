'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginUser, verifyUser } from "@/lib/features/user/authSlice";

const DEMO_CREDENTIALS = [
    { label: "Admin", email: "admin@example.com", password: "Admin@123" },
    { label: "Vendor", email: "vendor@example.com", password: "Vendor@123" },
    { label: "User", email: "StandardUser@example.com", password: "Test1234" },
];

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await dispatch(loginUser({ email, password }));

        if (loginUser.fulfilled.match(result)) {
            toast.success(result.payload.msg || 'Login successful');

            // loginUser doesn't return role, so verify to get it
            const verifyResult = await dispatch(verifyUser());
            setLoading(false);

            console.log("VERIFY RESULT:", verifyResult);
            console.log("MATCHED:", verifyUser.fulfilled.match(verifyResult));

            const role = verifyUser.fulfilled.match(verifyResult)
                ? verifyResult.payload.role
                : null;

            console.log("ROLE:", role);

            if (role === "admin") {
                router.push('/admin');
            } else if (role === "vendor") {
                router.push('/store');
            } else {
                router.push('/');
            }
        } else {
            setLoading(false);
            toast.error(result.payload || 'Unable to login. Please try again.');
        }
    };

    const fillDemo = (cred) => {
        setEmail(cred.email);
        setPassword(cred.password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
                <h1 className="text-3xl font-semibold text-slate-800 mb-3">Login</h1>
                <p className="text-sm text-slate-500 mb-8">Enter your credentials to continue.</p>

                <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                    <p className="text-xs font-semibold text-indigo-700 mb-3 uppercase tracking-wide">
                        Demo Credentials (click to autofill)
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {DEMO_CREDENTIALS.map((cred) => (
                            <button
                                key={cred.label}
                                type="button"
                                onClick={() => fillDemo(cred)}
                                className="rounded-xl bg-white border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition"
                            >
                                {cred.label}
                            </button>
                        ))}
                    </div>
                    <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                        {DEMO_CREDENTIALS.map((cred) => (
                            <div key={cred.label}>
                                <span className="font-medium text-slate-600">{cred.label}:</span> {cred.email} / {cred.password}
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}