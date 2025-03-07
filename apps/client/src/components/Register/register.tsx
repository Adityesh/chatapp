import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { APP_URL } from "@/constants/clientUrl.constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDocumentTitle } from "usehooks-ts";
import GoogleSignin from "../common/GoogleSignin";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { RegisterFormSchema, registerSchema } from "./registerSchema";
import { useRegisterUserMutation } from "@/store/slice/apiSlice";

export default function Register() {
  const [registerUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  useDocumentTitle("Create your account");

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      password: "",
      avatarUrl: undefined,
      email: "",
      fullName: "",
    },
  });

  const onSubmit = async (values: RegisterFormSchema) => {
    const result = await registerUser(values).unwrap();
    if(!result.error) {
      navigate(APP_URL.AUTH)
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full w-full">
        <h1 className="font-poppins-bold text-white text-2xl md:text-center">
          Register on to our platform
        </h1>
        <h3 className="font-satoshi font-medium text-gray-400 mb-4 md:text-center">
          Create an account providing basic details
        </h3>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-white">Fullname</FormLabel>
              <FormControl className="m-0">
                <Input
                  placeholder="Fullname"
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
          name="email"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl className="m-0">
                <Input
                  placeholder="Email"
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

        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-white">Avatar</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    onChange(e.target.files && e.target.files[0])
                  }
                  className="bg-transparent text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full my-4 text-white md:w-32 md:mx-auto flex">
          Sign up
        </Button>

        <p className="text-center text-white">
          Already have an account?{" "}
          <Link className="text-blue-500" to={APP_URL.AUTH}>
            Sign in
          </Link>
        </p>

        <Separator className="my-4" />
      </form>
      <GoogleSignin className="w-full md:w-fit md:mx-auto text-white" />
    </Form>
  );
}
