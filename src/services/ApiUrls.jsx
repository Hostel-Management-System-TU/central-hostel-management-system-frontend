export const baseApi = "http://127.0.0.1:7860/api/v1"
// export const baseApi = "http://10.86.107.252:3000/api/v1"

export const R2DevURL = "https://pub-f2cb6691fe21423a9c423ad220580d86.r2.dev/"

export const urls = {
    auth: {
        register: '/auth/register',
        profile: '/auth/me',
        fetchBorders: (hostel_id) => `/auth/borders/${hostel_id}`
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
}



export const getAPI = (api) => {
    return baseApi+api
}

export const getR2URL = (key) => {
    return R2DevURL+key
}