'use client'
import { useRef, useState } from "react";
import { Balance } from "@/app/components/shared/balance";

export default function Page() {
       const ref = useRef<HTMLInputElement>(null);
    
        const [inputValue, setInputValue] = useState(0.01);
      
        const handleIncrease = () => {
          const newValue = parseFloat((inputValue + 0.01).toFixed(2));
          setInputValue(newValue);
          if (ref.current) ref.current.value = newValue.toString();
        };
        const handleDicrement = () => {
            if(inputValue > 0.01) {
            const newValue = parseFloat((inputValue - 0.01).toFixed(2));
            setInputValue(newValue);
            if (ref.current) ref.current.value = newValue.toString();
            }
          };
    return(
        <>
        <div className="mine_container fixed left-0 top-0 w-full h-[100vh]   ">
            <div className="w-full flex justify-center">
            <Balance/>
            </div>


<div className="flex w-full justify-between mt-[25px]">
    <div className="relative"><img src={'/dirt1.png'}/>
    <div className="absolute bottom-[-15px]"><img src={'/man.png'}/></div>
    <div className="absolute top-[10px] right-0 kirka" ><img  src={'/kirka.png'}/></div>
    </div>
    <div><img src={'/dirt2.png'}/></div>
</div>


            <div className="flex flex-col items-center gap-[23px] mt-[81px]     ">
            <div  className="mt-[2px] flex items-center gap-[16px] cursor-pointer fadeIn">
                <div onClick={handleDicrement} style={{
                  opacity: inputValue > 0.01 ? '1' : '0.5'

                }}  className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] bg-[#FFFFFF]"><svg className="" width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.25 1.7485H0.75V0.248505H11.25V1.7485Z" fill="black"/>
</svg>
</div>
                <div className="relative"><input   onChange={(e) => setInputValue(parseFloat(e.target.value || "0"))} ref={ref} defaultValue={0.01} className="w-[106px] outline-none border border-[#381CB280] bg-[#482BAB] h-[52px] rounded-[100px] pl-[45px] text-[#999999] font-[500] text-[16px] pr-[10px] " type="number"  /><svg className="absolute top-[50%] left-[23px] translate-y-[-50%]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.2175 6.01667L10.6792 16.4283C10.5992 16.5544 10.4886 16.6582 10.3576 16.7299C10.2266 16.8017 10.0796 16.839 9.9303 16.8385C9.78098 16.838 9.63422 16.7997 9.50374 16.7271C9.37326 16.6545 9.26332 16.55 9.18418 16.4233L2.77335 6.01167C2.59341 5.72022 2.49872 5.38419 2.50001 5.04167C2.50769 4.53568 2.71603 4.05345 3.07922 3.70105C3.4424 3.34865 3.93068 3.15493 4.43668 3.16251H15.5717C16.6358 3.16167 17.5 4.00001 17.5 5.03667C17.5 5.38084 17.4033 5.72084 17.2175 6.01667ZM4.34835 5.66667L9.11751 13.0217V4.92667H4.84668C4.35335 4.92667 4.13251 5.25334 4.34835 5.66834M10.8817 13.0233L15.6525 5.66667C15.8733 5.25251 15.6475 4.92501 15.1533 4.92501H10.8833L10.8817 13.0233Z" fill="white"/>
</svg>
</div>
                <div onClick={handleIncrease} className="cursor-pointer w-[32px] h-[32px] flex items-center justify-center rounded-[8px] bg-[#FFFFFF]"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.25 6.7485H6.75V11.2485H5.25V6.7485H0.75V5.2485H5.25V0.748505H6.75V5.2485H11.25V6.7485Z" fill="black"/>
</svg>
</div>
            </div>
            <div className="fadeIn"><button className="spin_btn bg-[#742CF1] rounded-[100px] w-[113px] h-[113px] font-[700] text-white text-[32px] cursor-pointer border-[7px] border-[#8643FA]">DIG</button></div>
            </div>
        </div>
        </>
    )
}