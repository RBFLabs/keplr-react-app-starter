import {createContext} from 'react';
import type {KeplrContextProps} from './types';

export const KeplrContext = createContext<KeplrContextProps>({} as KeplrContextProps);
