import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, IonAlert, IonCard, IonCardContent, IonSpinner, IonButtons } from '@ionic/react';
import { useAuth } from '../theme/AuthContext';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [isRegister, setIsRegister] = useState(false);
const [error, setError] = useState('');
const [showAlert, setShowAlert] = useState(false);
const [loading, setLoading] = useState(false);
const [successMessage, setSuccessMessage] = useState(''); // For registration success
const { login, register, user } = useAuth();
const history = useHistory();

// ✅ Clear form every time the component loads or mode changes
useEffect(() => {
setEmail('');
setPassword('');
setError('');
setSuccessMessage('');
}, [isRegister]);

// ✅ Redirect if user is already logged in (for login mode only)
useEffect(() => {
if (user && !isRegister) {
history.replace('/home');
}
}, [user, isRegister, history]);

const handleSubmit = async () => {
if (!email || !password) {
setError('Please enter both email and password');
setShowAlert(true);
return;
}

// Basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
setError('Please enter a valid email address');
setShowAlert(true);
return;
}

// Password length check for registration
if (isRegister && password.length < 6) {
setError('Password should be at least 6 characters long');
setShowAlert(true);
return;
}

setLoading(true);
setError('');
setSuccessMessage('');

try {
if (isRegister) {
// ✅ REGISTER: Create account but don't auto-login
await register(email, password);

// ✅ SUCCESS: Show success message and clear form
setSuccessMessage(`Account created successfully! You can now login with your credentials.`);
setEmail('');
setPassword('');

// ✅ Switch to login mode automatically
setIsRegister(false);

} else {
// ✅ LOGIN: Normal login flow
await login(email, password);

// Form will be cleared by useEffect when component re-renders
// User will be redirected by the useEffect above
}
} catch (error: any) {
setError(error.message);
setShowAlert(true);
} finally {
setLoading(false);
}
};

const switchMode = () => {
setIsRegister(!isRegister);
// Form clearing is handled by useEffect above
};

return (
<IonPage>
{/* Updated Header - Same as Homepage */}
<IonHeader style={{
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
{/* Title with proper spacing */}
<IonTitle style={{
fontSize: "1.3rem",
fontWeight: "700",
color: 'white',
textAlign: 'left',
padding: '0',
margin: '0',
lineHeight: '1.2'
}}>
🌟 MindBalance Aid
</IonTitle>

{/* Empty IonButtons to maintain layout consistency */}
<IonButtons slot="end" style={{
margin: '0',
padding: '0',
opacity: '0' // Hide but maintain space
}}>
<IonButton
size="small"
fill="solid"
style={{
fontSize: "0.8rem",
fontWeight: "600",
'--background': 'rgba(255,255,255,0.2)',
'--color': 'white',
'--border-radius': '6px',
height: '32px',
margin: '0',
visibility: 'hidden'
}}
>
Logout
</IonButton>
</IonButtons>
</IonToolbar>
</IonHeader>

<IonContent className="ion-padding" style={{
'--padding-top': '30px',
'--padding-bottom': '20px'
}}>
{/* Add extra space at the top */}
<div style={{ height: '10px' }}></div>

<IonCard>
<IonCardContent>
<h2 style={{ textAlign: 'center',fontSize: '1.1rem', fontWeight: '600',color: 'var(--ion-color-dark)',margin: '0 0 10px 0'}}>
{isRegister ? 'Create Account' : 'Welcome'}</h2>
<p style={{ textAlign: 'center', color: '#666' }}>
{isRegister ? 'Sign up to start tracking your mood' : 'Sign in to continue your journey'}
</p>

{/* ✅ SUCCESS MESSAGE */}
{successMessage && (
<div style={{
background: '#d4edda',
color: '#155724',
padding: '10px',
borderRadius: '5px',
marginBottom: '15px',
textAlign: 'center'
}}>
{successMessage}
</div>
)}

<IonItem style={{ marginTop: '20px' }}>
<IonLabel position="stacked">Email</IonLabel>
<IonInput
type="email"
value={email}
onIonInput={(e) => setEmail(e.detail.value!)}
placeholder="your@email.com"
clearInput
disabled={loading}
autocomplete="email"
/>
</IonItem>

<IonItem>
<IonLabel position="stacked">Password</IonLabel>
<IonInput
type="password"
value={password}
onIonInput={(e) => setPassword(e.detail.value!)}
placeholder="Enter your password"
clearInput
disabled={loading}
autocomplete="new-password"
onKeyPress={(e) => {
if (e.key === 'Enter') {
handleSubmit();
}
}}
/>
</IonItem>

<IonButton
expand="block"
onClick={handleSubmit}
style={{ marginTop: '20px' }}
disabled={loading || !email || !password}
>
{loading ? (
<>
<IonSpinner name="crescent" style={{ marginRight: '8px' }} />
{isRegister ? 'Creating Account...' : 'Signing In...'}
</>
) : (
isRegister ? 'Create Account' : 'Sign In'
)}
</IonButton>

<IonButton
expand="block"
fill="clear"
onClick={switchMode}
disabled={loading}
style={{ marginTop: '10px' }}
>
{isRegister ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
</IonButton>
</IonCardContent>
</IonCard>

<IonAlert
isOpen={showAlert}
onDidDismiss={() => setShowAlert(false)}
header={isRegister ? 'Registration Error' : 'Login Error'}
message={error}
buttons={['OK']}
/>
</IonContent>
</IonPage>
);
};

export default Login;
