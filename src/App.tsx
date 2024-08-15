import FileSplitter from "./FileSplitter";

export default function App() {
  return (
    <>
      <div className="container-lg bg-slate-950 text-zinc-100 text-lg min-h-screen">
        <div className="bg-emerald-300/10">
          <h1 className="px-10 text-center border-b border-emerald-500 py-5 text-5xl font-medium bg-gradient-to-br from-emerald-200 via-emerald-500 to-emerald-950 bg-clip-text text-transparent mb-5">
            File Cutter Joiner
          </h1>
        </div>

        <div className="p-10">
          <FileSplitter />
        </div>
      </div>
    </>
  );
}
