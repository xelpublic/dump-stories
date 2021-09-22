import { useContext } from "react";
import { RootContext } from './../context/RootContext';

export const useRootContext = () => useContext(RootContext);