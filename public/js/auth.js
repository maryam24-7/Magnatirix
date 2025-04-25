async function register(username, password) {
  const response = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return await response.json();
}

async function login(username, password) {
  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

function getToken() {
  return localStorage.getItem('token');
}

async function getActiveUsers() {
  const token = getToken();
  const response = await fetch('/users', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
}
