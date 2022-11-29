import http from "http"
import {Axel} from "../client";
import {ILovenseConnection} from "../models/lovense";

export default function init(client: Axel) {
    const server = http.createServer((request) => {
        if (request.method == "POST") {
            let body = ""
            request.on("data", data => {
                body += data
            })
            request.on("end", () => {
                const jsonContent: ILovenseConnection = JSON.parse(body)

                client.connectedUsers.set(jsonContent.uid, jsonContent)

                if (!client.connectedUsers.has(jsonContent.uid)) {
                    console.log("New User Connected")
                }
            })
        }
    })

    server.listen(8443)
    console.log("Server running on port 8443")
}

