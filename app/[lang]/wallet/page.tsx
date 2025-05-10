'use client'
import { MyWallet } from "@/app/components/shared/myWallet";
import { Withdraw } from "@/app/components/shared/withdraw";
import { useBalanceStore } from "@/app/store";
import axios from "axios";
import { useEffect } from "react";

export default function Wallet() {
        const {setBalance} = useBalanceStore()
      useEffect(() => {
    const fetchBalance = async () => {
      try {
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
    return(
        <>
        <MyWallet/>
        <Withdraw/>
        </>
    )
}