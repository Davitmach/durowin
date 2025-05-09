
'use client'
import { useEffect, useState } from "react";
import { Deposit } from "../UI/UX/deposit";
import { useLanguageStore, useTransactionStore } from "@/app/store";


export const History = () => {
  type Page = "Deposit" | "Withdraw";
  const [page, setPage] = useState<Page>("Deposit");
  const {language} = useLanguageStore();
const [data,setData] = useState<any>([])
  const deposits = useTransactionStore((s) => s.deposits);
  const withdrawals = useTransactionStore((s) => s.withdrawals);

  // const data = page === "Deposit" ? deposits.reverse() : withdrawals.reverse();
useEffect(()=> {
if(page =='Deposit') {
  setData(deposits.reverse())
}
else {
setData(withdrawals.reverse())
}

},[page])
  return (
    <div className="mb-[90px] fadeIn mt-[24px] z-[99999999999999] history_container bg-[#260E53] rounded-[32px] py-[20px] px-[16px] flex flex-col items-center gap-[20px]">
      <div>
        <h1 className="text-[#FFFFFF] font-[700] text-[22px]">{language == 'eng' ?'History' :'История'}</h1>
      </div>
      <div className="relative flex bg-[#78788040] justify-between w-full rounded-[100px] p-[6px]">
        <div
          style={{ fontWeight: page == "Deposit" ? "600" : "400" }}
          onClick={() => setPage("Deposit")}
          className="text-[13px] text-[#FFFFFF] z-[99999] cursor-pointer w-[50%] flex items-center justify-center rounded-[100px]"
        >
         {language == 'eng'? 'Deposits':'Депозиты'} 
        </div>
        <div
          style={{ fontWeight: page == "Withdraw" ? "600" : "400" }}
          onClick={() => setPage("Withdraw")}
          className="text-[13px] text-[#FFFFFF] z-[99999] cursor-pointer w-[50%] flex items-center justify-center rounded-[100px]"
        >
          {language == 'eng'? 'Withdrawals':'Выводы'} 
          
        </div>
        <div
          style={{ left: page == "Deposit" ? "4px" : "calc(50% - 4px)" }}
          className="duration-[200ms] -z-[0] history_slider absolute bg-[#482BAB] w-[50%] h-[28px] rounded-[100px] top-[50%] translate-y-[-50%]"
        ></div>
      </div>
      <div className="flex flex-col gap-[12px] w-full max-h-[368px] overflow-y-auto history">
        {data.map((item:any, index:any) => (
          <Deposit key={index} amount={item.amount} date={item.date} status={item.status} type={item.type} />
        ))}
      </div>
    </div>
  );
};
