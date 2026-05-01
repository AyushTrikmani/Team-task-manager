import { useContext } from 'react';
import { AuthContext } from './AuthStore';

export const useAuth = () => useContext(AuthContext);
