import { create } from 'zustand'

interface BalanceStore {
  balance: number
  setBalance: (value: number) => void
  decreaseBalance: (amount: number) => void;
}

export const useBalanceStore = create<BalanceStore>((set,get) => ({
  balance: 0,
  setBalance: (value) => set({ balance: value }),
   decreaseBalance: (amount) => {
    const current = get().balance;
    set({ balance: current - amount });
  },
}))

type Status = "Success" | "Process";
type Type = "Deposit" | "Withdraw";

export interface Transaction {
  type: Type;
  status: Status;
  amount: number;
  date: string;
}

interface TransactionStore {
  deposits: Transaction[];
  withdrawals: Transaction[];
  setDeposits: (data: Transaction[]) => void;
  setWithdrawals: (data: Transaction[]) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  deposits: [],
  withdrawals: [],
  setDeposits: (data) => set({ deposits: data }),
  setWithdrawals: (data) => set({ withdrawals: data }),
}));



type Language = 'ru' | 'eng';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'ru',
  setLanguage: (lang) => {
    if (lang === 'ru' || lang === 'eng') {
      set({ language: lang });
    }
  },
}));
interface SoundStore {
  sound: boolean;
  setSound: (lang: boolean) => void;
}


export const useSoundStore = create<SoundStore>((set) => ({
  sound: true, 
  setSound: (newSoundState: boolean) => set({ sound: newSoundState }), 
}));

interface ActiveFlameStore {
  active: boolean;
  id: number | null;
  gameTable: string[];
  map:string;
  setActive: (active: boolean) => void;
  setId: (id: number | null) => void;
  setGameTable: (table: string[]) => void;
  setMap:(map:string)=> void
}

export const useFlamesActiveGameStore = create<ActiveFlameStore>((set) => ({
  active: false,
  id: null,
  gameTable: [],
  map:'',
  setMap:(newMap:string)=> set({map:newMap}),
  setActive: (newActiveState: boolean) => set({ active: newActiveState }),
  setId: (newId: number | null) => set({ id: newId }),
  setGameTable: (newTable: string[]) => set({ gameTable: newTable }),
}));

interface ClickSuccess {
  success: boolean;
  setSuccess: (success: boolean) => void;
}


export const useClickSuccess = create<ClickSuccess>((set) => ({
  success: false, 
  setSuccess: (newSoundState: boolean) => set({ success: newSoundState }), 
}));


interface AviableBetFlame {
  active: boolean;
  setActive: (success: boolean) => void;
}


export const useAviableBetBlame = create<AviableBetFlame>((set) => ({
  active: true, 
  setActive: (newSoundState: boolean) => set({ active: newSoundState }), 
}));

interface WinFlame {
  win: number;
  lose:number;
  setWin: (success: number) => void;
  setLose:(lose:number)=>void
}


export const useWinFlame = create<WinFlame>((set) => ({
  win: 0, 
  setWin: (newSoundState: number) => set({ win: newSoundState }), 
  lose:0,
  setLose:(newLoseState:number)=> set({lose:newLoseState})
}));
interface GameStart {
  start:boolean;

  setStart:(lose:boolean)=>void
}


export const useStartGame = create<GameStart>((set) => ({
 start:false,
 setStart:(state:boolean)=> set({start:state})
}));
