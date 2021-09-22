import * as React from "react";
import { GameStore } from "../store/GameStore";
import { UserStore } from "../store/UserStore";
import userStore from './../store/UserStore';
import gameStore from './../store/GameStore';

export interface IRootContext {
    user: UserStore,
    game: GameStore
}

export const RootContext = React.createContext<IRootContext>({ user: userStore, game: gameStore });

export const RootContextProvider: React.FC = ({ children }) => {
    return (
        <RootContext.Provider value={{ user: userStore, game: gameStore }}>
            {children}
        </RootContext.Provider>
    );
};

export default RootContextProvider;




