"use client";

import { useBalanceStore } from "@/app/store";
import axios from "axios";
import { useEffect } from "react";

export const GetBalance = () => {
  const { setBalance,balance} = useBalanceStore();
useEffect(()=> {
console.log(balance,'балик');

},[balance])
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

        console.log(response.data);
      } catch (error) {
        console.error("Ошибка при получении баланса:", error);
        const cached = localStorage.getItem("ton_balance");
        
        
        if (cached !== null) {
          console.log(cached,'qaq');
          setBalance(parseFloat(cached));
          console.warn("Ошибка запроса. Использован кэш:", cached);
        }
      }
    };

    fetchBalance();
  }, [setBalance]);

  return null;
};
