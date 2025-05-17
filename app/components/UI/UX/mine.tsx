'use client'
import { useSoundPlayer } from "@/app/sound";
import { useEffect, useState } from "react";
import { FaQuestion } from "react-icons/fa6";

interface IMineBlock {
  type: 'dirt' | 'ton';
  gameStart: boolean;
  quest:boolean;
  showWin: React.Dispatch<React.SetStateAction<boolean>>; // Передаем setShowWin
  setStart:React.Dispatch<React.SetStateAction<boolean>>;
  setOpened:React.Dispatch<React.SetStateAction<number>>;

}

export const MineBlock = (props: IMineBlock) => {
  const [exploded, setExploded] = useState(false); 
  const { play } = useSoundPlayer();


  const handleClick = () => {
    if (!props.gameStart || exploded) return; 
props.setOpened((prev)=> prev+1)
    setExploded(true); 
    if (props.type === 'dirt') {
      play('mineDirt'); 
    } else {
      play('mineTon'); 
      props.showWin(true);
      setTimeout(() => {
        props.showWin(false)
      }, 700);
    }
  };

  useEffect(() => {
    if (!props.gameStart) {
      setExploded(false); 
    }
  }, [props.gameStart]);

  return (
    <div
      className={`${props.gameStart && !exploded && 'shake-animation'} aspect-square w-[80%] flex items-center justify-center rounded-[16px] relative overflow-visible cursor-pointer`}
      onClick={handleClick}
    >
      <div className={`bg-white z-[9999] w-full h-full flex items-center justify-center rounded-[16px] ${exploded ? "explode-animation" : ""}`}>
        <FaQuestion opacity={props.quest === false ? '0' : '1'} className="z-10 pointer-events-none duration-300" fontSize={60} color="#742CF1" />
      </div>
      <div className="z-[0] absolute rounded-[16px] overflow-hidden ">
        <img src={props.type === 'ton' ? '/almaz.jpg' : '/dirtMine.jpg'} />
      </div>
    </div>
  );
};
