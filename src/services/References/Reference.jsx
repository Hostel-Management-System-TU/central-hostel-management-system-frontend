import { getAPI, urls } from "../ApiUrls";


export const FetchHostels = async () => {
  try {
    const res = await fetch(getAPI(urls.reference.hostels));

    // handle non-2xx responses
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        status: res.status,
        error: errorData.message || "Error in uploading payment",
      };
    }

    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Network error",
    };
  }
};