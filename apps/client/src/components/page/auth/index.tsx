import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginTab from "./login";
import RegisterTab from "./register";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const AuthComponent = () => {
  const [tab, setTab] = useState<"login" | "register">("login");

  const handleTabChange = (value: typeof tab) => {
    setTab(value);
  };

  const handleGoogleLogin = () => {
    window.open(import.meta.env.VITE_SERVER_BASE_URL + "/auth/google", "_self");
  };

  return (
    <div className="h-full flex justify-center items-center flex-col">
      <Tabs
        value={tab}
        className="w-[400px] mx-4"
        onValueChange={(value) => handleTabChange(value as typeof tab)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginTab handleTabChange={handleTabChange} />
        </TabsContent>
        <TabsContent value="register">
          <RegisterTab handleTabChange={handleTabChange} />
        </TabsContent>
      </Tabs>
      <Separator className="my-4 w-[95%]" />
      <Button className="bg-foreground" onClick={handleGoogleLogin}>
        <img src={"./google.svg"} height={25} width={25} />
        Sign in with Google
      </Button>
    </div>
  );
};

export default AuthComponent;
