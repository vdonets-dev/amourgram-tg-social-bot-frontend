import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';

interface PrivateRouteProps {}

export const PrivateRoute: FC<PropsWithChildren<PrivateRouteProps>> = ({ children }) => {
  const { isUserLoggedIn } = useAuth();

  if (!isUserLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
