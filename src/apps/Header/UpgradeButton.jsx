

import { Avatar, Popover, Button, Badge, Col, List } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { analytics, auth } from '../../config/firebase'; // Import Firebase services
import { logEvent } from "firebase/analytics";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../config/firebase'; // Import Firestore if needed

export default function UpgradeButton() {
    const translate = useLanguage();

    const handleUpgradeClick = async () => {
        try {
            // Track the upgrade click event
            logEvent(analytics, 'upgrade_button_click', {
                user_id: auth.currentUser?.uid,
                timestamp: new Date().toISOString()
            });

            // Optionally store in Firestore
            if (auth.currentUser) {
                await setDoc(doc(db, 'upgrade_clicks', Date.now().toString()), {
                    userId: auth.currentUser.uid,
                    clickedAt: new Date(),
                    action: 'enterprise_version_click'
                });
            }

             window.open(`https://cloud.idurarapp.com`);
        } catch (error) {
        }
    };

    return (
        <Badge count={1} size="small">
            <Button
                type="primary"
                style={{
                    float: 'right',
                    marginTop: '5px',
                    cursor: 'pointer',
                    background: '#16923e',
                    boxShadow: '0 2px 0 rgb(82 196 26 / 20%)',
                }}
                icon={<RocketOutlined />}
                onClick={handleUpgradeClick}
            >
                {translate('Try Entreprise Version')}
            </Button>
        </Badge>
    );
}