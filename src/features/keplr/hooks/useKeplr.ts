import {useContext} from 'react';
import {KeplrContext} from '../KeplrContext';

export function useKeplr() {
  const context = useContext(KeplrContext);
  if (!context) {
    throw new Error('You forgot to use GetKeplrProvider');
  }
  return context;
}
