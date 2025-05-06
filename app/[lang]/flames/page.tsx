'use client'
import { Bet } from "@/app/components/shared/bet";
import { FlamesGameTable } from "@/app/components/shared/flamesGameTable";
import { HeaderInfoWithSound } from "@/app/components/shared/headerInfo";
import { useFlamesActiveGameStore } from "@/app/store";
import axios from "axios";
import { useEffect } from "react";

export default function Page() {
    const {setActive,setId,setGameTable} = useFlamesActiveGameStore();
    const CheckGame = async()=> {
        axios.get('https://api.durowin.xyz/games/flames/user_actual_room/1/1')
        .then(response => {
            const data = response.data;
          if(data == null) {
            setActive(false)

          }
          else {
            setActive(true)
            setId(data.id)
            const collectedRaw = data.collected_indexdes ?? "";
            const collectedArray: string[] = collectedRaw
            .split(',')
            .map((str: string) => str.trim())
            .filter(Boolean);
          
            setGameTable(collectedArray);
          }
           
          })
          .catch(error => {
            console.error('Ошибка:', error);
          });
        }
        useEffect(()=> {
            CheckGame()
            },[])
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