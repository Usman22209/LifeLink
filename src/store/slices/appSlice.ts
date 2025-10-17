import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  language: 'en' | 'ur';
  isRtl: boolean;
}

const initialState: AppState = {
  language: 'en',
  isRtl: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'ur'>) => {
      state.language = action.payload;
      state.isRtl = action.payload === 'ur'; 
    },
  },
});

export const { setLanguage } = appSlice.actions;
export const selectLanguage = (state: { app: AppState }) => state.app.language;           
export const selectIsRtl = (state: { app: AppState }) => state.app.isRtl;   
export default appSlice.reducer;
