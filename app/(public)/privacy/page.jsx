'use client'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 px-6 py-16">
            <div className="mx-auto max-w-5xl bg-white rounded-3xl shadow-xl p-10">
                <h1 className="text-4xl font-semibold text-slate-800">Privacy Policy</h1>
                <p className="mt-6 text-slate-600 leading-8">At YoCart, we value your privacy. This demo site does not collect real personal data, and all stored information is only used to showcase the application.</p>
                <div className="mt-8 space-y-6 text-slate-600 leading-7">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Data Use</h2>
                        <p className="mt-3">We only use basic profile and order data to provide shopping features and a better experience on this demo platform.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Cookies</h2>
                        <p className="mt-3">This demo includes standard cookies to maintain sessions and cart state in the browser.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Third-Party Services</h2>
                        <p className="mt-3">We do not share your data with third parties on this demo version.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
