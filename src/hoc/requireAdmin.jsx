import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsLoggedIn, selectUser } from '../redux/authSlice';
import Header from '../common/header';

const RequireAdmin = (WrappedComponent) => {
  const AuthWrapper = (props) => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const user = useSelector(selectUser)
    if (!isLoggedIn && user.role !== "admin") {
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

export default RequireAdmin;
