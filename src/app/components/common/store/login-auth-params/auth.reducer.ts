import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.state';
import { clearAuthProps, setAuthPropsData } from './auth.actions';

export const authReducer = createReducer(

  initialState,

   on(setAuthPropsData, (state, payload) => {

  console.log('Previous State:', state);
  console.log('Payload:', payload);

  const newState = {
    ...state,
    user: payload
  };

  console.log('New State:', newState);

  return newState;
}),


  on(clearAuthProps, () => {
    console.log('CLEAR AUTH');
    return initialState;
  })

);
