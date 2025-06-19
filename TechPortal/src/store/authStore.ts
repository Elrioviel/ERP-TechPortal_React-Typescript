import Cookies from "js-cookie";

// Создаем глобальное хранилище для данных авторизации
interface AuthStore {
    token: string | null;
    logoutCallback: (() => void) | null;
  }
  
  export const authStore: AuthStore = {
    token: null,
    logoutCallback: null,
  };
  
  // Методы для управления аутентификацией из внешних модулей
  export const setAuthToken = (token: string | null) => {
    authStore.token = token;
  };
  
  export const setLogoutCallback = (callback: () => void) => {
    authStore.logoutCallback = callback;
  };
  
  export const getAuthToken = () => {
    if (!authStore.token) {
      authStore.token = Cookies.get("token") || null;
    }
    return authStore.token;
  };
  
  export const executeLogout = () => {
    if (authStore.logoutCallback) {
      authStore.logoutCallback();
    }
  };