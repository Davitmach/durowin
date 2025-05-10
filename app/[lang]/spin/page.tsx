'use client'
import { Balance } from "@/app/components/shared/balance";
import { SpinGameTable } from "@/app/components/shared/spinGameTable";
import { useBalanceStore } from "@/app/store";
import axios from "axios";
import { useEffect } from "react";

export default function Page() {
        const {setBalance} = useBalanceStore()
      useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get("https://api.durowin.xyz/users/balance/1/1");

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

    fetchBalance();
  }, [setBalance]);
    return(
        <div className="flex flex-col gap-[26px] fadeIn">
            <Balance/>
            <SpinGameTable/>
        </div>
    )
}