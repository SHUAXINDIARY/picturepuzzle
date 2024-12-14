import { ReactNode } from "react";

const Dropdown = (props: { dom: ReactNode; onDel?: () => void }) => {
  return (
    <details className="dropdown">
      <summary className="btn m-1 h-full">{props.dom}</summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li>
          <div className="btn btn-error" onClick={props.onDel}>
            删除
          </div>
        </li>
      </ul>
    </details>
  );
};

export default Dropdown;
