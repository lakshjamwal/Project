import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx'; // ✅ Added
import DashboardLost from './pages/DashboardLost.jsx';
import DashboardFound from './pages/DashboardFound.jsx';
import PostLost from './pages/PostLost.jsx';
import PostFound from './pages/PostFound.jsx';
import ItemDetails from './pages/ItemDetails.jsx';
import Admin from './pages/Admin.jsx';
import NavBar from './components/NavBar.jsx';
import { useAuth } from './context/AuthContext.jsx';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div>
      <NavBar />
      <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> {/* ✅ Added */}
          <Route path="/dashboard/lost" element={<PrivateRoute><DashboardLost /></PrivateRoute>} />
          <Route path="/dashboard/found" element={<PrivateRoute><DashboardFound /></PrivateRoute>} />
          <Route path="/post-lost" element={<PrivateRoute><PostLost /></PrivateRoute>} />
          <Route path="/post-found" element={<PrivateRoute><PostFound /></PrivateRoute>} />
          <Route path="/item/:id" element={<PrivateRoute><ItemDetails /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/dashboard/lost" replace />} />
        </Routes>
        <footer style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/dashboard/lost">Lost</Link> · <Link to="/dashboard/found">Found</Link> · <Link to="/post-lost">Post Lost</Link> · <Link to="/post-found">Post Found</Link>
        </footer>
      </div>
    </div>
  );
}
