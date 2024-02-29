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
      // { path: "/", element: <FirstTest /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <div>
        <h1>Welcome to the CBT</h1>
      </div> */}

      {/* <FirstTest /> */}

      <RouterProvider router={guide} />
    </>
  );
}

export default App;
