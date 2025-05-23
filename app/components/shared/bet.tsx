'use client';

import { useSoundPlayer } from "@/app/sound";
import { useAviableBetBlame, useBalanceStore, useClickSuccess, useFlamesActiveGameStore, useLanguageStore, UserData, useStartGame, useWinFlame } from "@/app/store";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export const Bet = ()=> {
    const [open,setOpen] = useState(false);
    const {active,setActive,id,setId,setMap,setGameTable,gameTable} = useFlamesActiveGameStore()
    const {setBalance,balance} = useBalanceStore();
    const [flames,setFlames] = useState(2); 
    const [clickSuccess,setClickSuccess] = useState(false);
    const {success,setSuccess} = useClickSuccess();
    const {language} = useLanguageStore();
    const {active:activeAv,setActive:SetA} = useAviableBetBlame()
    const {win,setWin}=useWinFlame()
    const {play} = useSoundPlayer()
const {setStart} = useStartGame();
const ref = useRef<HTMLInputElement>(null);
const ref2 =useRef(null)
const {id:userId,initData} =UserData()

const Claim = async()=> {
if(gameTable.length==0)return

  axios.post('https://api.durowin.xyz/games/flames/claim',{
    "init_data": window.Telegram.WebApp.initData,
    "user_id": window.Telegram.WebApp.initDataUnsafe.user.id,
    "room_id": id
  }
  ).then((res)=> {
    const data = res.data;
    if(data.ok == true) {
      setActive(false)
      setId(null)
      SetA(true)
      setBalance(data.balance)
      setMap(data.map)
      play('winFlame')
      setSuccess(true)
      setWin(data.ton_win)
      setTimeout(() => {
        setWin(0)
        setSuccess(false)
        // setStart(false)
      }, 3000);
  
    }
  })
}
const Bet = async()=> {
  if(activeAv == false) return
  if(ref.current ) {
    if(ref.current.value < '0.01') return
  axios.post('https://api.durowin.xyz/games/flames/create',{
    "init_data":window.Telegram.WebApp.initData,
    "user_id": window.Telegram.WebApp.initDataUnsafe.user.id,
    "ton_bet": Number(ref.current?.value),
    "flames_count": flames
  }
  
  ).then((res)=> {
    setStart(true)
   
    
    setWin(0);
    setSuccess(false)
    const data = res.data;
    if(data.is_ended == false) {
      setBalance(balance - data.ton_bet)
     setActive(true);
     setId(data.id)
     setMap('')
     setGameTable([])
     SetA(false)
     play('startFlame')
     

    }
  })
}}
const HandleBet = ()=> {
if(active == true && id) {
  Claim()
  
}
else {

if(ref.current) {
  Bet()
}
}
}
useEffect(()=> {
if(success == true && win ==0) {
  setSuccess(false)
}
},[win,success])
useEffect(()=> {
const check = localStorage.getItem('flame_bet');
if(ref.current) {
if(check) {
  ref.current.value = check
}
}
},[])
    return(<>
    
        <div className="relative mb-[100px] bet_container bg-[#260E53] w-full max-w-[400px]  rounded-[28px] p-[16px] flex flex-col gap-[16px] ">
        <div className={`absolute left-[50%] translate-x-[-50%] top-[-50px] font-[600] ${success ? 'flex':'hidden'} `}><h1 className="flex items-center gap-[5px] text-[20px] font-[600]"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.548 9.62667L17.0867 26.2853C16.9587 26.4871 16.7817 26.6531 16.5721 26.7679C16.3626 26.8826 16.1274 26.9424 15.8885 26.9416C15.6496 26.9408 15.4148 26.8795 15.206 26.7633C14.9972 26.6471 14.8213 26.4799 14.6947 26.2773L4.43735 9.61867C4.14946 9.15235 3.99796 8.6147 4.00002 8.06667C4.01231 7.25708 4.34565 6.48552 4.92675 5.92168C5.50784 5.35784 6.28909 5.04789 7.09869 5.06H24.9147C26.6174 5.05867 28 6.4 28 8.05867C28 8.60934 27.8454 9.15334 27.548 9.62667ZM6.95735 9.06667L14.588 20.8347V7.88267H7.75469C6.96535 7.88267 6.61202 8.40534 6.95735 9.06934M17.4107 20.8373L25.044 9.06667C25.3974 8.404 25.036 7.88 24.2454 7.88H17.4134L17.4107 20.8373Z" fill="white"/>
</svg>
+{win.toFixed(3)}</h1></div>
            <div className="flex flex-col gap-[12px]">
                <div className="flex gap-[12px] w-full">
                    <div className="flex-2">
                        <div><label className="text-[#FFFFFF] text-[14px]">{language =='eng'?'Bet':'Ставка'}</label></div>
                        <div className="relative"><input onChange={(e)=> {
                         localStorage.setItem('flame_bet',e.target.value);
                          
                        }} ref={ref} placeholder="0.01" className="ton_input w-full" type="number" /> <svg className="absolute top-[50%] translate-y-[-50%] left-[19px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.661 4.22L9.81501 16.714C9.71904 16.8653 9.58627 16.9898 9.42911 17.0759C9.27195 17.162 9.09554 17.2068 8.91636 17.2062C8.73717 17.2056 8.56107 17.1596 8.40449 17.0725C8.24792 16.9853 8.11598 16.8599 8.02102 16.708L0.328016 4.214C0.112094 3.86425 -0.00153249 3.46102 1.56103e-05 3.05C0.00922894 2.4428 0.259239 1.86413 0.695059 1.44125C1.13088 1.01837 1.71682 0.785909 2.32402 0.794995H15.686C16.963 0.793995 18 1.8 18 3.044C18 3.457 17.884 3.865 17.661 4.22ZM2.21802 3.8L7.94102 12.626V2.912H2.81602C2.22402 2.912 1.95902 3.304 2.21802 3.802M10.058 12.628L15.783 3.8C16.048 3.303 15.777 2.91 15.184 2.91H10.06L10.058 12.628Z" fill="white"/>
</svg></div>
                    </div>
                    <div className="flex-1">
                        <div><label className="text-[#FFFFFF] text-[14px] text-nowrap">{language=='eng'?'Flames':'Кол-во огоньков'}</label></div>
                        <div className="relative"><div className={`bg-[#482BAB] ${open ? 'rounded-b-[0]' :''} cursor-pointer duration-[200ms]  rounded-[20px] px-[16px] py-[14px]`} onClick={()=> {
                            setOpen(!open)
                        }}>{flames}</div><svg onClick={()=> {
                            setOpen(!open)
                        }}  className="absolute top-[50%] translate-y-[-50%] right-[17px] cursor-pointer" width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.4198 0.451988L13.4798 1.51299L7.70277 7.29199C7.6102 7.38514 7.50012 7.45907 7.37887 7.50952C7.25762 7.55997 7.12759 7.58594 6.99627 7.58594C6.86494 7.58594 6.73491 7.55997 6.61366 7.50952C6.49241 7.45907 6.38233 7.38514 6.28977 7.29199L0.509766 1.51299L1.56977 0.452987L6.99477 5.87699L12.4198 0.451988Z" fill="white"/>
</svg>
<div className={` ${open ? 'h-[100px]' :'h-0'} overflow-y-auto flames_scroll top-[40px] duration-[300ms] flex flex-col gap-[5px] rounded-b-[20px] overflow-hidden bg-[#482BAB] absolute ${open && 'pb-[10px] '} px-[16px]  w-full`}>
    <div className="flex items-center cursor-pointer py-[5px]" onClick={()=> {setFlames(2) ;setOpen(false)}}>2</div>
    <div className="flex items-center cursor-pointer py-[5px]" onClick={()=> {setFlames(3);setOpen(false)}}>3</div>
    <div className="flex items-center cursor-pointer py-[5px]" onClick={()=> {setFlames(4);setOpen(false)}}>4</div>
    <div className="flex items-center cursor-pointer py-[5px]" onClick={()=> {setFlames(5);setOpen(false)}}>5</div>
    <div className="flex items-center cursor-pointer py-[5px]" onClick={()=> {setFlames(6);setOpen(false)}}>6</div>
</div>


</div>

                    </div>
                </div>
                <div className="flex w-full justify-between gap-[8px]">
                    <div className=" h-[31px] bg-[#482BAB] border border-[#381CB280] rounded-[100px] flex-1 flex items-center justify-center text-[#FFFFFF] font-[400] text-[16px] cursor-pointer" onClick={()=> {
                   if (ref.current) {
                    const value = Number(ref.current.value);
                    if (!isNaN(value)) {
                      const newValue = value * 2;
                      ref.current.value = newValue.toString(); // <-- вот это добавляем
                    }
                  }
                    }}>2x</div>
                    <div onClick={()=> {
                   if (ref.current) {
                    const value = Number(ref.current.value);
                    if (!isNaN(value)) {
                      const newValue = value * 4;
                      ref.current.value = newValue.toString(); // <-- вот это добавляем
                    }
                  }
                    }} className=" h-[31px] bg-[#482BAB] border border-[#381CB280] rounded-[100px] flex-1 flex items-center justify-center text-[#FFFFFF] font-[400] text-[16px] cursor-pointer">4x</div>
                    <div onClick={()=> {
                   if (ref.current) {
                    const value = Number(ref.current.value);
                    if (!isNaN(value)) {
                      const newValue = value * 8;
                      ref.current.value = newValue.toString(); // <-- вот это добавляем
                    }
                  }
                    }} className=" h-[31px] bg-[#482BAB] border border-[#381CB280] rounded-[100px] flex-1 flex items-center justify-center text-[#FFFFFF] font-[400] text-[16px] cursor-pointer">8x</div>
                    <div onClick={() => {
  if (ref.current) {
    const value = Number(ref.current.value);
    if (!isNaN(value)) {
      const newValue = value / 2;
      if (newValue >= 0.01) {
        ref.current.value = newValue.toFixed(2); // округление до 2 знаков
      }
    }
  }
}}


 className=" h-[31px] bg-[#482BAB] border border-[#381CB280] rounded-[100px] flex-1 flex items-center justify-center text-[#FFFFFF] font-[400] text-[16px] cursor-pointer">1/2</div>
                    <div  onClick={()=> {
                      if(ref.current) {
                        ref.current.value = (Math.floor(balance * 100) / 100).toFixed(2).toString()
                      }
                    }} className=" h-[31px] bg-[#482BAB] border border-[#381CB280] rounded-[100px] flex-1 flex items-center justify-center text-[#FFFFFF] font-[400] text-[16px] cursor-pointer">MAX</div>
                </div>
            </div>
            <div><button onClick={HandleBet}  className={`outline-none w-full ${active ? 'bg-none border-[2px]':'bg-[#742CF1]'} duration-[200ms] border-[2px] border-[#742CF1] rounded-[100px] w-full py-[10px] font-[600] text-[16px] cursor-pointer`}>{language=='eng'?active? 'Claim':'Bet':active?  'Забрать':'Ставка'}</button></div>
        </div>
        </>
    )
}