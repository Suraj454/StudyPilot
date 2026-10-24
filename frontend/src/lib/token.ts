const KEY = 'studypilot_token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    // storage unavailable: the user stays logged out
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing to clear
  }
}