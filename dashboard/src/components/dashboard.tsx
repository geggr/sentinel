"use client";

import { ReportItem } from "@/@types/report";
import { useContext, useEffect, useState } from "react";
import { TableItem } from "./table-item";
import { TableBadge } from "./table-badge";
import Link from "next/link";

import { SocketContext } from "@/context/socket-context";
import { useRouter } from "next/navigation";


function formatTag(tag: string) {
    const hash = tag.slice(
        tag.length - 10,
        tag.length
    )

    return `#${hash}`;
}

const SortingOrder = {
    ASC: "ASC",
    DESC: "DESC"
}

type NewReportSocketResponse = { report: string; }

export function Dashboard() {
    const router = useRouter()

    const {
        socket,
        reports: data,
        setReports
    } = useContext(SocketContext)

    const [ reports, orderReports] = useState(data)
    const [ attribute, setAttribute ] = useState("")
    const [ order, setOrder ] = useState(SortingOrder.ASC)

    function orderTable<T extends keyof ReportItem>(selectedAttribute: T){

        if (selectedAttribute === attribute){
            orderReports(
                [...reports].reverse()
            )
        }

        const sorted = [...reports].sort( (first, second) => {
            if (order === SortingOrder.ASC) {
                return first[selectedAttribute] > second[selectedAttribute] ? 1 : -1
            }

            return first[selectedAttribute] > second[selectedAttribute] ? -1 : 1
        })

        orderReports(sorted)
        setAttribute(selectedAttribute)
        setOrder(order === SortingOrder.ASC ? SortingOrder.DESC : SortingOrder.ASC)
    }

    useEffect(() => {

        function onNewReport(value: NewReportSocketResponse) {
            try {
                const report = JSON.parse(value.report) as ReportItem

                const parsed = ({
                    ...report,
                    created_at: new Date(report.created_at)
                })

                setReports(reports => [parsed, ...reports])
                orderReports(reports => [parsed, ...reports])

            } catch (error) {
                console.log(error)
            }
        }


        socket.on('report:new', onNewReport)

        return () => {
            socket.off('report:new', onNewReport)
        }
    }, [])

    const labels: ({ name: string, attribute: keyof ReportItem}[]) = [
        { name: "Tag", attribute: 'tag' } ,
        { name: "Label", attribute: 'label' } ,
        { name: "Path", attribute: 'path' } ,
        { name: "Environment", attribute: 'environment' } ,
        { name: "Date", attribute: 'created_at'},
    ]

    function navigate(tag: string){
        router.push(`/tag/${tag}`)
    }

    return (
        <table className="w-full table-auto border-separate border-spacing-y-4">
            <thead className="text-left">
                <tr>
                    {labels.map( (label, index) => (
                        <th className="cursor-pointer" key={index} onClick={() => orderTable(label.attribute)}> { label.name } </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {reports.map((report) => (
                    <tr
                        key={report.id}
                        className="hover:bg-slate-50 hover:cursor-pointer"
                    >
                        <TableItem data={formatTag(report.tag)} onClick={() => navigate(report.tag)}/>
                        <TableBadge kind={report.label} />
                        <TableItem data={report.path} />
                        <TableItem data={report.environment} />
                        <TableItem data={report.created_at.toLocaleString('pt-BR')} />
                        <td className="p-4">
                            <Link
                                href={`/report/${report.id}`}
                                className="block uppercase text-center bg-slate-600 text-white w-full py-1 rounded-sm font-bold"
                            >
                                Analisar
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
