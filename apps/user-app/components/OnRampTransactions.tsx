import { Card } from "@repo/ui/card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: "Success" | "Processing" | "Failure",
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map((t, index) => (
                <div key={index} className="flex justify-between my-3">
                    <div>
                        <div className="text-sm">
                            {t.provider} <span className={`text-${t.status === "Success" ? "green": t.status === "Processing" ? "orange" : "red"}-600`}>{t.status}</span> 
                        </div>
                        <div className="text-slate-600 text-xs">
                            {t.time.toDateString()}
                        </div>
                    </div>
                    <div className={`flex flex-col justify-center text-${t.status === "Success" ? "green": t.status === "Processing" ? "orange" : "red"}-600`}>

                    {t.status === "Success" ? `+ Rs ${t.amount/ 100}`:t.status === "Processing" ? "--" : "Failure"}
                    
                    </div> 
                </div>
            ))}
        </div>
    </Card>
}