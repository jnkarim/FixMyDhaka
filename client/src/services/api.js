const API_BASE_URL =
  import.meta.env
    .VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";


function formatRelativeTime(
  value
) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  const timestamp =
    date.getTime();

  if (
    Number.isNaN(
      timestamp
    )
  ) {
    return "";
  }

  const difference =
    Date.now() -
    timestamp;

  const minutes =
    Math.floor(
      difference /
        60000
    );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${
      minutes === 1
        ? ""
        : "s"
    } ago`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24) {
    return `${hours} hour${
      hours === 1
        ? ""
        : "s"
    } ago`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  return `${days} day${
    days === 1
      ? ""
      : "s"
  } ago`;
}


function normalizeReport(
  report
) {
  const photoUrl =
    report.photo_url
      ? `${API_BASE_URL}${report.photo_url}`
      : null;

  return {
    id:
      report.public_id,

    reportId:
      report.public_id,

    title:
      report.title,

    description:
      report.description,

    location:
      report.location,

    lat:
      report.latitude,

    lng:
      report.longitude,

    category:
      report.category,

    categoryConfidence:
      report.category_confidence,

    jurisdiction:
      report.jurisdiction,

    authority:
      report.authority,

    authoritySource:
      report.authority_source,

    authorityEvidence:
      report.authority_evidence,

    evidenceSufficient:
      report.evidence_sufficient,

    status:
      report.issue_status,

    routingStatus:
      report.routing_status,

    officialSubmissionStatus:
      report.official_submission_status,

    reportingMethod:
      report.reporting_method,

    reportingUrl:
      report.reporting_url,

    nextStep:
      report.next_step,

    copyableComplaint:
      report.copyable_complaint,

    visualEvidence:
      report.visual_evidence,

    photoUrl,

    createdAt:
      report.created_at,

    updatedAt:
      report.updated_at,

    time:
      formatRelativeTime(
        report.created_at
      ),
  };
}


async function readError(
  response
) {
  try {
    const data =
      await response.json();

    if (
      typeof data.detail ===
      "string"
    ) {
      return data.detail;
    }

    return JSON.stringify(
      data.detail
    );
  } catch {
    return (
      `Request failed with `
      + `status ${response.status}.`
    );
  }
}


export async function analyzeReport({
  description,
  location,
  photo,
  latitude,
  longitude,
}) {
  const formData =
    new FormData();

  formData.append(
    "description",
    description
  );

  formData.append(
    "location",
    location
  );

  if (
    latitude !== null &&
    latitude !== undefined
  ) {
    formData.append(
      "latitude",
      String(latitude)
    );
  }

  if (
    longitude !== null &&
    longitude !== undefined
  ) {
    formData.append(
      "longitude",
      String(longitude)
    );
  }

  if (photo) {
    formData.append(
      "photo",
      photo
    );
  }

  let response;

  try {
    response =
      await fetch(
        `${API_BASE_URL}/api/reports/analyze`,
        {
          method:
            "POST",

          body:
            formData,
        }
      );
  } catch {
    throw new Error(
      "Cannot connect to the FixMyDhaka backend."
    );
  }

  if (!response.ok) {
    throw new Error(
      await readError(
        response
      )
    );
  }

  return response.json();
}


export async function getReports() {
  let response;

  try {
    response =
      await fetch(
        `${API_BASE_URL}/api/reports`
      );
  } catch {
    throw new Error(
      "Cannot load reports."
    );
  }

  if (!response.ok) {
    throw new Error(
      await readError(
        response
      )
    );
  }

  const data =
    await response.json();

  return (
    data.reports || []
  ).map(
    normalizeReport
  );
}


export async function getReport(
  reportId
) {
  const response =
    await fetch(
      `${API_BASE_URL}/api/reports/${reportId}`
    );

  if (!response.ok) {
    throw new Error(
      await readError(
        response
      )
    );
  }

  const report =
    await response.json();

  return normalizeReport(
    report
  );
}


export async function updateReportStatus(
  reportId,
  updates
) {
  const response =
    await fetch(
      `${API_BASE_URL}/api/reports/${reportId}`,
      {
        method:
          "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            updates
          ),
      }
    );

  if (!response.ok) {
    throw new Error(
      await readError(
        response
      )
    );
  }

  const report =
    await response.json();

  return normalizeReport(
    report
  );
}