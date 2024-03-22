export default function Input(props) {
  return (
    <>
      {props.type === "text" ? (
        <div className="w-[248px] min-h-[60px] flex flex-col justify-center gap-2">
          <div className="font-semibold ps-1">{props.label || "Label"}</div>
          <input
            className="w-[248px] min-h-[44px] rounded-[8px] border-2 px-2 text-lg font-semibold border-lightPrimary outline-none"
            type={props.type || "text"}
            name={props.name || "name"}
            value={props.value}
            onChange={props.onChange}
            id={props.id || "id"}
            placeholder={props.placeholder || "Placeholder"}
          />
        </div>
      ) : props.type === "checkbox" ? (
        <div className="w-[248px] min-h-[30px] flex justify-start items-center gap-2">
          <input
            className="w-[20px] h-[20px] rounded-[4px] border-0 px-2 font-semibold border-primary outline-none check"
            type={props.type || "text"}
            name={props.name || "name"}
            id={props.id || "id"}
            placeholder={props.placeholder || "Placeholder"}
          />
          <div className="font-semibold ps-1">{props.label || "Label"}</div>
        </div>
      ) : props.type === "date" ? (
        <div className="w-[248px] min-h-[60px] flex flex-col justify-center gap-2">
          <div className="font-semibold ps-1">{props.label || "Label"}</div>
          <input
            className="w-[248px] min-h-[44px] rounded-[8px] border-2 px-2 text-lg font-semibold border-lightPrimary outline-none"
            type={props.type || "text"}
            name={props.name || "name"}
            id={props.id || "id"}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder || "Placeholder"}
          />
        </div>
      ) : null}
    </>
  );
}
