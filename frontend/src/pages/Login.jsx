import { useEffect, useRef, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { setUser } = useAuth();
  const googleBtn = useRef();
  const [devEmail, setDevEmail] = useState('student@example.com');
  const [devName, setDevName] = useState('Student');

  // ✅ New: Email/password login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const doEmailLogin = async () => {
    try {
      const { data } = await api.post('/auth/login', { email: loginEmail, password: loginPassword });
      setUser(data.user);
      window.location.href = '/dashboard/lost';
    } catch {
      alert('Login failed');
    }
  };

  const useGoogle = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  const devBypass = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

  useEffect(() => {
    if (!useGoogle) return;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const init = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (resp) => {
          try {
            const { data } = await api.post('/auth/google', { idToken: resp.credential });
            setUser(data.user);
            window.location.href = '/dashboard/lost';
          } catch (e) {
            alert('Google login failed');
          }
        }
      });
      window.google.accounts.id.renderButton(googleBtn.current, { theme: 'outline', size: 'large', text: 'continue_with' });
    };
    if (document.readyState === 'complete') init(); else window.addEventListener('load', init);
    return () => window.removeEventListener('load', init);
  }, [useGoogle, setUser]);

  const doDevLogin = async () => {
    try {
      const { data } = await api.post('/auth/dev-login', { email: devEmail, name: devName });
      setUser(data.user);
      window.location.href = '/dashboard/lost';
    } catch {
      alert('Dev login failed (enable on server)');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '48px auto' }}>
      <h2>Login</h2>

      {/* ✅ Email/password login */}
      <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Email Login</div>
        <input placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
        <button onClick={doEmailLogin} style={{ marginTop: 8 }}>Login</button>
      </div>

      {useGoogle && (
        <>
          <div ref={googleBtn}></div>
          <div style={{ margin: '12px 0', color: '#666' }}>or</div>
        </>
      )}

      {devBypass && (
        <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Dev Login (Local)</div>
          <input placeholder="Name" value={devName} onChange={(e) => setDevName(e.target.value)} />
          <input placeholder="Email" value={devEmail} onChange={(e) => setDevEmail(e.target.value)} />
          <button onClick={doDevLogin} style={{ marginTop: 8 }}>Login</button>
        </div>
      )}
    </div>
  );
}
