import { Routes, Route, Navigate } from "react-router";
import Home from "@/components/pages/Home/Home";
import NotFound from "@/components/pages/NotFound/NotFound";
import AuthLayout from "@/components/layout/AuthLayout/AuthLayout";
import Login from "@/components/pages/Login/Login";
import BasicLayout from "@/components/layout/BasicLayout/BasicLayout";
import { useAuth } from "@/context/AuthContext";

const Router = () => {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <BasicLayout>
                <Home />
            </BasicLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route 
        path="/login"
        element={
          token ? ( 
          <Navigate to="/" replace />
        ) : (
          <AuthLayout>
            <Login />
          </AuthLayout>
        )
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;