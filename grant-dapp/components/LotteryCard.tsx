import { useAutoAnimate } from "@formkit/auto-animate/react";
import truncateEthAddress from "truncate-eth-address";
import style from "../styles/PotCard.module.css";
import { useAppContext } from "../context/context";

const LotteryCard = () => {
  const {
    enterGrantPool,
    pickWinner,
    withdrawPot,
    grantPoolPot,
    lastWinner,
    grantPoolId,
  } = useAppContext();

  const parent = null;

  return (
    <div className={style.wrapper} ref={parent}>
      <div className={style.title}>
        Funding Round <span className={style.textAccent}>#{grantPoolId}</span>
      </div>
      <div className={style.pot}>
        Total Grant Fund 🎓:{" "}
        <span className={style.potAmount}>{grantPoolPot} ETH</span>
      </div>

      <div className={style.recentWinnerTitle}>Last Winner</div>

      <div className={style.winner}>
        {lastWinner ? truncateEthAddress(lastWinner) : "No winner yet"}
      </div>

      <div className={style.btn} onClick={enterGrantPool}>
        Contribute to Pool (0.01 ETH)
      </div>
      <div className={style.btn} onClick={pickWinner}>
        Award Grant to Random Student
      </div>
      <div className={style.btn} onClick={withdrawPot}>
        Reclaim Funds (Admin)
      </div>
    </div>
  );
};

export default LotteryCard;
