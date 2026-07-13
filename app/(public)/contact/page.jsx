'use client'

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 px-6 py-16">
            <div className="mx-auto max-w-5xl bg-white rounded-3xl shadow-xl p-10">
                <h1 className="text-4xl font-semibold text-slate-800">Contact Us</h1>
                <p className="mt-6 text-slate-600 leading-8">Have a question or need support? Reach out and we’ll get back to you as soon as possible.</p>
                <div className="mt-10 grid gap-8 lg:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 p-8">
                        <h2 className="text-xl font-semibold text-slate-800">Get in touch</h2>
                        <p className="mt-4 text-slate-600 leading-7">Email: contact@example.com</p>
                        <p className="mt-2 text-slate-600 leading-7">Phone: +1-212-456-7890</p>
                        <p className="mt-2 text-slate-600 leading-7">Address: 794 Francisco, San Francisco, CA 94102</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 p-8">
                        <h2 className="text-xl font-semibold text-slate-800">Send a message</h2>
                        <form className="mt-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Name</label>
                                <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500" type="text" placeholder="Your name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Email</label>
                                <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500" type="email" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Message</label>
                                <textarea className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500" rows="5" placeholder="How can we help?"></textarea>
                            </div>
                            <button className="rounded-2xl bg-indigo-600 px-6 py-3 text-white text-sm font-medium hover:bg-indigo-700 transition">Send message</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
