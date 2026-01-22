# Applicant Facts Module

## Overview

This module handles querying and managing applicant facts from the Supabase database.

## Database

- **Database**: Supabase (PostgreSQL)
- **Table**: `applicant_facts`
- **Connector**: `@supabase/supabase-js`

## Database Schema

| Column     | Type        | Description                            |
| ---------- | ----------- | -------------------------------------- |
| id         | int         | Primary key                            |
| field_id   | text        | Identifier for the fact field          |
| status     | text        | Current status of the fact             |
| source     | text        | Source of the fact data                |
| created_at | timestamptz | Timestamp when record was created      |
| updated_at | timestamptz | Timestamp when record was last updated |
| is_current | bool        | Whether this is the current version    |
| value      | text        | The actual fact value                  |

## Endpoints

### GET /applicant-facts

Query applicant facts from the database.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-------------|--------|----------|--------------------------------|
| trn | string | No | Tax Registration Number |
| phoneNumber | string | No | Phone number to search |

**Response:**

- `200 OK` - Returns an array of `ApplicantFact` objects matching the criteria
- `404 Not Found` - No applicant facts found matching the criteria

**Example Request:**

```
GET /applicant-facts?trn=123456789
GET /applicant-facts?phoneNumber=+18761234567
GET /applicant-facts?trn=123456789&phoneNumber=+18761234567
```

**Example Response:**

```json
[
  {
    "id": 1,
    "field_id": "trn",
    "status": "verified",
    "source": "tax-office",
    "created_at": "2026-01-22T10:00:00Z",
    "updated_at": "2026-01-22T10:00:00Z",
    "is_current": true,
    "value": "123456789"
  }
]
```

## Environment Variables Required

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Files Structure

```
applicant-facts/
├── CONTEXT.md                        # This documentation file
├── applicant-facts.controller.ts     # HTTP endpoint handlers & status codes
├── applicant-facts.controller.spec.ts# Controller tests
├── applicant-facts.module.ts         # Module definition
├── applicant-facts.repository.ts     # Data access layer (Supabase queries)
├── applicant-facts.service.ts        # Business logic layer
├── applicant-facts.service.spec.ts   # Service tests
├── dto/
│   └── get-applicant-fact.dto.ts     # Request validation DTO
└── entities/
    └── applicant-fact.entity.ts      # TypeScript interface for DB entity
```

## Architecture

This module follows a layered architecture:

1. **Controller** (`applicant-facts.controller.ts`)
   - Handles HTTP requests and responses
   - Returns appropriate HTTP status codes (200, 404)
   - Delegates business logic to the service layer

2. **Service** (`applicant-facts.service.ts`)
   - Contains business logic
   - Processes query parameters and builds search criteria
   - Removes duplicate results
   - Delegates data access to the repository layer

3. **Repository** (`applicant-facts.repository.ts`)
   - Handles all database operations
   - Encapsulates Supabase queries
   - Returns raw data to the service layer
