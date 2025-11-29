This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Variables & Local Validation

This project uses [dotenv-safe](https://github.com/rolodato/dotenv-safe) for local environment variable validation. All required variables must be listed in `.env.example` and set in your `.env.local` file.

When running locally (`npm run dev`, `npm run build`, or `npm run start`), `dotenv-safe` will check that all required variables are present and not empty. If any are missing, the process will exit with an error.

**Steps:**

1. Copy `.env.example` to `.env.local` and fill in the values:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and set your values
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

For production/staging, set environment variables using your deployment platform (e.g., Azure App Service settings, CI/CD secrets). `.env.local` is only used for local development and is ignored by git.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
