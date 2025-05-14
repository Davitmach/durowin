'use client';
import { useEffect, useRef, useState } from "react";
import { Balance, Balance2 } from "@/app/components/shared/balance";
import axios from "axios";
import { MineBlock } from "@/app/components/UI/UX/mine";
import { useSoundPlayer } from "@/app/sound";
import { useBalanceStore, UserData } from "@/app/store";

export default function Page() {
  const ref = useRef<HTMLInputElement>(null);
  const { play } = useSoundPlayer();
const {id,initData} = UserData();
  const [inputValue, setInputValue] = useState(0.01);
  const [data, setData] = useState<any>();
  const [showWin, setShowWin] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [blockTypes, setBlockTypes] = useState<('ton' | 'dirt')[]>([]);
const [opened,setOpen] = useState(0);
const [clicked,setClick] = useState(false);
  const { decreaseBalance, setBalance,balance } = useBalanceStore();
  const isMining = useRef(false);


  const handleIncrease = () => {
    if(gameStart == true) return
    const newValue = parseFloat((inputValue + 0.01).toFixed(2));
    setInputValue(newValue);
    if (ref.current) ref.current.value = newValue.toString();
  };

  const handleDicrement = () => {
    if(gameStart == true) return
    if (inputValue > 0.01) {
      const newValue = parseFloat((inputValue - 0.01).toFixed(2));
      setInputValue(newValue);
      if (ref.current) ref.current.value = newValue.toString();
    }
  };


const Mine = async () => {
   if (gameStart === true && opened === 9) {
    setOpen(0);
    setGameStart(false);
    setClick(false);

    // Ждём, пока состояние сбросится, затем повторно вызываем Mine
    setTimeout(() => {
      Mine();
    }, 100); // Короткая задержка, чтобы успели примениться setState
    return;
  }
  if (isMining.current || gameStart) return; // мгновенная блокировка
  isMining.current = true;

  if (balance < inputValue) {
    play('noTon');
    isMining.current = false; // снимаем блокировку, если ошибка
    return;
  }

  setTimeout(async () => {
    setGameStart(true);
    setShowWin(false);
    setData(null);
    setBlockTypes(Array(9).fill('ton'));

    try {
      const response = await axios.post('https://api.durowin.xyz/games/mine/play', {
        user_id: window.Telegram.WebApp.initDataUnsafe.user.id,
        init_data: window.Telegram.WebApp.initData,
        ton_bet: inputValue,
      });

      if (response.data.result) {
        play('mineStart');
        setData(response.data);
        decreaseBalance(inputValue);

        const tonCount = response.data.result.results.filter((item: string) => item === 'ton').length;
        const values: ('ton' | 'dirt')[] = [
          ...Array(tonCount).fill('ton'),
          ...Array(9 - tonCount).fill('dirt'),
        ];
        const shuffled = [...values].sort(() => Math.random() - 0.5);
        setBlockTypes(shuffled);
      } else {
        setGameStart(false);
      }
    } catch (error) {
      console.error("Ошибка при старте игры:", error);
      setGameStart(false);
    } finally {
      isMining.current = false; // снимаем блокировку
    }
  }, 1000);
};

  useEffect(() => {
    if (!gameStart) {
      setBlockTypes(Array(9).fill('ton'));
    }
  }, [gameStart]);

  useEffect(() => {
    if(showWin == true) {
      setBalance(balance+inputValue)
    }
  }, [showWin]);

      useEffect(() => {
    const fetchBalance = async () => {
      
      try {
        const response = await axios.get(`https://api.durowin.xyz/users/balance/${window.Telegram.WebApp.initDataUnsafe.user.id}/${encodeURIComponent(window.Telegram.WebApp.initData)}`);

        if (response.data?.detail === "Too Many Requests") {
          const savedBalance = localStorage.getItem("ton_balance");
          if (savedBalance !== null) {
            setBalance(parseFloat(savedBalance));
       
          }
    
        } else {
          
          
          const balance = response?.data?.ton_balance;
          
          
          if (typeof balance === "number") {
            localStorage.setItem("ton_balance", balance.toString());
            setBalance(balance);
          }
        }

  
      } catch (error) {
       
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
//   useEffect(()=> {
// if(opened ==9 && gameStart ==true) {
//   setTimeout(() => {
//   setOpen(0);
//   setGameStart(false)   
//   setClick(false) 
//   }, 2000);

// }

//   },[opened])
  useEffect(()=> {
const check = localStorage.getItem('mine_bet');
if(ref.current) {
  if(check) {
    ref.current.value = check;
    setInputValue(parseFloat(check));
  }
}
  },[])
  return (
    <>
      <div className=" max-w-[400px] relative  mine_container w-full h-[100vh] mb-[20px]">
        <div className="w-full flex justify-center">
          <Balance2 />
        </div>

        <div style={{justifyItems:'center'}} className="w-full grid grid-cols-3 gap-[16px] mt-[20px]">
          {blockTypes.map((type, index) => (
            <MineBlock setOpened={setOpen} setStart={setGameStart} showWin={setShowWin} gameStart={gameStart} key={index} type={type} />
          ))}
        </div>

        <div className={`w-full flex items-center justify-center absolute left-[50%] translate-x-[-50%] translate-y-[10px] ${showWin == false && 'hidden'}`}>
          <h1 className="flex items-center gap-[6px] font-[600] text-[20px]">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27.548 9.62667L17.0867 26.2853C16.9587 26.4871 16.7817 26.6531 16.5721 26.7679C16.3626 26.8826 16.1274 26.9424 15.8885 26.9416C15.6496 26.9408 15.4148 26.8795 15.206 26.7633C14.9972 26.6471 14.8213 26.4799 14.6947 26.2773L4.43735 9.61867C4.14946 9.15235 3.99796 8.6147 4.00002 8.06667C4.01231 7.25708 4.34565 6.48552 4.92675 5.92168C5.50784 5.35784 6.28909 5.04789 7.09869 5.06H24.9147C26.6174 5.05867 28 6.4 28 8.05867C28 8.60934 27.8454 9.15334 27.548 9.62667ZM6.95735 9.06667L14.588 20.8347V7.88267H7.75469C6.96535 7.88267 6.61202 8.40534 6.95735 9.06934M17.4107 20.8373L25.044 9.06667C25.3974 8.404 25.036 7.88 24.2454 7.88H17.4134L17.4107 20.8373Z" fill="white" />
            </svg>
            +{showWin && inputValue}
          </h1>
        </div>

        <div className="flex flex-col items-center gap-[23px] mt-[45px] pb-[103px]">
          <div className="mt-[2px] flex items-center gap-[16px] cursor-pointer fadeIn">
            <div onClick={handleDicrement} style={{ opacity: inputValue > 0.01 ? '1' : '0.5' }} className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] bg-[#FFFFFF]">
              <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.25 1.7485H0.75V0.248505H11.25V1.7485Z" fill="black" />
              </svg>
            </div>
            <div className="relative">
              <input
                disabled={gameStart}
                onChange={(e) => {setInputValue(parseFloat(e.target.value || "0"))

                  localStorage.setItem('mine_bet',e.target.value);
                }}
                ref={ref}
                defaultValue={0.01}
                className="w-[106px] outline-none border border-[#381CB280] bg-[#482BAB] h-[52px] rounded-[100px] pl-[45px] text-[#999999] font-[500] text-[16px] pr-[10px]"
                type="number"
              />
              <svg className="absolute top-[50%] left-[23px] translate-y-[-50%]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.2175 6.01667L10.6792 16.4283C10.5992 16.5544 10.4886 16.6582 10.3576 16.7299C10.2266 16.8017 10.0796 16.839 9.9303 16.8385C9.78098 16.838 9.63422 16.7997 9.50374 16.7271C9.37326 16.6545 9.26332 16.55 9.18418 16.4233L2.77335 6.01167C2.59341 5.72022 2.49872 5.38419 2.50001 5.04167C2.50769 4.53568 2.71603 4.05345 3.07922 3.70105C3.4424 3.34865 3.93068 3.15493 4.43668 3.16251H15.5717C16.6358 3.16167 17.5 4.00001 17.5 5.03667C17.5 5.38084 17.4033 5.72084 17.2175 6.01667ZM4.34835 5.66667L9.11751 13.0217V4.92667H4.84668C4.35335 4.92667 4.13251 5.25334 4.34835 5.66834M10.8817 13.0233L15.6525 5.66667C15.8733 5.25251 15.6475 4.92501 15.1533 4.92501H10.8833L10.8817 13.0233Z" fill="white" />
              </svg>
            </div>
            <div onClick={handleIncrease} className="cursor-pointer w-[32px] h-[32px] flex items-center justify-center rounded-[8px] bg-[#FFFFFF]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.25 6.7485H6.75V11.2485H5.25V6.7485H0.75V5.2485H5.25V0.748505H6.75V5.2485H11.25V6.7485Z" fill="black" />
              </svg>
            </div>
          </div>
          <div className="fadeIn">
            <button onClick={Mine} className=" active:scale-[1.2] duration-[300ms] spin_btn bg-[#742CF1] rounded-[100px] w-[113px] h-[113px] font-[700] text-white text-[32px] cursor-pointer border-[7px] border-[#8643FA]">GO</button>
          </div>
        </div>
      </div>
    </>
  );
}
