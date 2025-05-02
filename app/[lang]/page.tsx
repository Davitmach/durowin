import Image from "next/image";
import { HeaderInfo } from "../components/shared/headerInfo";
import { History } from "../components/shared/history";

export default function Home() {
  return (
<div>
  <HeaderInfo/>
  <History/>
</div>
  );
}
