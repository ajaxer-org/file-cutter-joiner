import { useState } from "react";
import FileCutter from "./components/FileCutter";
import FileJoiner from "./components/FileJoiner";
import RadioGroup from "./components/RadioGroup";

export default function App() {
  const [selectedOption, setSelectedOption] = useState("c");

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <>
      <div className="bg-slate-950 text-emerald-400">
        <div className="bg-emerald-300/10">
          <h1 className="px-10 text-center border-b border-emerald-500 py-5 text-5xl font-medium bg-gradient-to-br from-emerald-200 via-emerald-500 to-emerald-950 bg-clip-text text-transparent mb-5">
            File Cutter Joiner
          </h1>
        </div>
        <div className="min-h-screen max-w-screen-md mx-auto">
          <div className="p-10">
            <div>
              <RadioGroup selectedOption={selectedOption} onChange={handleOptionChange} />

              {selectedOption === "c" && <FileCutter />}
              {selectedOption === "j" && <FileJoiner />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
