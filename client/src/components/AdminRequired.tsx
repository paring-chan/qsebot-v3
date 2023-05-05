import React from 'react'
import { useAccount } from '../utils/user'
import { Redirect } from 'react-router-dom'
import { useSnackbar } from 'notistack'

const AdminRequired: React.FC = ({ children }) => {
  const user = useAccount()
  const { enqueueSnackbar } = useSnackbar()

  if (!user.qse.admin) {
    enqueueSnackbar('관리자용 페이지', {
      variant: 'error',
    })

    return <Redirect to="/" />
  }

  return <>{children}</>
}

export default AdminRequired
