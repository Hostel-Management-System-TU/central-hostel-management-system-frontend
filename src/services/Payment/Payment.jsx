import fetch from "../../utils/customfetch";
import { getAPI, urls } from "../ApiUrls";


export const UploadPaymentDetails = async (token, payload) => {
  try {
    const res = await fetch(getAPI(urls.payment.addPayment),{
        method: "POST",
        body: payload
    },token);

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

export const FetchUserPaymentHistory = async (token) => {
  try {
    const res = await fetch(getAPI(urls.payment.fetchPaymentHistory),{},token);

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

export const FetchPaymentList = async (token,payload) => {
  try {
    const res = await fetch(getAPI(urls.payment.fetchPaymentList),{
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