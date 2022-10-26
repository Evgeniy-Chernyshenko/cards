import { Link } from "react-router-dom";
import { PATHS } from "../app/AppRoutes";

export const HomePage = () => {
  return (
    <>
      <ul>
        <li>
          <Link to={PATHS.index}>Home Page</Link>
        </li>
        <li>
          <Link to={PATHS.signin}>Sign In Page</Link>
        </li>
        <li>
          <Link to={PATHS.signup}>Sign Up Page</Link>
        </li>
        <li>
          <Link to={PATHS.profile}>Profile Page</Link>
        </li>
        <li>
          <Link to={PATHS.forgotPassword}>Forgot Password Page</Link>
        </li>
        <li>
          <Link to={PATHS.packs}>Packs List</Link>
        </li>
        <li>
          <Link to="abrakadabra">Not Found Page</Link>
        </li>
      </ul>
    </>
  );
};
