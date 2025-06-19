import cl from "./AuthLayout.module.css";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <section className={cl.container}>
            {children}
        </section>
    );
};

export default AuthLayout;