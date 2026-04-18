import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SignupDTO } from '../../domain/dtos/AuthDTO';

// Keys used in localStorage for auth persistence
const AUTH_KEY = 'employer_auth';

interface PersistedAuth {
  employerId: string;
  accessToken: string;
  logoUrl?: string;
}

const loadFromStorage = (): PersistedAuth | null => {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as PersistedAuth) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (data: PersistedAuth) => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  } catch {}
};

const clearStorage = () => {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {}
};

interface EmployerState {
  employerId: string | null;
  accessToken: string | null;
  logoUrl: string | null;
  isAuthenticated: boolean;
  pendingRegistrationData: Omit<SignupDTO, 'confirmPassword'> | null;
  isMobileSidebarOpen: boolean;
}

const initialState: EmployerState = {
  employerId: null,
  accessToken: null,
  logoUrl: null,
  isAuthenticated: false,
  pendingRegistrationData: null,
  isMobileSidebarOpen: false,
};

const employerSlice = createSlice({
  name: 'employer',
  initialState,
  reducers: {
    hydrate(state) {
      const persisted = loadFromStorage();
      if (persisted) {
        state.employerId = persisted.employerId;
        state.accessToken = persisted.accessToken;
        state.logoUrl = persisted.logoUrl || null;
        state.isAuthenticated = true;
      }
    },
    toggleMobileSidebar(state) {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
    },
    savePendingRegistration(state, action: PayloadAction<Omit<SignupDTO, 'confirmPassword'>>) {
      state.pendingRegistrationData = action.payload;
    },
    clearPendingRegistration(state) {
      state.pendingRegistrationData = null;
    },
    loginSuccess(state, action: PayloadAction<{ employerId: string; accessToken: string; logoUrl?: string }>) {
      state.employerId = action.payload.employerId;
      state.accessToken = action.payload.accessToken;
      state.logoUrl = action.payload.logoUrl || null;
      state.isAuthenticated = true;
      state.pendingRegistrationData = null;
      saveToStorage({ 
        employerId: action.payload.employerId, 
        accessToken: action.payload.accessToken,
        logoUrl: action.payload.logoUrl
      });
    },
    logout(state) {
      state.employerId = null;
      state.accessToken = null;
      state.logoUrl = null;
      state.isAuthenticated = false;
      state.pendingRegistrationData = null;
      clearStorage();
    },
  },
});

export const { loginSuccess, logout, savePendingRegistration, clearPendingRegistration, toggleMobileSidebar, hydrate } = employerSlice.actions;
export default employerSlice.reducer;
