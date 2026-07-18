import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.state';
import { clearAuthProps, setAuthPropsData } from './auth.actions';

export const authReducer = createReducer(

  initialState,
  
  on(setAuthPropsData, (state, payload) => {
  const newState = {
    ...state,
    user: payload
  };
  return newState;
}),

  on(clearAuthProps, () => {
    return initialState;
  })

);
