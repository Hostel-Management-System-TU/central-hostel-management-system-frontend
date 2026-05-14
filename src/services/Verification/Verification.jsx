import fetch from "../../utils/customfetch";
import { getAPI, urls } from "../ApiUrls";

export const VerifyPayment = async (token, payload) => {
  try {
    const res = await fetch(getAPI(urls.verification.verifyPayment),{
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

export const ChangePaymentStatus = async (token, payload) => {
    try {
    const res = await fetch(getAPI(urls.verification.changePaymentStatus),{
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
