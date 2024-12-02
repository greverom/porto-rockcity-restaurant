import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SpinnerState } from './spinner.reducer';

export const selectSpinnerState = createFeatureSelector<SpinnerState>('spinner');
export const selectIsLoading = createSelector(selectSpinnerState, (state) => state.isLoading);