'use client';

import { useBalanceStore, useLanguageStore } from "@/app/store";
import { useTonConnectUI } from "@tonconnect/ui-react";
import axios from "axios";
import { useEffect, useState } from "react";
import SlotCounter from 'react-slot-counter';

export const MyWallet = ()=> {
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const {balance} = useBalanceStore();
    const {language} = useLanguageStore();

    
    return(
        <div className="fadeIn bg-[#260E53] rounded-[32px] py-[16px] flex flex-col items-center gap-[20px] px-[16px] mt-[24px]">
            <div><h1 className="text-[#FFFFFF] font-[700] text-[22px]">{language=='eng'?'Your wallet':'Ваш кошелек'}</h1></div>
            <div className="flex items-center gap-[6px]">
            <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.548 4.62667L13.0867 21.2853C12.9587 21.4871 12.7817 21.6531 12.5721 21.7679C12.3626 21.8826 12.1274 21.9424 11.8885 21.9416C11.6496 21.9408 11.4148 21.8795 11.206 21.7633C10.9972 21.6471 10.8213 21.4799 10.6947 21.2773L0.437354 4.61867C0.149459 4.15235 -0.00204332 3.6147 2.08138e-05 3.06667C0.0123053 2.25708 0.345651 1.48552 0.926746 0.921677C1.50784 0.357836 2.28909 0.0478894 3.09869 0.0600041H20.9147C22.6174 0.0586708 24 1.4 24 3.05867C24 3.60934 23.8454 4.15334 23.548 4.62667ZM2.95735 4.06667L10.588 15.8347V2.88267H3.75469C2.96535 2.88267 2.61202 3.40534 2.95735 4.06934M13.4107 15.8373L21.044 4.06667C21.3974 3.404 21.036 2.88 20.2454 2.88H13.4134L13.4107 15.8373Z" fill="white"/>
</svg>
<span className="text-[#FFFFFF] text-[28px]"><SlotCounter value={balance.toFixed(2)} /></span>
            </div>
            <div className="w-full flex justify-center"><button onClick={()=> {
tonConnectUI.openModal()
            }} className="bg-[#742CF1] rounded-[100px] w-full py-[13px] font-[600] text-[16px] cursor-pointer">{language=='eng'?'Top up':'Пополнить'}</button></div>
        </div>
    )
}