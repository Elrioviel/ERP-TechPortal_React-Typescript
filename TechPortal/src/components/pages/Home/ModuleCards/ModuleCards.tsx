import styles from "./ModuleCards.module.css";
import {
  FaInfoCircle,
  FaRegCalendarCheck,
  FaExclamationTriangle,
  FaTelegramPlane,
  FaUserEdit,
  FaSearch,
  FaPencilAlt,
} from "react-icons/fa";

const ModuleCards = () => {
  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.title}>Внутренний сайт Satels</h1>

      <div className={styles.card}>
        <h2>План мощностей</h2>
        <p><b>Для отдела продаж</b></p>
        <ul>
          <li>
            <FaRegCalendarCheck style={{ color: "#16a34a" }} /> Удобное планирование загрузки ресурсов.
          </li>
          <li>
            <FaExclamationTriangle style={{ color: "#dc2626" }} /> Отслеживание перегрузок
          </li>
          <li>
            <FaTelegramPlane style={{ color: "#0088cc" }} /> Подпишитесь на Telegram-бота, чтобы не пропустить перегрузки.
          </li>
          <li>
            <FaInfoCircle style={{ color: "#1E3A8A" }} /> <i>Название бота уточните у технической поддержки.</i>
          </li>
        </ul>
      </div>

      <div className={styles.card}>
        <h2>КТУ сотрудников</h2>
        <p><b>Для бухгалтерии</b></p>
        <ul>
          <li>
            <FaUserEdit style={{ color: "#2563eb" }} /> Просмотр и редактирование коэффициентов трудового участия.
          </li>
          <li>
            <FaSearch style={{ color: "#2563eb" }} /> Поиск по ФИО сотрудников
          </li>
          <li>
            <FaPencilAlt style={{ color: "#2563eb" }} /> Удобный интерфейс для внесения изменений
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ModuleCards;

