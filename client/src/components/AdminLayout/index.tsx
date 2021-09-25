import React from 'react'
import AdminHeader from './Header'
import AdminSidebar from './Sidebar'

const AdminLayout: React.FC = ({ children }) => {
    const [drawer, setDrawer] = React.useState(false)

    return (
        <div>
            <AdminHeader openDrawer={() => setDrawer(!drawer)} />
            <AdminSidebar open={drawer} onClose={() => setDrawer(false)} />
            {children}
        </div>
    )
}

export default AdminLayout
