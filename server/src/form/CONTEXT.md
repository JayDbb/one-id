# Form Module

## Overview

This module exposes form names and form policies from the Supabase database.

## Database

- Database: Supabase (PostgreSQL)
- Table: `form_criteria`
- Connector: `@supabase/supabase-js`

## Database Schema (partial)

| Column    | Type | Description      |
| --------- | ---- | ---------------- |
| form_name | text | Name of the form |

## Endpoints

### GET /form

Return form names from `form_criteria`.

Query Parameters:
| Parameter | Type   | Required | Description                        |
| --------- | ------ | -------- | ---------------------------------- |
| formName  | string | No       | Optional exact match on form name  |

Response:

- `200 OK` - Returns an array of form name strings
- `404 Not Found` - No form names found matching the criteria

Example Request:

```
GET /form
GET /form?formName=employment_application
```

Example Response:

```json
["employment_application", "visa_intake"]
```

### GET /form/requirements

Return the `field_registry` rows for required fields that have not yet been captured for the applicant.

Query Parameters:
| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| form_name   | string | Yes      | Form name used to load policy |
| phone_number | string | No       | Phone number used to resolve applicant |

Response:

- `200 OK` - Returns an array of missing `field_registry` rows
- `400 Bad Request` - Missing `form_name`
- `404 Not Found` - No policy found matching the criteria

Example Request:

```
GET /form/requirements?form_name=employment_application&phone_number=15551234567
```

Example Response:

```json
[
  {
    "field_id": "applicant.full_name",
    "label": "Full name"
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
form/
├── CONTEXT.md                # This documentation file
├── form.controller.ts        # HTTP endpoint handlers & status codes
├── form.controller.spec.ts   # Controller tests
├── form.module.ts            # Module definition
├── form.repository.ts        # Data access layer (Supabase queries)
├── form.service.ts           # Business logic layer
├── form.service.spec.ts      # Service tests
├── dto/
│   ├── get-form.dto.ts       # Request validation DTO
│   └── get-form-requirements.dto.ts # Request validation DTO
└── entities/
    └── form-name.entity.ts   # TypeScript interface for DB rows
```

## Architecture

This module follows a layered architecture:

1. **Controller** (`form.controller.ts`)
   - Handles HTTP requests and responses
   - Returns appropriate HTTP status codes (200, 404)
   - Delegates business logic to the service layer

2. **Service** (`form.service.ts`)
   - Contains business logic
   - Deduplicates form names
   - Parses policy JSON when needed
   - Delegates data access to the repository layer

3. **Repository** (`form.repository.ts`)
   - Handles all database operations
   - Encapsulates Supabase queries
   - Returns raw data to the service layer
