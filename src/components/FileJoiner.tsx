import { ChangeEvent, DragEvent, useState } from "react";
import ProgressBar from "./ProgressBar";
import { downloadBlob } from "../lib/Utilities";
import FileInput from "./FileInput";

export default function FileJoiner() {
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [mergeProgress, setMergeProgress] = useState<number>(32);

  const handleMergeFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMergeFiles(Array.from(e.target.files));
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData("text/plain"));
    if (draggedIndex !== index) {
      const updatedFiles = [...mergeFiles];
      const [movedFile] = updatedFiles.splice(draggedIndex, 1);
      updatedFiles.splice(index, 0, movedFile);
      setMergeFiles(updatedFiles);
    }
  };

  const mergeFilesHandler = () => {
    if (mergeFiles.length === 0) {
      alert("Please select files to merge.");
      return;
    }

    const fileBlobs = mergeFiles;
    let mergedBlob = new Blob([]);
    let currentFile = 0;

    const processNextFile = () => {
      if (currentFile < fileBlobs.length) {
        const reader = new FileReader();
        reader.onload = (e) => {
          mergedBlob = new Blob([mergedBlob, new Uint8Array(e.target?.result as ArrayBuffer)]);
          currentFile++;

          // Update progress
          const progressPercentage = Math.floor((currentFile / fileBlobs.length) * 100);
          setMergeProgress(progressPercentage);

          // Process the next file after a short delay
          setTimeout(processNextFile, 100);
        };
        reader.readAsArrayBuffer(fileBlobs[currentFile]);
      } else {
        setMergeProgress(100);
        downloadBlob(mergedBlob, `merged_${fileBlobs[0].name.replace(/\.part\d+$/, "")}`);
      }
    };

    processNextFile();
  };

  return (
    <div className="bg-emerald-300/20 rounded-lg p-5">
      <h2 className="text-center mb-6 font-medium text-2xl">File Joiner</h2>

      <FileInput onChangeHandler={handleMergeFileChange} multiple={true} />
      {/* <input type="file" multiple onChange={handleMergeFileChange} /> */}
      <div className="mt-10">
        {mergeFiles.map((file, index) => (
          <div
            className="px-3 py-1 cursor-move text-emerald-300 bg-slate-700 mb-2 rounded-lg"
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            {file.name}
          </div>
        ))}
      </div>

      <button
        className="font-medium bg-gr-emerald px-5 py-2 rounded-lg cursor-pointer text-slate-800"
        onClick={mergeFilesHandler}
      >
        Join files
      </button>

      <div className="mt-10">
        <ProgressBar progress={mergeProgress} />
      </div>
    </div>
  );
}
