import { useContext } from "react";
import { UserContext } from "../App.js";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const renderNav = () => {
    if (state) {
      return [
        <>
          <li>
            <Link to="/profile">
              <i className="medium material-icons">person</i>
            </Link>
          </li>
          <li>
            {" "}
            <Link to="/createpost">
              <i className="medium material-icons">playlist_add</i>
            </Link>{" "}
          </li>
          <li>
            <Link
              style={{ color: "red" }}
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/signin");
              }}
              className="large material-icons"
              to="/signin"
            >
              <i className="medium material-icons">exit_to_app</i>
            </Link>{" "}
          </li>
        </>,
      ];
    } else {
      return [
        <li>
          {" "}
          <Link to="/signin">
            <i className="medium material-icons">input</i>
          </Link>{" "}
        </li>,
      ];
    }
  };

  return (
    <>
      <div className="navBar">
        <div className="navigationBar">
          <div className="mainPage">
            <Link to={state ? "/" : "/signin"}>
              <i className="medium material-icons">home</i>
            </Link>
          </div>
          <div className="navLink">
            <ul>{renderNav()}</ul>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "10vh" }}></div>
    </>

    // <nav
    //   className="#424242 grey darken-3 navbar-fixed"
    //   style={{ height: "10vh" }}
    // >
    //   <div className="nav-wrapper container #424242 grey darken-3">
    //     <Link to={state ? "/" : "/signin"} className="brand-logo">
    //       SammiGram
    //     </Link>
    //     <ul id="nav-mobile" className="right hide-on-med-and-down">
    //       {renderNav()}
    //     </ul>
    //   </div>
    // </nav>
  );
}
