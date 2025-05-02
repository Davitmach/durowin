'use client';
import { useBalanceStore } from "@/app/store";


export const Balance = ()=> {
   const {balance} = useBalanceStore()
   
    return(
        <>
        <div className="fadeIn mt-[16px] bg-[#7430FF80] balance_box inline-flex items-center justify-center gap-[10px] py-[14px] px-[24px] rounded-[100px] h-[50px] mx-auto">
        <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.548 4.62664L13.0867 21.2853C12.9587 21.4871 12.7817 21.6531 12.5721 21.7678C12.3626 21.8826 12.1274 21.9424 11.8885 21.9416C11.6496 21.9408 11.4148 21.8794 11.206 21.7633C10.9972 21.6471 10.8213 21.4799 10.6947 21.2773L0.437354 4.61864C0.149459 4.15232 -0.00204332 3.61467 2.08138e-05 3.06664C0.0123053 2.25705 0.345651 1.48549 0.926746 0.921647C1.50784 0.357806 2.28909 0.0478589 3.09869 0.0599736H20.9147C22.6174 0.0586402 24 1.39997 24 3.05864C24 3.60931 23.8454 4.15331 23.548 4.62664ZM2.95735 4.06664L10.588 15.8346V2.88264H3.75469C2.96535 2.88264 2.61202 3.40531 2.95735 4.06931M13.4107 15.8373L21.044 4.06664C21.3974 3.40397 21.036 2.87997 20.2454 2.87997H13.4134L13.4107 15.8373Z" fill="white"/>
</svg>
<p className="text-white text-[28px]">{balance.toFixed(2)}</p>
        </div>
        </>
    )
}