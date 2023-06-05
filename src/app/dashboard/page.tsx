import { db } from "@/firebase"
import { SellRequests } from "@/types/firestore"
import {
    BarChart,
    Button,
    Card,
    DonutChart,
    Metric,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    Title,
} from "@tremor/react"
import { doc, getDoc } from "firebase/firestore"
import { Session, getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import AccountCardIcon from "./AccountCardIcon"
import SellReqCard from "./SellReqCard"
import {
    FidorAccountResponse,
    FidorTransactionsResponse,
} from "@/types/fidorAPI"
import { DateTime } from "luxon"
import TransactionCard, { TransactionCardProps } from "./TransactionCard"

async function getSellRequests() {
    const docRef = doc(db, "admin", "sellRequests")

    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
        return undefined
    }

    const data = docSnap.data() as SellRequests

    return data
}

async function getAccountDetails(access_token: string) {
    const res = await fetch(`https://api.tp.sandbox.fidorfzco.com/accounts`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${access_token}`,
            accept: "application/vnd.fidor.de; version=1,text/json",
            "Content-Type": "application/json'",
        },
        cache: "no-store",
    })

    if (!res.ok) {
        throw new Error("Failed to fetch account details")
    }

    const data = (await res.json()) as FidorAccountResponse

    return data
}

async function getTransactions(access_token: string) {
    const res = await fetch(
        `https://api.tp.sandbox.fidorfzco.com/transactions?per_page=100`,
        {
            method: "GET",
            headers: {
                authorization: `Bearer ${access_token}`,
                accept: "application/vnd.fidor.de; version=1,text/json",
            },
            cache: "no-store",
            next: {
                tags: ["transactions"],
            },
        },
    )

    if (!res.ok) {
        console.log(res.statusText)
        throw new Error("Failed to fetch account details")
    }

    const data = (await res.json()) as FidorTransactionsResponse

    return data
}

async function getInvestmentPortfolio(accountId: string) {
    const decRef = doc(db, "users", accountId)

    const docSnap = await getDoc(decRef)

    if (!docSnap.exists()) {
        throw new Error("Failed to fetch investments")
    }

    const data = docSnap.data()

    const parsedData = Object.keys(data)
        .map(key => {
            return {
                ...data[key],
                ticker: key,
            }
        })
        .sort((a, b) => b.totalInvestment - a.totalInvestment)

    console.log(parsedData)

    return parsedData
}

