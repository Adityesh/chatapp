import { useNavigate } from "react-router-dom";
import { FC } from "react";

type ErrorProps = {
  notFound?: boolean;
};

const Error: FC<ErrorProps> = ({ notFound }) => {
  const navigate = useNavigate();

  return (
    <div className={"text-white h-screen w-full flex-col"}>
      <h1>{notFound ? "Page not found" : "Something went wrong 😢"}</h1>
      <p>{notFound ? "404" : "Unknown error"}</p>
      <button onClick={() => navigate(-1)}>&larr; Go back</button>
    </div>
  );
};

export default Error;
