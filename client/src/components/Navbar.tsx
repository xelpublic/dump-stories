import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { RootContext } from '../context/RootContext';
import { Paths } from '../routes/const';
import M from 'materialize-css';

export const Navbar: React.FC = observer(() => {
  const { user } = useContext(RootContext);
  const { game } = useContext(RootContext);
  const history = useHistory()

  useEffect(() => {
    var elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, { inDuration: 300, outDuration: 225, hover: false, constrainWidth: false });
  }, [])

  const logOut = async () => {
    user.isAuth = false;
    user.userName = '';
    localStorage.removeItem('token')
  }

  const newGame = async () => {
    if (game?.currentGame?.gameInProgress) {
      if (!window.confirm('Вы уверены что хотите прервать игру?')) {
        return;
      }
    }

    game.currentGame = undefined;
    history.push(Paths.Game);
  }

  return (
    <nav>
      <div className="nav-wrapper grey darken-1 pad-x1">
        <a className="brand-logo" href="#!" onClick={() => history.push(Paths.Root)} >
          Чепуха
        </a>

        <ul className="right">
          {
            game?.currentGame?.gameInProgress ?
              <li><a href="#!" onClick={newGame}>Начать новую</a></li>
              :
              <></>
          }
          <li><a href="#!" onClick={() => history.push(Paths.GameRules)}>Правила игры</a></li>

          <li>
            <a className="dropdown-trigger" href="#!" data-target="dropdown1">
              <i className="material-icons">person</i>
              {/* <i className="material-icons right">arrow_drop_down</i> */}
            </a>

            <ul id="dropdown1" className="dropdown-content">
              {
                user.isAuth ?
                  <>
                    <li><a href="#!" onClick={() => history.push(Paths.GameList)}>Список игр</a></li>
                    <li><a href="#!" onClick={logOut}>Выйти</a></li>
                    {
                      user.userRole === 'admin' ?
                        <li><a href="#!" onClick={() => history.push(Paths.Admin)}>Админка</a></li>
                        :
                        <> </>
                    }
                  </>
                  :
                  <li><a href="#!" onClick={() => history.push(Paths.Login)}>Авторизация</a></li>
              }
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  )
})
