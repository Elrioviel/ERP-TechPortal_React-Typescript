import { useAuth } from "@/context/AuthContext";
import cl from "./Header.module.css";
import logo from "../../../../assets/logo.svg";
import { Link } from "react-router";

interface HeaderProps {
  toggleSidebar: (isOpen: boolean) => void;
  sidebarVisible: boolean;
}

const Header = ({ toggleSidebar, sidebarVisible }: HeaderProps) => {
  const { lastName } = useAuth();

  return (
    <header className={cl.header}>
      <Link to='/' className={cl.logo}>
        <img className={cl.logoImg} src={logo} alt="Company Logo" />
      </Link>

      {lastName && 
        <span className={cl.userName}>{lastName}</span>
      }

      <div className={cl.burgerMenu} onClick={() => toggleSidebar(!sidebarVisible)}>
        <svg
          className={cl.burgerIcon}
          fill="none"
          stroke="white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </div>
    </header>
  );
};

export default Header;