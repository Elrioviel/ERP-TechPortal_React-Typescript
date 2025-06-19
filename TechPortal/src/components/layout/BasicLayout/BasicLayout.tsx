import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import cl from "./BasicLayout.module.css";
import { useState, useRef, useEffect } from "react";

interface BasicLayoutProps {
  children: React.ReactNode;
}

const BasicLayout = ({ children }: BasicLayoutProps) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarRef = useRef<HTMLUListElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setSidebarVisible(false);
    }
  };

  useEffect(() => {
    if (sidebarVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarVisible]);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <div className={cl.layout}>
      <Header toggleSidebar={setSidebarVisible} sidebarVisible={sidebarVisible} />
      <Sidebar ref={sidebarRef} isOpen={sidebarVisible} toggleSidebar={toggleSidebar} />
      <main className={cl.mainContent}>{children}</main>
    </div>
  );
};

export default BasicLayout;
