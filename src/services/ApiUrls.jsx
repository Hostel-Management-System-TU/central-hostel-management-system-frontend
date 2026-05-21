export const baseApi = import.meta.env.VITE_BASE_URL || "http://localhost:7860"
export const R2DevURL = import.meta.env.VITE_R2_URL || ""


export const urls = {
    reference: {
        hostels: '/hostels'
    },
    auth: {
        register: '/auth/register',
        profile: '/auth/me',
        fetchBorders: (hostel_id) => `/auth/borders/${hostel_id}`
    },
    dashboard: {
        user_dashboard: '/dashboard'
    },
    payment: {
        addPayment: '/payment',
        fetchPaymentHistory: '/payment/history',
        fetchPaymentList: '/payment/list',
        fetchPaymentDetails: (payment_id) => `/payment/${payment_id}`,
        fetchDefaulters: '/payment/defaulters',
        uploadBankStatement: '/payment/upload/bank-statement',
        adminPaymentAnalysis: (hostel_id) => `/payment/admin-analysis/${hostel_id}`,
    },
    verification: {
        verifyPayment: '/verify/payment',
        changePaymentStatus: '/verify/payment/change-status'
    },
    report: {
        register: '/report',
        history: '/report/history',
        fetchReportDeatils: (report_id) => `/report/${report_id}`,
        fetchReportsList: `/report/list`,
        updateStatus: `/report/change-status`
    }
}



export const getAPI = (api) => {
    return baseApi+api
}

export const getR2URL = (key) => {
    return R2DevURL+key
}