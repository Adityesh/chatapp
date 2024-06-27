import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginFormSchema } from "@/schema/authSchema";
import { useLoginUserMutation } from "@/store/slice/apiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/store";
import { SET_AUTH_STATE } from "@/store/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { APP_URL } from "@/constants/clientUrl.constants";

const LoginTab: React.FC<{
  handleTabChange: (value: "login" | "register") => void;
}> = ({ handleTabChange }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginUser] = useLoginUserMutation();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      await loginUser(values).unwrap();
      toast.success("Login successful");
      dispatch(SET_AUTH_STATE({ key: "isLoggedIn", value: true }));
      navigate(APP_URL.BASE);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormControl>
                <Input {...field} placeholder="Username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormControl>
                <Input {...field} type="password" placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-2 text-center">
          <Button type="submit">Login</Button>
        </div>
      </form>
      <div className="mt-2 text-center">
        <span>Don't have an account ? </span>
        <span
          className="text-primary cursor-pointer :hover:text-decoration-line:underline"
          onClick={() => handleTabChange("register")}
        >
          Register
        </span>
      </div>
    </Form>
  );
};

export default LoginTab;
