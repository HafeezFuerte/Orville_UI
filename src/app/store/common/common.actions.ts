import { createAction } from '@ngrx/store';
import { CommonState } from './common.state';

export const setCommonData = createAction(
  '[Common] Set Common Data',
  (payload: CommonState) => payload
);

export const clearCommonData = createAction(
  '[Common] Clear Common Data'
);
