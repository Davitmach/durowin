'use client';
import { useEffect, useRef, useState } from "react"
import { FaQuestion } from "react-icons/fa6";
import Image from 'next/image';
import { useAviableBetBlame, useBalanceStore, useClickSuccess, useFlamesActiveGameStore, UserData, useStartGame, useWinFlame } from "@/app/store";
import axios from "axios";
import { useSoundPlayer } from "@/app/sound";

interface IFlames {
  index:number,
  active?:boolean
  status?:string
}

export const Flames = (props: IFlames) => {
  const [active2, setActive] = useState(false);
  const {balance,setBalance} = useBalanceStore()
  const[status,setStatus] = useState(false);
const {id,active,setMap,setActive:setA,setGameTable} = useFlamesActiveGameStore();
const {play} =useSoundPlayer()
const {setSuccess,success} = useClickSuccess();
const {setWin,setLose} = useWinFlame()
const {start,setStart} = useStartGame()
const {initData,id:userId} = UserData();
const {setActive:setBetFlameAviable} = useAviableBetBlame();
const Click = async()=> {
  if(active == false) return 
  axios.post('https://api.durowin.xyz/games/flames/click',{
    "init_data": window.Telegram.WebApp.initData,
  "user_id": window.Telegram.WebApp.initDataUnsafe.user.id,
  "room_id": id,
  "click_index": props.index

  }).then((res)=> {
    setSuccess(false);
    setWin(0)
    const data =res.data;
    if(data.result == 'win') {
      setGameTable(data.collected_indexes.map((e:number)=> e.toString()))
play('clickSuccess')
setSuccess(true)
setWin(data.ton_win)
    }
    else {
     setStart(true)
     setBetFlameAviable(true)
      if(data.ton_win && data.map) {
        play('winFlame')
        setSuccess(true)
        setStart(false)
        console.log('start -');
        
        
        
        setWin(data.ton_win)
      }
      else {
        play('clickFail')
        setSuccess(false)
        setStart(false)
         console.log('start -');
      }
      setStart(false)
       console.log('start -');
      setMap(data.map)
      setA(false)
      
      if(data.balance) {

      setBalance(data.balance)
      }
    }
  })
}
// useEffect(()=> {
// if(success == true) {
//   setTimeout(() => {
//     setSuccess(false)
//   }, 1000);
// }
// },[success])

useEffect(()=> {


if(props.active == true) {
  
  setStart(true)
  
 setActive(true)
}
else {
  setActive(false)
  setStart(false)
   console.log('start -');
}
},[props.active])
useEffect(()=> {
if(props.status=='ton') {
  setStatus(true)
}
else {
  setStatus(false)
}
},[props.status])
  return (
    <div
      className="w-full h-[80px] cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={Click}
    >
      <div
        className={`w-full h-full relative transition-transform duration-700`}
        style={{
          transformStyle: 'preserve-3d',
          transform: active2 ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT SIDE */}
        <div
          className="absolute w-full h-full rounded-[16px] bg-[#FDFBEE] flex items-center justify-center gap-4"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <FaQuestion opacity={start?'1':'0' }  className="duration-[400ms]" fontSize={40} color="#742CF1" />
        </div>

        {/* BACK SIDE */}
        <div
          className="absolute w-full h-full rounded-[16px] bg-[#FDFBEE] flex items-center justify-center gap-4"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          {status ? (

            <svg width="44" height="40" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.9308 8.44833L23.9696 38.6422C23.7377 39.0078 23.4168 39.3087 23.037 39.5168C22.6572 39.7248 22.2309 39.8331 21.7979 39.8317C21.3648 39.8302 20.9392 39.719 20.5609 39.5085C20.1825 39.2979 19.8636 38.9949 19.6341 38.6277L1.0427 8.43383C0.520894 7.58862 0.246296 6.61413 0.250038 5.62083C0.272303 4.15345 0.876493 2.75499 1.92973 1.73303C2.98296 0.711065 4.39898 0.149286 5.86637 0.171244H38.1579C41.244 0.168827 43.75 2.59999 43.75 5.60633C43.75 6.60441 43.4697 7.59041 42.9308 8.44833ZM5.6102 7.43333L19.4408 28.7628V5.28733H7.05537C5.6247 5.28733 4.98429 6.23466 5.6102 7.43816M24.5569 28.7677L38.3923 7.43333C39.0327 6.23224 38.3778 5.28249 36.9447 5.28249H24.5617L24.5569 28.7677Z" fill="#069CE8" />
            </svg>
          ) : (
            <Image src="/flame.png" alt="Огонь" width={44} height={40} />
          )}
        </div>
      </div>
    </div>
  );
};
