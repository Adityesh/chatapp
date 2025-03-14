import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { APP_URL } from "@/constants/clientUrl.constants";
import { SET_AUTH_STATE } from "@/store/slice/authSlice";
import { useAppDispatch } from "@/hooks/useStore.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDocumentTitle } from "usehooks-ts";
import GoogleSignin from "../common/GoogleSignin";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { LoginFormSchema, loginSchema } from "./loginSchema";
import { useLoginUserMutation } from '@/store/api/authApi.ts';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginUser, loginRequest] = useLoginUserMutation();
  useDocumentTitle("Login to your account");

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormSchema) => {
    await loginUser(values).unwrap();
    toast.success("Login successful");
    dispatch(SET_AUTH_STATE({ key: "isLoggedIn", value: true }));
    navigate(APP_URL.BASE);
  };

  const handleGoogleLogin = () => {
    window.open(import.meta.env.VITE_SERVER_BASE_URL + "/auth/google", "_self");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full w-full">
        <h1 className="font-poppins-bold text-white text-xl md:text-center">
          Sign in to our platform
        </h1>
        <h3 className="font-satoshi font-medium text-gray-400 mb-4 md:text-center">
          Login here using your username and password
        </h3>
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-white">Username</FormLabel>
              <FormControl className="m-0">
                <Input
                  placeholder="Username"
                  {...field}
                  className="bg-transparent text-white text-lg"
                />
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
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Password"
                  type="password"
                  {...field}
                  className="bg-transparent text-white text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full my-4 text-white md:w-32 md:mx-auto flex"
          loading={loginRequest.isLoading}
        >
          Sign in
        </Button>
        <p className="text-center text-white">
          Not registered?{" "}
          <Link className="text-blue-500" to={APP_URL.REGISTER}>
            Create Account
          </Link>
        </p>

        <Separator className="my-4" />
      </form>
      <GoogleSignin
        className="w-full md:w-fit md:mx-auto text-white"
        onClick={handleGoogleLogin}
      />
    </Form>
  );
}
