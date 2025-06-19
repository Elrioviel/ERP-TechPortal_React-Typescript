import styles from "./Description.module.css";

const Description = () => {
    return (
        <div className={styles.descriptionContainer}>
            <div className={styles.descriptionItem}>
                <span className={styles.brightGreen}></span>
                <p>значительный запас мощности.</p>
            </div>
            <div className={styles.descriptionItem}>
                <span className={styles.lightGreen}></span>
                <p>имеются свободные ресурсы.</p>
            </div>
            <div className={styles.descriptionItem}>
                <span className={styles.yellow}></span>
                <p>частичная загруженность.</p>
            </div>
            <div className={styles.descriptionItem}>
                <span className={styles.red}></span>
                <p>загрузка максимальная.</p>
            </div>
        </div>
    );
}

export default Description;