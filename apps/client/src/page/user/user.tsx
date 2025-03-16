import { useParams } from "react-router-dom";

export default function User() {
  const params = useParams();
  const userId = params["id"];
  return <div>User Page with userId : {userId}</div>;
}
