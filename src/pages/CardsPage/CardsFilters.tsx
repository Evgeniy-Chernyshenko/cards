import styled from "@emotion/styled";
import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useDebounce } from "../../hooks/useDebounce";
import { cardsActions } from "../../store/cards-reducer";

export const Wrapper = styled.div`
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FilterLabel = styled.span``;

export const CardsFilters = () => {
  const isLoading = useAppSelector((state) => state.app.isLoading);
  const filters = useAppSelector((state) => state.cards.filters);
  const dispatch = useAppDispatch();
  const debouncedDispatch = useDebounce(dispatch, 700);
  const [isQuestionFocused, setIsQuestionFocused] = useState(false);
  const [cardQuestion, setCardQuestion] = useState(filters.cardQuestion);

  useEffect(() => {
    setCardQuestion(filters.cardQuestion);
  }, [filters.cardQuestion]);

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cardQuestion = e.currentTarget.value;

    setCardQuestion(cardQuestion);

    debouncedDispatch(cardsActions.setFilters({ cardQuestion }));
  };

  const handleQuestionFocus = () => {
    setIsQuestionFocused(true);
  };

  const handleQuestionBlur = () => {
    setIsQuestionFocused(false);
  };

  return (
    <Wrapper>
      <FilterLabel>Search</FilterLabel>
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
        disabled={isLoading && !isQuestionFocused}
        onChange={handleQuestionChange}
        onFocus={handleQuestionFocus}
        onBlur={handleQuestionBlur}
        value={cardQuestion}
      />
    </Wrapper>
  );
};
