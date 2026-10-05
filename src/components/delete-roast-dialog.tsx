"use client";

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

import { Eyebrow } from "@/components/ui/eyebrow";

import { useRoastFlow } from "@/contexts/roast-flow-context";

export function DeleteRoastDialog() {
  const { deleteOpen, setDeleteOpen, remove } = useRoastFlow();

  return (
    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <Eyebrow variant="primary">Delete roast</Eyebrow>
          <AlertDialogTitle>This cannot be undone</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting removes your roast, the stats we fetched and your share
            link from our servers. Anyone who already opened the link will see
            nothing. You can always generate a new roast afterwards.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction
            size="md"
            onClick={remove}
            data-testid="confirm-delete-button"
          >
            Delete permanently
          </AlertDialogAction>
          <AlertDialogCancel size="md">Keep it</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
