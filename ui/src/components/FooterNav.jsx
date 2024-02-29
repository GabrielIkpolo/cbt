import React from "react";
import "./footerNav.css"

const FooterNav = () => {
  return (
    <>
      <div className="footer">
        <p className="paragraph"> &copy; {new Date().getFullYear()} CBT</p>
        <p className="paragraph">Powered by GIKPS</p>
        
        </div>
    </>
  );
};

export default FooterNav;
