import React from 'react'
import { CssBaseline } from '@mui/material'
import { RecoilRoot } from 'recoil'
import WaitReady from './components/WaitReady'
import LoadingScreen from './components/LoadingScreen'
import { SnackbarProvider } from 'notistack'
import AuthRequired from './components/AuthRequired'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Main from './Pages/Main'
import AdminRequired from './components/AdminRequired'
import Admins from './Pages/Admin/Admins'
import AdminLayout from './components/AdminLayout'
import SuspenseRoute from './components/SuspenseRoute'
import QuizListPage from './Pages/Admin/Quiz'
import QuizEdit from './Pages/Admin/Quiz/Edit'
import CustomCommands from './Pages/Admin/Commands'
import CustomCommandScripts from './Pages/Admin/Scripts'

const Entry: React.FC = () => {
    return (
        <BrowserRouter>
            <RecoilRoot>
                <SnackbarProvider>
                    <CssBaseline />
                    <React.Suspense fallback={<LoadingScreen />}>
                        <WaitReady>
                            <Switch>
                                <Route exact path="/" component={Main} />
                                <Route path="/admin">
                                    <AuthRequired>
                                        <AdminRequired>
                                            <AdminLayout>
                                                <Switch>
                                                    <Route exact path="/admin">
                                                        <Redirect to="/admin/admins" />
                                                    </Route>
                                                    <SuspenseRoute exact path="/admin/admins" component={Admins} />
                                                    <SuspenseRoute exact path="/admin/quiz" component={QuizListPage} />
                                                    <SuspenseRoute exact path="/admin/quiz/:id" component={QuizEdit} />
                                                    <SuspenseRoute exact path="/admin/commands" component={CustomCommands} />
                                                    <SuspenseRoute exact path="/admin/scripts" component={CustomCommandScripts} />
                                                </Switch>
                                            </AdminLayout>
                                        </AdminRequired>
                                    </AuthRequired>
                                </Route>
                            </Switch>
                        </WaitReady>
                    </React.Suspense>
                </SnackbarProvider>
            </RecoilRoot>
        </BrowserRouter>
    )
}

export default Entry
