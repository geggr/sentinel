"use client"

import { ReportItem, ReportResponse } from "@/@types/report"
import { SocketContext } from "@/context/socket-context"
import { ReactNode, useEffect, useState } from "react"
import { io } from "socket.io-client"

type ReportsProvider = {
    initialValue: ReportItem[]
    children: ReactNode
}

export function ReportsProvider({ initialValue, children } : ReportsProvider) {
    const socket = io('http://localhost:8080')

    const [reports, setReports] = useState<ReportItem[]>(initialValue)
    const [tags, setTags] = useState<string[]>([])

    useEffect(() => {

        const set = new Set<string>([])

        for(const report of reports) {
            set.add(report.tag)
        }

        setTags([...set])

    }, [reports])


    return (
        <SocketContext.Provider value={{ socket, reports, tags, setReports }}>
            {children}
        </SocketContext.Provider>
    )
}

