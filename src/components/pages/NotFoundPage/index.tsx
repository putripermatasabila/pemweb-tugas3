import { Link } from "react-router"

export default function NotFoundPage() {
    return (
        <section className="mx-auto max-w-xl text-center">
            <p className="text-7xl font-black text-blue-100 sm:text-8xl">404</p>
            <h1 className="-mt-8 text-3xl font-bold text-slate-900">
                Halaman tidak ditemukan
            </h1>
            <p className="mt-3 text-slate-500">
                URL yang kamu buka tidak terdaftar dalam aplikasi.
            </p>
            <div className="mt-6 flex justify-center gap-3">
                <Link
                    to="/"
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700"
                >
                    Ke halaman utama
                </Link>
                <Link
                    to="/products"
                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
                >
                    Ke daftar produk
                </Link>
            </div>
        </section>
    )
}
