import { ReportItem, ReportResponse } from "@/@types/report";
import { Table } from "@/components/table";
import { compare } from "@/utils/date.utils";

type TagParams = {
    params: {
        id: string;
    }
}

type TagReport = ReportItem & {
    created_at: Date;
    visible: boolean;
}

async function fetchReportsFromTag(id: string) {

    try {
        const response = await fetch(`http://localhost:8080/api/reports/tag/${id}`)
        const reports = await response.json() as (ReportResponse[] | undefined)

        if (!reports) return []

        console.log(reports)

        return reports.map(it => ({
            ...it,
            created_at: new Date(it.created_at),
            visible: false
        }))
            .sort((first, second) => compare(first.created_at, second.created_at)) as TagReport[]
    } catch (error) {
        console.log(error)
        return []
    }

}

export default async function Page({ params }: TagParams) {
    const reports = await fetchReportsFromTag(params.id)
    const columns = ["Label", "Environment", "Path", "Date"]

    const hash = params.id.slice(
        params.id.length - 10,
        params.id.length
    )

    return (
        <main className="flex min-h-screen flex-col p-24 max-w-7xl mx-auto">
            <h1 className="font-bold text-2xl mb-5"> Report #{hash} </h1>
            <div className="w-full grid grid-cols-4 mb-8">
                {columns.map((column, idx) => (<p key={idx} className="font-bold text-lg"> {column} </p>))}
            </div>
            <Table data={reports} />
        </main>
    )
}