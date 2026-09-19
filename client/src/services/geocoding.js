const NOMINATIM_BASE_URL =
  "https://nominatim.openstreetmap.org";


function uniqueValues(values) {
  return [
    ...new Set(
      values.filter(Boolean)
    ),
  ];
}


export function getCompactLocation(
  address = {},
  displayName = ""
) {
  const parts =
    uniqueValues([
      address.road,
      address.neighbourhood,
      address.suburb,
      address.quarter,
      address.residential,
      address.city_district,
      address.city,
      address.town,
    ]);

  if (parts.length > 0) {
    return parts
      .slice(0, 3)
      .join(", ");
  }

  if (displayName) {
    return displayName
      .split(",")
      .slice(0, 3)
      .map(
        (part) =>
          part.trim()
      )
      .join(", ");
  }

  return "";
}


export async function reverseGeocodeLocation(
  lat,
  lng
) {
  const params =
    new URLSearchParams({
      format: "jsonv2",
      lat: String(lat),
      lon: String(lng),
      zoom: "18",
      addressdetails: "1",
      "accept-language":
        "en",
    });

  const response =
    await fetch(
      `${NOMINATIM_BASE_URL}/reverse?${params.toString()}`
    );

  if (!response.ok) {
    throw new Error(
      "Unable to identify this location."
    );
  }

  const data =
    await response.json();

  const location =
    getCompactLocation(
      data.address,
      data.display_name
    );

  if (!location) {
    throw new Error(
      "No area name found."
    );
  }

  return {
    location,
    displayName:
      data.display_name,
    address:
      data.address,
  };
}


export async function searchLocations(
  query
) {
  const params =
    new URLSearchParams({
      q: `${query}, Dhaka, Bangladesh`,
      format: "jsonv2",
      addressdetails: "1",
      limit: "5",
      countrycodes: "bd",
      "accept-language":
        "en",
    });

  const response =
    await fetch(
      `${NOMINATIM_BASE_URL}/search?${params.toString()}`
    );

  if (!response.ok) {
    throw new Error(
      "Unable to search location."
    );
  }

  return response.json();
}