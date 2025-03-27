import { lazy, Suspense, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { AppContextProvider } from '@/context/appContext';
import PageLoader from '@/components/PageLoader';
import AuthRouter from '@/router/AuthRouter';
import Localization from '@/locale/Localization';

const ErpApp = lazy(() => import('./ErpApp'));

const DefaultApp = () => {
  console.log("Inside DefaultApp - Rendering now...");
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

  console.log(
    '🚀 Welcome to Fireblaze! Did you know that we also offer commercial customization services? Contact us at hello@yourdomain.com for more information.'
  );

  useEffect(() => {
    console.log("Checking authentication...");
    console.log("Auth instance:", auth); // Check if Firebase auth is initialized

    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("User  state changed:", user); // Logs user data or null
      setIsLoggedIn(!!user); // Set true if logged in, false if not
      console.log("Updated isLoggedIn state:", !!user);
    });

    unsubscribe(); // Cleanup subscription
  }, []);

  if (isLoggedIn === null) {
    console.log("Rendering PageLoader (Loading screen)...");
    return <PageLoader />;
  } else if (!isLoggedIn) {
    console.log("Rendering AuthRouter (Login page)...");
    return (
      <Localization>
        <AuthRouter />
      </Localization>
    );
  } else {
    console.log("Rendering DefaultApp (Main application)...");
    return <DefaultApp />;
  }
}