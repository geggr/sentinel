(async function main() {
    const HttpResponse = (response) => {

        console.log(response.status)

        let data = Promise.resolve(response)

        let processed = false

        function onSuccess(callback) {
            if (!processed && response.status >= 200 && response.status <= 300) {
                data = data.then(callback)

                processed = true
            }
        }

        function onError(callback) {
            if (!processed && response.status >= 400 && response.status <= 500) {
                data = data.then(callback)
                processed = true
            }
        }

        function onBadRequest(callback) {
            if (!processed && response.status === 400){
                data = data.then(callback)
                processed = true
            }
        }

        function onNotFound(callback) {
            if (!processed && response.status === 404){
                data = data.then(callback)
                processed = true
            }
        }

        function onInternalServerError() {

        }

        function defaultHandler() {

        }

        return {
            onSuccess: function(cb){
                onSuccess(cb)
                return this
            },
            onError,
            onBadRequest: function(cb){
                onBadRequest(cb)
                return this
            },
            onNotFound: function(cb){
                onNotFound(cb)
                return this
            },
            get: function(){
                return data
            },
            onInternalServerError,
            defaultHandler
        }

    }

    const HttpClient = () => {


        function get(endpoint) {
            return fetch(endpoint).then(response => HttpResponse(response))
        }

        return {
            get
        }
    }

    const http = HttpClient()


    const client = await http.get('https://www.alura.com.br/api/cursosxx')

    const response = await client
                .onSuccess(async response => {
                    const data = await response.json()

                    return ({ success: true, data })
                })
                .onBadRequest(response => {
                    console.log("Tivemos um bad request")
                    return ({ success: false, status: 'BAD_REQUEST'})
                })
                .onNotFound(() => {
                    console.log("Tivemos um not Found")
                    return ({ success: false, status: 'NOT_FOUND'})
                })
                .get()
    

    console.log(response)
})()