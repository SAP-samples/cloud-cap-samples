import { useContext } from 'react';
import { AppStateContext } from '../contexts/AppStateContext';

const useAppState = () => useContext(AppStateContext);

export { useAppState };
