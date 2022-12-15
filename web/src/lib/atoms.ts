import { atom } from 'jotai';
import { SessionUser } from './types';

export const userAtom = atom<SessionUser | null>(null);
export const openedAtom = atom(false);
