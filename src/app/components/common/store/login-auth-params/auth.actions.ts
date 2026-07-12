import { createAction, props } from '@ngrx/store';
import { AuthPayload } from './auth.models';

export const setAuthPropsData = createAction(
  '[Common] Set Common Data',
  (payload: AuthPayload) => payload
);

export const clearAuthProps = createAction(
  '[Auth] Clear Auth'
);