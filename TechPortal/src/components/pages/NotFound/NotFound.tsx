import cl from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={cl.container}>
      <div className={cl.content}>
        <h1 className={cl.header}>404</h1>
        <p className={cl.text}>Страница, которую вы ищете, не существует.</p>
      </div>
    </div>
  );
};

export default NotFound;