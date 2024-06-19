import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../types/storeTypes";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
