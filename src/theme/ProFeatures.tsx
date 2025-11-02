import React, { useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonAlert } from '@ionic/react';
import { useMonetization } from './MonetizationContext';
import { useAuth } from './AuthContext';

const ProFeatures: React.FC = () => {
  const { isPro, upgradeToPro } = useMonetization();
  const { user } = useAuth();
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false);

  // Don't show Pro features if no user is logged in
  if (!user) {
    return null;
  }

  if (isPro) {
    return (
      <IonCard color="primary">
        <IonCardHeader>
          <IonCardTitle>🌟 Pro Features Unlocked</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {/* PRO FEATURES LIST */}
          <p>✅ <strong>Advanced analytics</strong> - Detailed insights and trends</p>
          <p>✅ <strong>Unlimited mood history</strong> - Access all your past entries</p>
          <p>✅ <strong>Custom themes</strong> - Personalize your app with different color schemes</p>
          <p>✅ <strong>Priority support</strong> - Faster responses and dedicated help</p>
          
          <p style={{ marginTop: '15px', fontStyle: 'italic' }}>
            Account: {user.email}
          </p>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <>
      <IonCard color="warning">
        <IonCardHeader>
          <IonCardTitle>🔒 Pro Features Locked</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>Upgrade to unlock these premium features:</p>
          
          {/* LOCKED FEATURES LIST */}
          <p>❌ <strong>Advanced analytics</strong> - Detailed insights and trends</p>
          <p>❌ <strong>Unlimited mood history</strong> - Access all your past entries</p>
          <p>❌ <strong>Custom themes</strong> - Personalize your app with different color schemes</p>
          <p>❌ <strong>Priority support</strong> - Faster responses and dedicated help</p>
          
          <p style={{ marginTop: '15px', fontStyle: 'italic' }}>
            Current account: {user.email}
          </p>
          
          <IonButton 
            expand="block" 
            color="success" 
            onClick={() => setShowUpgradeAlert(true)}
            style={{ marginTop: '15px' }}
          >
            Upgrade to Pro - $4.99
          </IonButton>
        </IonCardContent>
      </IonCard>

      <IonAlert
        isOpen={showUpgradeAlert}
        onDidDismiss={() => setShowUpgradeAlert(false)}
        header="Upgrade to Pro"
        message={`Upgrade account "${user.email}" to Pro for $4.99 one-time payment?\n\nYou'll unlock:\n• Advanced analytics\n• Unlimited mood history\n• Custom themes\n• Priority support`}
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { 
            text: 'Purchase', 
            handler: upgradeToPro 
          }
        ]}
      />
    </>
  );
};

export default ProFeatures;