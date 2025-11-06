import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonText, IonSpinner, IonAlert, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../theme/AuthContext";
import { useMonetization } from "../theme/MonetizationContext";
import { useUserStatus } from "../theme/useUserStatus";
import { useTheme } from "../theme/ThemeContext"; // ADD THIS IMPORT
import { 
  scheduleDailyReminder, 
  testNotification, 
  cancelAllNotifications, 
  getPendingNotifications,
  checkNotificationSettings,
  recreateChannelWithSound
} from "../Services/NotificationService";
import { useEffect, useState } from "react";
import AddMood from "../components/AddMood";
import MoodList from "../components/MoodList";
import MoodTrendChart from "../components/MoodTrendChart";
import MoodPie from "../components/MoodPie";
import StressTrendChart from "../components/StressTrendChart";
import ProFeatures from "../theme/ProFeatures";
import { isWeb } from '../utils/PlatformUtils';
import { Capacitor } from "@capacitor/core";
import { auth } from "../firebaseConfig";


export default function Home() {
  const history = useHistory();
  const { user, logout } = useAuth();
  const { isPro } = useMonetization();
  const { isNewUser, userStatus } = useUserStatus();
  const { currentTheme } = useTheme(); // ADD THIS HOOK
  const [loading, setLoading] = useState(false);
  const [showSoundAlert, setShowSoundAlert] = useState(false);
  const [ setNotificationSettings] = useState<any>(null);
  

  // Function to get theme colors based on current theme
  const getThemeColors = () => {
    const themes = {
      default: ['#667eea', '#764ba2'],
      dark: ['#2a2a2a', '#444444'],
      blue: ['#1e88e5', '#4fc3f7'],
      green: ['#43a047', '#66bb6a'],
      purple: ['#8e24aa', '#ba68c8']
    };
    return themes[currentTheme as keyof typeof themes] || themes.default;
  };

  const themeColors = getThemeColors();

  useEffect(() => {
    console.log('🏠 Home component - User:', user?.email, 'IsPro:', isPro, 'UserStatus:', userStatus, 'Theme:', currentTheme);
    
    const checkSettings = async () => {
      const settings = await checkNotificationSettings();
      setNotificationSettings(settings);
    };
    checkSettings();
  }, [user, isPro, userStatus, currentTheme]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      history.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

const navigateToMindfulness = () => {
  // 👇 This line removes focus from the button before navigation
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  history.push('/mindfulness');
};



  const handleTestNotification = async () => {
    setLoading(true);
    try {
      await testNotification();
      
      if (!isWeb() && Capacitor.getPlatform() === 'android') {
        setTimeout(() => setShowSoundAlert(true), 2000);
      }
    } catch (error) {
      console.error('Test notification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleReminder = async () => {
    setLoading(true);
    try {
      await scheduleDailyReminder();
    } catch (error) {
      console.error('Schedule reminder error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPending = async () => {
    setLoading(true);
    try {
      await getPendingNotifications();
    } catch (error) {
      console.error('Check pending error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAll = async () => {
    setLoading(true);
    try {
      await cancelAllNotifications();
    } catch (error) {
      console.error('Cancel all error:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleFixSoundChannels = async () => {
    setLoading(true);
    try {
      await recreateChannelWithSound();
    } catch (error) {
      console.error('Fix sound channels error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle style={{ fontSize: "1.1rem", fontWeight: "600" }}>
              🌟 MindBalance Aid
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>Please log in to continue...</p>
          <IonButton expand="block" onClick={() => history.replace('/login')}>
            Go to Login
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  const platformText = isWeb() ? 'Web Browser' : 
    Capacitor.getPlatform() === 'android' ? 'Android Mobile' : 
    Capacitor.getPlatform() === 'ios' ? 'iOS Mobile' : 'Mobile Device';

  // Determine welcome message based on user status - ADD THIS FUNCTION
  const getWelcomeMessage = () => {
    const userName = user.email?.split('@')[0] || 'there';
    
    if (userStatus === 'new') {
      return {
        title: 'Welcome to MindBalance Aid! 🎉',
        subtitle: `We're excited to help you track your mood, ${userName}!`
      };
    } else {
      return {
        title: 'Welcome back! 👋',
        subtitle: `Ready to track your mood today, ${userName}?`
      };
    }
  };

  const welcomeMessage = getWelcomeMessage();

  return (
   <IonPage>
  {/* Updated Header with Dynamic Theme Colors */}
 <IonHeader style={{
  background: `linear-gradient(135deg, ${themeColors[0]} 0%, ${themeColors[1]} 100%)`, // DYNAMIC COLORS
  paddingTop: '25px',
  minHeight: '80px',
  display: 'block'
}}>
  <IonToolbar style={{
    '--background': 'transparent',
    '--color': 'white',
    '--border-width': '0',
    '--min-height': '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px'
  }}>
    {/* Title - Left aligned like login page */}
    <IonTitle style={{ 
      fontSize: "1.3rem", 
      fontWeight: "700",
      color: 'white',
      textAlign: 'left',
      padding: '0',
      margin: '0',
      lineHeight: '1.2',
      flex: '1'
    }}>
      🌟 MindBalance Aid
    </IonTitle>
    
    {/* Logout button - Right aligned */}
    <IonButtons slot="end" style={{
      margin: '0',
      padding: '0',
      marginLeft: 'auto'
    }}>
      <IonButton 
        onClick={handleLogout}
        size="small"
        fill="solid"
        style={{
          fontSize: "0.8rem",
          fontWeight: "600",
          '--background': 'rgba(255,255,255,0.2)',
          '--background-hover': 'rgba(255,255,255,0.3)',
          '--color': 'white',
          '--border-radius': '6px',
          '--padding-start': '12px',
          '--padding-end': '12px',
          height: '32px'
        }}
      >
        Logout
      </IonButton>
    </IonButtons>
  </IonToolbar>
</IonHeader>


      <IonContent className="ion-padding">
        {/* Welcome Section with Dynamic Theme Colors */}
        <IonCard style={{ 
          background: `linear-gradient(135deg, ${themeColors[0]} 0%, ${themeColors[1]} 100%)`, // DYNAMIC COLORS
          color: 'white',
          marginBottom: '20px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <IonCardHeader>
            <IonCardTitle style={{ 
              fontSize: '1.4rem', 
              fontWeight: '700',
              color: 'white',
              marginBottom: '8px'
            }}>
              {welcomeMessage.title}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p style={{ 
              fontSize: '1rem', 
              margin: '0',
              opacity: '0.9',
              fontWeight: '400'
            }}>
              {welcomeMessage.subtitle}
            </p>
            
            {/* Special message for new users */}
            {userStatus === 'new' && (
              <div style={{
                marginTop: '15px',
                padding: '10px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
                  🚀 Get started:
                </p>
                <ul style={{ margin: '0', paddingLeft: '15px', opacity: '0.9' }}>
                  <li>Track your first mood entry below</li>
                  <li>Explore mindfulness exercises</li>
                  <li>Set up daily reminders</li>
                </ul>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        {/* Quick Stats Card - UPDATED WITH USER STATUS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#495057' }}>
              {isPro ? 'PRO' : 'FREE'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '4px' }}>
              Account Type
            </div>
          </div>
          <div style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#495057' }}>
              {platformText.split(' ')[0]}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '4px' }}>
              Platform
            </div>
          </div>
          {/* ADD USER STATUS INDICATOR */}
          <div style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: userStatus === 'new' ? '#28a745' : '#6c757d'
            }}>
              {userStatus === 'new' ? 'NEW' : 'RET'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '4px' }}>
              {userStatus === 'new' ? 'New User' : 'Returning'}
            </div>
          </div>
        </div>

       
        {/* Pro Features */}
        <ProFeatures />

        {/* Quick Actions */}
        <IonCard style={{ marginBottom: '20px' }}>
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: '1.1rem' }}>
              🚀 Quick Actions
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton 
              expand="block" 
              onClick={navigateToMindfulness}
              style={{ marginBottom: '12px' }}
              color="tertiary"
              size="default"
            >
              🧘 Mindfulness Exercises
            </IonButton>

            {isPro && (
              <>
                <IonButton 
                  expand="block" 
                  routerLink="/themes"
                  style={{ marginBottom: '12px' }}
                  color="secondary"
                  size="default"
                >
                  🎨 Custom Themes
                </IonButton>
                
                <IonButton 
                  expand="block" 
                  routerLink="/support"
                  color="tertiary"
                  size="default"
                >
                  🚀 Priority Support
                </IonButton>
              </>
            )}
          </IonCardContent>
        </IonCard>

        {/* Notification Testing Section */}
        <IonCard style={{ 
          background: isWeb() ? '#fffbf0' : '#f0f9ff',
          marginBottom: '20px',
          border: `2px solid ${isWeb() ? '#ffecb5' : '#b3e0ff'}`
        }}>
          <IonCardHeader>
            <IonCardTitle style={{ 
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🔔 Notification Testing/Setting {loading && <IonSpinner name="crescent" />}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ 
                color: isWeb() ? '#856404' : '#055160', 
                fontSize: '0.9rem',
                fontWeight: '500',
                margin: '0 0 8px 0'
              }}>
                {platformText} Detected
              </p>
              {isWeb() ? (
                <p style={{ color: '#856404', fontSize: '0.8rem', margin: 0 }}>
                  ⚠️ Notifications work best on mobile devices with full sound support.
                </p>
              ) : (
                <p style={{ color: '#055160', fontSize: '0.8rem', margin: 0 }}>
                  ✅ Notifications configured for Android with sound & vibration.
                </p>
              )}
            </div>

            {/* Sound Fix Button for Android */}
            {!isWeb() && (
              <IonButton 
                expand="block" 
                size="small" 
                onClick={handleFixSoundChannels}
                color="warning"
                style={{ marginBottom: '10px', fontSize: '0.8rem' }}
                disabled={loading}
              >
                🔧 Fix Sound Channels
              </IonButton>
            )}
            
            <IonButton 
              expand="block" 
              size="small" 
              onClick={handleTestNotification}
              color={isWeb() ? 'warning' : 'success'}
              style={{ marginBottom: '8px', fontSize: '0.8rem' }}
              disabled={loading}
            >
              {isWeb() ? '🔕 Test Notification' : '🔊 Test Notification'}
            </IonButton>
            
            <IonButton 
              expand="block" 
              size="small" 
              onClick={handleScheduleReminder}
              color="medium"
              style={{ marginBottom: '8px', fontSize: '0.8rem' }}
              disabled={loading}
            >
              📅 Schedule Daily (7 PM)
            </IonButton>
            
            <IonButton 
              expand="block" 
              size="small" 
              onClick={handleCheckPending}
              color="medium"
              style={{ marginBottom: '8px', fontSize: '0.8rem' }}
              disabled={loading}
            >
              📋 Check Pending
            </IonButton>
            
            <IonButton 
              expand="block" 
              size="small" 
              onClick={handleCancelAll}
              color="danger"
              style={{ marginBottom: '8px', fontSize: '0.8rem' }}
              disabled={loading}
            >
              🗑️ Cancel All
            </IonButton>
            
            
          </IonCardContent>
        </IonCard>

        {/* Sound Troubleshooting Alert */}
        <IonAlert
          isOpen={showSoundAlert}
          onDidDismiss={() => setShowSoundAlert(false)}
          header="Sound Check 🔊"
          message={`
            If you didn't hear sound:

            1. First click "Fix Sound Channels" button
            2. Then test notification again
            3. Check device volume
            4. Ensure Do Not Disturb is off

            For Pixel 6 API 33 emulator:
            • Check emulator audio settings
            • Device volume might be muted
          `}
          buttons={['OK, Got it!']}
        />

        {/* Main App Components */}
        <AddMood userId={user.uid} />
        <MoodTrendChart userId={user.uid} />
        <MoodPie userId={user.uid} />
        
        {isPro ? (
          <StressTrendChart userId={user.uid} />
        ) : (
          <IonCard style={{ 
            background: '#fffbf0',
            margin: '20px 0'
          }}>
            <IonCardContent style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔒</div>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                color: '#856404',
                margin: '0 0 8px 0'
              }}>
                Advanced Analytics Locked
              </h3>
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#856404', 
                margin: 0 
              }}>
                Upgrade to Pro to unlock the Stress Trend Chart and advanced insights
              </p>
            </IonCardContent>
          </IonCard>
        )}
        
        <MoodList userId={user.uid} />
      </IonContent>
    </IonPage>
  );
}
