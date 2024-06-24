import { Outlet } from "react-router-dom";

export default function Root() {
  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/local/login",
        {
          method: "post",
          body: JSON.stringify({
            userName: "Adityesh1",
            password: "Test@123",
          }),
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        },
      );

      console.log(await response.json());
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        credentials: "include",
      });
      console.log(await response.json());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      Root Element
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
      <Outlet />
    </>
  );
}
