import { Bet } from "@/app/components/shared/bet";
import { FlamesGameTable } from "@/app/components/shared/flamesGameTable";
import { HeaderInfoWithSound } from "@/app/components/shared/headerInfo";

export default function Page() {
    return(
        <>
        <HeaderInfoWithSound/>
        <div className="flex flex-col gap-[81px] fadeIn">
        <FlamesGameTable/>
        <Bet/>
        </div>
        </>
    )
}