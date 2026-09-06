const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

export function getAuthToken() {
  return localStorage.getItem('smartsoil_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('smartsoil_token', token);
    return;
  }

  localStorage.removeItem('smartsoil_token');
}

function getErrorMessage(payload) {
  if (typeof payload.detail === 'string') {
    return payload.detail;
  }

  if (Array.isArray(payload.detail)) {
    return payload.detail
      .map((item) => {
        const field = item.loc?.at(-1);
        const fieldNames = { username: 'Email', password: 'Password', phone: 'Mobile number', otp: 'OTP' };
        if (item.type === 'missing' && fieldNames[field]) {
          return `${fieldNames[field]} is required`;
        }
        return item.msg || 'Invalid input';
      })
      .join('. ');
  }

  return payload.message || 'Request failed';
}

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;
  const isUrlEncoded = options.body instanceof URLSearchParams;

  if (!isFormData && !isUrlEncoded) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body && !isFormData && !isUrlEncoded
      ? typeof options.body === 'string'
        ? options.body
        : JSON.stringify(options.body)
      : options.body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(errorText);
    } catch {
      throw new Error(errorText || 'Request failed');
    }

    throw new Error(getErrorMessage(parsed));
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export function loginUser({ email, password }) {
  const body = new URLSearchParams({ username: email, password });

  return apiRequest('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
}

export function requestOtp(phone) {
  return apiRequest('/auth/request-otp', {
    method: 'POST',
    body: { phone },
  });
}

export function verifyOtp(phone, otp) {
  return apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: { phone, otp },
  });
}

export function registerUser({ fullName, email, password, phone }) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: {
      full_name: fullName,
      email,
      phone: phone || null,
      password,
    },
  });
}

export function getCurrentUser() {
  return apiRequest('/auth/me');
}

export function getWeatherTemperature() {
  return apiRequest('/weather/temperature');
}

export function getMarketPrices() {
  return apiRequest('/weather/market-prices');
}

export function getHistory() {
  return apiRequest('/history');
}

export function getProfile() {
  return apiRequest('/profile');
}

export function analyzeSoil(payload) {
  return apiRequest('/soil/analyze', {
    method: 'POST',
    body: payload,
  });
}

export function getPredictionById(id) {
  return apiRequest(`/history/${id}`);
}

export function logoutUser() {
  setAuthToken(null);
}

export function recommendCrop(payload) {
  return apiRequest('/crop/recommend', {
    method: 'POST',
    body: payload,
  });
}
