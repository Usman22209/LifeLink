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
export default appSlice.reducer;
