import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommonState } from './common.state';

export const selectCommonState =
  createFeatureSelector<CommonState>('common');

export const selectCommonData = createSelector(
  selectCommonState,
  state => state
);
