import React from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonGrid, 
  IonRow, IonCol, IonAlert, IonButtons, IonBackButton, IonIcon, IonText
} from '@ionic/react';
import { useMonetization } from '../theme/MonetizationContext';
import { useTheme, Theme } from '../theme/ThemeContext';
import { arrowBack, checkmark, colorPalette } from "ionicons/icons";
import { useIonViewWillLeave } from "@ionic/react";


const CustomThemes: React.FC = () => {
  const { isPro } = useMonetization();
  const { currentTheme, setTheme } = useTheme();
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState<Theme>('default');

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

  const themes = [
    { id: 'default' as Theme, name: 'Default', colors: ['#667eea', '#764ba2'], description: 'Clean blue theme', icon: '🎨' },
    { id: 'dark' as Theme, name: 'Dark Mode', colors: ['#2a2a2a', '#444444'], description: 'Easy on the eyes', icon: '🌙' },
    { id: 'blue' as Theme, name: 'Ocean Blue', colors: ['#1e88e5', '#4fc3f7'], description: 'Calm blue tones', icon: '💧' },
    { id: 'green' as Theme, name: 'Forest Green', colors: ['#43a047', '#66bb6a'], description: 'Nature inspired', icon: '🌿' },
    { id: 'purple' as Theme, name: 'Royal Purple', colors: ['#8e24aa', '#ba68c8'], description: 'Rich purple theme', icon: '👑' },
  ];

  const handleApplyTheme = (theme: Theme) => {
    setTheme(theme);
    setSelectedTheme(theme);
    setShowSuccessAlert(true);
  };

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
              🎨 Custom Themes
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
                Custom Themes Locked
              </h2>
              <p style={{ 
                fontSize: '14px', 
                marginBottom: '20px',
                opacity: 0.9
              }}>
                Upgrade to Pro to unlock beautiful custom themes!
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
            🎨 Custom Themes
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
        {/* Current Theme Display */}
        <IonCard style={{ marginBottom: '16px', borderRadius: '12px' }}>
          <IonCardContent style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <IonIcon icon={colorPalette} style={{ fontSize: '16px' }} />
              Current Theme
            </div>
            <div style={{
              background: `linear-gradient(135deg, ${themeColors[0]} 0%, ${themeColors[1]} 100%)`,
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {themes.find(t => t.id === currentTheme)?.name}
              </div>
            </div>
            <IonText style={{ fontSize: '13px', color: '#666' }}>
              Select a theme below to change the appearance
            </IonText>
          </IonCardContent>
        </IonCard>

        {/* Theme Selection Grid */}
        <IonGrid style={{ marginBottom: '16px' }}>
          <IonRow>
            {themes.map((theme) => (
              <IonCol size="6" key={theme.id}>
                <IonCard 
                  style={{ 
                    margin: '0 0 12px 0',
                    borderRadius: '12px',
                    border: currentTheme === theme.id ? `2px solid ${theme.colors[0]}` : '1px solid #e9ecef',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleApplyTheme(theme.id)}
                >
                  <div 
                    style={{ 
                      height: '60px',
                      background: `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 100%)`,
                      borderRadius: '10px 10px 0 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}
                  >
                    {theme.icon}
                    {currentTheme === theme.id && (
                      <div style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IonIcon icon={checkmark} style={{ color: theme.colors[0], fontSize: '12px' }} />
                      </div>
                    )}
                  </div>
                  
                  <IonCardContent style={{ padding: '12px 8px' }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '600',
                      textAlign: 'center',
                      marginBottom: '4px'
                    }}>
                      {theme.name}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#666',
                      textAlign: 'center'
                    }}>
                      {theme.description}
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* Quick Actions */}
        <IonCard style={{ borderRadius: '12px' }}>
          <IonCardContent style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <IonButton 
                size="small" 
                fill="outline" 
                expand="block"
                routerLink="/home"
                style={{ fontSize: '12px', height: '32px' }}
              >
                <IonIcon icon={arrowBack} slot="start" style={{ fontSize: '12px' }} />
                Back Home
              </IonButton>
              <IonButton 
                size="small" 
                fill="solid" 
                expand="block"
                onClick={() => setTheme('default')}
                style={{ fontSize: '12px', height: '32px' }}
              >
                🔄 Reset
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <IonAlert
          isOpen={showSuccessAlert}
          onDidDismiss={() => setShowSuccessAlert(false)}
          header="Theme Applied!"
          message={`Your theme has been changed to ${themes.find(t => t.id === selectedTheme)?.name}`}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default CustomThemes;