import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";
import { IUserInfo } from '../model/IUserInfo';


export const registration = async (userLogin:string, password:string) => {
    const { data } = await $host.post('api/user/register', { userLogin, password, role: 'PLAYER' })
    localStorage.setItem('token', data.token)
    const res = jwt_decode<IUserInfo>(data.token)
    return res
}

export const login = async (userLogin: string, password: string) => {
    const { data } = await $host.post('api/user/login', { userLogin, password })
    localStorage.setItem('token', data.token)
    const res = jwt_decode<IUserInfo>(data.token)
    return res
}

export const check = async () => {
    const { data } = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    const res = jwt_decode<IUserInfo>(data.token)
    return res
}

