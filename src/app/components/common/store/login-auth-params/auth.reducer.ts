import { createReducer, on } from '@ngrx/store';
import { AuthState } from './auth.state';
import {setAuthPropsData, clearAuthProps}   from './auth.actions';

export const initialState: AuthState = {
  user: null
};


export const authReducer = createReducer(
  initialState,

  on(setAuthPropsData, (state, payload) => ({
    ...state,
    payload
  })),

  on(clearAuthProps, () => initialState)
);