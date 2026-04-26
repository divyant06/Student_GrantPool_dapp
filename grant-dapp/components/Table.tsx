import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useAppContext } from "../context/context";
import style from "../styles/Table.module.css";
import TableRow from "./TableRow";

const Table = () => {
  const { grantPoolPlayers } = useAppContext();

  const parent = null;

  return (
    <div className={style.wrapper}>
      <div className={style.tableHeader}>
        <div className={style.addressTitle}>Student Contributor</div>
        <div className={style.amountTitle}>Amount</div>
      </div>
      <div className={style.rows} ref={parent}>
        {!!grantPoolPlayers?.length ? (
          grantPoolPlayers.map((player, index) => (
            <TableRow key={index} player={player} />
          ))
        ) : (
          <div className={style.noPlayers}>No contributors yet</div>
        )}
      </div>
    </div>
  );
};
export default Table;
