import type { Product } from "../../../types/product"
import ProductCard from "../../molecules/ProductCard"
type Props = {
    products: Product[]
    onSelect: (id: number) => void
    onEdit: (product: Product) => void
    onDelete: (id: number) => void
}

export default function ProductGrid({
    products,
    onSelect,
    onEdit,
    onDelete,
}: Props) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelect}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}
