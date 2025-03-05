import { APP_URL } from "@/constants/clientUrl.constants.ts";
import { useAppSelector } from "@/store/store.ts";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from 'usehooks-ts';
import "./style.css"
import { Button } from '@/components/ui/button.tsx';

export default function AuthRoute() {
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  useDocumentTitle("Register or Login to the app")

  if(isLoggedIn) navigate(APP_URL.BASE);

  return <div className={"background h-100"}>
    Auth <Button className='mt'>Click me</Button>
  </div>;
}
