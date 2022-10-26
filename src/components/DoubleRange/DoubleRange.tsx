import styled from "@emotion/styled";
import { Slider } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { DobleRangeInput } from "./DobleRangeInput";

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 20px;
`;

const getMin = (value: undefined | number) => {
  return value || 0;
};

const getMax = (value: undefined | number, min: number) => {
  const max = value || 0;

  return max < min ? min : max;
};

const getValue = (
  value: [undefined | number, undefined | number],
  min: number,
  max: number
) => {
  let v1 = value[0] === undefined ? min : value[0];
  let v2 = value[1] === undefined ? max : value[1];

  v1 = v1 < min ? min : v1 > max ? max : v1;
  v2 = v2 < min ? min : v2 > max ? max : v2;

  return [v1, v2];
};

export const DoubleRange = (props: PropsType) => {
  const [min, setMin] = useState(() => getMin(props.min));
  const [max, setMax] = useState(() => getMax(props.max, min));
  const [value, setValue] = useState(() => getValue(props.value, min, max));

  useEffect(() => {
    setMin(getMin(props.min));
  }, [props.min]);

  useEffect(() => {
    setMax(getMax(props.max, min));
  }, [props.max, min]);

  useEffect(() => {
    setValue(getValue(props.value, min, max));
  }, [props.value, min, max]);

  const handleSliderChangeCommitted = (
    event: Event | SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => {
    props.onChange(value as [number, number]);
  };

  const handleSliderChange = (event: Event, value: number | number[]) => {
    setValue(getValue(value as [number, number], min, max));
  };

  const disabled = props.disabled || min === max;
  const viewMax = min === max ? max + 1 : max;
  const viewValue = min === max ? [min, viewMax] : value;

  return (
    <Wrapper>
      <DobleRangeInput disabled={disabled} value={value[0]} />
      <Slider
        sx={{ width: 160 }}
        value={viewValue}
        disabled={disabled}
        min={min}
        max={viewMax}
        onChangeCommitted={handleSliderChangeCommitted}
        onChange={handleSliderChange}
      />
      <DobleRangeInput disabled={disabled} value={value[1]} />
    </Wrapper>
  );
};

type PropsType = {
  disabled?: boolean;
  min: undefined | number;
  max: undefined | number;
  value: [undefined | number, undefined | number];
  onChange: (value: [number, number]) => void;
};
