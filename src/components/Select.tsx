export interface SelectProps {
  onSetRow?: (val?: number) => void;
}
const Select = (props: SelectProps) => {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">选择照片行数</span>
      </div>
      <select
        defaultValue={4}
        className="select select-bordered w-full max-w-xs"
        onChange={(e) => {
          props.onSetRow?.(Number(e.target.value));
        }}
      >
        {new Array(6).fill(1).map((item, i) => {
          return <option key={item + i}>{i + 1}</option>;
        })}
      </select>
    </label>
  );
};

export default Select;
