type RadioGroupProps = {
  selectedOption: string;
  onChange: (value: string) => void;
};

export default function RadioGroup({ selectedOption, onChange }: RadioGroupProps) {
  const classes =
    "block cursor-pointer select-none rounded-lg p-2 text-center peer-checked:text-white peer-checked:bg-gr-emerald bg-black/50";

  return (
    <div className="grid">
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-emerald-300/20 p-2 mb-5">
        <div>
          <input
            type="radio"
            name="option"
            id="cutter"
            value="c"
            className="peer hidden"
            checked={selectedOption === "c"}
            onChange={(e) => onChange(e.target.value)}
          />
          <label htmlFor="cutter" className={classes}>
            Cutter
          </label>
        </div>

        <div>
          <input
            type="radio"
            name="option"
            id="joiner"
            value="j"
            className="peer hidden"
            checked={selectedOption === "j"}
            onChange={(e) => onChange(e.target.value)}
          />
          <label htmlFor="joiner" className={classes}>
            Joiner
          </label>
        </div>
      </div>
    </div>
  );
}
