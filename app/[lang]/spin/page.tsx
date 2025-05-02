import { Balance } from "@/app/components/shared/balance";
import { SpinGameTable } from "@/app/components/shared/spinGameTable";

export default function Page() {
    return(
        <div className="flex flex-col gap-[26px] fadeIn">
            <Balance/>
            <SpinGameTable/>
        </div>
    )
}