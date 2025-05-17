import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ComponentPropsWithoutRef, memo, PropsWithChildren } from "react";

interface EmojiInputProps
  extends ComponentPropsWithoutRef<typeof Popover>,
    ComponentPropsWithoutRef<typeof EmojiPicker> {
  open: boolean;
  handleClose: () => void;
  closeOnSelect?: boolean;
}

const EmojiInput = ({
  open,
  children,
  closeOnSelect,
  handleClose,
  onOpenChange,
  onEmojiSelect,
}: PropsWithChildren<EmojiInputProps>) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <EmojiPicker
          className="h-[342px]"
          onEmojiSelect={(emoji) => {
            if (closeOnSelect) {
              handleClose();
            }
            if(onEmojiSelect) {
              onEmojiSelect(emoji);
            }
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
};

export default memo(EmojiInput);
