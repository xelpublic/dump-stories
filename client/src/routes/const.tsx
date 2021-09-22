import { Admin } from "../components/Admin/Admin"
import { Auth } from "../components/Auth"
import { Game } from "../components/Game/Game"
import { GameRules } from "../components/Game/GameRules"
import { GameList } from "../components/GameList/GameList"

export enum Paths{
    //user
    Root = '/game',
    Login = '/login',
    Registratopn = '/registration',
    //user
    //game
    GameRules='/game_rules',
    Game = '/game',
    GameList = '/game_list',
    //game
    //admin
    Admin = '/admin'
    //admin
}

export interface IRote{
    path: string,
    component:any
}

export const authRoutes:IRote[] = [
    {
        path: Paths.GameList,
        component: GameList
    },
]

export const publicRoutes:IRote[] = [
    {
        path: Paths.Login,
        component: Auth
    },
    {
        path: Paths.Registratopn,
        component: Auth
    },
    {
        path: Paths.GameRules,
        component: GameRules
    },
    {
        path: Paths.Game,
        component: Game
    }

]

export const adminRoutes: IRote[] = [
    {
        path: Paths.Admin,
        component: Admin
    }
]