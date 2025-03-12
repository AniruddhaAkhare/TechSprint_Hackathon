import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Badge, Button } from 'antd';
import { LogoutOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import { auth, db } from '../../config/firebase'; // Import your Firebase config
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import useLanguage from '@/locale/useLanguage';
import UpgradeButton from './UpgradeButton';

export default function HeaderContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const { Header } = Layout;
  const navigate = useNavigate();
  const translate = useLanguage();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ uid: user.uid, ...userDoc.data() });
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const ProfileDropdown = () => (
    <div className="profileDropdown" onClick={() => navigate('/profile')}>
      <Avatar
        size="large"
        className="last"
        src={currentUser?.photoURL}
        style={{
          color: '#f56a00',
          backgroundColor: currentUser?.photoURL ? 'none' : '#fde3cf',
          boxShadow: 'rgba(150, 190, 238, 0.35) 0px 0px 6px 1px',
        }}
      >
        {currentUser?.displayName?.charAt(0)?.toUpperCase()}
      </Avatar>
      <div className="profileDropdownInfo">
        <p>{currentUser?.displayName}</p>
        <p>{currentUser?.email}</p>
      </div>
    </div>
  );

  const items = [
    {
      label: <ProfileDropdown className="headerDropDownMenu" />,
      key: 'ProfileDropdown',
    },
    { type: 'divider' },
    {
      icon: <UserOutlined />,
      key: 'settingProfile',
      label: (
        <Link to={'/profile'}>
          <span>{translate('profile_settings')}</span>
        </Link>
      ),
    },
    {
      icon: <ToolOutlined />,
      key: 'settingApp',
      label: <Link to={'/settings'}>{translate('app_settings')}</Link>,
    },
    { type: 'divider' },
    {
      icon: <LogoutOutlined />,
      key: 'logout',
      label: <span onClick={handleLogout}>{translate('logout')}</span>,
    },
  ];

  if (!currentUser) return null; // Or loading state

  return (
    <Header
      style={{
        padding: '20px',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        gap: '15px',
      }}
    >
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        placement="bottomRight"
        style={{ width: '280px', float: 'right' }}
      >
        <Avatar
          className="last"
          src={currentUser?.photoURL}
          style={{
            color: '#f56a00',
            backgroundColor: currentUser?.photoURL ? 'none' : '#fde3cf',
            boxShadow: 'rgba(150, 190, 238, 0.35) 0px 0px 10px 2px',
            float: 'right',
            cursor: 'pointer',
          }}
          size="large"
        >
          {currentUser?.displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
      </Dropdown>

      <UpgradeButton />
    </Header>
  );
}