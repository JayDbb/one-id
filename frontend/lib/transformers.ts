/**
 * Data transformers to map server API responses to frontend data structures
 */

import type {
  ApiApplication,
  ApiApplicationDetail,
  ApiPerson,
  ApiPersonDetail,
  ApiFormEntity,
} from './api-types';
import type { Application, Person, Program } from './mock-data';

// ============================================================================
// Application Transformers
// ============================================================================

/**
 * Transforms a server Application to frontend Application format
 * Uses defaults for fields not available in the API
 */
export function transformApplication(
  apiApp: ApiApplication,
  detail?: ApiApplicationDetail,
): Application {
  // Use detail if available, otherwise use basic app data
  const app = detail || apiApp;
  
  // Map status values - server returns strings, ensure they match frontend types
  const statusMap: Record<string, Application['status']> = {
    pending: 'pending',
    'under-review': 'under-review',
    approved: 'approved',
    rejected: 'rejected',
    waitlisted: 'waitlisted',
  };
  
  const mappedStatus = statusMap[app.status.toLowerCase()] || 'pending';
  
  // Use formId as programId since programs are forms
  const programId = detail?.formId || app.applicationName || '';
  
  // Use applicationName as programName, or try to extract from formId if it's a form name
  const programName = app.applicationName || detail?.formId || '';
  
  return {
    id: String(app.id),
    applicantId: detail ? String(detail.applicantId) : String(app.id),
    applicantName: app.applicantName,
    programId, // Maps to formId - programs are forms
    programName, // Maps to applicationName or formId
    status: mappedStatus,
    submittedDate: app.dateApplied,
    lastUpdated: detail?.createdAt || app.dateApplied,
    priority: 'medium', // Default - not available in API
    assignedOfficer: null, // Not available in API
    division: app.division,
    community: '', // Not available in basic API response
    requestedAmount: null, // Not available in API
    approvedAmount: null, // Not available in API
    notes: [], // Not available in API
    documents: [], // Not available in API
  };
}

/**
 * Transforms a server ApplicationDetail to frontend Application format
 */
export function transformApplicationDetail(
  detail: ApiApplicationDetail,
): Application {
  return transformApplication(detail, detail);
}

// ============================================================================
// Person Transformers
// ============================================================================

/**
 * Transforms a server Person to frontend Person format
 * Uses defaults for fields not available in the basic API response
 */
export function transformPerson(apiPerson: ApiPerson): Person {
  // Calculate approval rate
  const approvalRate =
    apiPerson.formsApplied > 0
      ? Math.round((apiPerson.formsQualified / apiPerson.formsApplied) * 100)
      : 0;
  
  // Calculate impact score based on approval rate and forms applied
  // This is a computed field not available in the API
  const impactScore = Math.min(
    100,
    Math.round(approvalRate * 0.7 + Math.min(apiPerson.formsApplied * 2, 30)),
  );
  
  return {
    id: String(apiPerson.id),
    name: apiPerson.fullName,
    submissionRatio: {
      submitted: apiPerson.formsApplied,
      total: 10, // Default - not available in API
    },
    approvalRate,
    impactScore,
    division: apiPerson.division,
    community: '', // Not available in basic API response
    age: 0, // Not available in basic API response
    gender: 'male', // Default - not available in basic API response
    occupation: '', // Not available in basic API response
    maritalStatus: '', // Not available in basic API response
  };
}

/**
 * Transforms a server PersonDetail to frontend Person format
 * Includes additional fields from the detail endpoint
 */
export function transformPersonDetail(detail: ApiPersonDetail): Person {
  // Calculate approval rate
  const approvalRate =
    detail.formsApplied > 0
      ? Math.round((detail.formsQualified / detail.formsApplied) * 100)
      : 0;
  
  // Calculate impact score
  const impactScore = Math.min(
    100,
    Math.round(approvalRate * 0.7 + Math.min(detail.formsApplied * 2, 30)),
  );
  
  // Extract community from location or address if available
  const community =
    detail.location ||
    detail.residentialAddress?.line2?.split(',')[0]?.trim() ||
    '';
  
  // Map gender to frontend format
  const genderMap: Record<string, Person['gender']> = {
    male: 'male',
    female: 'female',
    m: 'male',
    f: 'female',
  };
  const gender = detail.gender
    ? genderMap[detail.gender.toLowerCase()] || 'male'
    : 'male';
  
  return {
    id: String(detail.id),
    name: detail.fullName,
    submissionRatio: {
      submitted: detail.formsApplied,
      total: 10, // Default - not available in API
    },
    approvalRate,
    impactScore,
    division: detail.division || '',
    community,
    age: detail.age || 0,
    gender,
    occupation: detail.occupation || '',
    maritalStatus: detail.maritalStatus || '',
  };
}

// ============================================================================
// Form to Program Transformers
// ============================================================================

/**
 * Infers program category from form name
 */
function inferCategory(formName: string): Program['category'] {
  const nameLower = formName.toLowerCase();
  
  if (nameLower.includes('education') || nameLower.includes('scholarship') || nameLower.includes('school')) {
    return 'education';
  }
  if (nameLower.includes('health') || nameLower.includes('medical') || nameLower.includes('nhf')) {
    return 'healthcare';
  }
  if (nameLower.includes('housing') || nameLower.includes('home')) {
    return 'housing';
  }
  if (nameLower.includes('disaster') || nameLower.includes('relief') || nameLower.includes('emergency')) {
    return 'emergency';
  }
  if (nameLower.includes('water') || nameLower.includes('tank') || nameLower.includes('agricultural') || nameLower.includes('farmer')) {
    return 'in-kind';
  }
  
  return 'cash-transfer'; // Default
}

/**
 * Maps form status to program status
 */
function mapFormStatusToProgramStatus(
  formStatus: 'active' | 'upcoming' | 'closed',
): Program['status'] {
  const statusMap: Record<string, Program['status']> = {
    active: 'active',
    upcoming: 'pilot',
    closed: 'closed',
  };
  
  return statusMap[formStatus] || 'active';
}

/**
 * Transforms a server Form entity to frontend Program format
 * Uses defaults for fields not available in the Forms API
 */
export function transformFormToProgram(apiForm: ApiFormEntity): Program {
  // Infer category from form name
  const category = inferCategory(apiForm.name);
  
  // Map status
  const status = mapFormStatusToProgramStatus(apiForm.status);
  
  // Generate code from shortName or form name
  const code = apiForm.shortName 
    ? apiForm.shortName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
    : apiForm.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 10);
  
  return {
    id: apiForm.id,
    name: apiForm.name,
    code,
    category,
    status,
    description: apiForm.name, // Use form name as description
    ministry: 'Ministry of Labour and Social Security', // Default
    budget: 0, // Not available in API
    disbursed: 0, // Not available in API
    beneficiaries: 0, // Not available in API
    targetBeneficiaries: 0, // Not available in API
    applicationsPending: apiForm.currentApplications,
    applicationsApproved: 0, // Not available in API
    applicationsRejected: 0, // Not available in API
    weight: 10, // Default
    startDate: new Date().toISOString().split('T')[0], // Default to today
    endDate: null, // Default
    coverageAreas: ['Islandwide'], // Default
    eligibilityCriteria: [], // Not available in API
    deliveryRate: 85, // Default - could be calculated from applications if data available
  };
}
