import Select from "react-select";
export default function CustumSelect( props ) {
  return (
    <>
      <div className="w-[248px] min-h-[60px] flex flex-col justify-center gap-2">
        <div className="font-semibold ps-1">{props.label || "Label"}</div>
        <select
          onChange={props.onChange}
          value={props.value}
          className="w-[248px] min-h-[44px] rounded-[8px] border text-lg font-semibold border-lightPrimary outline-none px-2 bg-transparent"
          name={props.name || "name"}
          id={props.id || "id"}
          placeholder={props.placeholder || "Placeholder"}
        >
          {props.children}
        </select>
      </div>
    </>
  );
}
