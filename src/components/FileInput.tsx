import { ChangeEvent } from "react";

type FileInputProps = {
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function FileInput({ onChangeHandler }: FileInputProps) {
  return (
    <div className="flex mb-10">
      <div className="relative w-full">
        <input
          className="block p-2 w-full overflow-hidden rounded-md border 
                border-gray-300 bg-gray-50 text-gray-900 
                focus:border-emerald-500 focus:ring-4 focus:ring-emerald-300 
                dark:border-emerald-600 dark:bg-slate-800 dark:text-white dark:placeholder-emerald-400
                   dark:focus:border-emerald-500  dark:focus:ring-slate-700 text-sm"
          id="file"
          type="file"
          onChange={onChangeHandler}
        />
      </div>
    </div>
  );
}
