import { Link, Outlet } from "react-router"

export default function PageLayout() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-slate-200 bg-white">
                <nav
                    className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"
                    aria-label="Navigasi utama"
                >
                    <Link
                        to="/"
                        className="text-lg font-bold text-blue-700"
                    >
                        Manajemen Produk
                    </Link>
                    <Link
                        to="/products"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Daftar Produk
                    </Link>
                </nav>
            </header>
            <main className="mx-auto min-h-[calc(100vh-73px)] max-w-6xl px-4 py-8 sm:px-6">
                <Outlet />
            </main>
        </div>
    )
}
