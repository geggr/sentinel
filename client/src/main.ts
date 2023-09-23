import { ExampleClient } from './example.client'
import SentinelClient from './setinel.client'

const sentinel = SentinelClient.of()

sentinel.protect()

sentinel.info({
    message: "Starting Endpoint"
})

const another = new ExampleClient()

function fib(value: number) : number {
    if (value < 2 ) return 1

    return fib(value - 2) + fib (value - 1)
}

function one_single_fn(){
    const start = Date.now()
    const value = fib(25)
    const end = Date.now()

    sentinel.warning({
        message: "Calculate",
        data: {
            start,
            end,
            value
        }
    })

    another.execute()

    sentinel.info({
        message: "End Endopoint"
    })
}

one_single_fn()
