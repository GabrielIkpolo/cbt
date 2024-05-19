import { useState } from "react";
import { AuthProvider } from "./utils/AuthContext.jsx";
import "./App.css";
import FirstTest from "./pages/FirstTest.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.jsx";
import HeaderNav from "./components/HeaderNav.jsx";
import FooterNav from "./components/FooterNav.jsx";
import Login from "./components/Login.jsx";
import toast, { Toaster } from "react-hot-toast";
import ExamPage from './pages/ExamPage.jsx';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SelectExam from "./pages/SelectExam.jsx";
import ExamResult from "./pages/ExamResult.jsx";
import { useEffect } from "react";
import AlreadyTakenExam from "./pages/AlreadyTakenExam.jsx";
import Admin from "./pages/Admin.jsx";
import RegistrationComponent from "./components/RegistrationComponent.jsx";

const Wrapper = ({ children }) => {
  return (
    <div className="wrapper">
      {children}
    </div>
  );
};

const HeaderAndFooter = () => {
  return (
    <>
      <HeaderNav />
      <Wrapper className="wrapper">
        <Toaster />
        <Outlet />
      </Wrapper>
      <FooterNav />
    </>
  );
};

const allowedRoles = [0, 1, 2];
const allowedRolesTwo = [1, 2];
const allowedRolesThree = [2];

const guide = createBrowserRouter([
  {
    path: "/",
    element: <HeaderAndFooter />,
    children: [
      { path: "/", element: <Login /> },

      {path: "/register", element: <RegistrationComponent />},

      {
        path: "/select-exam", element: (
          <ProtectedRoute role={allowedRoles} >
            <SelectExam />
          </ProtectedRoute>
        )
      },

      {
        path: "/exam", element: (
          <ProtectedRoute role={allowedRoles}>
            <ExamPage />
          </ProtectedRoute>
        )
      },

      {
        path: "/exam-result", element: (
          <ProtectedRoute role={allowedRoles}>
            <ExamResult />
          </ProtectedRoute>
        )
      },

      {
        path: "/contact-server-admin", element:(
          <AlreadyTakenExam />
        )
      },

      {
        path: "/admin", element:(
          <ProtectedRoute role={allowedRolesThree} >
            <Admin />
          </ProtectedRoute>
        )
      },

      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

function App() {

  return (
    <>
      <AuthProvider>
        <RouterProvider router={guide} />
      </AuthProvider>
    </>

  );
}

export default App;
