import fetch from "../../utils/customfetch";
import { getAPI, urls } from "../ApiUrls";


export const FetchDashboard = async (token) => {
  try {
    const res = await fetch(getAPI(urls.dashboard.user_dashboard),{},token);

    // handle non-2xx responses
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        status: res.status,
        error: errorData.message || "Error in fetching",
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