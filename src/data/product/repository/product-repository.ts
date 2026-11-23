import type { ProductRemoteSource } from "../source/product-remote.ts"
import ProductModel from "../model/product-model.ts"
import ProductListParam from "../param/product-list-param.ts"
import type { ProductValues } from "../../../types/product"

// Maps remote payloads into validated application models.
export default function ProductRepository({
    getProductListRemote,
    getProductRemote,
    createProductRemote,
    updateProductRemote,
    deleteProductRemote,
}: ProductRemoteSource) {
    async function getProductList(
        param = new ProductListParam(),
    ): Promise<ProductModel[]> {
        const response = await getProductListRemote(param)
        // The endpoint contract returns a direct array of products.
        if (!Array.isArray(response)) {
            throw new TypeError(
                "Contoh ini mengharapkan response API berupa array produk.",
            )
        }

        const products = response.map((item) => ProductModel.fromResponse(item))
        const ids = products.map((product) => product.getId())
        if (new Set(ids).size !== ids.length) {
            throw new TypeError("ID produk dari API harus unik.")
        }

        return products
    }

    async function getProduct(id: number): Promise<ProductModel> {
        if (!getProductRemote) {
            throw new Error("Operasi detail produk belum tersedia.")
        }
        const response = await getProductRemote(id)
        return ProductModel.fromResponse(response)
    }

    async function createProduct(
        values: ProductValues,
    ): Promise<ProductModel> {
        if (!createProductRemote) {
            throw new Error("Operasi tambah produk belum tersedia.")
        }
        const response = await createProductRemote(values)
        return ProductModel.fromResponse(response)
    }

    async function updateProduct(
        id: number,
        values: ProductValues,
    ): Promise<ProductModel> {
        if (!updateProductRemote) {
            throw new Error("Operasi ubah produk belum tersedia.")
        }
        const response = await updateProductRemote(id, values)
        return ProductModel.fromResponse(response)
    }

    async function deleteProduct(id: number): Promise<void> {
        if (!deleteProductRemote) {
            throw new Error("Operasi hapus produk belum tersedia.")
        }
        await deleteProductRemote(id)
    }

    return {
        getProductList,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
    }
}
