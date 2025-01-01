import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import RegistrationPage from "./pages/RegistrationPage";
import PrivateRoutes from "./pages/PrivateRoutes";
import ErrorPage from "./pages/ErrorPage";
import SignInPage from "./pages/SignInPage";
import DashboardPage from "./pages/DashboardPage";
import SystemPage from "./pages/SystemPage";
import SessionPage from "./pages/SessionPage";
import PreferencePage from "./pages/PreferencePage";
import LiveStatusPage from "./pages/LiveStatusPage";
import SystemStatisticsPage from "./pages/SystemStatisticsPage";
import SessionStatisticsPage from "./pages/SessionStatisticsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <SignInPage /> },
      { path: "/sign-up", element: <RegistrationPage /> },
      {
        element: <PrivateRoutes />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "dashboard/:id", element: <SystemPage /> },
          { path: "session/:systemId", element: <SessionPage />},
          { path: "preferences/:systemId", element: <PreferencePage /> },
          { path: "status/:systemId", element: <LiveStatusPage /> },
          { path: "statistics/:systemId", element: <SystemStatisticsPage /> },
          { path: "statistics/:systemId/:sessionId", element: <SessionStatisticsPage /> },
        ],
      },
    ],
  },
]);

export default router;
