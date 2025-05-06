import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsLoggedIn } from '../redux/authSlice';
import Header from '../common/header';

const RequireAuth = (WrappedComponent) => {
  const AuthWrapper = (props) => {
    const isLoggedIn = useSelector(selectIsLoggedIn);

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    return (
      <>
        <Header />
        <WrappedComponent {...props} />
      </>
    );
  };

  return AuthWrapper;
};

export default RequireAuth;
