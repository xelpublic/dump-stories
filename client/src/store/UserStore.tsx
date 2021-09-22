import { makeAutoObservable } from "mobx";

class UserStore {
    isAuth: boolean=false;
    userName: string = '';
    userRole: string = '';

    constructor() {
        makeAutoObservable(this)
    }


    // public logOut = () => {
    //     this._userName = "";
    //     this.isAuth = false;
    //     localStorage.removeItem('token')
    // }

    // public logIn = (userName: string) => {
    //     this._userName = userName;
    //     this.isAuth = true;
    // }

}

const userStore = new UserStore();

export default userStore;

export { UserStore};



