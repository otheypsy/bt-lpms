import { useEffect, useRef } from 'react'
import BTLocalPayment from 'braintree-web/local-payment'
import { useGetAppState } from '../states/App/AppHooks'
import { useSetAlert } from '../states/Alert/AlertHooks'

const lpmConfig = {
    paymentType: 'bancontact',
    amount: '10.67',
    fallback: {
        // see Fallback section for details on these params
        url: 'https://example.com',
        buttonText: 'Complete Payment',
    },
    currencyCode: 'EUR',
    givenName: 'John',
    surname: 'Doe',
    address: {
        streetAddress: 'Witbakkerstraat 296',
        extendedAddress: 'Apt. B',
        locality: 'Sint-kornelis-horebeke',
        postalCode: '9667',
        region: 'East Flanders',
        countryCode: 'BE',
    },
}

const BTLocalPaymentMethodsCore = () => {
    const appState = useGetAppState()
    const lpmInstance = useRef(undefined)
    const paymentId = useRef(undefined)
    const { success, warning, danger } = useSetAlert()

    // LPM Instance
    useEffect(() => {
        const initialize = async () => {
            try {
                warning('Initializing BTLocalPaymentMethods...')

                // Create LPM Instance
                lpmInstance.current = await BTLocalPayment.create({
                    client: appState.clientInstance,
                    merchantAccountId: appState.merchantAccountId,
                })
                console.log('BTLocalPaymentMethods: lpmInstance', lpmInstance.current)

                success('Ready!')
            } catch (error) {
                console.error(error)
                danger('Error!')
            }
        }
        appState.clientInstance && initialize()

        return () => {
            lpmInstance?.current?.teardown()
        }
    }, [appState, success, warning, danger])

    const startLPMPayment = async () => {
        const response = await lpmInstance.current.startPayment({
            ...lpmConfig,
            onPaymentStart: (data, start) => {
                console.log('BTLocalPaymentMethods: onPaymentStart', data)
                paymentId.current = data.paymentId
                start()
            },
        })
        console.log('BTLocalPaymentMethods: payload', response)
    }

    return (
        <div className="row">
            <div className="col">
                <h4 className="p-2">Checkout</h4>
                <br />
                <pre className="bg-light p-2">
                    <code>{JSON.stringify(lpmConfig, null, 2)}</code>
                </pre>
                <br />
                <div className="row">
                    <div className="col-4">
                        {lpmInstance && (
                            <button className="btn btn-outline-primary" onClick={startLPMPayment}>
                                Bancontact
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const BTLocalPaymentMethods = () => {
    const appState = useGetAppState()
    const { danger } = useSetAlert()

    useEffect(() => {
        if (!appState?.clientInstance) danger('Braintree client instance is required')
    }, [appState, danger])

    if (!appState?.clientInstance) return null
    return <BTLocalPaymentMethodsCore />
}

export default BTLocalPaymentMethods
