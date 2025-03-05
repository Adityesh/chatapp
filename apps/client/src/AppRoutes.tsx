import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/page/protected-route.tsx';
import { APP_URL } from '@/constants/clientUrl.constants.ts';
import Auth from '@/page/auth';
import Settings from '@/page/settings';
import Chat from '@/page/chat';
import SideBar from '@/components/Sidebar';
export default function() {
  return (
    <BrowserRouter>
      <SideBar />
      <Routes>
        <Route index element={<div>Index element</div>} />
        <Route path={APP_URL.AUTH} element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route path={APP_URL.SETTINGS} element={<Settings/>}/>
          <Route path={APP_URL.CHAT} element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}