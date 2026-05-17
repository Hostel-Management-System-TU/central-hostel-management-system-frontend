import { RefreshCcw } from 'lucide-react'
import React from 'react'

const ListLoader = ({comment}) => {
    return (
        <div className="p-8 text-center">
            <RefreshCcw className="w-6 h-6 text-slate-300 animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-500">{comment}</p>
        </div>
    )
}

export default ListLoader