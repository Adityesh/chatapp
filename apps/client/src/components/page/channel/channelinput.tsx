import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Typing from "@/components/ui/typing";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  useGetLoggedInUserQuery,
  useSendMessageMutation,
} from "@/store/slice/apiSlice";
import { SEND_MESSAGE, USER_TYPING } from "@/store/slice/socketSlice";
import { getUsersTyping } from "@/utils";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { EmojiMartPickerOnClick } from "@repo/shared";
import { ChangeEvent, useRef, useState } from "react";

const ChannelInput: React.FC<{ channelId: number }> = ({ channelId }) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileState, setFileState] = useState(new Date().toString());
  const [attachments, setAttachments] = useState<Record<string, File>>({});
  const [content, setContent] = useState("");
  const [sendMessage] = useSendMessageMutation();
  const { data: loggedInUser } = useGetLoggedInUserQuery(null);
  const usersTyping = useAppSelector((state) => state.socket.usersTyping);
  const currentUsersTyping = usersTyping[channelId] || [];

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const files =
      Object.values(attachments).length > 0
        ? Object.values(attachments)
        : undefined;
    if (!loggedInUser || !loggedInUser.data || content.length === 0) return;
    const response = await sendMessage({
      channelId,
      content,
      senderId: loggedInUser.data.id,
      files,
    }).unwrap();
    if (response.data) {
      setContent("");
      setAttachments({});
      document
        .getElementById("message-bottom")
        ?.scrollIntoView({ behavior: "smooth" });
      dispatch(SEND_MESSAGE({ ...response.data, channelId }));
    }
  };

  const handleFocus = () => {
    if (!loggedInUser || !loggedInUser.data) return;
    dispatch(
      USER_TYPING({
        typing: true,
        fullName: loggedInUser?.data?.fullName,
        channelId: channelId.toString(),
      })
    );
  };

  const handleBlur = () => {
    if (!loggedInUser || !loggedInUser.data) return;
    dispatch(
      USER_TYPING({
        typing: false,
        fullName: loggedInUser?.data.fullName,
        channelId: channelId.toString(),
      })
    );
  };

  const handleEmojiClick = (emoji: EmojiMartPickerOnClick) => {
    setContent(content + emoji.native);
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handleFileChange = ({
    target: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!files || !fileInputRef.current) return;
    let attachmentState = attachments;
    Array.from(files).forEach((file) => {
      const fileExists = attachmentState[file.name];
      if (!fileExists) {
        attachmentState[file.name] = file;
      }
    });
    setAttachments(attachmentState);
    setFileState(new Date().toString());
  };

  return (
    <>
        {currentUsersTyping.length > 0 && (
        <div className="w-full flex items-center justify-start font-satoshi mt-2">
            <p className="pb-4 mx-2">{getUsersTyping(currentUsersTyping)}</p>
            <Typing />
        </div>
        )}

      <div className="w-full flex items-center justify-between">
        <Button variant="link" onClick={handleOpenFileDialog}>
          <Icon name="file-plus" className="text-primary" />
        </Button>
        <form onSubmit={handleSendMessage} className="w-full">
          <div className="w-full relative">
            {Object.values(attachments).length > 0 && (
              <div className="absolute bg-slate-600 w-full bottom-full h-40 rounded-sm flex items-center">
                {Object.values(attachments).map((file, index) => {
                  return (
                    <div key={index}>
                      <img src={URL.createObjectURL(file)} width={160} />
                      <span
                        onClick={() => {
                          const filteredAttachments: typeof attachments = {};
                          for (let key in attachments) {
                            if (key !== file.name) {
                              filteredAttachments[key] = attachments[key];
                            }
                          }
                          setAttachments(filteredAttachments);
                        }}
                      >
                        Delete
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        </form>
        <Popover>
          <PopoverTrigger>
            <Icon
              name="smile-plus"
              className="text-primary cursor-pointer ml-4"
            />
          </PopoverTrigger>
          <PopoverContent className="p-0 w-fit bg-transparent border-none">
            <Picker data={data} perLine={6} onEmojiSelect={handleEmojiClick} />
          </PopoverContent>
        </Popover>
        <Button type="submit" variant={"link"} className="text-primary my-auto">
          <Icon name="send-horizontal" />
        </Button>
      </div>
      <input
        type="file"
        multiple
        className="hidden"
        ref={fileInputRef}
        key={fileState}
        onChange={handleFileChange}
      />
    </>
  );
};

export default ChannelInput;
