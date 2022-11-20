interface ILovenseToys {
    nickname: string
    name: string
    id: string
    status: number
}

export interface ILovenseConnection {
    uid: string
    appVersion: string
    toys: Map<string, ILovenseToys>
    wssPort: string
    httpPort: string
    wsPort: string
    appType: string
    domain: string
    utoken: string
    httpsPort: string
    version: string
    platform: string
}
