'use client';

import { Flames } from "../UI/UX/flames";

export const FlamesGameTable = ()=> {
    return(
        <div className="grid grid-cols-4 gap-[16px] mt-[20px] ">
            <Flames status={true}/>
            <Flames status={false}/>
            <Flames status={true}/>
            <Flames status={true}/>
            <Flames status={false}/>
            <Flames status={true}/>
            <Flames status={true}/>
            <Flames status={false}/>
            <Flames status={true}/>
            <Flames status={true}/>
            <Flames status={true}/>
            <Flames status={true}/>

        </div>
    )
}