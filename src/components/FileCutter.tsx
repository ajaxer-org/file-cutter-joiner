import { ChangeEvent, useState } from "react";
import FileInput from "./FileInput";
import ProgressBar from "./ProgressBar";
import { downloadBlob } from "../lib/Utilities";
import { useLocalStorage } from "simple-react-hooks-utility";

export default function FileCutter() {
  const [progress, setProgress] = useState<number>(44);
  const [chunkSizeMB, setChunkSizeMB] = useLocalStorage<number>("chunkSize", 0);
  const [file, setFile] = useState<File | null>(null);

  const handleChunkSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChunkSizeMB(Number(e.target.value));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const fileCutter = () => {
    if (!file) {
      alert("Please select a valid file");
      return;
    }

    if (chunkSizeMB <= 0) {
      alert("Please specify the chunk size in MB");
      return;
    }

    const chunkSize = chunkSizeMB * 1024 * 1024; // Convert MB to bytes
    const fileSize = file.size;

    if (chunkSize > fileSize) {
      alert("Chunk size cannot be greater than the file size.");
      return;
    }

    const totalChunks = Math.ceil(fileSize / chunkSize); // Total number of chunks
    console.log("Total chunks: " + totalChunks);

    //Math.floor() This method will round down to the nearest integer.
    const partSize = Math.floor(fileSize / totalChunks);
    console.log("partSize: ", partSize);

    let start = 0;
    let currentChunk = 0;

    const processNextChunk = () => {
      if (start < fileSize) {
        const end = Math.min(start + chunkSize, fileSize);
        const blob = file.slice(start, end);
        const chunkFileName = `${file.name}.part${currentChunk + 1}`;
        //downloadBlob(blob, chunkFileName);
        start = end;
        currentChunk++;

        // Update progress
        const progressPercentage = Math.floor((currentChunk / totalChunks) * 100);
        setProgress(progressPercentage);

        // Process the next chunk after a short delay
        setTimeout(processNextChunk, 100);
      } else {
        setProgress(100);
      }
    };

    processNextChunk();
  };

  return (
    <div className="bg-emerald-300/20 rounded-lg p-5">
      <h2 className="text-center mb-6 font-medium text-2xl">File Cutter</h2>

      <FileInput onChangeHandler={handleFileChange} />

      <div className="mb-10">
        <p>Part Size in (MB)</p>
        <div className="">
          <input
            className="block p-2 w-full overflow-hidden rounded-md outline-none
                text-white bg-slate-800 border-emerald-600 border-b
                focus:border-emerald-500 focus:ring-4 focus:ring-emerald-700"
            type="number"
            value={chunkSizeMB}
            onChange={handleChunkSizeChange}
            min="1"
          />
        </div>
      </div>

      <button
        className="font-medium bg-gr-emerald px-5 py-2 rounded-lg cursor-pointer text-slate-800"
        onClick={fileCutter}
      >
        File Cutter
      </button>

      <div className="mt-10">
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
}
