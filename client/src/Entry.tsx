import React from 'react'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
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
import CommandEdit from './Pages/Admin/Commands/Edit'
import YouTubeNotifications from './Pages/Admin/Notifications/YouTube'
import YouTubeEdit from './Pages/Admin/Notifications/YouTubeEdit'
import BlackListList from './Pages/Admin/Blacklist'
import BlacklistEdit from './Pages/Admin/Blacklist/Edit'
import Layout from './components/Layout'
import ReactionRoleList from './Pages/Admin/ReactionRole'
import Ranking from './Pages/Ranking'
import Shop from './Pages/Shop'
import ShopItemList from './Pages/Admin/Shop'

const Entry: React.FC = () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#5865F2',
            },
            success: {
                main: '#43B581',
                contrastText: '#fff',
            },
            secondary: {
                main: '#4F545C',
            },
            error: {
                main: '#F04747',
            },
        },
    })

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <RecoilRoot>
                    <SnackbarProvider>
                        <CssBaseline />
                        <React.Suspense fallback={<LoadingScreen />}>
                            <WaitReady>
                                <Switch>
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
                                                        <SuspenseRoute exact path="/admin/commands/:id" component={CommandEdit} />
                                                        <SuspenseRoute exact path="/admin/notifications/youtube" component={YouTubeNotifications} />
                                                        <SuspenseRoute exact path="/admin/notifications/youtube/:id" component={YouTubeEdit} />
                                                        <SuspenseRoute exact path="/admin/blacklist" component={BlackListList} />
                                                        <SuspenseRoute exact path="/admin/blacklist/:id" component={BlacklistEdit} />
                                                        <SuspenseRoute exact path="/admin/reactionroles" component={ReactionRoleList} />
                                                        <SuspenseRoute exact path="/admin/shop" component={ShopItemList} />
                                                    </Switch>
                                                </AdminLayout>
                                            </AdminRequired>
                                        </AuthRequired>
                                    </Route>
                                    <Route>
                                        <Layout>
                                            <Route exact path="/" component={Main} />
                                            <Route exact path="/ranking" component={Ranking} />
                                            <Route path="/shop">
                                                <AuthRequired>
                                                    <Route exact path="/shop" component={Shop} />
                                                </AuthRequired>
                                            </Route>
                                        </Layout>
                                    </Route>
                                </Switch>
                            </WaitReady>
                        </React.Suspense>
                    </SnackbarProvider>
                </RecoilRoot>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default Entry
