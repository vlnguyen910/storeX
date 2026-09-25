declare module "react-native" {
  import type { ComponentType, ReactNode } from "react";

  interface NativeComponentProps {
    children?: ReactNode;
    className?: string;
    [key: string]: unknown;
  }

  export const Text: ComponentType<NativeComponentProps>;
  export const View: ComponentType<NativeComponentProps>;
}
