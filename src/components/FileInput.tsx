import { ChangeEvent } from "react";

type FileInputProps = {
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
};

export default function FileInput({ onChangeHandler, multiple = false }: FileInputProps) {
  const msg = multiple ? "Please select all parts to join" : "Please select a file to cut";

  return (
    <div className="flex0 mb-10">
      <p>{msg}</p>
      <div className="relative w-full">
        <input
          className="block p-2 w-full overflow-hidden rounded-md outline-none
                text-white bg-slate-800 border-emerald-600 border-b
                focus:border-emerald-500 focus:ring-4 focus:ring-emerald-700"
          id="file"
          type="file"
          onChange={onChangeHandler}
          multiple={multiple}
        />
      </div>
    </div>
  );
}
