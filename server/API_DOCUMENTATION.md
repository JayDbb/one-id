# One ID API Documentation

## Base Information

- **Base URL**: `http://localhost:3000` (development)
- **API Version**: v1
- **Content-Type**: `application/json` (except for file uploads)
- **Authentication**: Currently none (add as needed)

## Table of Contents

1. [Health Check](#health-check)
2. [Applicant Facts](#applicant-facts)
3. [Applications](#applications)
4. [People](#people)
5. [Forms](#forms)
6. [Form Requirements](#form-requirements)
7. [Form Registry](#form-registry)
8. [Dashboard](#dashboard)
9. [Eligibility](#eligibility)
10. [Document Upload](#document-upload)

---

## Health Check

### GET /

Check if the API is running.

**Response:**
- **Status Code**: `200 OK`
- **Body**: `string` - "Hello World!" message

**Example:**
```bash
curl http://localhost:3000/
```

---

## Applicant Facts

### POST /applicant-facts

Create a new applicant fact entry. This endpoint is used to store applicant data such as TRN, phone numbers, and other field values.

**Request Body:**
```json
{
  "field_id": "string (required)",
  "value": ["string"] (required, array of strings),
  "phone_number": "string (required)"
}
```

**Request Validation:**
- `field_id`: Must be a non-empty string
- `value`: Must be a non-empty array of strings
- `phone_number`: Must be a non-empty string (will be sanitized to remove non-numeric characters)

**Response:**
- **Status Code**: `201 Created`
- **Body**: `ApplicantFact` object

**ApplicantFact Interface:**
```typescript
{
  id: number;
  field_id: string;
  status: string;           // Default: "pending"
  source: string;           // Default: "whatsapp"
  created_at: string;       // ISO timestamp
  updated_at: string;       // ISO timestamp
  is_current: boolean;      // Default: true
  value: string[];          // Array of field values
  user_id: string;         // UUID, auto-generated or retrieved from phone number
}
```

**Notes:**
- Phone numbers are automatically sanitized (non-numeric characters removed)
- If a `user_id` exists for the given phone number, it will be reused; otherwise, a new UUID is generated
- The service automatically handles user_id lookup and creation

**Example Request:**
```bash
curl -X POST http://localhost:3000/applicant-facts \
  -H "Content-Type: application/json" \
  -d '{
    "field_id": "applicant.tax_registration_number",
    "value": ["123-456-789"],
    "phone_number": "+1 (876) 555-1234"
  }'
```

**Example Response:**
```json
{
  "id": 1,
  "field_id": "applicant.tax_registration_number",
  "status": "pending",
  "source": "whatsapp",
  "created_at": "2024-11-26T10:00:00.000Z",
  "updated_at": "2024-11-26T10:00:00.000Z",
  "is_current": true,
  "value": ["123-456-789"],
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### GET /applicant-facts

Retrieve applicant facts by TRN or phone number.

**Query Parameters:**
- `trn` (optional, string): Tax Registration Number to search for
- `phoneNumber` (optional, string): Phone number to search for

**Request Validation:**
- At least one of `trn` or `phoneNumber` must be provided (implicitly)

**Response:**
- **Status Code**: `200 OK` if results found
- **Status Code**: `404 Not Found` if no results found
- **Body**: Array of `ApplicantFact` objects

**Example Request:**
```bash
curl "http://localhost:3000/applicant-facts?trn=123-456-789"
```

**Example Response:**
```json
[
  {
    "id": 1,
    "field_id": "applicant.tax_registration_number",
    "status": "pending",
    "source": "whatsapp",
    "created_at": "2024-11-26T10:00:00.000Z",
    "updated_at": "2024-11-26T10:00:00.000Z",
    "is_current": true,
    "value": ["123-456-789"],
    "user_id": "550e8400-e29b-41d4-a716-446655440000"
  }
]
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "No applicant facts found matching the criteria"
}
```

---

### PUT /applicant-facts

Update an existing applicant fact or create a new one if it doesn't exist (upsert behavior).

**Request Body:**
```json
{
  "field_id": "string (required)",
  "value": ["string"] (required, array of strings),
  "phone_number": "string (required)"
}
```

**Request Validation:**
- `field_id`: Must be a non-empty string
- `value`: Must be a non-empty array of strings
- `phone_number`: Must be a non-empty string (will be sanitized)

**Response:**
- **Status Code**: `200 OK`
- **Body**: Updated or created `ApplicantFact` object

**Notes:**
- Phone numbers are automatically sanitized (non-numeric characters removed)
- The endpoint looks up the `user_id` from the phone number
- If no `user_id` exists for the phone number, a new UUID is generated
- If the field being updated is `applicant.phone_number`, the value array is also sanitized
- **Upsert behavior**: If no applicant fact exists for the given `user_id` and `field_id`, a new record is created. If it exists, the `value` is updated and `updated_at` is set to the current timestamp
- This endpoint will never return 404 - it always creates or updates

**Example Request:**
```bash
curl -X PUT http://localhost:3000/applicant-facts \
  -H "Content-Type: application/json" \
  -d '{
    "field_id": "applicant.tax_registration_number",
    "value": ["987-654-321"],
    "phone_number": "+1 (876) 555-1234"
  }'
```

**Example Response (Updated):**
```json
{
  "id": 1,
  "field_id": "applicant.tax_registration_number",
  "status": "pending",
  "source": "whatsapp",
  "created_at": "2024-11-26T10:00:00.000Z",
  "updated_at": "2024-11-26T15:30:00.000Z",
  "is_current": true,
  "value": ["987-654-321"],
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Example Response (Created - if didn't exist):**
```json
{
  "id": 2,
  "field_id": "applicant.tax_registration_number",
  "status": "pending",
  "source": "whatsapp",
  "created_at": "2024-11-26T15:30:00.000Z",
  "updated_at": "2024-11-26T15:30:00.000Z",
  "is_current": true,
  "value": ["987-654-321"],
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Applications

### GET /applications

Retrieve a paginated list of applications with optional filtering.

**Query Parameters:**
- `status` (optional, string): Filter by application status
- `division` (optional, string): Filter by division/constituency
- `form_id` (optional, string): Filter by form ID
- `dateFrom` (optional, ISO date string): Filter applications from this date
- `dateTo` (optional, ISO date string): Filter applications to this date
- `page` (optional, number, default: 1): Page number (min: 1)
- `limit` (optional, number, default: 20): Items per page (min: 1, max: 100)

**Response:**
- **Status Code**: `200 OK`
- **Body**: Paginated response object

**Response Structure:**
```typescript
{
  data: Application[];
  total: number;
  page: number;
  limit: number;
}
```

**Application Interface:**
```typescript
{
  id: number;
  applicantName: string;
  citizenId: string;
  applicationName: string;
  dateApplied: string;
  division: string;
  status: string;
}
```

**Example Request:**
```bash
curl "http://localhost:3000/applications?status=pending&page=1&limit=20"
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "applicantName": "Michael T. Davis",
      "citizenId": "147-258",
      "applicationName": "Scholarship Program 2024",
      "dateApplied": "2024-11-26",
      "division": "Manchester Southern",
      "status": "pending"
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 20
}
```

---

### GET /applications/:id

Retrieve detailed information about a specific application.

**Path Parameters:**
- `id` (required, string): Application ID

**Response:**
- **Status Code**: `200 OK` if found
- **Status Code**: `404 Not Found` if not found
- **Body**: `ApplicationDetail` object

**ApplicationDetail Interface:**
```typescript
{
  id: number;
  applicantName: string;
  citizenId: string;
  applicationName: string;
  dateApplied: string;
  division: string;
  status: string;
  applicantId: number;
  formId: string;
  createdAt: string;
  applicantFacts?: Record<string, any>;  // Additional applicant data
  formPolicy?: any;                       // Form policy/requirements
}
```

**Example Request:**
```bash
curl http://localhost:3000/applications/1
```

**Example Response:**
```json
{
  "id": 1,
  "applicantName": "Michael T. Davis",
  "citizenId": "147-258",
  "applicationName": "Scholarship Program 2024",
  "dateApplied": "2024-11-26",
  "division": "Manchester Southern",
  "status": "pending",
  "applicantId": 123,
  "formId": "scholarship_2024",
  "createdAt": "2024-11-26T10:00:00.000Z",
  "applicantFacts": {
    "applicant.tax_registration_number": ["123-456-789"],
    "applicant.phone_number": ["18765551234"]
  },
  "formPolicy": {
    "version": 1,
    "requirements": [...]
  }
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Application not found"
}
```

---

### POST /applications

Submit a new application.

**Request Body:**
```json
{
  "form_id": "string (required)",
  "applicant_id": "string (required)",
  "status": "string (optional, default: 'pending')"
}
```

**Request Validation:**
- `form_id`: Must be a non-empty string
- `applicant_id`: Must be a non-empty string
- `status`: Optional string (defaults to "pending" if not provided)

**Response:**
- **Status Code**: `201 Created` on success
- **Status Code**: `400 Bad Request` on validation error or business logic failure
- **Body**: Success response object

**Response Structure:**
```typescript
{
  message: string;
  application: any;  // Created application object
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -d '{
    "form_id": "scholarship_2024",
    "applicant_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "pending"
  }'
```

**Example Response:**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "id": 1,
    "form_id": "scholarship_2024",
    "applicant_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "pending",
    "created_at": "2024-11-26T10:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "Failed to submit application: [error details]"
}
```

---

## People

### GET /people

Retrieve a paginated list of people with optional filtering and search.

**Query Parameters:**
- `search` (optional, string): Search by name or ID
- `division` (optional, string): Filter by division/constituency
- `program` (optional, string): Filter by program
- `status` (optional, string): Filter by status
- `page` (optional, number, default: 1): Page number (min: 1)
- `limit` (optional, number, default: 20): Items per page (min: 1, max: 100)

**Response:**
- **Status Code**: `200 OK`
- **Body**: Paginated response object

**Response Structure:**
```typescript
{
  data: Person[];
  total: number;
  page: number;
  limit: number;
}
```

**Person Interface:**
```typescript
{
  id: number | string;
  trn?: string;
  fullName: string;
  phoneNumber?: string;
  division: string;
  formsApplied: number;
  formsQualified: number;
}
```

**Example Request:**
```bash
curl "http://localhost:3000/people?search=Michael&division=Manchester%20Southern&page=1&limit=20"
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "trn": "147-258",
      "fullName": "Michael T. Davis",
      "phoneNumber": "+1 (876) 555-7890",
      "division": "Manchester Southern",
      "formsApplied": 3,
      "formsQualified": 2
    }
  ],
  "total": 258,
  "page": 1,
  "limit": 20
}
```

---

### GET /people/:id

Retrieve detailed information about a specific person, including their applications and qualifications.

**Path Parameters:**
- `id` (required, string): Person ID

**Response:**
- **Status Code**: `200 OK` if found
- **Status Code**: `404 Not Found` if not found
- **Body**: `PersonDetail` object

**PersonDetail Interface:**
```typescript
{
  id: number | string;
  fullName: string;
  phoneNumber?: string;
  trn?: string;
  dateOfBirth: string;
  age?: number;
  gender?: string;
  nationality?: string;
  nationalId?: string;
  maritalStatus?: string;
  occupation?: string;
  division?: string;
  location?: string;
  residentialAddress?: {
    line1: string;
    line2: string;
  };
  primaryPhone?: string;
  emailAddress?: string;
  formsApplied: number;
  formsQualified: number;
  applications: Application[];      // Array of submitted applications
  qualifications: Qualification[];  // Array of program qualifications
}
```

**Application Interface (in PersonDetail):**
```typescript
{
  id: number;
  formName: string;
  status: string;
  submittedDate: string;
  decisionDate?: string | null;
}
```

**Qualification Interface:**
```typescript
{
  programName: string;
  qualified: boolean;
  reason: string;
}
```

**Example Request:**
```bash
curl http://localhost:3000/people/1
```

**Example Response:**
```json
{
  "id": 1,
  "fullName": "Michael T. Davis",
  "phoneNumber": "+1 (876) 555-7890",
  "trn": "147-258",
  "dateOfBirth": "Nov 14, 1987",
  "age": 38,
  "gender": "Male",
  "nationality": "Jamaican",
  "nationalId": "147258369",
  "maritalStatus": "N/A",
  "occupation": "N/A",
  "division": "Manchester Southern",
  "location": "Porus",
  "residentialAddress": {
    "line1": "34 Willow Road",
    "line2": "34 Willow Road, Porus, Manchester Southern"
  },
  "primaryPhone": "+1 (876) 555-7890",
  "emailAddress": "N/A",
  "formsApplied": 3,
  "formsQualified": 2,
  "applications": [
    {
      "id": 1,
      "formName": "Scholarship Program 2024",
      "status": "approved",
      "submittedDate": "Oct 15, 2024",
      "decisionDate": "Nov 1, 2024"
    }
  ],
  "qualifications": [
    {
      "programName": "Scholarship Program 2024",
      "qualified": true,
      "reason": "Meets all eligibility criteria"
    }
  ]
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Person not found"
}
```

---

## Forms

### GET /form

Retrieve form names. Can be filtered by form name.

**Query Parameters:**
- `formName` (optional, string): Filter by form name (partial match)

**Response:**
- **Status Code**: `200 OK` if results found
- **Status Code**: `404 Not Found` if no results found
- **Body**: Array of form name strings

**Example Request:**
```bash
curl "http://localhost:3000/form?formName=scholarship"
```

**Example Response:**
```json
[
  "scholarship_2024",
  "scholarship_2025"
]
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "No form names found matching the criteria"
}
```

---

### GET /form/requirements

Retrieve form requirements/policy for a specific form or phone number.

**Query Parameters:**
- `form_name` (optional, string): Form name to get requirements for
- `phone_number` (optional, string): Phone number to get requirements for

**Request Validation:**
- At least one of `form_name` or `phone_number` must be provided

**Response:**
- **Status Code**: `200 OK` if found
- **Status Code**: `400 Bad Request` if neither parameter provided
- **Status Code**: `404 Not Found` if no form policy found
- **Body**: Array of field requirement objects

**Response Structure:**
```typescript
Record<string, unknown>[]  // Array of field requirement objects
```

**Example Request:**
```bash
curl "http://localhost:3000/form/requirements?form_name=scholarship_2024"
```

**Example Response:**
```json
[
  {
    "field_id": "applicant.full_name",
    "title": "Full name",
    "type": "text",
    "validation": {
      "required": true,
      "minLength": 2
    },
    "prompt_template": "Please provide your full name"
  },
  {
    "field_id": "applicant.tax_registration_number",
    "title": "TRN",
    "type": "text",
    "validation": {
      "required": true,
      "pattern": "^[0-9]{3}-[0-9]{3}-[0-9]{3}$"
    }
  }
]
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "form_name or phone_number is required"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "No form policy found matching the criteria"
}
```

---

### GET /forms

Retrieve all forms (alternative endpoint).

**Response:**
- **Status Code**: `200 OK`
- **Body**: Array of `Form` objects

**Form Interface:**
```typescript
{
  form_name: string;
  version: number;
  policy: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

**Example Request:**
```bash
curl http://localhost:3000/forms
```

**Example Response:**
```json
[
  {
    "form_name": "scholarship_2024",
    "version": 3,
    "policy": {
      "requirements": [...]
    },
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-11-01T00:00:00.000Z"
  }
]
```

---

## Form Registry

### GET /form-registry

Retrieve field registry entries. The field registry contains metadata about all available form fields.

**Query Parameters:**
- `fields` (optional, string): Comma-separated list of fields to include in response

**Available Fields:**
- `field_id` - The unique identifier for the field
- `title` - Human-readable title
- `prompt_template` - Template for prompting users
- `type` - Field type (text, number, date, etc.)
- `validation` - Validation rules (JSON)
- `normalizers` - Data normalization rules (JSON)
- `aliases` - Alternative field names (JSON)
- `category` - Field category

**Request Validation:**
- `fields`: If provided, must only contain valid field names from the list above
- Invalid fields will result in a 400 error
- The `constraint` field is ignored if provided

**Response:**
- **Status Code**: `200 OK` if results found
- **Status Code**: `400 Bad Request` if invalid fields specified
- **Status Code**: `404 Not Found` if no results found
- **Body**: Array of field registry objects

**Example Request (all fields):**
```bash
curl http://localhost:3000/form-registry
```

**Example Request (specific fields):**
```bash
curl "http://localhost:3000/form-registry?fields=field_id,title,type,validation"
```

**Example Response:**
```json
[
  {
    "field_id": "applicant.full_name",
    "title": "Full Name",
    "prompt_template": "Please enter your full name",
    "type": "text",
    "validation": {
      "required": true,
      "minLength": 2,
      "maxLength": 100
    },
    "normalizers": [],
    "aliases": ["name", "fullname"],
    "category": "personal_info"
  },
  {
    "field_id": "applicant.tax_registration_number",
    "title": "Tax Registration Number",
    "prompt_template": "Please enter your TRN",
    "type": "text",
    "validation": {
      "required": true,
      "pattern": "^[0-9]{3}-[0-9]{3}-[0-9]{3}$"
    },
    "normalizers": ["trim", "uppercase"],
    "aliases": ["trn"],
    "category": "identification"
  }
]
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "Invalid fields: invalid_field_name"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "No form registry rows found"
}
```

---

## Dashboard

### GET /dashboard/stats

Get dashboard statistics including total applications, active forms, total applicants, and pending reviews.

**Response:**
- **Status Code**: `200 OK`
- **Body**: Dashboard statistics object

**Example Request:**
```bash
curl http://localhost:3000/dashboard/stats
```

**Example Response:**
```json
{
  "totalApplications": 156,
  "activeForms": 2,
  "totalApplicants": 258,
  "pendingReview": 40
}
```

---

### GET /dashboard/analytics

Get application analytics data for charts (typically last 7 days).

**Response:**
- **Status Code**: `200 OK`
- **Body**: Analytics data object

**Example Request:**
```bash
curl http://localhost:3000/dashboard/analytics
```

**Example Response:**
```json
{
  "days": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "data": [12, 45, 38, 52, 28, 35, 42],
  "total": 252
}
```

---

### GET /dashboard/recent-applications

Get recent applications for the dashboard.

**Response:**
- **Status Code**: `200 OK`
- **Body**: Array of recent application objects

**Example Request:**
```bash
curl http://localhost:3000/dashboard/recent-applications
```

**Example Response:**
```json
[
  {
    "formId": "FORM-2024-001",
    "applicants": 3,
    "status": "pending",
    "createdAt": "2024-11-26"
  }
]
```

---

### GET /dashboard/application-status

Get application status distribution (approved, in progress, pending counts).

**Response:**
- **Status Code**: `200 OK`
- **Body**: Application status object

**Example Request:**
```bash
curl http://localhost:3000/dashboard/application-status
```

**Example Response:**
```json
{
  "total": 156,
  "completed": 64,
  "inProgress": 52,
  "pending": 40,
  "completedPercent": 41
}
```

---

### GET /dashboard/active-forms

Get list of active forms with their versions and applicant counts.

**Response:**
- **Status Code**: `200 OK`
- **Body**: Array of active form objects

**Example Request:**
```bash
curl http://localhost:3000/dashboard/active-forms
```

**Example Response:**
```json
[
  {
    "formName": "scholarship_2024",
    "version": 3,
    "isActive": true,
    "applicants": 124
  }
]
```

---

## Eligibility

### GET /check-eligibility

Check which forms/programs a person is eligible for based on their phone number.

**Query Parameters:**
- `phone_number` (required, string): Phone number to check eligibility for

**Request Validation:**
- `phone_number`: Must be provided (required)

**Response:**
- **Status Code**: `200 OK`
- **Status Code**: `400 Bad Request` if phone_number is missing
- **Body**: Array of form names (strings) that the person is eligible for

**Example Request:**
```bash
curl "http://localhost:3000/check-eligibility?phone_number=18765551234"
```

**Example Response:**
```json
[
  "scholarship_2024",
  "housing_grant_2024"
]
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "phone_number is required"
}
```

---

## Document Upload

### POST /upload-documents

Upload a document/image to Supabase Storage and save the path to applicant_facts.

**Content-Type**: `multipart/form-data`

**Form Data Fields:**
- `image` (required, file): Image file to upload (supports: jpg, jpeg, png, gif, webp)
- `field_id` (required, string): Field ID to associate the document with
- `phone_number` (required, string): Phone number of the applicant

**Request Validation:**
- `image`: Must be a valid image file
- `field_id`: Must be a non-empty string
- `phone_number`: Must be a non-empty string (will be sanitized)

**Response:**
- **Status Code**: `200 OK` on success
- **Status Code**: `400 Bad Request` on validation error or upload failure
- **Body**: Success response object

**Response Structure:**
```typescript
{
  success: boolean;
  url: string;        // Public URL of uploaded document
  message: string;
}
```

**Notes:**
- Phone numbers are automatically sanitized (non-numeric characters removed)
- Files are organized in Supabase Storage as: `{phoneNumber}/{fieldId}/{uuid}.{ext}`
- The document URL is saved to `applicant_facts` table with the provided `field_id`
- File extension is determined from the MIME type
- Supported formats: JPEG, PNG, GIF, WebP (defaults to JPG if unknown)

**Example Request (using curl):**
```bash
curl -X POST http://localhost:3000/upload-documents \
  -F "image=@/path/to/document.jpg" \
  -F "field_id=applicant.national_id_document" \
  -F "phone_number=+1 (876) 555-1234"
```

**Example Request (using JavaScript/FormData):**
```javascript
const form = new FormData();
form.append('image', imageBuffer, {
  filename: 'document.jpg',
  contentType: 'image/jpeg'
});
form.append('field_id', 'applicant.national_id_document');
form.append('phone_number', '18765551234');

const response = await fetch('http://localhost:3000/upload-documents', {
  method: 'POST',
  body: form
});
```

**Example Response:**
```json
{
  "success": true,
  "url": "https://[supabase-project].supabase.co/storage/v1/object/public/documents/18765551234/applicant.national_id_document/550e8400-e29b-41d4-a716-446655440000.jpg",
  "message": "Document uploaded successfully"
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "field_id and phone_number are required in form data"
}
```

or

```json
{
  "statusCode": 400,
  "message": "No file provided"
}
```

or

```json
{
  "statusCode": 400,
  "message": "Failed to upload to Supabase: [error details]"
}
```

---

## Error Responses

All endpoints follow a consistent error response format:

**Standard Error Response:**
```json
{
  "statusCode": number,
  "message": string,
  "error": string (optional)
}
```

**Common HTTP Status Codes:**
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data or validation error
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Data Types and Conventions

### Phone Numbers
- Phone numbers are automatically sanitized to remove all non-numeric characters
- Example: `"+1 (876) 555-1234"` becomes `"18765551234"`

### Dates
- Dates are returned in ISO 8601 format: `"2024-11-26T10:00:00.000Z"`
- Date strings in query parameters should also be in ISO format

### Pagination
- Default page: `1`
- Default limit: `20` (varies by endpoint)
- Maximum limit: `100` (where applicable)
- Response includes `total`, `page`, and `limit` for pagination metadata

### Field IDs
Common field ID patterns:
- `applicant.tax_registration_number` - TRN
- `applicant.phone_number` - Phone number
- `applicant.full_name` - Full name
- `applicant.national_id_document` - National ID document
- Custom field IDs as defined in `field_registry` table

---

## Environment Variables

Required environment variables for the server:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
# Optional: For storage operations that require service role
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3000  # Optional, defaults to 3000
```

---

## Supabase Storage Configuration

For the document upload endpoint to work:

1. **Create a Storage Bucket:**
   - Bucket name: `documents` (or update `BUCKET_NAME` in `documents.service.ts`)
   - Set bucket to public or configure RLS policies as needed

2. **Bucket Policies:**
   - Ensure the bucket allows uploads
   - Configure appropriate read/write permissions

3. **Service Role Key:**
   - For private buckets, you may need to use `SUPABASE_SERVICE_ROLE_KEY` instead of `SUPABASE_ANON_KEY` for uploads

---

## Notes

- All endpoints use NestJS validation pipes for request validation
- Phone numbers are consistently sanitized across all endpoints
- User IDs are automatically generated or retrieved based on phone numbers
- The API uses Supabase as the backend database and storage solution
- CORS is enabled for all origins in development (configure for production)

---

## Changelog

### Version 1.0.0
- Initial API documentation
- All endpoints documented
- Document upload endpoint added
