 'use client';

import { useLoopSound, useSoundPlayer } from "@/app/sound";
import { useBalanceStore, useLanguageStore } from "@/app/store";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
const ICONS = ['meat', 'tons', 'ice', 'airplane', 'cash', 'eggplant', 'palm'];
const ICONS_MAP: Record<string, string> = {
  meat: '/meat.png',
  tons: '/tons.png',
  ice: '/ice.png',
  airplane: '/airplane.png',
  cash: '/ton.png',
  eggplant: '/eggplant.png',
  palm: '/palm.png'
};

type SpinResult = {
  result: {
    row_1: string[];
    row_2: string[];
    row_3: string[];
    ton_win: number;
  };
  balance: number;
};

const getRandomIcon = () => ICONS[Math.floor(Math.random() * ICONS.length)];

export const SpinGameTable = ()=> {
  const [auto, setAuto] = useState(false);
  const holdTimer = useRef<any>(null);
  const wasHeld = useRef<any>(false);
  const intervalId = useRef<any>(null);
const [first,setFirst] = useState(true);
    const ref = useRef<HTMLInputElement>(null);
    const {language} = useLanguageStore();
    const [inputValue, setInputValue] = useState(0.01);
    const {setBalance} = useBalanceStore();
    const [spin, setSpin] = useState(false);
    const [columns, setColumns] = useState<string[][]>([[], [], []]);
    const [result, setResult] = useState<SpinResult | null>(null);
    const [showResult, setShowResult] = useState(false);
  const [active,setActive] = useState(false);
  const {balance} = useBalanceStore();
const {play} = useSoundPlayer();
const {push} = useRouter();
    useEffect(() => {
      // Инициализация случайными значениями при первом рендере
      const tempColumns: string[][] = [[], [], []];
      for (let i = 0; i < 30; i++) {
        const row = [getRandomIcon(), getRandomIcon(), getRandomIcon()];
        row.forEach((val, idx) => {
          tempColumns[idx].push(val);
        });
      }
      setColumns(tempColumns);
    }, []);
    const [isFirstSpin, setIsFirstSpin] = useState(true); // Флаг для отслеживания первого спина

    const startHold = () => {
      wasHeld.current = false;
      holdTimer.current = setTimeout(() => {
        wasHeld.current = true;
        enableAutoSpin();
      }, 1000);
    };
  
    const cancelHold = () => {
      clearTimeout(holdTimer.current);
    };
  
    // Включаем автоставку
    const enableAutoSpin = () => {
      if (intervalId.current) return; // уже включена
      setAuto(true);
      intervalId.current = setInterval(() => {
        if (!active) {
          handleSpin();
        }
      }, 7000);
    };
  
    // Выключаем автоставку
    const disableAutoSpin = () => {
      setAuto(false);
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  
    // Обычный клик
    const handleClick = () => {
      if (wasHeld.current) return; // не обрабатывать клик после удержания
      if (auto) {
        disableAutoSpin(); // выключаем авто
      } else {
        handleSpin(); // обычный спин
      }
    };
  
    // Очистка при размонтировании
    useEffect(() => {
      return () => {
        clearTimeout(holdTimer.current);
        clearInterval(intervalId.current);
      };
    }, []);


    const handleSpin = async () => {
      
    

      if(inputValue < balance) {
        if(auto == true) {
          setTimeout(() => {
            handleSpin()
          }, 4000);
        }
        setBalance(balance -inputValue);
        play('start')
      setSpin(false);
      setShowResult(false);
      setResult(null);
      setActive(true);
      setTimeout(() => {
        setActive(false);
      }, 3000);
setTimeout(() => {
  play('game')     
}, 300);
 
  
      const currentTop = columns.map((col) => col.slice(-3)); // Последние 3, т.е. верхние
    
      // Создаём рандомные 27 строк (27 значений: 3 колонки по 27)
      const tempColumns: string[][] = [[], [], []];
      for (let i = 0; i < 27; i++) {
        const row = [getRandomIcon(), getRandomIcon(), getRandomIcon()];
        row.forEach((val, idx) => {
          tempColumns[idx].push(val);
        });
      }
      const newColumns = isFirstSpin
        ? columns // При первом спине оставляем старые данные
        : tempColumns.map((col, idx) => [...currentTop[idx], ...col]); // Добавляем новые для обычных спинов
    
      setColumns(newColumns);
    
      // После первого спина, обновляем флаг
      if (isFirstSpin) {
        setIsFirstSpin(false);
      }
    
      setTimeout(() => setSpin(true), 10);
    
      try {
        const res = await fetch('https://api.durowin.xyz/games/spin/play', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 1,
            init_data: '1',
            ton_bet: inputValue,
          }),
        });
    
        const data: SpinResult = await res.json();
      if(!data.result) {

        push(`/${language}`)
      }
    
        setResult(data);
      setTimeout(() => {
        
       
        setBalance(data.balance);

      
        if(Number(data.result.ton_win)>0) {
          if (
            Array.isArray(data.result.row_2) &&
            data.result.row_2.some((item) => item?.includes?.('ton'))
          ) {
            play('winTon');
            triggerAnimation()
          }
          else {
            play('win')
     
          }
        }
        else {
          play('noTon')
        
        }
      }, 2000);
        setTimeout(() => {
          const withResult: string[][] = [...newColumns];
    
          // Добавляем 3 строки результата
          withResult[0].push(data.result.row_1[0]);
          withResult[1].push(data.result.row_1[1]);
          withResult[2].push(data.result.row_1[2]);
          withResult[0].push(data.result.row_2[0]);
          withResult[1].push(data.result.row_2[1]);
          withResult[2].push(data.result.row_2[2]);
          withResult[0].push(data.result.row_3[0]);
          withResult[1].push(data.result.row_3[1]);
          withResult[2].push(data.result.row_3[2]);
    
          setColumns(withResult);
    
          setTimeout(() => {
            setShowResult(true);
          }, 900);
        }, 1000);
      } catch (err) {
        console.error('Ошибка:', err);
      }
    }
    else {
      play('noTon')
    }
    ;}
    
    
    
  
  
    const handleIncrease = () => {
      const newValue = parseFloat((inputValue + 0.01).toFixed(2));
      if(auto == true) {
        disableAutoSpin();
      }
      setInputValue(newValue);
      if (ref.current) ref.current.value = newValue.toString();
    };
    const handleDicrement = () => {
        if(inputValue > 0.01) {
          if(auto == true) {
            disableAutoSpin();
          }
        const newValue = parseFloat((inputValue - 0.01).toFixed(2));
        setInputValue(newValue);
        if (ref.current) ref.current.value = newValue.toString();
        }
      };
      const [isActive, setIsActive] = useState(false);

      useEffect(() => {
        const images = document.querySelectorAll('.falling-img');
        images.forEach((img:any, index) => {
          // Случайное горизонтальное положение
          const randomLeft = Math.random();
          img.style.setProperty('--random-left', randomLeft);
          
          // Случайный угол вращения
          const randomRotate = (Math.random() * 2) + 1; // от 1 до 3 оборотов
          img.style.setProperty('--random-rotate', randomRotate);
    
          // Случайная задержка для разных изображений
          const delay = Math.random() * 2;
          img.style.animationDelay = `${delay}s`;
        });
      }, [isActive]); // Когда состояние активируется, анимация обновляется
    
      const triggerAnimation = () => {
       
        
        setIsActive(false); // Сбрасываем анимацию
        setTimeout(() => {
          setIsActive(true); // Перезапускаем анимацию
        }, 50); // С небольшой задержкой, чтобы дать браузеру время сбросить анимацию
        setTimeout(() => {
          setIsActive(false)
        }, 6000);
      };

    return(
      <>
     <div className={`win_page fixed ${isActive ? 'active' : ''}`}>
  {[...Array(40)].map((_, i) => (
    <img key={i} src="/tons.png" alt="" className="falling-img" />
  ))}
</div>
        <div className="flex flex-col gap-[23px] items-center w-full mb-[130px]">
            <div className="max-w-[354px] w-full h-[219px] rounded-[12px]  relative overflow-visible">
            <div className="max-w-[354px] w-full h-[219px] rounded-[12px]  relative ">
                <div className="rounded-[12px] bg-[#000000] opacity-[.25] w-full h-full spin_game_table"></div>
                <div className="box rounded-[12px] w-full h-full absolute left-0 top-0 ">
                    <div className="z-[9999999999999] absolute left-[8px] top-[8px] bg-[#FFFFFF] white_part opacity-[.75] w-[5px] h-[5px] rounded-[100px]"></div>
                    <div className="z-[9999999999999] absolute left-[8px] bottom-[8px] bg-[#FFFFFF] white_part opacity-[.75] w-[5px] h-[5px] rounded-[100px]"></div>
                    <div className="z-[9999999999999] absolute right-[8px] top-[8px] bg-[#FFFFFF] white_part opacity-[.75] w-[5px] h-[5px] rounded-[100px]"></div>
                    <div className="z-[9999999999999] absolute right-[8px] bottom-[8px] bg-[#FFFFFF] [box-shadow: -0.68px 1px 1.1px 0px #3D151540;] opacity-[.75] w-[5px] h-[5px] rounded-[100px] "></div>
                </div>
                <div className="rounded-[12px] purple w-full h-full absolute left-0 top-0"></div>
                <div className="px-[22px] flex absolute  top-[11px] left-[50%] translate-x-[-50%] w-full items-center gap-[11px]">
                    <div className="flex-[.7] bg-[white] h-[1px]"></div>
                    <div className="flex-1 flex justify-center"><svg width="113" height="9" viewBox="0 0 113 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.33491 4.5232H6.85915V7.4528C6.4658 7.74739 6.01505 7.97649 5.49877 8.13197C4.98249 8.28745 4.46623 8.36931 3.94176 8.36931C3.19602 8.36931 2.51582 8.21381 1.91759 7.88648C1.31936 7.56734 0.852269 7.12545 0.508082 6.56081C0.163895 5.99617 0 5.34972 0 4.63778C0 3.92584 0.17209 3.27934 0.508082 2.7147C0.852269 2.15006 1.31936 1.70817 1.92579 1.38903C2.53221 1.06989 3.21238 0.90625 3.96632 0.90625C4.59733 0.90625 5.171 1.01264 5.68728 1.22541C6.20356 1.43817 6.63787 1.74908 6.99025 2.15006L5.91672 3.14024C5.40043 2.60015 4.77765 2.32193 4.0483 2.32193C3.58938 2.32193 3.17963 2.4201 2.81906 2.60832C2.45848 2.80471 2.17984 3.07476 1.98316 3.42664C1.78648 3.77851 1.67995 4.17951 1.67995 4.62959C1.67995 5.07966 1.77829 5.47248 1.98316 5.82435C2.17984 6.17623 2.45847 6.44627 2.81085 6.64267C3.16324 6.83907 3.57297 6.93725 4.02369 6.93725C4.50719 6.93725 4.94154 6.83087 5.3267 6.62629V4.51501L5.33491 4.5232Z" fill="white"/>
<path d="M9.87452 7.88648C9.27629 7.56734 8.801 7.11726 8.45681 6.55262C8.11263 5.98798 7.94873 5.34972 7.94873 4.63778C7.94873 3.92584 8.12082 3.29572 8.45681 2.72289C8.7928 2.15007 9.26809 1.70817 9.87452 1.38903C10.4727 1.06989 11.1529 0.90625 11.8986 0.90625C12.6444 0.90625 13.3246 1.06989 13.9228 1.38903C14.521 1.70817 14.9963 2.15825 15.3405 2.72289C15.6847 3.28753 15.8568 3.92584 15.8568 4.63778C15.8568 5.34972 15.6847 5.97979 15.3405 6.55262C14.9963 7.11726 14.5292 7.56734 13.9228 7.88648C13.3246 8.20563 12.6526 8.36931 11.8986 8.36931C11.1447 8.36931 10.4727 8.20563 9.87452 7.88648ZM13.0624 6.65081C13.4065 6.45442 13.677 6.18437 13.8736 5.83249C14.0703 5.48062 14.1687 5.08786 14.1687 4.63778C14.1687 4.18771 14.0703 3.79489 13.8736 3.44302C13.677 3.09114 13.4065 2.8211 13.0624 2.6247C12.7182 2.4283 12.333 2.33012 11.9068 2.33012C11.4807 2.33012 11.0956 2.4283 10.7514 2.6247C10.4072 2.8211 10.1368 3.09114 9.94009 3.44302C9.74341 3.79489 9.64504 4.19589 9.64504 4.63778C9.64504 5.07967 9.74341 5.48062 9.94009 5.83249C10.1368 6.18437 10.4072 6.45442 10.7514 6.65081C11.0956 6.84721 11.4807 6.94544 11.9068 6.94544C12.333 6.94544 12.7182 6.84721 13.0624 6.65081Z" fill="white"/>
<path d="M18.5855 7.88648C17.9872 7.56734 17.5119 7.11726 17.1677 6.55262C16.8236 5.98798 16.6597 5.34972 16.6597 4.63778C16.6597 3.92584 16.8318 3.29572 17.1677 2.72289C17.5037 2.15007 17.979 1.70817 18.5855 1.38903C19.1837 1.06989 19.8638 0.90625 20.6096 0.90625C21.3553 0.90625 22.0355 1.06989 22.6338 1.38903C23.232 1.70817 23.7073 2.15825 24.0515 2.72289C24.3956 3.28753 24.5677 3.92584 24.5677 4.63778C24.5677 5.34972 24.3956 5.97979 24.0515 6.55262C23.7073 7.11726 23.2402 7.56734 22.6338 7.88648C22.0355 8.20563 21.3635 8.36931 20.6096 8.36931C19.8556 8.36931 19.1837 8.20563 18.5855 7.88648ZM21.7733 6.65081C22.1175 6.45442 22.3879 6.18437 22.5846 5.83249C22.7813 5.48062 22.8796 5.08786 22.8796 4.63778C22.8796 4.18771 22.7813 3.79489 22.5846 3.44302C22.3879 3.09114 22.1175 2.8211 21.7733 2.6247C21.4291 2.4283 21.0439 2.33012 20.6178 2.33012C20.1916 2.33012 19.8065 2.4283 19.4623 2.6247C19.1181 2.8211 18.8477 3.09114 18.651 3.44302C18.4544 3.79489 18.356 4.19589 18.356 4.63778C18.356 5.07967 18.4544 5.48062 18.651 5.83249C18.8477 6.18437 19.1181 6.45442 19.4623 6.65081C19.8065 6.84721 20.1916 6.94544 20.6178 6.94544C21.0439 6.94544 21.4291 6.84721 21.7733 6.65081Z" fill="white"/>
<path d="M25.8306 1.02902H29.1085C29.8953 1.02902 30.5837 1.17636 31.1901 1.47914C31.7965 1.78192 32.2636 2.19924 32.5914 2.73933C32.9274 3.27942 33.0913 3.91771 33.0913 4.63783C33.0913 5.35795 32.9274 5.98807 32.5914 6.53634C32.2554 7.07643 31.7883 7.50194 31.1901 7.79653C30.5919 8.09113 29.8953 8.2466 29.1085 8.2466H25.8306V1.02902ZM29.0266 6.88002C29.7478 6.88002 30.3214 6.67545 30.7557 6.27447C31.1819 5.8735 31.4032 5.32522 31.4032 4.63783C31.4032 3.95045 31.1901 3.41036 30.7557 3.0012C30.3296 2.60022 29.7478 2.39565 29.0266 2.39565H27.5024V6.87183H29.0266V6.88002Z" fill="white"/>
<path d="M37.2793 1.02902H38.951V6.88001H42.5732V8.2384H37.2793V1.02087V1.02902Z" fill="white"/>
<path d="M44.2203 7.51827C43.6467 6.94545 43.3599 6.13533 43.3599 5.0797V1.0372H45.0317V5.01422C45.0317 6.30716 45.5643 6.95368 46.6378 6.95368C47.1623 6.95368 47.5557 6.79819 47.8343 6.48723C48.1129 6.17627 48.2441 5.68525 48.2441 5.02241V1.04539H49.8912V5.08789C49.8912 6.14352 49.6044 6.96182 49.0308 7.52646C48.4571 8.09928 47.654 8.38574 46.6215 8.38574C45.5889 8.38574 44.7858 8.09928 44.2122 7.52646L44.2203 7.51827Z" fill="white"/>
<path d="M53.0134 7.89481C52.4152 7.57567 51.9481 7.13378 51.6121 6.56914C51.2679 6.0045 51.104 5.35805 51.104 4.64611C51.104 3.93417 51.2761 3.28767 51.6121 2.72303C51.9563 2.15839 52.4234 1.71651 53.0134 1.39736C53.6117 1.07822 54.2755 0.914581 55.0212 0.914581C55.644 0.914581 56.2094 1.02093 56.7175 1.24188C57.2256 1.46282 57.6517 1.782 57.9959 2.19116L56.9224 3.18129C56.4307 2.61665 55.8325 2.33845 55.1031 2.33845C54.6524 2.33845 54.259 2.43663 53.9067 2.63303C53.5543 2.82943 53.2838 3.09947 53.0872 3.45135C52.8905 3.80323 52.7922 4.20422 52.7922 4.64611C52.7922 5.088 52.8905 5.48895 53.0872 5.84083C53.2838 6.1927 53.5543 6.46275 53.9067 6.65914C54.259 6.85554 54.6524 6.95378 55.1031 6.95378C55.8243 6.95378 56.4307 6.66732 56.9224 6.0945L57.9959 7.08469C57.6517 7.50203 57.2256 7.82116 56.7175 8.0421C56.2094 8.26305 55.644 8.36945 55.013 8.36945C54.2755 8.36945 53.6117 8.21395 53.0134 7.88662V7.89481Z" fill="white"/>
<path d="M61.7487 5.41525L60.7817 6.42176V8.2466H59.1182V1.02902H60.7817V4.40049L63.9778 1.02902H65.838L62.8468 4.24501L66.0183 8.2466H64.0679L61.7569 5.41525H61.7487Z" fill="white"/>
<path d="M71.1738 2.39564H68.8628V1.0372H75.1565V2.39564H72.8456V8.24659H71.1738V2.39564Z" fill="white"/>
<path d="M77.4185 7.88648C76.8202 7.56734 76.3449 7.11726 76.0008 6.55262C75.6566 5.98798 75.4927 5.34972 75.4927 4.63778C75.4927 3.92584 75.6648 3.29572 76.0008 2.72289C76.3367 2.15007 76.812 1.70817 77.4185 1.38903C78.0167 1.06989 78.6969 0.90625 79.4426 0.90625C80.1884 0.90625 80.8685 1.06989 81.4668 1.38903C82.065 1.70817 82.5403 2.15825 82.8845 2.72289C83.2287 3.28753 83.4008 3.92584 83.4008 4.63778C83.4008 5.34972 83.2287 5.97979 82.8845 6.55262C82.5403 7.11726 82.0732 7.56734 81.4668 7.88648C80.8685 8.20563 80.1966 8.36931 79.4426 8.36931C78.6887 8.36931 78.0167 8.20563 77.4185 7.88648ZM80.6063 6.65081C80.9505 6.45442 81.2209 6.18437 81.4176 5.83249C81.6143 5.48062 81.7126 5.08786 81.7126 4.63778C81.7126 4.18771 81.6143 3.79489 81.4176 3.44302C81.2209 3.09114 80.9505 2.8211 80.6063 2.6247C80.2621 2.4283 79.877 2.33012 79.4508 2.33012C79.0247 2.33012 78.6395 2.4283 78.2953 2.6247C77.9511 2.8211 77.6807 3.09114 77.484 3.44302C77.2874 3.79489 77.189 4.19589 77.189 4.63778C77.189 5.07967 77.2874 5.48062 77.484 5.83249C77.6807 6.18437 77.9511 6.45442 78.2953 6.65081C78.6395 6.84721 79.0247 6.94544 79.4508 6.94544C79.877 6.94544 80.2621 6.84721 80.6063 6.65081Z" fill="white"/>
<path d="M91.0532 5.69345V8.2466H89.3814V5.66892L86.5869 1.02902H88.3652L90.2992 4.23687L92.2332 1.02902H93.8722L91.0614 5.68526L91.0532 5.69345Z" fill="white"/>
<path d="M95.7163 7.88648C95.1181 7.56734 94.6428 7.11726 94.2986 6.55262C93.9544 5.98798 93.7905 5.34972 93.7905 4.63778C93.7905 3.92584 93.9626 3.29572 94.2986 2.72289C94.6346 2.15007 95.1099 1.70817 95.7163 1.38903C96.3145 1.06989 96.9947 0.90625 97.7404 0.90625C98.4862 0.90625 99.1664 1.06989 99.7646 1.38903C100.363 1.70817 100.838 2.15825 101.182 2.72289C101.527 3.28753 101.699 3.92584 101.699 4.63778C101.699 5.34972 101.527 5.97979 101.182 6.55262C100.838 7.11726 100.371 7.56734 99.7646 7.88648C99.1664 8.20563 98.4944 8.36931 97.7404 8.36931C96.9865 8.36931 96.3145 8.20563 95.7163 7.88648ZM98.9042 6.65081C99.2483 6.45442 99.5188 6.18437 99.7154 5.83249C99.9121 5.48062 100.01 5.08786 100.01 4.63778C100.01 4.18771 99.9121 3.79489 99.7154 3.44302C99.5188 3.09114 99.2483 2.8211 98.9042 2.6247C98.56 2.4283 98.1748 2.33012 97.7486 2.33012C97.3225 2.33012 96.9374 2.4283 96.5932 2.6247C96.249 2.8211 95.9786 3.09114 95.7819 3.44302C95.5852 3.79489 95.4868 4.19589 95.4868 4.63778C95.4868 5.07967 95.5852 5.48062 95.7819 5.83249C95.9786 6.18437 96.249 6.45442 96.5932 6.65081C96.9374 6.84721 97.3225 6.94544 97.7486 6.94544C98.1748 6.94544 98.56 6.84721 98.9042 6.65081Z" fill="white"/>
<path d="M103.764 7.51827C103.19 6.94545 102.903 6.13533 102.903 5.0797V1.0372H104.575V5.01422C104.575 6.30716 105.108 6.95368 106.181 6.95368C106.706 6.95368 107.099 6.79819 107.378 6.48723C107.656 6.17627 107.787 5.68525 107.787 5.02241V1.04539H109.435V5.08789C109.435 6.14352 109.148 6.96182 108.574 7.52646C108.001 8.09928 107.197 8.38574 106.165 8.38574C105.132 8.38574 104.329 8.09928 103.756 7.52646L103.764 7.51827Z" fill="white"/>
<path d="M111.025 8.0584C110.837 7.87837 110.738 7.65743 110.738 7.39556C110.738 7.1337 110.828 6.91277 111.017 6.74092C111.205 6.56907 111.443 6.47905 111.73 6.47905C112.017 6.47905 112.254 6.56907 112.443 6.74092C112.631 6.91277 112.721 7.1337 112.721 7.39556C112.721 7.65743 112.623 7.87837 112.435 8.0584C112.246 8.23843 112.008 8.32846 111.73 8.32846C111.451 8.32846 111.214 8.23843 111.025 8.0584ZM110.771 1.02902H112.689L112.369 5.74255H111.091L110.771 1.02902Z" fill="white"/>
</svg>
</div>
                    <div className="flex-[.7] bg-[white] h-[1px]"></div>
                </div>
                <div className="overflow-hidden max-w-[329px] w-full h-[170px] absolute  game left-[50%] translate-x-[-50%] bottom-[14px] rounded-[12px]">
<div className=" black px-[5px] flex gap-[3px] bg-[#000000] top-[4px] absolute left-[50%] translate-x-[-50%] rounded-[12px] overflow-hidden">
<div className="box_shadow"></div>



<div className="h-[170px] flex overflow-hidden gap-[3px] ">
        {columns.map((col, colIndex) => (
          <div
            key={colIndex}
            className={
              'flex bg-[#8643FA] bg-fixed   flex-1 flex-col  ' +
              (spin ? `spin-col  spin-delay-${colIndex}` : '')
            }
          >
            {col.map((icon, i) => {
              const isResultPart = i >= col.length - 3; // последние 3 строки для результата
              const rowIndex = i - (col.length - 3);
              return (
                <div
                  key={i}
                  className={
                    'h-[59px]  shrink-0 py-[27px] px-[27px]  bg-[#8643FA] flex items-center justify-center ' 
                  
                  }
                >
                  <img
                    src={ICONS_MAP[icon]}
                    alt={icon}
                    className={` h-[43px] w-[48px]`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>


</div>

                </div>
            
         
                <div className="arrow absolute top-[56%] translate-y-[-50%] right-[-10px]  translate-x-[40px] z-[99999999999]"><img src={'/arrow.png'}/></div>
            </div>
           
            </div>
            <div className="mt-[4px] h-[70px] ">
             
<div className="font-[600] text-[#FFFFFF] text-[16px]">{language=='eng'?'Hold to start/stop auto-spin' :'Держите, чтобы начать/остановить авто-вращение'}</div>
{showResult&&result&& result.result.ton_win > 0 && <div className="flex items-center gap-[8px] w-full justify-center mt-[24px]"><svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.548 4.62667L13.0867 21.2853C12.9587 21.4871 12.7817 21.6531 12.5721 21.7679C12.3626 21.8826 12.1274 21.9424 11.8885 21.9416C11.6496 21.9408 11.4148 21.8795 11.206 21.7633C10.9972 21.6471 10.8213 21.4799 10.6947 21.2773L0.437354 4.61867C0.149459 4.15235 -0.00204332 3.6147 2.08138e-05 3.06667C0.0123053 2.25708 0.345651 1.48552 0.926746 0.921677C1.50784 0.357836 2.28909 0.0478894 3.09869 0.0600041H20.9147C22.6174 0.0586708 24 1.4 24 3.05867C24 3.60934 23.8454 4.15334 23.548 4.62667ZM2.95735 4.06667L10.588 15.8347V2.88267H3.75469C2.96535 2.88267 2.61202 3.40534 2.95735 4.06934M13.4107 15.8373L21.044 4.06667C21.3974 3.404 21.036 2.88 20.2454 2.88H13.4134L13.4107 15.8373Z" fill="white"/>
</svg>
<h1>+{result?.result.ton_win.toFixed(2)}</h1>
</div>}
            </div>
            <div  className="mt-[2px] flex items-center gap-[16px] cursor-pointer">
                <div onClick={handleDicrement} style={{
                  opacity: inputValue > 0.01 ? '1' : '0.5'

                }}  className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] bg-[#FFFFFF]"><svg className="" width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.25 1.7485H0.75V0.248505H11.25V1.7485Z" fill="black"/>
</svg>
</div>
                <div className="relative"><input   onChange={(e) => {setInputValue(parseFloat(e.target.value || "0"))
                  if(auto == true) {
                    disableAutoSpin()
                  }
                }} ref={ref} defaultValue={0.01} className="w-[106px] outline-none border border-[#381CB280] bg-[#482BAB] h-[52px] rounded-[100px] pl-[45px] text-[#999999] font-[500] text-[16px] pr-[10px] " type="number"  /><svg className="absolute top-[50%] left-[23px] translate-y-[-50%]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.2175 6.01667L10.6792 16.4283C10.5992 16.5544 10.4886 16.6582 10.3576 16.7299C10.2266 16.8017 10.0796 16.839 9.9303 16.8385C9.78098 16.838 9.63422 16.7997 9.50374 16.7271C9.37326 16.6545 9.26332 16.55 9.18418 16.4233L2.77335 6.01167C2.59341 5.72022 2.49872 5.38419 2.50001 5.04167C2.50769 4.53568 2.71603 4.05345 3.07922 3.70105C3.4424 3.34865 3.93068 3.15493 4.43668 3.16251H15.5717C16.6358 3.16167 17.5 4.00001 17.5 5.03667C17.5 5.38084 17.4033 5.72084 17.2175 6.01667ZM4.34835 5.66667L9.11751 13.0217V4.92667H4.84668C4.35335 4.92667 4.13251 5.25334 4.34835 5.66834M10.8817 13.0233L15.6525 5.66667C15.8733 5.25251 15.6475 4.92501 15.1533 4.92501H10.8833L10.8817 13.0233Z" fill="white"/>
</svg>
</div>
                <div onClick={handleIncrease} style={{
                  opacity: inputValue < balance ? '1' : '0.5'

                }}  className="cursor-pointer w-[32px] h-[32px] flex items-center justify-center rounded-[8px] bg-[#FFFFFF]"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.25 6.7485H6.75V11.2485H5.25V6.7485H0.75V5.2485H5.25V0.748505H6.75V5.2485H11.25V6.7485Z" fill="black"/>
</svg>
</div>
            </div>
            <div><button    onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onClick={handleClick}   style={{transform:auto ==true ? 'scale(1.2)': 'scale(1)'}} disabled={active}  className="no-select duration-[400ms] spin_btn bg-[#742CF1] rounded-[100px] w-[113px] h-[113px] font-[700] text-white text-[32px] cursor-pointer border-[7px] border-[#8643FA]">SPIN</button></div>
        </div>
        <style jsx>{`
        .spin-col {
          animation: spin 2s ease-in-out forwards;
        }

        .spin-delay-1 {
          animation-delay: 0.3s;
        }

        .spin-delay-2 {
          animation-delay: 0.6s;
        }

        @keyframes spin {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-1040%); /* ограничили, чтобы не улетало слишком далеко */
          }
        }
      `}</style>
    </>
    )
}
