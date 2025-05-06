'use client';

import axios from "axios";
import { Flames } from "../UI/UX/flames";
import { useEffect } from "react";
import { useFlamesActiveGameStore } from "@/app/store";

export const FlamesGameTable = ()=> {
const {gameTable,map} = useFlamesActiveGameStore();

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