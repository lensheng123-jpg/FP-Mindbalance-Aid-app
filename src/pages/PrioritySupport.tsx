import React, { useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonTextarea, IonItem, IonLabel, IonAlert, IonButtons, IonBackButton,
  IonCard, IonCardContent, IonIcon, IonText
} from '@ionic/react';
import { useMonetization } from '../theme/MonetizationContext';
import { useAuth } from '../theme/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { arrowBack, mail, star, time, checkmark } from "ionicons/icons";
import { useIonViewWillLeave } from "@ionic/react";


const PrioritySupport: React.FC = () => {
  const { isPro } = useMonetization();
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useIonViewWillLeave(() => {
  // Clear focus before leaving this page (fixes aria-hidden warning)
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
});

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

  const handleSubmit = () => {
    console.log('Support request:', { user: user?.email, message, isPro });
    setMessage('');
    setShowAlert(true);
    setSubmitted(true);
  };

  const supportFeatures = [
    { icon: '🚀', title: 'Fast Response', description: 'Typically within 2 hours' },
    { icon: '⭐', title: 'Priority Handling', description: 'Jump to front of the queue' },
    { icon: '💬', title: 'Direct Chat', description: 'Real-time support available' },
    { icon: '🔧', title: 'Technical Support', description: 'Expert help for any issues' }
  ];

  if (submitted) {
    return (
      <IonPage>
        <IonHeader style={{
          background: `linear-gradient(135deg, ${themeColors[0]} 0%, ${themeColors[1]} 100%)`,
          paddingTop: '20px',
          minHeight: '70px',
          display: 'block'
        }}>
          <IonToolbar style={{
            '--background': 'transparent',
            '--color': 'white',
            '--border-width': '0',
            '--min-height': '50px',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px'
          }}>
            <IonButtons slot="start" style={{ margin: '0', padding: '0', minWidth: 'auto' }}>
              <IonBackButton 
                defaultHref="/home" 
                text=""
                icon={arrowBack}
                style={{
                  color: 'white',
                  '--background': 'rgba(255,255,255,0.15)',
                  '--background-hover': 'rgba(255,255,255,0.25)',
                  '--border-radius': '8px',
                  '--padding-start': '8px',
                  '--padding-end': '8px',
                  '--padding-top': '6px',
                  '--padding-bottom': '6px',
                  width: '36px',
                  height: '36px',
                  fontSize: '16px',
                  margin: '0'
                }}
              />
            </IonButtons>
            
            <IonTitle style={{ 
              fontSize: "1.1rem", 
              fontWeight: "600",
              color: 'white',
              textAlign: 'center',
              padding: '0 8px',
              margin: '0',
              lineHeight: '1.2'
            }}>
              🚀 Priority Support
            </IonTitle>
            
            <div style={{ width: '36px' }}></div>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding" style={{ 
          '--padding-top': '16px',
          '--padding-bottom': '16px',
          '--padding-start': '12px',
          '--padding-end': '12px'
        }}>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '16px' 
            }}>✅</div>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#28a745'
            }}>
              Message Sent!
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#666',
              marginBottom: '24px'
            }}>
              We've received your support request and will get back to you within 2 hours.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <IonButton 
                size="small" 
                onClick={() => setSubmitted(false)}
              >
                Send Another
              </IonButton>
              <IonButton 
                size="small" 
                fill="outline"
                routerLink="/home"
              >
                Back Home
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!isPro) {
    return (
      <IonPage>
        <IonHeader style={{
          background: `linear-gradient(135deg, ${themeColors[0]} 0%, ${themeColors[1]} 100%)`,
          paddingTop: '20px',
          minHeight: '70px',
          display: 'block'
        }}>
          <IonToolbar style={{
            '--background': 'transparent',
            '--color': 'white',
            '--border-width': '0',
            '--min-height': '50px',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px'
          }}>
            <IonButtons slot="start" style={{ margin: '0', padding: '0', minWidth: 'auto' }}>
              <IonBackButton 
                defaultHref="/home" 
                text=""
                icon={arrowBack}
                style={{
                  color: 'white',
                  '--background': 'rgba(255,255,255,0.15)',
                  '--background-hover': 'rgba(255,255,255,0.25)',
                  '--border-radius': '8px',
                  '--padding-start': '8px',
                  '--padding-end': '8px',
                  '--padding-top': '6px',
                  '--padding-bottom': '6px',
                  width: '36px',
                  height: '36px',
                  fontSize: '16px',
                  margin: '0'
                }}
              />
            </IonButtons>
            
            <IonTitle style={{ 
              fontSize: "1.1rem", 
              fontWeight: "600",
              color: 'white',
              textAlign: 'center',
              padding: '0 8px',
              margin: '0',
              lineHeight: '1.2'
            }}>
              🚀 Priority Support
            </IonTitle>
            
            <div style={{ width: '36px' }}></div>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding" style={{ 
          '--padding-top': '16px',
          '--padding-bottom': '16px',
          '--padding-start': '12px',
          '--padding-end': '12px'
        }}>
          <IonCard style={{ 
            background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
            color: 'white',
            marginBottom: '16px',
            borderRadius: '12px'
          }}>
            <IonCardContent style={{ 
              padding: '24px 16px',
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔒</div>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                Priority Support Locked
              </h2>
              <p style={{ 
                fontSize: '14px', 
                marginBottom: '20px',
                opacity: 0.9
              }}>
                Upgrade to Pro for fast, dedicated support!
              </p>
              <IonButton 
                size="small"
                color="light"
                routerLink="/home"
                style={{ height: '36px', fontSize: '13px' }}
              >
                ← Back to Home
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader style={{
        background: `linear-gradient(135deg, ${themeColors[0]} 0%, ${themeColors[1]} 100%)`,
        paddingTop: '20px',
        minHeight: '70px',
        display: 'block'
      }}>
        <IonToolbar style={{
          '--background': 'transparent',
          '--color': 'white',
          '--border-width': '0',
          '--min-height': '50px',
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px'
        }}>
          <IonButtons slot="start" style={{ margin: '0', padding: '0', minWidth: 'auto' }}>
            <IonBackButton 
              defaultHref="/home" 
              text=""
              icon={arrowBack}
              style={{
                color: 'white',
                '--background': 'rgba(255,255,255,0.15)',
                '--background-hover': 'rgba(255,255,255,0.25)',
                '--border-radius': '8px',
                '--padding-start': '8px',
                '--padding-end': '8px',
                '--padding-top': '6px',
                '--padding-bottom': '6px',
                width: '36px',
                height: '36px',
                fontSize: '16px',
                margin: '0'
              }}
            />
          </IonButtons>
          
          <IonTitle style={{ 
      fontSize: "1.1rem", 
      fontWeight: "600",
      color: 'white',
      textAlign: 'left', // Changed from center to left
      padding: '0 8px',
      margin: '0',
      lineHeight: '1.2',
      flex: '1', // Takes remaining space
      marginLeft: '8px' // Small gap from back button
          }}>
            🚀 Priority Support
          </IonTitle>
          
          <div style={{ width: '36px' }}></div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ 
        '--padding-top': '16px',
        '--padding-bottom': '16px',
        '--padding-start': '12px',
        '--padding-end': '12px'
      }}>
        {/* Pro Support Badge */}
        <IonCard style={{ 
          background: `linear-gradient(135deg, ${themeColors[0]} 0%, ${themeColors[1]} 100%)`,
          color: 'white',
          marginBottom: '16px',
          borderRadius: '12px'
        }}>
          <IonCardContent style={{ 
            padding: '16px',
            textAlign: 'center' 
          }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <IonIcon icon={star} style={{ fontSize: '16px' }} />
              PRO PRIORITY SUPPORT
            </div>
            <div style={{ fontSize: '13px', opacity: 0.9 }}>
              Fast, dedicated support for Pro users
            </div>
          </IonCardContent>
        </IonCard>

        {/* Support Features Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {supportFeatures.map((feature, index) => (
            <div key={index} style={{
              background: '#f8f9fa',
              padding: '12px',
              borderRadius: '10px',
              textAlign: 'center',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '6px' }}>
                {feature.icon}
              </div>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: 'bold',
                marginBottom: '2px'
              }}>
                {feature.title}
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: '#6c757d'
              }}>
                {feature.description}
              </div>
            </div>
          ))}
        </div>

        {/* Support Form */}
        <IonCard style={{ marginBottom: '16px', borderRadius: '12px' }}>
          <IonCardContent style={{ padding: '16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <IonText style={{ fontSize: '14px', fontWeight: '600' }}>
                📝 Describe Your Issue
              </IonText>
            </div>
            
            <IonTextarea
              placeholder="Tell us how we can help you..."
              value={message}
              onIonInput={(e) => setMessage(e.detail.value!)}
              style={{
                fontSize: '14px',
                minHeight: '120px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px'
              }}
            />
            
            <IonButton 
              expand="block"
              size="small"
              onClick={handleSubmit}
              disabled={!message.trim()}
              style={{ height: '36px', fontSize: '13px' }}
            >
              <IonIcon icon={mail} slot="start" style={{ fontSize: '14px' }} />
              Send Priority Request
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Contact Info */}
        <IonCard style={{ borderRadius: '12px' }}>
          <IonCardContent style={{ padding: '16px' }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <IonIcon icon={time} style={{ fontSize: '14px' }} />
              Response Time
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
              <strong>Email:</strong> support@mindbalance.com<br/>
              <strong>Response:</strong> 1-2 hours (Pro users)
            </div>
            
            <IonButton 
              size="small" 
              fill="solid" 
              color= "primary" // Automatically uses the Ionic theme color.
              expand="block"
              routerLink="/home"
              style={{ fontSize: '12px', height: '32px' }}
            >
              <IonIcon icon={arrowBack} slot="start" style={{ fontSize: '12px' }} />
              Back to Home
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Priority Support Request Sent"
          message="Your priority support request has been submitted! We'll contact you within 2 hours."
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default PrioritySupport;
