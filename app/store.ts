import { create } from 'zustand'

interface BalanceStore {
  balance: number
  setBalance: (value: number) => void
}

export const useBalanceStore = create<BalanceStore>((set) => ({
  balance: 0,
  setBalance: (value) => set({ balance: value })
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