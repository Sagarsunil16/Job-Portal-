import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Typed dispatch — gives full TS autocomplete on dispatched action payloads
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed selector — infers return type automatically from state slice
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
