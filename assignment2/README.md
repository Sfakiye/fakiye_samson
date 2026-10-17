# Module 2 Assignment - Support Ticket Management API

A Node.js + Express + TypeScript REST API for managing support tickets, including a derived urgency scoring endpoint.

## Setup

npm install

## Running the Server

npx tsx src/server.ts

Server runs on http://localhost:3000

## Running Tests

npx jest

## API Endpoints

### Health Check
GET /api/v1/health

### Get All Tickets
GET /api/v1/tickets

### Get Ticket by ID
GET /api/v1/tickets/:id

### Create Ticket
POST /api/v1/tickets

Request Body:
{
  "title": "Login page not loading",
  "description": "Users report a blank screen",
  "priority": "critical"
}

Required fields: title, description, priority (must be one of: critical, high, medium, low). New tickets default to status: "open".

### Update Ticket
PUT /api/v1/tickets/:id

Accepts any combination of title, description, priority, status (status must be one of: open, in-progress, resolved). Only provided fields are changed.

### Delete Ticket
DELETE /api/v1/tickets/:id

### Calculate Ticket Urgency
GET /api/v1/tickets/:id/urgency

Returns a calculated urgency score and level based on ticket priority and age.

Urgency formula:
urgencyScore = basePriorityScore + (ticketAge in days * 5)

Base scores: critical=50, high=30, medium=20, low=10.

Resolved tickets always return urgencyScore: 0 with level "Minimal. Ticket resolved."

Urgency levels:
- Score less than 30: Low urgency. Address when capacity allows.
- Score 30 to 54: Moderate. Schedule for attention.
- Score 55 to 79: High urgency. Prioritize resolution.
- Score 80 or more: Critical. Immediate attention required.

## Project Structure

src/
  app.ts
  server.ts
  api/v1/
    routes/
    controllers/
    services/
    models/
  constants/
  data/
test/
.github/workflows/assignment2-ci.yml
