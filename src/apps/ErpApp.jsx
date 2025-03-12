import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { auth, db } from '@/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAppContext } from '@/context/appContext';
import Navigation from '@/apps/Navigation/NavigationContainer';
import HeaderContent from '@/apps/Header/HeaderContainer';
import PageLoader from '@/components/PageLoader';
// import AppRouter from '@/router/AppRouter';
import useResponsive from '@/hooks/useResponsive';

export default function ErpApp() {
  console.log("Inside ErpApp - Component mounted");
  const { Content } = Layout;
  const { isMobile } = useResponsive();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appSettings, setAppSettings] = useState({});
  const { state: stateApp } = useAppContext();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
          setUser({ uid: user.uid, ...doc.data() });
        });

        // Fetch app settings from Firestore
        const settingsDocRef = doc(db, 'settings', 'app_config');
        const unsubscribeSettings = onSnapshot(settingsDocRef, (doc) => {
          if (doc.exists()) {
            setAppSettings(doc.data());
          }
        });

        
          unsubscribeUser();
          unsubscribeSettings();
        
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    unsubscribeAuth();
  }, []);

  // if (loading) return <PageLoader />;

  return (
    <Layout hasSider>
      <Navigation user={user} />

      {isMobile ? (
        <Layout style={{ marginLeft: 0 }}>
          <HeaderContent user={user} />
          <Content
            style={{
              margin: '40px auto 30px',
              overflow: 'initial',
              width: '100%',
              padding: '0 25px',
              maxWidth: 'none',
            }}
          >
            {/* <AppRouter user={user} appSettings={appSettings} /> */}
          </Content>
        </Layout>
      ) : (
        <Layout>
          <HeaderContent user={user} />
          <Content
            style={{
              margin: '40px auto 30px',
              overflow: 'initial',
              width: '100%',
              padding: '0 50px',
              maxWidth: 1400,
            }}
          >
            {/* <AppRouter user={user} appSettings={appSettings} /> */}
          </Content>
        </Layout>
      )}
    </Layout>
  );
}