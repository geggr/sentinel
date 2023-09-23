type ReportParams = {
    params: {
        id: string;
    }
}

import { ReportItem, ReportResponse } from "@/@types/report";
import { Viewer } from "@/components/viewer";

async function fetchReport(id: string) {
    try {
        const response = await fetch(`http://localhost:8080/api/report/${id}`, { cache: 'reload' })
        const report = await response.json() as ReportResponse


        const parsed: ReportItem = ({
            ...report,
            created_at: new Date(report.created_at),
        })

        return parsed
    } catch (error) {
        return null
    }
}


export default async function Page({ params }: ReportParams) {
    const report = await fetchReport(params.id)
    return (
        <main className="flex flex-col min-h-screen p-24 max-w-7xl mx-auto">
            {report && (
                <>
                    <div className="flex gap-8">
                        <div className="">
                            <h4 className="text-slate-800 font-bold">Código do Erro</h4>
                            <p>#{report.tag}</p>
                        </div>
                        <div className="">
                            <h4 className="text-slate-800 font-bold">Tipo do Erro</h4>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h4 className="text-slate-800 font-bold">Tracing</h4>
                        <Viewer data={report.error} />
                    </div>
                </>)}
        </main>
    )

}