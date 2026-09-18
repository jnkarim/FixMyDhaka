const API_BASE_URL =
  import.meta.env
    .VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

export async function analyzeReport({
  description,
  location,
  photo,
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

  if (photo) {
    formData.append(
      "photo",
      photo
    );
  }

  const response =
    await fetch(
      `${API_BASE_URL}/api/reports/analyze`,
      {
        method: "POST",
        body: formData,
      }
    );

  if (!response.ok) {
    let message =
      "Unable to analyze the report.";

    try {
      const data =
        await response.json();

      if (data?.detail) {
        message =
          data.detail;
      }
    } catch {
      // Keep fallback error
    }

    throw new Error(
      message
    );
  }

  return response.json();
}