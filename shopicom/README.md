This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# BACKEND

### ADMIN ONLY ROUTES:

- Home Page Banner:
  - POST: /api/content/banner
  - DELETE: /api/content/banner
- Populate Data:
  - GET: /api/populate

### Authentication routes

- POST: /api/login
- POST: /api/register
- POST: /api/verifyseller

### Cart routes

- POST: /api/cart/add
- POST: /api/cart/delete
- GET: /api/cart/read

### Checkout route

- GET: /api/checkout

### Product routes

- GET: /api/products
- POST: /api/products/update
- POST: /api/products/update/category

- GET: /api/products/read/myproducts
- GET: /api/products/read/bestsellers

- POST: /api/products/create

### UploadThings route

- GET, POST: /api/uploadthing

### User routes

- GET: /api/user/getorderqueue
- GET: /api/user/getprofile
- GET: /api/user/orders
- PATCH: /api/user/orders/received
- POST: /api/user/updateprofile

### Webhooks route

- Stripe webhook
  - POST: /api/webhooks
