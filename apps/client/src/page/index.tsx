import { useDocumentTitle } from "usehooks-ts";

export default function Index() {
  useDocumentTitle("Home");
  return <>
    Hello From Index Page

  </>;
}
