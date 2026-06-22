import { cn } from "@/utils";
import { ReactNode } from "react";
import {
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface IButtonProps {
  text?: string;
  textProps?: TextProps;
  buttonProps?: TouchableOpacityProps;
  children?: ReactNode;
  varient?: "primary" | "outline" | "ghost";
}

export function Button({
  textProps,
  text,
  buttonProps,
  children,
  varient = "primary",
}: IButtonProps) {
  return (
    <TouchableOpacity
      {...buttonProps}
      className={cn(
        `px-7 rounded-xl mt-3 min-h-[4rem] flex items-center flex-row justify-center ${varient === "primary" ? "bg-primary" : varient === "outline" ? "bg-transparent border border-primary" : "bg-transparent"} `,
        buttonProps?.className,
      )}
    >
      {children ? (
        children
      ) : (
        <Text
          {...textProps}
          className={`text-lg text-center text-white ${textProps?.className}`}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}
