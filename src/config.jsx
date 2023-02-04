const title = 'Braintree  ~  Local Payment Methods'

const credentials = {
    set: (credentials) => {
        try {
            window.localStorage.setItem('credentials', JSON.stringify(credentials))
        } catch (error) {
            console.error(error)
        }
    },
    get: () => {
        try {
            return JSON.parse(window.localStorage.getItem('credentials')) || {}
        } catch (error) {
            console.error(error)
            return {}
        }
    },
}

const routes = [
    {
        label: 'ClientInstance',
        path: 'client-instance',
        element: () => import('./pages/BTClientInstance'),
        isDep: false,
    },
    {
        label: 'LocalPaymentMethods',
        path: 'bt-lpms',
        element: () => import('./pages/BTLocalPaymentMethods'),
        isDep: true,
    },
    {
        label: 'SEPA',
        path: 'bt-sepa',
        element: () => import('./pages/BTSepa'),
        isDep: true,
    },
]

export { title, credentials, routes }
