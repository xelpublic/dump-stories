import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import { observer } from "mobx-react-lite";
import { Paths, publicRoutes, authRoutes, adminRoutes } from '../routes/const';
import { RootContext } from '../context/RootContext';

export const AppRouter: React.FC = observer(() => {
    const { user } = useContext(RootContext)

    return (
        <Switch>
            {user.isAuth && authRoutes.map(({ path, component }) =>
                <Route key={path} path={path} component={component} exact />
            )}
            {publicRoutes.map(({ path, component }) =>
                <Route key={path} path={path} component={component} exact />
            )}
            {user.isAuth && user.userRole === 'admin' && adminRoutes.map(({ path, component }) =>
                <Route key={path} path={path} component={component} exact />
            )}
            <Redirect to={Paths.Root} />
        </Switch>
    )
})
