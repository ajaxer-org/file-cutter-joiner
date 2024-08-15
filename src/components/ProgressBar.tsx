type ProgressBarProps = {
  progress: number;
};

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-100 bg-black/60 p-1 rounded-full">
      <div
        className="bg-gr-emerald text-slate-900 text-center text-sm font-bold rounded-full"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
}
