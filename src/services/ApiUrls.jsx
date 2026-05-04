export const baseApi = "http://127.0.0.1:3000/api/v1"
// export const baseApi = "http://10.192.218.252:3000/api/v1"

export const urls = {
    auth: {
        register: '/auth/register',
        profile: '/auth/me'
    },
    payment: {
        addPayment: '/payment',
        fetchPaymentHistory: '/payment/history',
        fetchPaymentList: '/payment/list'
    }
}

export const getAPI = (api) => {
    return baseApi+api
}
