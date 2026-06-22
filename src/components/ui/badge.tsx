import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/utils/index";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Slot } from "@rn-primitives/slot";
import { cva, type VariantProps } from "class-variance-authority";
import React, { PropsWithChildren } from "react";
import {
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

const badgeVariants = cva(
  cn(
    "border-primary  group shrink-0 flex-row items-center justify-center gap-1 overflow-hidden rounded-full border px-4 py-1",
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-fit whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
    }),
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-primary border-transparent text-white",
          Platform.select({ web: "[a&]:hover:bg-primary/90" }),
        ),
        secondary: cn(
          "bg-secondary border-transparent",
          Platform.select({ web: "[a&]:hover:bg-secondary/90" }),
        ),
        destructive: cn(
          "bg-destructive border-transparent",
          Platform.select({ web: "[a&]:hover:bg-destructive/90" }),
        ),
        outline: Platform.select({
          web: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        }),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const badgeTextVariants = cva("text-xs font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-white",
      outline: "text-primary ",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BadgeProps = React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    asChild?: boolean;
  } & VariantProps<typeof badgeVariants> & {
    badgeButton?: boolean;
    badgeButtonProps?: TouchableOpacityProps;
    badgeButtonComponent?: React.ReactNode;
  } & PropsWithChildren;

function Badge({
  className,
  variant,
  asChild,
  badgeButton,
  badgeButtonProps,
  badgeButtonComponent,
  children,
  ...props
}: BadgeProps) {
  const Component = asChild ? Slot : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component
        className={cn(
          badgeVariants({ variant }),
          !badgeButton ? "pointer-events-none" : "",
          className,
        )}
        {...props}
      >
        <View className="flex flex-row gap-3 items-center ">
          {children}
          {badgeButton && (
            <TouchableOpacity
              {...badgeButtonProps}
              className={cn(
                "bg-white  rounded-full ",
                badgeButtonProps?.className,
              )}
            >
              {badgeButtonComponent ?? (
                <Ionicons name="close" size={15} color={"#F5004F"} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </Component>
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
