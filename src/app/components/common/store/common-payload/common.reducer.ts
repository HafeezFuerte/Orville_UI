import { createReducer } from '@ngrx/store';
import { initialState } from './common.state';

export const commonReducer = createReducer(initialState);
