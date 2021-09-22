import { useContext, useState } from 'react'
import { NavLink, useLocation, useHistory } from "react-router-dom"
import { login, registration } from "../http/userAPI"
import { observer } from "mobx-react-lite"
import { Paths } from '../routes/const'
import { RootContext } from '../context/RootContext'
import { IUserInfo } from './../model/IUserInfo';

export const Auth: React.FC = observer(() => {
    const { user } = useContext(RootContext);
    const location = useLocation();
    const history = useHistory();
    const isLogin = location.pathname === Paths.Login;
    const [userLogin, setUserLogin] = useState('');
    const [password, setPassword] = useState('');

    const click = async () => {
        try {
            let data:IUserInfo;
            if (isLogin) {
                data = await login(userLogin, password);
            } else {
                data = await registration(userLogin, password);
            }

            user.userName = data.userLogin;
            user.isAuth = true;
            console.log('user.isAuth = true');

            history.push(Paths.Root);
        } catch (e) {
            console.log(e);
        }

    }

    return (
        <div className="row">
            <div className="col">
                <div className="card" style={{ width: '30rem' }}>
                    <h4 className="card-title grey darken-1 white-text pad-1">
                        {isLogin ? 'Авторизация' : "Регистрация"}
                    </h4>

                    <div className="card-content">

                        <input type="text"
                            className="form-control"
                            id="userLogin"
                            placeholder="Введите ваш логин..."
                            value={userLogin}
                            onChange={e => setUserLogin(e.target.value)} />

                        <input type="password"
                            className="form-control"
                            id="password"
                            placeholder="Введите ваш пароль..."
                            value={password}
                            onChange={e => setPassword(e.target.value)} />
                    </div>

                    <div className="card-action">
                        {isLogin ?
                            <div>
                                Нет аккаунта? <NavLink to={Paths.Registratopn}>Зарегистрируйтесь!</NavLink>
                            </div>
                            :
                            <div>
                                Есть аккаунт? <NavLink to={Paths.Login}>Войдите!</NavLink>
                            </div>
                        }
                        <div className="right-align">
                            <button type="button" className="btn" style={{ minWidth: '8rem' }}
                                onClick={click}>
                                {isLogin ? 'Войти' : 'Регистрация'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
})
