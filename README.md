# Budget Tracker

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

A client-side personal-finance dashboard for recording income and expenses, setting category budgets, visualising spending, and reviewing transaction history. All data stays in the browser.

## Overview

Budget Tracker is a React + TypeScript single-page application built with Vite. It is intentionally backend-free: transactions, budgets, and the selected currency are persisted in `localStorage`, so the app works offline after the first load and can be hosted as a static site.

## Features

- Summary cards for total balance, total income, and total expenses
- Add income or expense transactions with amount, category, and description
- Nine expense categories (food, transport, shopping, bills, health, education, travel, entertainment, other)
- Per-category monthly budgets with progress bars and over-budget warnings
- Budget creation, editing by category, and deletion
- Transaction history with text search and category/type filters
- Delete individual transactions
- Expense-by-category pie chart
- Six-month spending-trend bar chart
- Currency selector with multiple currency symbols
- Toast notifications for validation and budget warnings
- Responsive shadcn/ui + Tailwind layout
- Data persistence through a reusable `useLocalStorage` hook

## Tech Stack

| Area | Technology |
|---|---|
| UI | React 18.3, TypeScript 5.5, Vite 5.4 |
| Styling | Tailwind CSS 3.4, shadcn/ui-style Radix components |
| Charts | Recharts 2.12 |
| Icons | lucide-react |
| Forms and validation | react-hook-form, Zod |
| Persistence | Browser `localStorage` |
| Linting | ESLint 9 with TypeScript ESLint |

## Getting Started

### Prerequisites

- Node.js 18+
- npm (a Bun lockfile is also present, but the documented scripts use npm)

### Install and Run

```bash
git clone https://github.com/Atul2512anand/Budget-tracker-atul.git
cd Budget-tracker-atul
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

### Build for Production

```bash
npm run build
npm run preview
```

The production assets are written to `dist/`. Deploy that folder to any static host.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Usage

1. Open the **Add Expense** tab and choose **Income** or **Expense**.
2. Enter an amount, pick a category, add a short description, and submit.
3. Open **Budgets** to set a monthly limit for a category.
4. Use **Dashboard** to see the balance cards, category pie chart, monthly trend, and budget progress.
5. Use **History** to search, filter, or delete transactions.
6. Switch the display currency from the selector in the header.

### Data Storage

The app writes to these browser storage keys:

- `transactions` — income and expense records
- `budgets` — category budgets and their accumulated `spent` value
- `currency` — the selected display currency

Clearing site data, using private browsing, or switching browsers will remove or hide the data. There is no account, sync, or backup.

## Project Structure

```text
Budget-tracker-atul/
├── public/
├── src/
│   ├── components/
│   │   ├── BudgetManager.tsx
│   │   ├── CurrencySelector.tsx
│   │   ├── ExpenseTracker.tsx
│   │   ├── SpendingChart.tsx
│   │   ├── TransactionHistory.tsx
│   │   └── ui/                 # shadcn/Radix primitives
│   ├── contexts/
│   │   └── CurrencyContext.tsx
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── use-toast.ts
│   │   └── use-mobile.tsx
│   ├── lib/
│   ├── pages/
│   │   └── Index.tsx           # Dashboard and state owner
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

## Notes and Limitations

- **Client-side only:** there is no authentication, server, or cloud sync. Data is per browser profile.
- **Currency display only:** changing the currency changes the symbol; amounts are not converted using exchange rates.
- **Budget totals are incremental:** adding an expense increases the matching budget's `spent` value, but deleting a transaction does not subtract it again. Creating a budget after expenses already exist starts its `spent` value at zero.
- **Transaction date:** new transactions are dated with the current day; there is no date picker or back-dating.
- The app is a single-user dashboard and does not separate accounts or months.
- No automated tests are included.

## License

No `LICENSE` file is included. The project is shared for educational and portfolio purposes; add a licence before redistributing it.

## Author

**Atul Anand**  
B.Tech–M.Tech (Cyber Security), National Forensic Sciences University  
GitHub: [@Atul2512anand](https://github.com/Atul2512anand)
