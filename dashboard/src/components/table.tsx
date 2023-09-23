"use client";
import JsonView from "@uiw/react-json-view";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";
import { useState } from "react";
import { Badge } from "./badge";
import { ReportItem } from "@/@types/report";

type Report = ReportItem & {
    visible: boolean
}

interface TableProps {
    data: Report[]
}

type TableItemProps = {
    report: Report
}

function TableItem({ report }: TableItemProps) {
    return (
        <>
            <div className="w-full grid grid-cols-4">
                <span><Badge kind={report.label} /></span>
                <span> {report.environment} </span>
                <span> {report.path} </span>
                <span>{report.created_at.toLocaleString("pt-BR")}</span>
            </div>
            {
                report.visible &&
                <JsonView value={report.error} style={githubLightTheme} displayDataTypes={false} collapsed={false} shortenTextAfterLength={300} />
            }
        </>
    )
}

export function Table({ data }: TableProps) {

    const [reports, setReports] = useState(data)

    function toggleCollapse(id: number) {
        setReports(
            reports.map(it => {
                if (it.id !== id) return it

                return ({ ...it, visible: !(it.visible) })
            })
        )
    }

    return (
        <ul className="w-full">
            {reports.map((report) => (
                <li
                    key={report.id}
                    className="hover:bg-slate-50 hover:cursor-pointer mb-4"
                    onClick={() => toggleCollapse(report.id)}
                >
                    <TableItem report={report} />
                </li>
            ))}
        </ul>
    )
}