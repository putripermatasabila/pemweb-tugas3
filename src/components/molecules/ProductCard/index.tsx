import type { Product } from "../../../types/product"
import { TbPackage } from "react-icons/tb"
import Button from "../../atoms/Button"
import { formatRupiah } from "../../../utils/formatRupiah"
type Props = {
    product: Product
    onSelect: (id: number) => void
    onEdit: (product: Product) => void
    onDelete: (id: number) => void
}

export default function ProductCard({
    product,
    onSelect,
    onEdit,
    onDelete,
}: Props) {
    return (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    ID: {product.id}
                </span>
                <TbPackage className="text-2xl text-slate-400" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{product.name}</h2>
            <p className="mt-2 mb-5 text-xl font-bold text-blue-700">
                {formatRupiah(product.price)}
            </p>
            <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => onSelect(product.id)}>Detail</Button>
                <Button
                    variant="secondary"
                    onClick={() => onEdit(product)}
                >
                    Edit
                </Button>
                <Button
                    variant="danger"
                    onClick={() => onDelete(product.id)}
                >
                    Hapus
                </Button>
            </div>
        </article>
    )
}
