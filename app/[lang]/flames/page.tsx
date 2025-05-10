'use client'
import { Bet } from "@/app/components/shared/bet";
import { FlamesGameTable } from "@/app/components/shared/flamesGameTable";
import { HeaderInfoWithSound } from "@/app/components/shared/headerInfo";
import { useBalanceStore, useFlamesActiveGameStore } from "@/app/store";
import axios from "axios";
import { useEffect } from "react";

export default function Page() {
    const {setActive,setId,setGameTable} = useFlamesActiveGameStore();
    const {setBalance} = useBalanceStore()
      useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (window.Telegram && window.Telegram.WebApp) {
       const response = await axios.get(`https://api.durowin.xyz/users/balance/${window.Telegram.WebApp.initDataUnsafe.user.id}/${encodeURIComponent(window.Telegram.WebApp.initData)}`);

        if (response.data?.detail === "Too Many Requests") {
          const savedBalance = localStorage.getItem("ton_balance");
          if (savedBalance !== null) {
            setBalance(parseFloat(savedBalance));
            console.warn("Слишком много запросов. Использован кэш:", savedBalance);
          }
        } else {
          
          
          const balance = response?.data?.ton_balance;
          if (typeof balance === "number") {
            localStorage.setItem("ton_balance", balance.toString());
            setBalance(balance);
          }
        }

      }
      } catch (error) {
        console.error("Ошибка при получении баланса:", error);
        const cached = localStorage.getItem("ton_balance");
        
        
        if (cached !== null) {

          setBalance(parseFloat(cached));
          console.warn("Ошибка запроса. Использован кэш:", cached);
        }
      }
    };
setTimeout(() => {
  fetchBalance();
}, 1000);
    
  }, [setBalance]);
    const CheckGame = async()=> {
        axios.get(`https://api.durowin.xyz/games/flames/user_actual_room/${window.Telegram.WebApp.initDataUnsafe.user.id}/${encodeURIComponent(window.Telegram.WebApp.initData)}`)
        .then(response => {
            const data = response.data;
          if(data == null) {
            setActive(false)

          }
          else {
            setActive(true)
            setId(data.id)
            const collectedRaw = data.collected_indexdes ?? "";
            const collectedArray: string[] = collectedRaw
            .split(',')
            .map((str: string) => str.trim())
            .filter(Boolean);
          
            setGameTable(collectedArray);
          }
           
          })
          .catch(error => {
            console.error('Ошибка:', error);
          });
        }
        useEffect(()=> {
          setTimeout(() => {
            CheckGame()
          }, 1000);
            
            },[])
    return(
        <>
        <HeaderInfoWithSound/>
        <div className="flex flex-col gap-[81px] fadeIn">
        <FlamesGameTable/>
        <Bet/>
        </div>
        </>
    )
}