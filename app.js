document.getElementById("fileInput").addEventListener("change", displayFileSize);

function displayFileSize() {
  const fileInput = document.getElementById("fileInput").files[0];
  const fileSizeElement = document.getElementById("fileSize");

  if (fileInput) {
    const size = fileInput.size;
    const formattedSize = formatFileSize(size);
    fileSizeElement.textContent = `File size: ${formattedSize}`;
  }
}

function formatFileSize(size) {
  const units = ["Bytes", "KB", "MB", "GB"];
  let unitIndex = 0;
  let formattedSize = size;

  while (formattedSize >= 1024 && unitIndex < units.length - 1) {
    formattedSize /= 1024;
    unitIndex++;
  }

  return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
}

function updateProgressBar(progressElement, percentage) {
  progressElement.style.width = percentage + "%";
  progressElement.textContent = percentage + "%";
}

function splitFile() {
  const fileInput = document.getElementById("fileInput").files[0];
  const chunkSizeMB = parseInt(document.getElementById("chunkSize").value);
  const chunkSize = chunkSizeMB * 1024 * 1024; // Convert MB to bytes
  const progressElement = document.getElementById("progress");

  if (fileInput && chunkSize > 0) {
    const fileSize = fileInput.size;

    if (chunkSize > fileSize) {
      alert("Chunk size cannot be greater than the file size.");
      return;
    }

    const totalChunks = Math.ceil(fileSize / chunkSize); // Total number of chunks
    let start = 0;
    let currentChunk = 0;

    function processNextChunk() {
      if (start < fileSize) {
        // Calculate end position of the current chunk
        const end = Math.min(start + chunkSize, fileSize);
        const blob = fileInput.slice(start, end);
        const chunkFileName = `${fileInput.name}.part${currentChunk + 1}`;
        downloadBlob(blob, chunkFileName);
        start = end;
        currentChunk++;

        // Update progress
        const progressPercentage = Math.floor((currentChunk / totalChunks) * 100);
        updateProgressBar(progressElement, progressPercentage);

        // Process the next chunk after a short delay
        setTimeout(processNextChunk, 100);
      } else {
        updateProgressBar(progressElement, 100);
      }
    }

    processNextChunk();
  } else {
    alert("Please select a valid file and specify the chunk size in MB.");
  }
}

function downloadBlob(blob, fileName) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

function mergeFiles() {
  const mergeInput = document.getElementById("mergeInput").files;
  const progressElement = document.getElementById("mergeProgress");

  if (mergeInput.length > 0) {
    const fileBlobs = Array.from(mergeInput).sort((a, b) => a.name.localeCompare(b.name));
    let mergedBlob = new Blob();
    let currentFile = 0;

    function processNextFile() {
      if (currentFile < fileBlobs.length) {
        mergedBlob = new Blob([mergedBlob, fileBlobs[currentFile]], { type: fileBlobs[0].type });
        currentFile++;

        // Update progress
        const progressPercentage = Math.floor((currentFile / fileBlobs.length) * 100);
        updateProgressBar(progressElement, progressPercentage);

        // Process the next file after a short delay
        setTimeout(processNextFile, 100);
      } else {
        updateProgressBar(progressElement, 100);
        downloadBlob(mergedBlob, "merged_" + fileBlobs[0].name.replace(/\.part\d+$/, ""));
      }
    }

    processNextFile();
  } else {
    alert("Please select files to merge.");
  }
}
