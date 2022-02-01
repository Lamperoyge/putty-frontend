import { TailSpin } from "react-loader-spinner";

export const Spinner = ({ color }) => {
  return (
    <TailSpin
      radius={0}
      height={25}
      width={25}
      color={color || "black"}
      wrapperClass="spinner"
    />
  );
};
