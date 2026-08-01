import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.state';
import { clearAuthProps, setAuthPropsData } from './auth.actions';

export const authReducer = createReducer(

  initialState,
  
  on(setAuthPropsData, (state, payload) => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(payload));
      localStorage.setItem('token', payload.token || '');
    } catch (e) {}
    const newState = {
      ...state,
      user: payload
    };
    return newState;
  }),

  on(clearAuthProps, () => {
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    } catch (e) {}
    return { user: null };
  })

);
