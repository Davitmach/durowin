import { useLanguageStore } from "@/app/store";

interface IDeposit {
    type:'Deposit' | 'Withdraw';
    status:'Success' |'Process'|'Cancelled'
    amount:number;
    date:string;
}
export const Deposit = (props:IDeposit)=> {
    const {language} = useLanguageStore();
    return(
        <div className="bg-[#482BAB] history_block flex w-full rounded-[12px] p-[10px] justify-between items-center">
            <div className={`flex  ${props.type == 'Withdraw' && props.status =='Process' ?'gap-[12px]' : 'gap-[0] flex-col'}`}>
                {props.type == 'Withdraw' && props.status =='Process' ? 
                <>
                <div><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 22C4.925 22 0 17.075 0 11C0 4.925 4.925 0 11 0C17.075 0 22 4.925 22 11C22 17.075 17.075 22 11 22ZM12 4.5H10V11.414L14 15.414L15.414 14L12 10.586V4.5Z" fill="white"/>
</svg>
</div>
                <div>
                    <div><h1 className="font-[500] text-[14px]">  {language == 'eng' ? props.type : 'Вывод' }</h1></div>
                    {/* <div><span className="text-[#999999] text-[12px] font-[400]">{props.date}</span></div> */}
                </div>
                </>
                :
                <>
            <div><h1 className="font-[500] text-[14px]">{language=='eng' ?  props.type: props.type == 'Deposit' ?'Депозит':'Вывод' }</h1></div>
            {/* <div><span className="text-[#999999] text-[12px] font-[400]">{props.date}</span></div> */}
                </>
                }
            </div>
            <div className="flex flex-col items-end">
                <div><span className="text-[14px] font-[400]">{props.type == 'Deposit'? '+' :'-'} {props.amount} TON</span></div>
                <div><h4 className="text-[12px]">{language == 'eng' ? props.status: props.status =='Cancelled'? 'Отменен':props.status =='Process'? 'В процессе':'Успешно'}</h4></div>
            </div>
        </div>
    )
}