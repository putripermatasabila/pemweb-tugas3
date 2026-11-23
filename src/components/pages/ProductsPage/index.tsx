import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import ProductRemote from "../../../data/product/source/product-remote"
import ProductRepository from "../../../data/product/repository/product-repository"
import ProductGrid from "../../organisms/ProductGrid"
import type { Product } from "../../../types/product"

const repository = ProductRepository(
    ProductRemote({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "" }),
)

export default function ProductsPage() {
    const navigate = useNavigate()
    const [products, setProducts] = useState<Product[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")

    async function loadProducts() {
        setIsLoading(true)
        setError("")
        try {
            const models = await repository.getProductList()
            setProducts(models.map((model) => model.toJSON()))
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : "Gagal memuat produk.",
            )
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        void loadProducts()
    }, [])

    function openCreateModal() {
        setEditingProduct(null)
        setName("")
        setPrice("")
        setIsModalOpen(true)
    }

    function openEditModal(product: Product) {
        setEditingProduct(product)
        setName(product.name)
        setPrice(String(product.price))
        setIsModalOpen(true)
    }

    function closeModal() {
        setIsModalOpen(false)
        setEditingProduct(null)
    }

    async function submitProduct(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")
        const parsedPrice = Number(price)
        if (!name.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
            setError("Nama wajib diisi dan harga harus berupa angka tidak negatif.")
            return
        }

        try {
            if (editingProduct) {
                await repository.updateProduct(editingProduct.id, {
                    name: name.trim(),
                    price: parsedPrice,
                })
            } else {
                await repository.createProduct({
                    name: name.trim(),
                    price: parsedPrice,
                })
            }
            closeModal()
            await loadProducts()
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : "Gagal menyimpan produk.",
            )
        }
    }

    async function handleDelete(id: number) {
        if (!window.confirm("Hapus produk ini?")) {
            return
        }
        try {
            await repository.deleteProduct(id)
            await loadProducts()
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : "Gagal menghapus produk.",
            )
        }
    }

    const visibleProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.trim().toLowerCase()),
    )

    return (
        <>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                        Inventaris
                    </p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
                        Manajemen Produk
                    </h1>
                </div>
                <button
                    type="button"
                    onClick={openCreateModal}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    + Tambah Produk
                </button>
            </div>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Cari nama produk..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 sm:max-w-sm"
                />
                <span className="text-sm text-slate-500">
                    {visibleProducts.length} produk
                </span>
            </div>

            {error && (
                <p
                    role="alert"
                    className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"
                >
                    {error}
                </p>
            )}

            {isLoading ? (
                <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
                    Memuat produk…
                </p>
            ) : visibleProducts.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                    Produk tidak ditemukan.
                </p>
            ) : (
                <ProductGrid
                    products={visibleProducts}
                    onSelect={(id) => navigate(`/products/${id}`)}
                    onEdit={openEditModal}
                    onDelete={(id) => void handleDelete(id)}
                />
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="product-form-title"
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                    >
                        <h2
                            id="product-form-title"
                            className="text-xl font-bold text-slate-900"
                        >
                            {editingProduct ? "Edit Produk" : "Tambah Produk"}
                        </h2>
                        <form className="mt-5" onSubmit={submitProduct}>
                            <label
                                htmlFor="product-name"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Nama Produk
                            </label>
                            <input
                                id="product-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                                className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                            />
                            <label
                                htmlFor="product-price"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Harga
                            </label>
                            <input
                                id="product-price"
                                type="number"
                                min="0"
                                value={price}
                                onChange={(event) => setPrice(event.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                            />
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-slate-300 px-4 py-2 font-semibold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </>
    )
}
