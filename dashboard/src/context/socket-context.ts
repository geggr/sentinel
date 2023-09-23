import { ReportItem } from "@/@types/report";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { Socket } from "socket.io-client";


type SocketContextProps = {
    socket: Socket,
    tags: string[],
    reports: ReportItem[],
    setReports: Dispatch<SetStateAction<ReportItem[]>>
}

export const SocketContext = createContext<SocketContextProps>({} as SocketContextProps)