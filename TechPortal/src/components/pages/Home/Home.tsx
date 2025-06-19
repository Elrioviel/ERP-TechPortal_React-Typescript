import { useSearchParams } from "react-router";
import PowerTable from "@/components/pages/Home/PowerTable/PowerTable";
import KtuTable from "@/components/pages/Home/KtuTable/KtuTable";
import ModuleCards from "@/components/pages/Home/ModuleCards/ModuleCards";
import cl from './Home.module.css';
import backgroundImg from '../../../assets/girlwindow.webp';

const Home = () => {
  const [searchParams] = useSearchParams();

  const showPowerPlan = searchParams.get("showPowerPlan") === "true";
  const showKtu = searchParams.get("showKtu") === "true";

  return (
    <div className={cl.container}>
      {showPowerPlan && !showKtu && (
        <div className={cl.table}>
          <PowerTable />
        </div>
      )}

      {showKtu && !showPowerPlan && (
        <div className={cl.table}>
          <KtuTable />
        </div>
      )}

      {!showPowerPlan && !showKtu && (
        <>
          <div
            className={cl.background}
            style={{ backgroundImage: `url(${backgroundImg})` }}
          />
          <ModuleCards />
        </>
      )}
    </div>
  );
};

export default Home;