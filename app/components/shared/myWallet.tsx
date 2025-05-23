'use client';
import { beginCell, Cell, storeStateInit } from '@ton/core'
import { useBalanceStore, useLanguageStore } from "@/app/store";
import {
  SendTransactionRequest,
  TonConnectButton,
  useTonAddress,
  useTonConnectUI,
  
} from "@tonconnect/ui-react";
import axios from "axios";

import { useEffect, useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import SlotCounter from "react-slot-counter";

export const MyWallet = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { balance } = useBalanceStore();
  const { language } = useLanguageStore();
  const userWalletAddress = useTonAddress();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const [show,setShow] = useState(false);



  const handleClick = () => {
    setOpen(true);
  };
const handleDeposit = async () => {
  if (!ref.current) return;

  const value = Number(ref.current.value);
  if (isNaN(value) || value < 0.25) return;

  try {
    const addressResponse = await axios.get<string>("https://api.durowin.xyz/main_ton_address");
    const mainAddress = addressResponse.data;

    const nanoAmount = BigInt(Math.floor(value * 1e9)).toString(); // безопасное преобразование в строку без экспоненты

    const userId = (window.Telegram.WebApp.initDataUnsafe.user.id).toString();
    const stateInit = beginCell()
      .storeUint(0, 32)
      .storeStringTail(userId)
      .endCell();

    const transaction: SendTransactionRequest = {
      validUntil: Date.now() + 5 * 60 * 1000,
      messages: [
        {
          address: mainAddress,
          amount: nanoAmount,
          payload: stateInit.toBoc().toString("base64"),
        },
      ],
    };

    const result = await tonConnectUI.sendTransaction(transaction);


    


    setOpen(false); // Закрыть модальное окно
    
    setShow(true)
    
  
  } catch (err) {
    console.error("Deposit error:", err);
   
  }
};



useEffect(()=> {
if(show ==true) {
  setTimeout(() => {
  setShow(false)  
  }, 5000);
  
}
},[show])
  return (
    <>
    {show&&
    <div className='fadeIn bg-[#742cf1] rounded-[12px] p-[10px]  flex items-center justify-center left-[50%] translate-x-[-50%] text-[19px] fixed max-w-[400px] top-[20px] w-[89%] z-[99999999] shadow-xl '>{language=='ru'?'Ваши средства поступят через минуту' :'Your funds will arrive in a minute'}</div>
    }
      <div className="fadeIn bg-[#260E53] rounded-[32px] py-[16px] flex flex-col items-center gap-[20px] px-[16px] mt-[24px]">
        <div>
          <h1 className="text-[#FFFFFF] font-[700] text-[22px]">
            {language === "eng" ? "Your wallet" : "Ваш кошелек"}
          </h1>
        </div>
        <div className="flex items-center gap-[6px]">
          <svg
            width="24"
            height="22"
            viewBox="0 0 24 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.548 4.62667L13.0867 21.2853C12.9587 21.4871 12.7817 21.6531 12.5721 21.7679C12.3626 21.8826 12.1274 21.9424 11.8885 21.9416C11.6496 21.9408 11.4148 21.8795 11.206 21.7633C10.9972 21.6471 10.8213 21.4799 10.6947 21.2773L0.437354 4.61867C0.149459 4.15235 -0.00204332 3.6147 2.08138e-05 3.06667C0.0123053 2.25708 0.345651 1.48552 0.926746 0.921677C1.50784 0.357836 2.28909 0.0478894 3.09869 0.0600041H20.9147C22.6174 0.0586708 24 1.4 24 3.05867C24 3.60934 23.8454 4.15334 23.548 4.62667ZM2.95735 4.06667L10.588 15.8347V2.88267H3.75469C2.96535 2.88267 2.61202 3.40534 2.95735 4.06934M13.4107 15.8373L21.044 4.06667C21.3974 3.404 21.036 2.88 20.2454 2.88H13.4134L13.4107 15.8373Z"
              fill="white"
            />
          </svg>
          <span className="text-[#FFFFFF] text-[28px]">
            <SlotCounter value={(Math.floor(balance * 100) / 100).toFixed(2)} />
          </span>
        </div>
        <div className="w-full flex justify-center">
          <button
            onClick={handleClick}
            className="bg-[#742CF1] rounded-[100px] w-full py-[13px] font-[600] text-[16px] cursor-pointer"
          >
            {language === "eng" ? "Top up" : "Пополнить"}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed w-full px-[20px] h-[100vh] bg-black/40 left-0 top-0 z-[999999999] flex items-center justify-center">
          <div className="fadeIn max-w-[400px] deposit_box w-full p-[30px] bg-[#260e53] rounded-[16px] flex flex-col gap-[16px] relative">
            <FaXmark
              onClick={() => setOpen(false)}
              className="text-[20px] absolute top-[10px] right-[10px] cursor-pointer"
            />

            {userWalletAddress.length === 0 && (
              <div className="flex justify-center">
                {/* <TonConnectButton /> */}
                <button onClick={()=> tonConnectUI.openModal()} className='mt-[15px] outline-none bg-[#742CF1] rounded-[100px] w-full py-[13px] font-[600] text-[16px] cursor-pointer'>Connect Wallet</button>
              </div>
            )}

            <div className="relative pb-[0px]">
              <input
                ref={ref}
                className="ton_input w-full !pl-[45px]"
                type="text"
                placeholder="0.25"
              />
              <svg
                className="absolute top-[50%] translate-y-[-50%] left-[19px]"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M17.661 4.22L9.81501 16.714C9.71904 16.8653 9.58627 16.9898 9.42911 17.0759C9.27195 17.162 9.09554 17.2068 8.91636 17.2062C8.73717 17.2056 8.56107 17.1596 8.40449 17.0725C8.24792 16.9853 8.11598 16.8599 8.02102 16.708L0.328016 4.214C0.112094 3.86425 -0.00153249 3.46102 1.56103e-05 3.05C0.00922894 2.4428 0.259239 1.86413 0.695059 1.44125C1.13088 1.01837 1.71682 0.785909 2.32402 0.794995H15.686C16.963 0.793995 18 1.8 18 3.044C18 3.457 17.884 3.865 17.661 4.22ZM2.21802 3.8L7.94102 12.626V2.912H2.81602C2.22402 2.912 1.95902 3.304 2.21802 3.802M10.058 12.628L15.783 3.8C16.048 3.303 15.777 2.91 15.184 2.91H10.06L10.058 12.628Z"
                  fill="white"
                />
              </svg>
               <h1 className='absolute right-0 text-[13px] text-[#999999]'>{language=='eng'? 'min 0.25':'минимум 0.25'}</h1>
            </div>

           {userWalletAddress.length>0 && <button
              onClick={()=>{
setTimeout(() => {
  handleDeposit()
}, 1000);

              }}
           
              className="mt-[15px] outline-none bg-[#742CF1] rounded-[100px] w-full py-[13px] font-[600] text-[16px] cursor-pointer"
            >
              {language === "eng" ? "Deposit" : "Пополнить"}
            </button>
}
            {userWalletAddress.length > 0 && (
              <button
                className="outline-none bg-[#742CF1] rounded-[100px] w-full py-[13px] font-[600] text-[16px] cursor-pointer"
                onClick={() => {
                  tonConnectUI.disconnect();
                }}
              >
                {language === "eng" ? "Disconnect Wallet" : "Отключить кошелек"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};