import styled from "@emotion/styled";
import { FilterAltOff, Search } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { DoubleRange } from "../../components/DoubleRange/DoubleRange";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useDebounce } from "../../hooks/useDebounce";
import { packsActions } from "../../store/packs-reducer";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 40px;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  &:first-of-type {
    flex-grow: 1;
  }
`;

const FilterLabel = styled.span``;

const FilterItem = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PacksFilters = () => {
  const isLoading = useAppSelector((state) => state.app.isLoading);
  const filters = useAppSelector((state) => state.packs.filters);
  const dispatch = useAppDispatch();
  const debouncedDispatch = useDebounce(dispatch, 700);
  const [isPackNameFocused, setIsPackNameFocused] = useState(false);
  const [packName, setPackName] = useState(filters.packName);
  const minCardsCount = useAppSelector(
    (store) => store.packs.current?.minCardsCount
  );
  const maxCardsCount = useAppSelector(
    (store) => store.packs.current?.maxCardsCount
  );

  useEffect(() => {
    setPackName(filters.packName);
  }, [filters.packName]);

  const handlePackNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const packName = e.currentTarget.value;

    setPackName(packName);

    debouncedDispatch(packsActions.setFilters({ packName }));
  };

  const handlePackNameFocus = () => {
    setIsPackNameFocused(true);
  };

  const handlePackNameBlur = () => {
    setIsPackNameFocused(false);
  };

  const handleClickMy = () => {
    dispatch(packsActions.setFilters({ showMyPacks: true }));
  };

  const handleClickAll = () => {
    dispatch(packsActions.setFilters({ showMyPacks: false }));
  };

  const handleClearFilters = () => {
    dispatch(packsActions.clearFilters());
  };

  const handleDoubleRangeChange = (value: [number, number]) => {
    dispatch(packsActions.setFilters({ min: value[0], max: value[1] }));
  };

  return (
    <Wrapper>
      <FilterContainer>
        <FilterLabel>Search</FilterLabel>
        <FilterItem>
          <TextField
            placeholder="Provide your text"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              style: { fontSize: 14 },
              type: "search",
            }}
            variant="outlined"
            size="small"
            fullWidth
            disabled={isLoading && !isPackNameFocused}
            onChange={handlePackNameChange}
            onFocus={handlePackNameFocus}
            onBlur={handlePackNameBlur}
            value={packName}
          />
        </FilterItem>
      </FilterContainer>
      <FilterContainer>
        <FilterLabel>Show packs cards</FilterLabel>
        <FilterItem>
          <ButtonGroup disabled={isLoading}>
            <Button
              variant={filters.showMyPacks ? "contained" : "outlined"}
              onClick={handleClickMy}
            >
              My
            </Button>
            <Button
              variant={filters.showMyPacks ? "outlined" : "contained"}
              onClick={handleClickAll}
            >
              All
            </Button>
          </ButtonGroup>
        </FilterItem>
      </FilterContainer>
      <FilterContainer>
        <FilterLabel>Number of cards</FilterLabel>
        <FilterItem>
          <DoubleRange
            disabled={isLoading}
            min={minCardsCount}
            max={maxCardsCount}
            value={[filters.min, filters.max]}
            onChange={handleDoubleRangeChange}
          />
        </FilterItem>
      </FilterContainer>
      <FilterContainer>
        <FilterItem>
          <IconButton
            sx={{ alignSelf: "flex-end" }}
            disabled={isLoading}
            onClick={handleClearFilters}
          >
            <FilterAltOff />
          </IconButton>
        </FilterItem>
      </FilterContainer>
    </Wrapper>
  );
};
