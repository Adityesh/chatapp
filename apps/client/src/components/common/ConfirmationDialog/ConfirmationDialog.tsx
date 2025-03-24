import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  description: string;
  cancelText: string;
  actionText: string;
  cancelCallback: (() => void) | (() => Promise<void>);
  actionCallback: (() => void) | (() => Promise<void>);
};

export default function ConfirmationDialog({
  open,
  actionCallback,
  actionText,
  cancelCallback,
  cancelText,
  description,
  title,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelCallback}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={actionCallback}>
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
