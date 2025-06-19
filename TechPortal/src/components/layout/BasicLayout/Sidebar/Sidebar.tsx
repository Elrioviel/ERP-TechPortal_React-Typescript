import { Ref, useEffect, useRef } from "react";
import cl from "./Sidebar.module.css";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

interface SidebarProps {
  className?: string;
  isOpen: boolean;
  toggleSidebar: (isOpen: boolean) => void;
  ref?: Ref<HTMLUListElement>
}

const Sidebar = ({ className, isOpen, toggleSidebar, ref }: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { logout, showPowerPlan, showKTU } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        toggleSidebar(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  const handleMenuItemClick = () => {
    toggleSidebar(false);
  };

  return (
    <nav ref={sidebarRef} className={`${cl.sidebar} ${className || ''} ${isOpen ? cl.show : ""}`}>
      <ul ref={ref}>
        {showPowerPlan && (
          <li>
            <Link to="/?showPowerPlan=true" className={cl.sidebarItem} onClick={handleMenuItemClick}>
              План Мощностей
            </Link>
          </li>
        )}
        {showKTU && (
          <li>
            <Link to="?showKtu=true" className={cl.sidebarItem} onClick={handleMenuItemClick}>
              КТУ сотрудников
            </Link>
          </li>
        )}
        <li>
          <button type="button" onClick={logout} className={`${cl.sidebarItem} ${cl.logout}`}>
            <LogOut size={24} className={cl.icon} />Выйти
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
