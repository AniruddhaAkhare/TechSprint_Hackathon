import { lazy, Suspense, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { AppContextProvider } from '@/context/appContext';
import PageLoader from '@/components/PageLoader';
import AuthRouter from '@/router/AuthRouter';
import Localization from '@/locale/Localization';

const ErpApp = lazy(() => import('./ErpApp'));

const DefaultApp = () => {
  return (
    <Localization>
      <AppContextProvider>
        <Suspense fallback={<PageLoader />}>
          <ErpApp />
        </Suspense>
      </AppContextProvider>
    </Localization>
  );
};

export default function IdurarOs() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Use null to indicate loading


  useEffect(() => {
    

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user); // Set true if logged in, false if not
    });

    unsubscribe(); // Cleanup subscription
  }, []);

  if (isLoggedIn === null) {
    return <PageLoader />;
  } else if (!isLoggedIn) {
    return (
      <Localization>
        <AuthRouter />
      </Localization>
    );
  } else {
    return <DefaultApp />;
  }
}