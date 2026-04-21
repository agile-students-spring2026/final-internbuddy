import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import ProtectedRoute from './ProtectedRoute';

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <>
        <Outlet />
        <BottomNav />
      </>
    </ProtectedRoute>
  );
}

export default ProtectedLayout;