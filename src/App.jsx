import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import UserList from './pages/users/List';
import UserCreate from './pages/users/Create';
import UserEdit from './pages/users/Edit';
import ProfileView from './pages/users/View';
import RequireAuth from './hoc/requireAuth';
import RequireAdmin from './hoc/requireAdmin'


const AuthenticatedUserList = RequireAuth(UserList);
const AuthenticatedUserCreate = RequireAdmin(UserCreate);
const AuthenticatedProfileView = RequireAuth(ProfileView);
const AuthenticatedUserEdit = RequireAuth(UserEdit);
const AuthenticatedUserListWithActions = RequireAdmin(UserList);

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AuthenticatedUserList />} />
      <Route path="/create" element={<AuthenticatedUserCreate />} />
      <Route path="/profile/:id" element={<AuthenticatedProfileView />} />
      <Route path="/profile/edit/:id" element={<AuthenticatedUserEdit />} />
      <Route path="/admin" element={<AuthenticatedUserListWithActions />} />
    </Routes>
  );
}

export default App;
