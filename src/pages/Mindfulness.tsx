import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonButtons, IonBackButton, IonCard, IonCardContent, IonCardHeader,
  IonIcon, IonText
} from "@ionic/react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from '../theme/ThemeContext';
import { arrowBack, time, play, stop } from "ionicons/icons";
import { useIonViewWillLeave } from "@ionic/react";


export default function Mindfulness() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { currentTheme } = useTheme();
  
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

  const startTimer = (minutes: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setTimeLeft(minutes * 60);
    setIsActive(true);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev > 1) return prev - 1;
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsActive(false);
        return 0;
      });
    }, 1000);
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeLeft(null);
    setIsActive(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <IonPage>
      {/* Updated Header with Dynamic Theme Colors */}
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
          {/* SMALLER BACK BUTTON */}
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
          
          {/* Title - Now Right/Aligned (Left side of available space) */}
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
      🧘 Mindfulness Exercises
    </IonTitle>

          
          {/* SPACER FOR BALANCE */}
          <div style={{ width: '36px' }}></div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ 
        '--padding-top': '16px',
        '--padding-bottom': '16px',
        '--padding-start': '12px',
        '--padding-end': '12px'
      }}>
        {/* Breathing Exercise Card - COMPACT */}
        <IonCard style={{ 
          margin: '0 0 16px 0', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <IonCardHeader style={{ 
            padding: '12px 12px 8px 12px',
            background: `linear-gradient(135deg, ${themeColors[0]}15 0%, ${themeColors[1]}15 100%)`
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '20px' }}>🌬️</span>
              <IonText style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                color: `var(--ion-color-primary)`
              }}>
                Breathing Exercise
              </IonText>
            </div>
          </IonCardHeader>
          
          <IonCardContent style={{ padding: '12px' }}>
            <p style={{ 
              fontSize: '14px', 
              color: '#666',
              margin: '0 0 16px 0',
              lineHeight: '1.4'
            }}>
              Take a moment to focus on your breathing. Inhale slowly through your nose, hold for a moment, and exhale slowly through your mouth.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <IonButton 
                onClick={() => startTimer(1)} 
                disabled={isActive}
                size="small"
                style={{ 
                  height: '36px',
                  fontSize: '13px',
                  '--background': themeColors[0],
                  '--background-hover': themeColors[1],
                  '--background-activated': themeColors[1]
                }}
              >
                <IonIcon icon={play} slot="start" style={{ fontSize: '14px' }} />
                1-Minute Breathing
              </IonButton>
              
              <IonButton 
                onClick={() => startTimer(5)} 
                disabled={isActive}
                size="small"
                style={{
                  height: '36px',
                  fontSize: '13px',
                  '--background': themeColors[1],
                  '--background-hover': themeColors[0],
                  '--background-activated': themeColors[0]
                }}
              >
                <IonIcon icon={play} slot="start" style={{ fontSize: '14px' }} />
                5-Minute Meditation
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Timer Display - COMPACT */}
        {timeLeft !== null && (
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
                fontWeight: '600',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <IonIcon icon={time} style={{ fontSize: '16px' }} />
                {timeLeft === 0 ? "🎉 Session Complete!" : "Time Remaining"}
              </div>
              
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                margin: '12px 0',
                fontFamily: 'monospace',
                letterSpacing: '2px'
              }}>
                {formatTime(timeLeft)}
              </div>
              
              <IonButton 
                onClick={resetTimer} 
                size="small"
                fill="outline"
                style={{
                  height: '32px',
                  fontSize: '12px',
                  '--background': 'rgba(255,255,255,0.15)',
                  '--color': 'white',
                  '--border-color': 'rgba(255,255,255,0.3)',
                  '--background-hover': 'rgba(255,255,255,0.25)'
                }}
              >
                <IonIcon 
                  icon={timeLeft === 0 ? play : stop} 
                  slot="start" 
                  style={{ fontSize: '12px' }} 
                />
                {timeLeft === 0 ? "Start New" : "Stop Session"}
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {/* Additional Exercises - COMPACT */}
        <IonCard style={{ 
          margin: '16px 0 0 0',
          borderRadius: '12px'
        }}>
          <IonCardHeader style={{ padding: '12px 12px 8px 12px' }}>
            <IonText style={{ 
              fontSize: '15px', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '18px' }}>🧠</span>
              More Exercises
            </IonText>
          </IonCardHeader>
          
          <IonCardContent style={{ padding: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <IonButton 
                size="small" 
                fill="outline"
                onClick={() => startTimer(3)}
                disabled={isActive}
                style={{
                  height: '32px',
                  fontSize: '12px',
                  flex: 1
                }}
              >
                🧘 3-min Body Scan
              </IonButton>
              
              <IonButton 
                size="small" 
                fill="outline"
                onClick={() => startTimer(7)}
                disabled={isActive}
                style={{
                  height: '32px',
                  fontSize: '12px',
                  flex: 1
                }}
              >
                💭 7-min Mindful
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Quick Tips */}
        <IonCard style={{ 
          margin: '12px 0 0 0',
          background: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <IonCardContent style={{ padding: '12px' }}>
            <div style={{ 
              fontSize: '13px', 
              color: '#666',
              textAlign: 'center'
            }}>
              💡 <strong>Tip:</strong> Find a quiet space and sit comfortably for best results.
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}