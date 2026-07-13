import { createAction, props } from '@ngrx/store';
import { AuthPayload } from './auth.models';

export const setAuthPropsData = createAction(
  '[Auth] Set Auth User',
  props<AuthPayload>()
);

export const clearAuthProps = createAction(
  '[Auth] Clear Auth User'
);
