"use client";
import { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type Props = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  width: string;
  title: string;
  description?: string;
  showClose?: boolean;
  children?: React.ReactNode;
};
const QuickDialog = ({
  show,
  setShow,
  width,
  title,
  description,
  children,
  showClose = true,
}: Props) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      setShow(false);
    }
  };
  return (
    <Dialog open={show}>
      <DialogContent
        className={`sm:max-w-[${width}]`}
        onKeyDown={handleKeyPress}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {showClose && (
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShow(false)}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickDialog;
