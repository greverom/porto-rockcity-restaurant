import { createReducer, on } from '@ngrx/store';
import { showSpinner, hideSpinner } from './spinner.actions';

export interface SpinnerState {
  isLoading: boolean;
}

export const initialSpinnerState: SpinnerState = {
  isLoading: false,
};

export const spinnerReducer = createReducer(
  initialSpinnerState,
  on(showSpinner, (state) => ({ ...state, isLoading: true })),
  on(hideSpinner, (state) => ({ ...state, isLoading: false }))
);