import fetch from "../../utils/customfetch";
import { getAPI, urls } from "../ApiUrls";


export const FetchProfileData = async (token) => {
  try {
    const res = await fetch(getAPI(urls.auth.profile),{},token);

    // handle non-2xx responses
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        status: res.status,
        error: errorData.message || "Something went wrong",
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

export const RegisterUser = async (token, payload) => {
  try {
    const res = await fetch(
      getAPI(urls.auth.register),
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: data.message || data.error || "Registration failed",
      };
    }

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

export const FetchBorders = async (token, hostel_id) => {
  try {
    const res = await fetch(
      getAPI(urls.auth.fetchBorders(hostel_id)),
      {},
      token
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: data.message || data.error || "Fetching failed",
      };
    }

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