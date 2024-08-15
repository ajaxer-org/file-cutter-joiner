// src/FileSplitter.tsx
import React, { useState, ChangeEvent, DragEvent, useCallback } from "react";
import ProgressBar from "./components/ProgressBar";
import FileInput from "./components/FileInput";

function FileSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [chunkSizeMB, setChunkSizeMB] = useState<number>(5);
  const [progress, setProgress] = useState<number>(44);
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [mergeProgress, setMergeProgress] = useState<number>(0);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleChunkSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChunkSizeMB(Number(e.target.value));
  };

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

  const splitFile = () => {
    if (!file || chunkSizeMB <= 0) {
      alert("Please select a valid file and specify the chunk size.");
      return;
    }

    const chunkSize = chunkSizeMB * 1024 * 1024; // Convert MB to bytes
    const fileSize = file.size;

    if (chunkSize > fileSize) {
      alert("Chunk size cannot be greater than the file size.");
      return;
    }

    const totalChunks = Math.ceil(fileSize / chunkSize); // Total number of chunks
    let start = 0;
    let currentChunk = 0;

    const processNextChunk = () => {
      if (start < fileSize) {
        const end = Math.min(start + chunkSize, fileSize);
        const blob = file.slice(start, end);
        const chunkFileName = `${file.name}.part${currentChunk + 1}`;
        downloadBlob(blob, chunkFileName);
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

  const downloadBlob = (blob: Blob, fileName: string) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
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
    <div>
      <section>
        <main className="grid">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/10 p-2 mb-5">
            <div>
              <input type="radio" name="option" id="cutter" value="c" className="peer hidden" checked />
              <label
                htmlFor="cutter"
                className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-gr-emerald bg-black/50"
              >
                Cutter
              </label>
            </div>

            <div>
              <input type="radio" name="option" id="joiner" value="j" className="peer hidden" />
              <label
                htmlFor="joiner"
                className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-gr-emerald bg-black/50"
              >
                Joiner
              </label>
            </div>
          </div>
        </main>
      </section>

      <div className="bg-emerald-300/20 rounded-lg p-5">
        <h2>File Cutter</h2>

        <FileInput onChangeHandler={handleFileChange} />

        <div className="mb-10">
          <p>Part Size</p>
          <div className="">
            <input
              className="bg-slate-800 border-b border-emerald-300 text-emerald-300 w-full px-3 py-1 rounded-lg focus:border-emerald-200"
              type="number"
              value={chunkSizeMB}
              onChange={handleChunkSizeChange}
              min="1"
            />
          </div>
        </div>

        <button className="font-medium w-full bg-gr-emerald px-5 py-2 rounded-lg cursor-pointer" onClick={splitFile}>
          File Cutter
        </button>

        <div className="mt-10">
          <ProgressBar progress={progress} />
        </div>
      </div>

      <div className="bg-emerald-300/20 rounded-lg p-5">
        <h2>File Joiner</h2>
        <input type="file" multiple onChange={handleMergeFileChange} />
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
          className="font-medium w-full bg-gr-emerald px-5 py-2 rounded-lg cursor-pointer"
          onClick={mergeFilesHandler}
        >
          Merge Files
        </button>

        <div className="mt-10">
          <ProgressBar progress={progress} />
        </div>
      </div>
    </div>
  );
}

export default FileSplitter;
