import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/logo.png";
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

const Wrapper = ({ children }) => {
  return <div className="wrapper">{children}</div>;
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

const guide = createBrowserRouter([
  {
    path: "/",
    element: <HeaderAndFooter />,
    children: [
      { path: "/", element: <Login /> },
      
      {
        path: "/exam", element: (
          <ProtectedRoute>
            <ExamPage />
          </ProtectedRoute>
        )
      },

      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <RouterProvider router={guide} />
      {/* <ProtectedRoute /> */}

    </>
  );
}

export default App;
