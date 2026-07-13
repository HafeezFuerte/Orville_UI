import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState =
  createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(
  selectAuthState,
  state => state.user
);

export const selectToken = createSelector(
  selectCurrentUser,
  user => user?.token
);

export const selectUserId = createSelector(
  selectCurrentUser,
  user => user?.userId
);

export const selectCompanyId = createSelector(
  selectCurrentUser,
  user => user?.companyId
);

export const selectUserName = createSelector(
  selectCurrentUser,
  user => user?.userName
);

export const selectRoleName = createSelector(
  selectCurrentUser,
  user => user?.roleName
);

export const selectUserCode = createSelector(
  selectCurrentUser,
  user => user?.userCode
);

export const selectClientId = createSelector(
  selectCurrentUser,
  user => user?.clientId
);

export const selectCurrencyCode = createSelector(
  selectCurrentUser,
  user => user?.currencyCode
);
