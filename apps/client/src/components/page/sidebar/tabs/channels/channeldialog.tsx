import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createChannelSchema } from "@/schema/channelSchema";
import { useCreateChannelMutation } from "@/store/slice/apiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, memo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ChannelDialog: FC<{
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}> = ({ open, handleOpenChange }) => {
  const [createChannel] = useCreateChannelMutation();
  const form = useForm<z.infer<typeof createChannelSchema>>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      topic: "",
      description: "",
    },
  });
  const fileRef = form.register("channelAvatar");

  const handleSubmit = async (
    { topic, description, channelAvatar }: z.infer<typeof createChannelSchema>
  ) => {
    
    const response = await createChannel({
      topic,
      channelAvatar,
      description,
      isGroup: true,
    }).unwrap();

    console.log(response);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-white mb-4 font-satoshi">Create a new channel</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="What's the topic about?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormControl>
                        <Input {...field} placeholder="Describe the channel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="channelAvatar"
                  render={() => (
                    <FormItem className="mb-4">
                      <FormControl>
                        <Input {...fileRef} type="file" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-2 text-center">
                  <Button type="submit">Register</Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ChannelDialog);
