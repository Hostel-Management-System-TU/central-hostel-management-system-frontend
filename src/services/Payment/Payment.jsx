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

export const FetchPaymentDetails = async (token,payment_id) => {
  try {
    const res = await fetch(getAPI(urls.payment.fetchPaymentDetails(payment_id)),{},token);

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

export const FetchDefaulters = async (token, payload) => {
  try {
    const res = await fetch(getAPI(urls.payment.fetchDefaulters),{
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

export const UploadBankStatementInDB = async (token, payload) => {
  try {
    const res = await fetch(getAPI(urls.payment.uploadBankStatement),{
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

export const FetchAdminPaymentAnalytics = async (token, hostel_id) => {
  try {
    const res = await fetch(getAPI(urls.payment.adminPaymentAnalysis(hostel_id)), {}, token);

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