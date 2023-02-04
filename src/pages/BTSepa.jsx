import { useEffect, useRef } from 'react'
import BTSEPA from 'braintree-web/sepa'
import { useGetAppState } from '../states/App/AppHooks'
import { useSetAlert } from '../states/Alert/AlertHooks'

const sepaConfig = {
    accountHolderName: 'John Doe',
    customerId: 'odesai-sepa-test-2',
    iban: 'NL89RABO7853818114',
    mandateType: 'RECURRENT',
    countryCode: 'NL',
}

const BTSepaCore = () => {
    const appState = useGetAppState()
    const sepaInstance = useRef(undefined)
    const { success, warning, danger } = useSetAlert()

    // LPM Instance
    useEffect(() => {
        const initialize = async () => {
            try {
                warning('Initializing BTSepa...')

                // Create LPM Instance
                sepaInstance.current = await BTSEPA.create({
                    client: appState.clientInstance,
                    debug: true,
                })
                console.log('BTSepa: sepaInstance', sepaInstance.current)

                success('Ready!')
            } catch (error) {
                console.error(error)
                danger('Error!')
            }
        }
        appState.clientInstance && initialize()

        return () => {
            sepaInstance?.current?.teardown()
        }
    }, [appState, success, warning, danger])

    const startSepaPayment = async () => {
        const response = await sepaInstance.current.tokenize({
            ...sepaConfig,
            merchantAccountId: appState.merchantAccountId,
        })
        console.log('BTLocalPaymentMethods: payload', response)
    }

    return (
        <div className="row">
            <div className="col">
                <h4 className="p-2">Checkout</h4>
                <br />
                <pre className="bg-light p-2">
                    <code>{JSON.stringify(sepaConfig, null, 2)}</code>
                </pre>
                <br />
                <div className="row">
                    <div className="col-4">
                        {sepaInstance && (
                            <button className="btn btn-outline-primary" onClick={startSepaPayment}>
                                SEPA
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const BTSepa = () => {
    const appState = useGetAppState()
    const { danger } = useSetAlert()

    useEffect(() => {
        if (!appState?.clientInstance) danger('Braintree client instance is required')
    }, [appState, danger])

    if (!appState?.clientInstance) return null
    return <BTSepaCore />
}

export default BTSepa
