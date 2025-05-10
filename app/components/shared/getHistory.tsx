"use client";

import { useTransactionStore } from "@/app/store";
import { useEffect } from "react";

export const TransactionLoader = () => {
  const setDeposits = useTransactionStore((s) => s.setDeposits);
  const setWithdrawals = useTransactionStore((s) => s.setWithdrawals);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const res = await fetch(`https://api.durowin.xyz/deposits/get_users_deposits/${window.Telegram.WebApp.initDataUnsafe.user.id}/${window.Telegram.WebApp.initData}`);
        const data = await res.json();

        if (data?.detail === "Too Many Requests") {
          const cached = localStorage.getItem("deposits");
          if (cached) {
            const parsed = JSON.parse(cached);
            setDeposits(parsed);
            console.warn("Депозиты: лимит запросов. Использован кэш.");
          }
          return;
        }

        const mapped = data.map((item: any) => ({
          type: "Deposit",
          status: "Success",
          amount: item.ton_amount,
          date: new Date().toLocaleTimeString(),
        }));

        setDeposits(mapped);
        localStorage.setItem("deposits", JSON.stringify(mapped));
      } catch (e) {
        console.error("Ошибка при загрузке депозитов:", e);
        const cached = localStorage.getItem("deposits");
        if (cached) {
          const parsed = JSON.parse(cached);
          setDeposits(parsed);
          console.warn("Ошибка при запросе. Использован кэш депозитов.");
        }
      }
    };

    const fetchWithdrawals = async () => {
      try {
        const res = await fetch(`https://api.durowin.xyz/withdraws/get_user_list/${window.Telegram.WebApp.initDataUnsafe.user.id}/${window.Telegram.WebApp.initData}`);
        const data = await res.json();

        if (data?.detail === "Too Many Requests") {
          const cached = localStorage.getItem("withdrawals");
          if (cached) {
            const parsed = JSON.parse(cached);
            setWithdrawals(parsed);
            console.warn("Выводы: лимит запросов. Использован кэш.");
          }
          return;
        }

        const mapped = data.map((item: any) => ({
          type: "Withdraw",
          status: item.status === "process"
          ? "Process"
          : item.status === "cancelled"
          ? "Cancelled"
          : "Success",
          amount: item.ton_amount,
          date: new Date().toLocaleTimeString(),
        }));

        setWithdrawals(mapped);
        localStorage.setItem("withdrawals", JSON.stringify(mapped));
      } catch (e) {
        console.error("Ошибка при загрузке выводов:", e);
        const cached = localStorage.getItem("withdrawals");
        if (cached) {
          const parsed = JSON.parse(cached);
          setWithdrawals(parsed);
          console.warn("Ошибка при запросе. Использован кэш выводов.");
        }
      }
    };
setTimeout(() => {
  fetchDeposits();
    fetchWithdrawals();
}, 1000);
    
  }, [setDeposits, setWithdrawals]);

  return null;
};
