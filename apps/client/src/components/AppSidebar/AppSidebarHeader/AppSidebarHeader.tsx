import { Input } from "@/components/ui/input.tsx";
import { useAppDispatch, useAppSelector } from "@/store/store.ts";
import { stringToCapitalize } from "@/utils.ts";
import { UPDATE_TAB_SEARCH } from "@/store/slice/navigationSlice.ts";

export default function AppSidebarHeader() {
  const dispatch = useAppDispatch();
  const { tab, tabSearch } = useAppSelector((state) => state.navigation);
  const tabFormatted = stringToCapitalize(tab);

  const handleTabSearch = (tabSearch: string) => {
    dispatch(UPDATE_TAB_SEARCH(tabSearch));
  };
  return (
    <>
      <h1 className={"text-white text-4xl font-satoshi px-4"}>
        {tabFormatted} (4)
      </h1>
      <div className={"px-4"}>
        <Input
          className={"text-white font-poppins px-4"}
          placeholder={`Search ${tabFormatted}`}
          value={tabSearch}
          onChange={(e) => handleTabSearch(e.target.value)}
        />
      </div>
    </>
  );
}
