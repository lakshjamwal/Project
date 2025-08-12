import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Link to="/dashboard/lost" style={{ fontWeight: 700 }}>CampusCrate</Link>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <>
              <span>Hi, {user.name}</span>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link> {/* ✅ Added */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
