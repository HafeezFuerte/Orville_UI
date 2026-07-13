import { AuthPayload } from './auth.models';

export interface AuthState {
  user: AuthPayload | null;
}

export const initialState: AuthState = {
  user: null
};
