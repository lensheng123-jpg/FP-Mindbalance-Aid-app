// Add this import at the top of App.tsx
import './themes.css';
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import Home from "../pages/Home";
import Mindfulness from '../pages/Mindfulness';
import Login from '../pages/Login';
import CustomThemes from '../pages/CustomThemes'; // ADD THIS
import PrioritySupport from '../pages/PrioritySupport'; // ADD THIS
import { AuthProvider, useAuth } from '../theme/AuthContext';
import { MonetizationProvider } from '../theme/MonetizationContext';
import "@ionic/react/css/core.css";
import { ThemeProvider } from '../theme/ThemeContext';
import React from "react";
setupIonicReact();

const AppRouter: React.FC = () => {
  const { user } = useAuth();

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/home">
          {user ? <Home /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/mindfulness">
          {user ? <Mindfulness /> : <Redirect to="/login" />}
        </Route>
        {/* ADD THESE NEW ROUTES */}
        <Route exact path="/themes">
          {user ? <CustomThemes /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/support">
          {user ? <PrioritySupport /> : <Redirect to="/login" />}
        </Route>
        {/* END NEW ROUTES */}
        <Route exact path="/">
          <Redirect to={user ? "/home" : "/login"} />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <MonetizationProvider>
        <ThemeProvider>
        <AppRouter />
        </ThemeProvider>
      </MonetizationProvider>
    </AuthProvider>
  </IonApp>
);

export default App;