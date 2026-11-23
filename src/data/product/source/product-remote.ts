import ProductListParam from "../param/product-list-param.ts"
import type { ProductValues } from "../../../types/product"

export type ProductRemoteSource = {
    getProductListRemote: (param?: ProductListParam) => Promise<unknown>
    getProductRemote?: (id: number) => Promise<unknown>
    createProductRemote?: (values: ProductValues) => Promise<unknown>
    updateProductRemote?: (
        id: number,
        values: ProductValues,
    ) => Promise<unknown>
    deleteProductRemote?: (id: number) => Promise<unknown>
}

type ProductRemoteOptions = {
    baseUrl?: string
    fetchImpl?: typeof fetch
}

// Sends HTTP requests and returns the unvalidated JSON payload.
export default function ProductRemote({
    baseUrl = "",
    fetchImpl = fetch,
}: ProductRemoteOptions = {}): ProductRemoteSource {
    function requireBaseUrl(): string {
        if (!baseUrl.trim()) {
            throw new Error(
                "Isi VITE_API_BASE_URL di .env.local terlebih dahulu.",
            )
        }

        const url = new URL(baseUrl)
        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("URL API harus menggunakan http atau https.")
        }
        return baseUrl.replace(/\/+$/, "")
    }

    async function requestJson(
        url: URL | string,
        init: RequestInit,
        errorMessage: string,
    ): Promise<unknown> {
        const response = await fetchImpl(url, init)
        if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as
                | { message?: string }
                | null
            throw new Error(
                payload?.message || `${errorMessage} (HTTP ${response.status}).`,
            )
        }
        return response.json()
    }

    async function getProductListRemote(
        param = new ProductListParam(),
    ): Promise<unknown> {
        const url = new URL(`${requireBaseUrl()}/products`)
        url.search = param.toQueryString()
        return requestJson(
            url,
            {
            method: "GET",
            headers: { Accept: "application/json" },
            },
            "Gagal memuat produk",
        )
    }

    async function getProductRemote(id: number): Promise<unknown> {
        return requestJson(
            `${requireBaseUrl()}/products/${id}`,
            { headers: { Accept: "application/json" } },
            "Gagal memuat detail produk",
        )
    }

    async function createProductRemote(values: ProductValues): Promise<unknown> {
        return requestJson(
            `${requireBaseUrl()}/products`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            },
            "Gagal menambahkan produk",
        )
    }

    async function updateProductRemote(
        id: number,
        values: ProductValues,
    ): Promise<unknown> {
        return requestJson(
            `${requireBaseUrl()}/products/${id}`,
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            },
            "Gagal memperbarui produk",
        )
    }

    async function deleteProductRemote(id: number): Promise<unknown> {
        return requestJson(
            `${requireBaseUrl()}/products/${id}`,
            { method: "DELETE", headers: { Accept: "application/json" } },
            "Gagal menghapus produk",
        )
    }

    return {
        getProductListRemote,
        getProductRemote,
        createProductRemote,
        updateProductRemote,
        deleteProductRemote,
    }
}
