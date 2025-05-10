'use client'
import { useSoundPlayer } from "@/app/sound";
import { useEffect, useState } from "react";
import { FaQuestion } from "react-icons/fa6";

interface IMineBlock {
  type: 'dirt' | 'ton';
  gameStart: boolean;
  showWin: React.Dispatch<React.SetStateAction<boolean>>; // Передаем setShowWin
}

export const MineBlock = (props: IMineBlock) => {
  const [exploded, setExploded] = useState(false); // Состояние, отвечает за взрыв блока
  const { play } = useSoundPlayer(); // Звук

  // Обработчик клика
  const handleClick = () => {
    if (!props.gameStart || exploded) return; // Блок не должен взрываться, если уже взорван

    setExploded(true); // Отметим блок как взорванный
    if (props.type === 'dirt') {
      play('mineDirt'); // Звук для грязи
    } else {
      play('mineTon'); // Звук для тона
      props.showWin(true); // Показываем выигрыш
      setTimeout(() => {
        props.showWin(false)
      }, 700);
    }
  };

  useEffect(() => {
    if (!props.gameStart) {
      setExploded(false); // Сброс взрывов, если игра не началась
    }
  }, [props.gameStart]);

  return (
    <div
      className={`${props.gameStart && !exploded && 'shake-animation'} aspect-square w-full flex items-center justify-center rounded-[16px] relative overflow-visible cursor-pointer`}
      onClick={handleClick}
    >
      <div className={`bg-white z-[9999] w-full h-full flex items-center justify-center rounded-[16px] ${exploded ? "explode-animation" : ""}`}>
        <FaQuestion opacity={props.gameStart === false ? '0' : '1'} className="z-10 pointer-events-none duration-300" fontSize={60} color="#742CF1" />
      </div>
      <div className="z-[0] absolute rounded-[16px] overflow-hidden ">
        <img src={props.type === 'ton' ? '/almaz.jpg' : '/dirtMine.jpg'} />
      </div>
    </div>
  );
};
