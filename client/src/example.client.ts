export class ExampleClient {
    constructor() {}

    post() {
        return fetch('http://localhost:8080/dont-exists', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({}),
        })
    }

    unavaiable_endpoint() {
        this.post()
    }

    parse_error() {
        JSON.parse('A string that is not a json')
    }

    execute() {
        this.parse_error()
    }
}
