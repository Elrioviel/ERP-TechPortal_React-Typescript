import { useState } from "react";
import config from "@/config";
import cl from './Login.module.css';
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ login: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.login || !formData.password) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/Authentication`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Неверный логин или пароль.");
      }

      const data = await response.json();
      const user = data[0];

      login(user.token, user.lastName, user.isNotDealer, user.showPowerPlan, user.showKTU);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ошибка при авторизации.");
      }
    }
  };

  return (
    <div className={cl.container}>
        <div className={cl.wrapper}>
            <h1 className={cl.loginTitle}>Авторизация</h1>
            {error && <p className={cl.error}>{error}</p>}

            <form className={cl.form} onSubmit={handleSubmit}>
                <div className={cl.inputGroup}>
                <label htmlFor="login">Логин</label>
                <input
                    id="login"
                    type="text"
                    name="login"
                    placeholder="Введите ваш логин"
                    value={formData.login}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className={cl.inputGroup}>
                <label htmlFor="password">Пароль</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Введите ваш пароль"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                </div>

                <button className={cl.button} type="submit" disabled={!formData.login || !formData.password}>
                Войти
                </button>
            </form>
        </div>
    </div>
  );
};

export default Login;