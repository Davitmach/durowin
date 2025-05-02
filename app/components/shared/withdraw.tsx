'use client';

import { useState } from 'react';
import axios from 'axios';
import { useLanguageStore } from '@/app/store';

export const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
const {language} = useLanguageStore();
  const handleWithdraw = async () => {
    if (!amount || !address) {

      return;
    }

    try {
      await axios.post('https://api.durowin.xyz/withdraws/create', {
        init_data: '1',
        user_id: 1,
        to_address: address,
        ton_amount: parseFloat(amount),
      });
     
      setAmount('');
      setAddress('');
    } catch (e) {
      console.error(e);
     
    }
  };

  return (
    <div className="fadeIn withdraw_container bg-[#260E53] rounded-[32px] mt-[20px] py-[20px] px-[16px] flex flex-col items-center gap-[16px]">
      <div>
        <h1 className="text-[20px] text-[#FFFFFF] font-[700]">{language=='eng'?'Withdraw' :'Вывод'} (TON)</h1>
      </div>
      <div className="flex flex-col w-full gap-[8px]">
        <label>{language=='eng'?'Quantity':'Количество'}</label>
        <div className="relative">
          <input
            className="ton_input w-full"
            type="text"
            placeholder="30.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <svg className="absolute top-[50%] translate-y-[-50%] left-[19px]" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.661 4.22L9.81501 16.714C9.71904 16.8653 9.58627 16.9898 9.42911 17.0759C9.27195 17.162 9.09554 17.2068 8.91636 17.2062C8.73717 17.2056 8.56107 17.1596 8.40449 17.0725C8.24792 16.9853 8.11598 16.8599 8.02102 16.708L0.328016 4.214C0.112094 3.86425 -0.00153249 3.46102 1.56103e-05 3.05C0.00922894 2.4428 0.259239 1.86413 0.695059 1.44125C1.13088 1.01837 1.71682 0.785909 2.32402 0.794995H15.686C16.963 0.793995 18 1.8 18 3.044C18 3.457 17.884 3.865 17.661 4.22ZM2.21802 3.8L7.94102 12.626V2.912H2.81602C2.22402 2.912 1.95902 3.304 2.21802 3.802M10.058 12.628L15.783 3.8C16.048 3.303 15.777 2.91 15.184 2.91H10.06L10.058 12.628Z" fill="white" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col w-full gap-[8px]">
        <label>{language=='eng'?'Address':'Адрес'}</label>
        <input
          type="text"
          placeholder={language =='eng'?'Put here your TON address': 'Напишите здесь ваш TON адрес'}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="w-full">
        <button
          className="w-full bg-[#742CF1] rounded-[100px] py-[10px] font-[600] text-[16px] cursor-pointer"
          onClick={handleWithdraw}
        >
          {language=='eng'?'Withdraw':'Вывести'}
        </button>
      </div>
    </div>
  );
};
