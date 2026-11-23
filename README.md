# Manajemen Produk - Tugas 4

Aplikasi React untuk mengelola data produk melalui backend REST API.

## Fitur

- React Router untuk halaman daftar produk, detail produk, dan halaman 404
- Tailwind CSS untuk tampilan responsif
- Menampilkan daftar produk dari backend
- Menambah, mengubah, dan menghapus produk
- Pencarian produk berdasarkan nama
- Halaman detail pada `/products/:id`
- Pesan untuk produk atau URL yang tidak ditemukan

## Struktur Ringkas

```text
app/
  routes.tsx
  entry.tsx
src/
  components/
    atoms/
    molecules/
    organisms/
    templates/
    pages/
  data/product/
  types/
  utils/
```

## Menjalankan Frontend

Persyaratan:

- Node.js 22.12 atau lebih baru
- Backend berjalan pada port 3000

```sh
npm ci
npm run dev
```

Buka `http://127.0.0.1:5173`.

Buat `.env.local` dari `.env.example`:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

## Menjalankan Backend

Backend menggunakan Express, TypeScript, dan Prisma. Jalankan repository backend dengan:

```sh
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

Endpoint utama:

| Method | Endpoint |
|---|---|
| GET | `/products` |
| GET | `/products/:id` |
| POST | `/products` |
| PUT | `/products/:id` |
| DELETE | `/products/:id` |

## Pengujian

```sh
npm test
npm run typecheck
npm run build
```

## Bukti Pengujian Video

https://youtu.be/TGSkRUkjNCM
