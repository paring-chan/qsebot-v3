import React from 'react'
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom'
import LoadingScreen from '../components/LoadingScreen'

const SuspenseRoute: React.FC<RouteProps> = ({ component: Component, ...props }) => {
    return (
        <Route
            {...props}
            component={
                Component
                    ? (x: RouteComponentProps) => (
                          <React.Suspense fallback={<LoadingScreen />}>
                              <Component {...x} />
                          </React.Suspense>
                      )
                    : undefined
            }
        />
    )
}

export default SuspenseRoute
