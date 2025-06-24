import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/services/fetchWithAuth";
import { useAuth } from "@/context/AuthContext";
import config from "@/config";
import styles from "@/components/pages/Home/KtuTable/KtuTable.module.css";
import Lottie from "lottie-react";

type KtuPerson = {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  ktu: number;
};

const ITEMS_PER_PAGE = 10;

const KtuTable = () => {
  const { token } = useAuth();
  const [people, setPeople] = useState<KtuPerson[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<KtuPerson[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newKtu, setNewKtu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [animationData, setAnimationData] = useState(null); // <-- для Lottie

  useEffect(() => {
    // Загрузка анимации
    fetch("/assets/OTQEEvxFK8.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error("Ошибка загрузки анимации:", err));
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchKtuData = async () => {
      try {
        const response = await fetchWithAuth(`${config.API_BASE_URL}/PeopleKTU/GetPeopleKTU`);
        if (response.ok) {
          const data: KtuPerson[] = await response.json();
          setPeople(data);
          setFilteredPeople(data);
        } else {
          console.error("Ошибка при получении KTU данных", response.status);
        }
      } catch (error) {
        console.error("Error fetching KTU data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKtuData();
  }, [token]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = people.filter((p) =>
      `${p.lastName} ${p.firstName} ${p.middleName}`.toLowerCase().includes(term)
    );
    setFilteredPeople(filtered);
    setCurrentPage(1);
  }, [searchTerm, people]);

  const handleEdit = (id: number, currentKtu: number) => {
    setEditingId(id);
    setNewKtu(currentKtu);
  };

  const handleSave = async (id: number) => {
    if (newKtu === null) return;

    try {
      const personResponse = await fetchWithAuth(`${config.API_BASE_URL}/PeopleKTU/GetPersonKTU?idPeople=${id}`);
      if (!personResponse.ok) {
        alert("Ошибка при получении данных пользователя");
        return;
      }

      const personData = await personResponse.json();

      const insertResponse = await fetchWithAuth(`${config.API_BASE_URL}/PeopleKTU/InsertPersonKTU`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPeople: id,
          comment: null,
          ktu: newKtu,
          tax: personData.tax
        }),
      });

      if (insertResponse.ok) {
        const updated = people.map((p) => (p.id === id ? { ...p, ktu: newKtu } : p));
        setPeople(updated);
        setEditingId(null);
      } else {
        alert("Ошибка при обновлении KTU");
      }
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      alert("Произошла ошибка при сохранении KTU");
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPeople = filteredPeople.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredPeople.length / ITEMS_PER_PAGE);

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.loader}>
        <h2>Загружаем данные... это займет пару секунд...</h2>
        {animationData && <Lottie animationData={animationData} loop />}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>КТУ сотрудников</h1>

      <input
        type="text"
        placeholder="Поиск по ФИО"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.tableWrapper}>
        <table className={styles.ktuTable}>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>KTU</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPeople.map((p) => (
              <tr key={p.id}>
                <td>{`${p.lastName} ${p.firstName} ${p.middleName}`}</td>
                <td>
                  {editingId === p.id ? (
                    <input
                      type="number"
                      step="1"
                      value={newKtu ?? p.ktu}
                      onChange={(e) => setNewKtu(parseFloat(e.target.value))}
                      className={styles.ktuInput}
                    />
                  ) : (
                    p.ktu
                  )}
                </td>
                <td>
                  {editingId === p.id ? (
                    <>
                      <button className={styles.saveButton} onClick={() => handleSave(p.id)}>
                        Сохранить
                      </button>
                      <button
                        className={styles.cancelButton}
                        onClick={() => {
                          setEditingId(null);
                          setNewKtu(null);
                        }}
                      >
                        Отменить
                      </button>
                    </>
                  ) : (
                    <button className={styles.editButton} onClick={() => handleEdit(p.id, p.ktu)}>
                      Изменить
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>
          Предыдущие
        </button>
        <span>Страница {currentPage} из {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Следующие
        </button>
      </div>
    </div>
  );
};

export default KtuTable;
