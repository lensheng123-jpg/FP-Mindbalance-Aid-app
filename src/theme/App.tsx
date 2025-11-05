import "./themes.css";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import Home from "../pages/Home";
import Mindfulness from "../pages/Mindfulness";
import Login from "../pages/Login";
import CustomThemes from "../pages/CustomThemes";
import PrioritySupport from "../pages/PrioritySupport";
import { AuthProvider, useAuth } from "../theme/AuthContext";
import { MonetizationProvider } from "../theme/MonetizationContext";
import { ThemeProvider } from "../theme/ThemeContext";
import "@ionic/react/css/core.css";
import React from "react";

setupIonicReact();

// ✅ Protected Routes using Auth Context
const ProtectedRoute: React.FC<{ component: React.FC; path: string }> = ({
  component: Component,
  path,
}) => {
  const { user } = useAuth();
  return (
    <Route
      exact
      path={path}
      render={() => (user ? <Component /> : <Redirect to="/login" />)}
    />
  );
};

const AppRouter: React.FC = () => {
  const { user } = useAuth();

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Public Route */}
        <Route exact path="/login">
          <Login />
        </Route>

        {/* Protected Routes */}
        <ProtectedRoute path="/home" component={Home} />
        <ProtectedRoute path="/mindfulness" component={Mindfulness} />
        <ProtectedRoute path="/themes" component={CustomThemes} />
        <ProtectedRoute path="/support" component={PrioritySupport} />

        {/* Redirect root path */}
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
