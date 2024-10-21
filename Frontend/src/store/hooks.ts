// Hook's in react-redux like useDispatch() , useSelector() don't have types so we don't use them instead we create own hooks.

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

//Customized Hooks:
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
