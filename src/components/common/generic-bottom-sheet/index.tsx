import { BottomSheet, Column } from "@expo/ui";
import { PropsWithChildren } from "react";

interface IBottomSheetProps {
  isPresented: boolean;
  onDismiss(): void;
}

export function GenericBottomSheet({
  isPresented,
  onDismiss,
  children,
}: IBottomSheetProps & PropsWithChildren) {
  return (
    <BottomSheet
      // snapPoints={["full", "half"]}
      isPresented={isPresented}
      onDismiss={onDismiss}
    >
      <Column spacing={12}>{children}</Column>
    </BottomSheet>
  );
}
