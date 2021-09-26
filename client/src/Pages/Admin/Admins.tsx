import React from 'react'
import { useRequest } from '../../utils/request'

const Admins: React.FC = () => {
    const { data } = useRequest('/admin/admins')
    console.log(data)

    return <div>Admin List</div>
}

export default Admins
