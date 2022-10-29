export type Menu = {
  title: string;
  onOk: () => void;
  items: (Input | Checkbox | Select)[];
};

export type Input = {
  label: string;
  onChange: (value: Input["value"]) => void;
  type: "input";
  value: string | null | undefined;
};

export type Checkbox = {
  label: string;
  onChange: (checked: boolean) => void;
  type: "checkbox";
  checked: boolean;
};

export type Select = {
  label: string;
  onChange: (value: Option) => void;
  type: "select";
  options: Option[];
  value: Option["value"];
};

export type Option = {
  label: string;
  value: any;
};
