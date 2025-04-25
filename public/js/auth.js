// إدارة تسجيل الدخول والخروج
async function register(username, password) {
  const response = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data.message;
}

async function login(username, password) {
  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  localStorage.setItem('token', data.token);
}

function logout() {
  localStorage.removeItem('token');
}

function getToken() {
  return localStorage.getItem('token');
}

async function getActiveUsers() {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch('/users', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
}
