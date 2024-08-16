import { ChangeEvent } from "react";

export type InputProps = {
  onChangeFileInputHandler: (e: ChangeEvent<HTMLInputElement>) => void;
};