async function DashboardPage() {
    const session = await getServerSession(authOptions)
    //FIXME - this is a hack to get around the fact that fidor dies after 12am
    // const session: Session = {
    //     user: {
    //         id: "37378142",
    //         email: "customerB1@example.com",
    //     },
    //     accessToken: "test",
    //     refreshToken: "test",
    //     expires: "test",
    //     expiresAt: 1234,
    // }

    if (!session) {
        redirect("/")
    }

    //FIXME -  this is a hack to get around the fact that fidor dies after 12am
    const accountDetails = await getAccountDetails(session.accessToken)
    const transactions = await getTransactions(session.accessToken)

    // console.log(">>> Account details", accountDetails)
    // const accountDetails: FidorAccountResponse = {
    //     collection: {
    //         current_page: 1,
    //         per_page: 100,
    //         total_entries: 0,
    //         total_pages: 0,
    //     },
    //     data: [
    //         {
    //             id: "1234",
    //             bic: "1234",
    //             created_at: "2021-10-10T10:10:10Z",
    //             updated_at: "2021-10-10T10:10:10Z",
    //             nick: "",
    //             balance: 100000,
    //         },
    //     ],
    // }
    // const transactions: FidorTransactionsResponse = {
    //     collection: {
    //         current_page: 1,
    //         per_page: 100,
    //         total_entries: 0,
    //         total_pages: 0,
    //     },
    //     data: [],
    // }

    // console.log(">>> Account details", accountDetails)

    if (
        session.user.id === "95933444" &&
        session.user.email === "studenta23@email.com"
    ) {
        const sellRequests = await getSellRequests()

        return (
            <div className="flex h-full w-full gap-4">
                <Card className="w-1/3">
                    <Title className="mb-4 text-2xl font-semibold">
                        Sell Requests
                    </Title>
                    <div className="space-y-4">
                        {sellRequests ? (
                            Object.keys(sellRequests).length > 0 ? (
                                Object.keys(sellRequests).map(key => (
                                    <SellReqCard
                                        key={key}
                                        id={key}
                                        amount={sellRequests[key].amount}
                                        receiver={sellRequests[key].receiver}
                                        shareCount={
                                            sellRequests[key].shareCount
                                        }
                                        sharePrice={
                                            sellRequests[key].sharePrice
                                        }
                                        ticker={sellRequests[key].ticker}
                                        token={session.accessToken}
                                    />
                                ))
                            ) : (
                                <Text>No sell requests!</Text>
                            )
                        ) : (
                            <Text>No sell requests!</Text>
                        )}
                    </div>
                </Card>
                <div className="flex w-2/3 flex-col gap-4">
                    <Card className="h-1/3">
                        <Title className="mb-4 text-2xl font-semibold">
                            Your account
                        </Title>
                        <div className="flex gap-4">
                            <Card
                                className="flex gap-4"
                                decoration="top"
                                decorationColor="blue">
                                <AccountCardIcon icon="Identification" />
                                <div>
                                    <Text>Account ID</Text>
                                    <Metric>{accountDetails.data[0].id}</Metric>
                                </div>
                            </Card>
                            <Card
                                className="flex gap-4"
                                decoration="top"
                                decorationColor="cyan">
                                <AccountCardIcon icon="Library" />
                                <div>
                                    <Text>Account number</Text>
                                    <Metric>
                                        {accountDetails.data[0].account_number}
                                    </Metric>
                                </div>
                            </Card>
                            <Card
                                className="flex gap-4"
                                decoration="top"
                                decorationColor="teal">
                                <AccountCardIcon icon="Cash" />
                                <div>
                                    <Text>Balance</Text>
                                    <Metric>
                                        $
                                        {accountDetails.data[0].balance.toLocaleString(
                                            "en-US",
                                        )}
                                    </Metric>
                                </div>
                            </Card>
                        </div>
                    </Card>
                    <Card className="h-2/3 overflow-hidden">
                        <div className="flex justify-between">
                            <Title className="mb-4 text-2xl font-semibold">
                                Your transactions
                            </Title>
                        </div>
                        <div className="max-h-full overflow-scroll">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableHeaderCell>ID</TableHeaderCell>
                                        <TableHeaderCell>
                                            Created at
                                        </TableHeaderCell>
                                        <TableHeaderCell>
                                            Recipient
                                        </TableHeaderCell>
                                        <TableHeaderCell>
                                            Amount
                                        </TableHeaderCell>
                                        <TableHeaderCell>
                                            Subject
                                        </TableHeaderCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.data.map(transaction =>
                                        transaction.subject.includes(
                                            "INVESTR-STOCKS",
                                        ) ? (
                                            <TableRow key={transaction.id}>
                                                <TableCell>
                                                    {transaction.id}
                                                </TableCell>
                                                <TableCell>
                                                    {DateTime.fromISO(
                                                        transaction.created_at,
                                                    ).toLocaleString(
                                                        DateTime.DATETIME_MED,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        transaction
                                                            .transaction_type_details
                                                            .recipient
                                                    }
                                                </TableCell>
                                                <TableCell
                                                    className={
                                                        transaction.amount < 0
                                                            ? "text-red-400"
                                                            : "text-green-400"
                                                    }>
                                                    $
                                                    {transaction.amount < 0
                                                        ? (
                                                              transaction.amount /
                                                              100
                                                          )
                                                              .toFixed(2)
                                                              .slice(1)
                                                        : (
                                                              transaction.amount /
                                                              100
                                                          ).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        transaction.subject.split(
                                                            "INVESTR-STOCKS - ",
                                                        )[1]
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ) : null,
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    const investmentData = transactions.data
        .map(transaction => {
            if (transaction.subject.includes("INVESTR-STOCKS")) {
                const data = transaction.subject.split("INVESTR-STOCKS - ")[1]
                const splitData = data.split(" ")

                const shareCount = parseInt(splitData[0])
                const ticker = splitData[3]
                const sharePrice = parseFloat(splitData[5])

                return {
                    shareCount,
                    ticker,
                    sharePrice,
                }
            }
        })
        .filter(item => !!item)

    const investmentPortfolio = await getInvestmentPortfolio(session.user.id)

    const totalInvestment = investmentPortfolio.reduce(
        (acc, curr) => acc + curr.totalInvestment,
        0,
    )

    return (
        <div className="flex h-full flex-col gap-4">
            <div className="flex h-[40%] gap-4">
                <Card className="w-4/5">
                    <Title className="mb-4 text-2xl font-semibold">
                        Your account
                    </Title>
                    <div className="flex gap-4">
                        <Card
                            className="flex gap-4"
                            decoration="top"
                            decorationColor="teal">
                            <AccountCardIcon icon="Cash" />
                            <div>
                                <Text>Balance</Text>
                                <Metric>
                                    $
                                    {accountDetails.data[0].balance?.toLocaleString(
                                        "en-US",
                                    )}
                                </Metric>
                            </div>
                        </Card>
                        <Card
                            className="flex gap-4"
                            decoration="top"
                            decorationColor="sky">
                            <AccountCardIcon icon="Database" />
                            <div>
                                <Text>Total Investments</Text>
                                <Metric>
                                    ${totalInvestment.toLocaleString("en-US")}
                                </Metric>
                            </div>
                        </Card>
                    </div>
                </Card>
                <Card className="w-1/5">
                    <Title className="mb-4 text-2xl font-semibold">
                        Diversity
                    </Title>
                    <DonutChart
                        data={investmentPortfolio}
                        category="shareCount"
                        index="ticker"
                    />
                </Card>
            </div>
            <div className="flex h-[60%] gap-4">
                <Card className="w-2/6 overflow-hidden">
                    <Title className="mb-4 text-2xl font-semibold">
                        Latest investments
                    </Title>
                    <div className="flex max-h-full flex-col gap-3 overflow-y-scroll px-2 py-1 pb-5">
                        {investmentData.map(investment =>
                            investment
                                ? TransactionCard({
                                      price: investment.sharePrice,
                                      shares: investment.shareCount,
                                      ticker: investment.ticker,
                                  })
                                : null,
                        )}
                    </div>
                </Card>
                <Card className="w-4/6">
                    <Title className="mb-4 text-2xl font-semibold">
                        Portfolio Value
                    </Title>
                    <BarChart
                        data={investmentPortfolio}
                        categories={["totalInvestment"]}
                        index={"ticker"}
                        autoMinValue
                    />
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage
