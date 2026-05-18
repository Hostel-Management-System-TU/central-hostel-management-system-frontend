// export const baseApi = "http://127.0.0.1:7860/api/v1"
export const baseApi = "https://chms78-chms-api.hf.space/api/v1"

export const R2DevURL = "https://pub-f2cb6691fe21423a9c423ad220580d86.r2.dev/"

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