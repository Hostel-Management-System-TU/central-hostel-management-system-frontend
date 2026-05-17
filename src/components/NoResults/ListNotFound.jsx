import { Search } from 'lucide-react'
import React from 'react'

const ListNotFound = ({comment}) => {
    return (
        <div className="p-8 text-center">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">{comment}</p>
        </div>
    )
}

export default ListNotFound