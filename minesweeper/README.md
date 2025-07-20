# Minesweeper NestJS API

A RESTful API for a Minesweeper built with NestJS and MongoDB.

## Description

This project provides a backend API for a Minesweeper, allowing players to create and track boards. The API is built using NestJS framework with TypeScript and uses MongoDB for data persistence.

## Features

- Create new Minesweeper boards
- RESTful API endpoints for minesweeper

## Prerequisites

- Node.js (v14 or higher)
- MongoDB instance running locally or remotely
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd minesweeper
```

2. Install dependencies:
```bash
npm install
```

3. Configure MongoDB connection in `src/config/mongodb.config.ts`

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run start:prod
```

### Build the Application
```bash
npm run build
```

## API Endpoints

The API provides endpoints for managing Minesweeper boards:

- `POST /boards` - Create a new board
- `GET /boards/recent` - Get recent boards
- `GET /boards` - Get all boards with pagination and search

## Testing

Run the test suite:

```bash
# E2E tests
npm run test:e2e

## Project Structure

```
src/
├── boards/        
```
