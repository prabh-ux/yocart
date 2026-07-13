'use client'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 px-6 py-16">
            <div className="mx-auto max-w-5xl bg-white rounded-3xl shadow-xl p-10">
                <h1 className="text-4xl font-semibold text-slate-800">About YoCart</h1>
                <p className="mt-6 text-slate-600 leading-8 text-base">
                    YoCart is a modern multi-vendor e-commerce platform built with Next.js and Tailwind CSS. We help shop owners and customers connect through a clean, responsive storefront and dashboard experience.
                </p>
                <div className="mt-10 grid gap-8 lg:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 p-8">
                        <h2 className="text-xl font-semibold text-slate-800">Our Mission</h2>
                        <p className="mt-4 text-slate-600 leading-7">Deliver a fast, simple, and scalable shopping experience for customers, sellers, and administrators.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 p-8">
                        <h2 className="text-xl font-semibold text-slate-800">Why YoCart</h2>
                        <p className="mt-4 text-slate-600 leading-7">Built with React, Next.js App Router, and Redux, YoCart is designed for rapid development and easy extension.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
