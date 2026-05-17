import fetch from "../../utils/customfetch";
import { getAPI, urls } from "../ApiUrls";

export const FetchUserReports = async (token) => {
  try {
    const res = await fetch(getAPI(urls.report.history),{},token);

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
}

export const FetchReportsList = async (token, payload) => {
  try {
    const res = await fetch(getAPI(urls.report.fetchReportsList),{
      method: "POST",
      body: JSON.stringify(payload)
    },token);

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
}

export const RegisterReport = async (token, payload) => {
  try {
    const res = await fetch(getAPI(urls.report.register),{
        method: "POST",
        body: payload
    },token);

    // handle non-2xx responses
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        status: res.status,
        error: errorData.message || "Error in uploading report",
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

export const FetchReportDetails = async (token,report_id) => {
  try {
    const res = await fetch(getAPI(urls.report.fetchReportDeatils(report_id)),{},token);

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
}

export const UpdateStatus = async (token, payload) => {
  try {
    const res = await fetch(getAPI(urls.report.updateStatus),{
        method: "POST",
        body: JSON.stringify(payload)
    },token);

    // handle non-2xx responses
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        status: res.status,
        error: errorData.message || "Error in updating status",
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