"use client"

function error(error: Error) {
    return <p className="text-3xl text-red-400">{error.message}</p>
}

export default error
