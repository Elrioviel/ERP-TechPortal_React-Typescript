import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { fetchWithAuth } from "@/services/fetchWithAuth";
import { useAuth } from "@/context/AuthContext";
import config from "@/config";
import styles from "./PowerTable.module.css";
import animationData from "@/assets/OTQEEvxFK8.json";
import Description  from "@/components/pages/Home/Description/Description";

interface PowerData {
  idPowerPlan: number;
  idPower: number;
  name: string;
  val: number;
  booked: number;
  dt: string;
  bookedPercent: number;
  minPercent: number;
  maxPercent: number;
  isNotDealer: boolean;
}

const PowerTable = () => {
  const { token, isNotDealer } = useAuth();
  const [data, setData] = useState<Record<number, PowerData[]>>({});
  const [uniquePowers, setUniquePowers] = useState<Record<number, string>>({});
  const [filteredIds, setFilteredIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const pageSize = 10;

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth(
          `${config.API_BASE_URL}/PowerPlan/GetAllPowerPlan`,
          { method: "POST" }
        );
        if (!response.ok) {
          throw new Error("Ошибка загрузки данных");
        }
        const jsonData: PowerData[] = await response.json();

        await new Promise((resolve) => setTimeout(resolve, 500));

        const groupedData: Record<number, PowerData[]> = {};
        const uniquePowersMap: Record<number, string> = {};

        jsonData.forEach((item) => {
          const dateObj = new Date(item.dt);
          const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${dateObj.getFullYear()}`;

          if (!groupedData[item.idPower]) {
            groupedData[item.idPower] = [];
          }
          groupedData[item.idPower].push({ ...item, dt: formattedDate, booked: Math.round(item.booked) });

          if (!uniquePowersMap[item.idPower]) {
            uniquePowersMap[item.idPower] = item.name;
          }
        });

        Object.keys(groupedData).forEach((idPower) => {
          groupedData[Number(idPower)].sort((a, b) => new Date(a.dt.split(".").reverse().join("-")).getTime() - new Date(b.dt.split(".").reverse().join("-")).getTime());
        });

        setData(groupedData);
        setUniquePowers(uniquePowersMap);
        setFilteredIds(Object.keys(uniquePowersMap).map(Number));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    setFilteredIds(
      Object.keys(uniquePowers)
        .map(Number)
        .filter((id) => uniquePowers[id].toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setPageIndex(0);
  }, [searchQuery, uniquePowers]);

  const getColorClass = (bookedPercent: number, minPercent: number, maxPercent: number) => {
    if (bookedPercent > minPercent && bookedPercent <= maxPercent) {
      return bookedPercent < 50 ? styles.lightGreen : styles.yellow;
    } else {
      return bookedPercent <= minPercent ? styles.brightGreen : styles.red;
    }
  };

  const paginatedIds = filteredIds.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  if (!token) {
    return null;
  } else {
  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loader}>
          <h2>Загружаем... это займет пару секунд...</h2>
          <Lottie animationData={animationData} loop />
        </div>
      ) : (
        <>
          <h1>План мощностей</h1>
          <div className={styles.descriptionTableWrapper}>
            <Description />
          </div>
          <input
            type="text"
            placeholder="Поиск по названию мощности"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.tableContainer}>
            {paginatedIds.map((idPower) => (
              <div key={idPower} className={styles.powerBlock}>
                <span><h3 className={styles.powerTitle}>{uniquePowers[idPower]}</h3></span>
                <table className={styles.powerTable}>
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Загруженность</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data[idPower]?.map((entry) => (
                      <tr key={entry.dt}>
                        <td>{entry.dt}</td>
                        <td className={getColorClass(entry.bookedPercent, entry.minPercent, entry.maxPercent)}>
                          {isNotDealer ? `${entry.booked}/${entry.val}` : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
            <div className={styles.pagination}>
              <button onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex === 0}>
                Предыдущие
              </button>
              <button
                onClick={() => setPageIndex(pageIndex + 1)}
                disabled={(pageIndex + 1) * pageSize >= filteredIds.length}
              >
                Следующие
              </button>
            </div>
        </>
      )}
    </div>
  );
}
}
export default PowerTable;