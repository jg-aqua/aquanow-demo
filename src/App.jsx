import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Layout from '@/components/wallet/Layout';
import Home from '@/pages/Home';
import Market from '@/pages/Market';
import AssetDetail from '@/pages/AssetDetail';
import Activity from '@/pages/Activity';
import Send from '@/pages/Send';
import Receive from '@/pages/Receive';
import Swap from '@/pages/Swap';
import Buy from '@/pages/Buy';
import Sell from '@/pages/Sell';
import Profile from '@/pages/Profile';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/asset/:symbol" element={<AssetDetail />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/send" element={<Send />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <SonnerToaster
          position="top-center"
          theme="dark"
          toastOptions={{
            style: {
              background: 'hsl(230 14% 9%)',
              border: '1px solid hsl(230 10% 16%)',
              color: 'hsl(36 15% 96%)',
            },
          }}
        />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App