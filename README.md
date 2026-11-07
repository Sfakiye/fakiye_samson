# Module 1 Backend Assignment

A Node.js + Express + TypeScript backend API with automated testing and CI.

## Setup

```bash
npm install
```

## Running the Server

```bash
npx ts-node src/server.ts
```

Server runs on `http://localhost:3000`.

## Running Tests

```bash
npx jest
```

## API Endpoints

### Health Check
`GET /api/v1/health`

Returns server status and API version.

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

### Portfolio Performance
`POST /api/v1/portfolio/performance`

Calculates portfolio profit/loss and percentage change.

**Request Body:**
```json
{
  "initialInvestment": 10000,
  "currentValue": 12000
}
```

**Response:**
```json
{
  "initialInvestment": 10000,
  "currentValue": 12000,
  "profitOrLoss": 2000,
  "percentageChange": 20,
  "performanceSummary": "The portfolio has gained significantly with a profit of $2000."
}
```

**Error Response (invalid input):**
```json
{
  "error": "initialInvestment and currentValue must be valid numbers"
}
```

## Project Structure

```
src/
├── app.ts                          # Express app configuration
├── server.ts                       # Server entry point
├── api/v1/routes/                  # API route handlers
└── portfolio/                      # Portfolio calculation logic
test/                                # Jest test suites
.github/workflows/                  # CI configuration (lint + test)
```