import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import ProductRemote from "../../../data/product/source/product-remote"
import ProductRepository from "../../../data/product/repository/product-repository"
import type { Product } from "../../../types/product"
import { formatRupiah } from "../../../utils/formatRupiah"

const repository = ProductRepository(
    ProductRemote({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "" }),
)

export default function ProductDetailPage() {
    const { id } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const productId = Number(id)
        if (!Number.isSafeInteger(productId) || productId <= 0) {
            setError("ID produk tidak valid.")
            setIsLoading(false)
            return
        }

        void repository
            .getProduct(productId)
            .then((model) => setProduct(model.toJSON()))
            .catch((caughtError) =>
                setError(
                    caughtError instanceof Error
                        ? caughtError.message
                        : "Produk tidak ditemukan.",
                ),
            )
            .finally(() => setIsLoading(false))
    }, [id])

    return (
        <section>
            <Link
                to="/products"
                className="mb-6 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
                ← Kembali ke daftar produk
            </Link>

            {isLoading ? (
                <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                    Memuat detail produk…
                </p>
            ) : error ? (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-8 text-center"
                >
                    <h1 className="text-2xl font-bold text-red-700">
                        Produk Tidak Ditemukan
                    </h1>
                    <p className="mt-2 text-red-600">{error}</p>
                </div>
            ) : product ? (
                <article className="max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <p className="text-sm font-semibold text-blue-600">
                        Detail Produk
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        {product.name}
                    </h1>
                    <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6">
                        <div>
                            <dt className="text-sm text-slate-500">ID Produk</dt>
                            <dd className="mt-1 font-semibold">{product.id}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-slate-500">Harga</dt>
                            <dd className="mt-1 text-xl font-bold text-blue-700">
                                {formatRupiah(product.price)}
                            </dd>
                        </div>
                    </dl>
                </article>
            ) : null}
        </section>
    )
}
