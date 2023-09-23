// @ts-nocheck
import { v4 as randomUUID } from 'uuid'

type SentinelClientConstructor = {
    environment: string
    path: string
    tag: string
    endpoint?: string
}

type CreateReport = {
    label: string
    tag: string
}

export default class SentinelClient {
    private readonly environment: string
    private readonly tag: string
    private readonly path: string
    private readonly endpoint: string

    private static DEFAULT_ENDPOINT_URL = 'http://localhost:8080/api'

    constructor({
        environment,
        tag,
        path,
        endpoint = SentinelClient.DEFAULT_ENDPOINT_URL,
    }: SentinelClientConstructor) {
        this.environment = environment
        this.tag = tag
        this.path = path
        this.endpoint = endpoint
    }

    static of() {
        const environment = 'default'
        const path = window.location.pathname
        const tag = randomUUID()

        return new SentinelClient({ environment, path, tag })
    }

    async post(data: CreateReport | object) {
        const url = `${this.endpoint}/report/create`

        const body = JSON.stringify(data)

        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body,
            })
        } catch (error) {
            console.log(`Failed to sent Report = ${body}`)
        }
    }

    getUserInformation() {
        return {}
    }

    buildCreateReportObject(label: string, data: object) {
        return {
            label,
            environment: this.environment,
            tag: this.tag,
            path: this.path,
            error: data,
            user: {
                user_agent: navigator.userAgent,
                language: navigator.language,
            },
        }
    }

    info(data: object) {
        this.post(this.buildCreateReportObject('INFO', data))
    }

    error(data: object) {
        this.post(this.buildCreateReportObject('ERROR', data))
    }

    ofError(error: Error, label = 'ERROR') {
        const [_, ...items] = error.stack
            ?.split(/\n/g)
            .map((it) => it.trim()) as string[]

        this.post(
            this.buildCreateReportObject('ERROR', {
                name: error.name,
                message: error.message,
                stack: items,
            }),
        )
    }

    warning(data: object) {
        this.post(this.buildCreateReportObject('WARNING', data))
    }

    inspect() {
        try {
            throw new Error()
        } catch (error) {
            const data = error as Error
            this.ofError(data, 'INFO')
        }
    }

    guard(callback){
        try {
            callback()
        } catch (error){
            this.ofError(error)
        }
    }

    protect() {
        window.addEventListener('error', ({ error }) => this.ofError(error))
    }
}
