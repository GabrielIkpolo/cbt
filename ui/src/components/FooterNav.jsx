import React from "react";
import "./footerNav.css"

const FooterNav = () => {
  return (
    <>
      <div className="footer">
        <div className="copyright">
          <span>
            &copy; {new Date().getFullYear()} <em>Gikps</em>
          </span>
        </div>
      </div>
    </>
  );
};

export default FooterNav;
