# Visit Korea Guide

Korea travel blog for foreign visitors. Practical everyday survival tips, not tourist attractions.

## What is this?

A blog platform that helps foreigners navigate daily life in Korea — convenience stores, cafes, restaurants, transportation, and more. Each post includes:

- **Communication Cards**: English / Romanized Korean / Hangul with audio playback
- **Location Links**: Find nearby stores via Naver Map
- **Short Videos**: Embedded YouTube Shorts / Instagram Reels

## Tech Stack

- **Frontend**: Next.js 16 + Tailwind CSS
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth (JWT)
- **Deploy**: Docker + Nginx
- **i18n**: English (default), Korean, +9 languages

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── (en)/          # Default English routes (no prefix)
│   ├── [locale]/      # Other language routes (/ko, /ja, etc.)
│   ├── api/           # API routes
│   └── admin/         # Admin dashboard
├── components/        # React components
├── lib/               # Utilities, auth, i18n, DB
└── types/             # TypeScript types
```

## Deployment

Docker-based deployment with Blue/Green strategy.

```bash
# Build Docker image
docker build -t fc-travel .

# Run container
docker run -d --name travel \
  --env-file .env.production \
  -p 3000:3000 \
  fc-travel
```

## License

Private project.
