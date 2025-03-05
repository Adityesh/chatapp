import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useLazySearchUsersQuery,
  useSearchUsersQuery,
} from "@/store/slice/apiSlice";
import { BaseUserResult } from "@repo/shared";
import { FC, memo, useState } from "react";
import makeAnimated from "react-select/animated";
import Select from "react-select/async";

const animatedComponents = makeAnimated();

const ChannelUserDialog: FC<{
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}> = ({ open, handleOpenChange }) => {
  const [fetchUsers] = useLazySearchUsersQuery();

  const loadUsers = async (
    inputValue: string,
    callback: (options: BaseUserResult[]) => void
  ) => {
    return fetchUsers({ limit: 5, page: 1, query: inputValue }).then(
      (value) => {
        const options = value?.data?.data.items;
        return callback(options || []);
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-white mb-4 font-satoshi">
            Add users
          </DialogTitle>
          <DialogDescription>
            <Select
              closeMenuOnSelect={false}
              loadOptions={loadUsers}
              components={animatedComponents}
              isMulti
              getOptionLabel={(option) => option.fullName}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ChannelUserDialog);
