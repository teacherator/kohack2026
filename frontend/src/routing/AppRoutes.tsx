import { Routes, Route } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import Default from '../pages/Default';
import MishnahYomiViewer from '../pages/MishnahYomiViewer';
import UserSettingsPage from '../pages/UserSettingsPage';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="Default" element={<Default />} />
        <Route path="mishnah-yomi" element={<MishnahYomiViewer />} />
        <Route path="settings" element={<UserSettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}