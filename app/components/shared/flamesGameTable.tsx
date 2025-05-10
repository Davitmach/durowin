'use client';

import { Flames } from "../UI/UX/flames";
import { useEffect } from "react";
import { useAviableBetBlame, useFlamesActiveGameStore } from "@/app/store";

export const FlamesGameTable = ()=> {
const {gameTable,map,setMap,setGameTable} = useFlamesActiveGameStore();
const {setActive} = useAviableBetBlame()
useEffect(()=> {
 
  
if(map!=='') {
  setTimeout(() => {
    setMap('')
    setGameTable([])
    setActive(true)
  }, 3000);
}
},[map,gameTable])
    return(
        <div className="grid grid-cols-4 gap-[16px] mt-[20px] ">
           {map=='' ?  Array.from({ length: 12 }, (_, index) => {
        const isActive = gameTable.includes(index.toString());

        
        return <Flames key={index} status='ton' active={isActive} index={index} />;
      }):Array.from({ length: 12 }, (_, index) => {
        const char = map[index];
        const status = char === '1' ? 'fire' : 'ton';
        return (
          <Flames
            key={index}
            status={status}
            active={true}
            index={index}
          />
        );
      })}
            

        </div>
    )
}