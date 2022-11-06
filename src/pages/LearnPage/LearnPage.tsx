import styled from "@emotion/styled";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import _ from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CardType } from "../../api/cards-api";
import { PATHS } from "../../app/AppRoutes";
import { WrapContainer } from "../../components/WrapContainer";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { cardsActions, cardsThunks } from "../../store/cards-reducer";

const PackTitle = styled.h1`
  font-size: 22px;
  font-weight: var(--fw3);
  word-break: break-all;
  text-align: center;
  margin-bottom: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const QAContainer = styled.div`
  word-break: break-all;
  font-size: 16px;
`;

const QATitle = styled.span`
  font-weight: var(--fw3);
`;

const AttemptsContainer = styled.div`
  color: var(--text-color2);
`;

const AttemptsValue = styled.span`
  font-weight: var(--fw3);
`;

const LoaderWrapper = styled.div`
  text-align: center;
`;

const RateContainer = styled.div``;

const RateTitle = styled.span`
  font-size: 16px;
  font-weight: var(--fw1);
  display: block;
  margin-bottom: 5px;
`;

const getRandomCard = (cardItems: CardType[]) => {
  const mappedCardIndexToProbability = cardItems.reduce<number[]>(
    (a, c, i) => [...a, (6 - c.grade || 1) + (a[i - 1] || 0)],
    []
  );

  const random = _.random(1, mappedCardIndexToProbability.at(-1)!);

  const cardIndex = mappedCardIndexToProbability.findIndex((v) => v >= random);

  return cardItems[cardIndex];
};

const answerData = [
  { label: "Did not know", value: 1 },
  { label: "Forgot", value: 2 },
  { label: "A lot of thought", value: 3 },
  { label: "Сonfused", value: 4 },
  { label: "Knew the answer", value: 5 },
];

export const LearnPage = () => {
  const { packId } = useParams();
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.cards.current);
  const [randomCard, setRandomCard] = useState<null | CardType>(null);
  const [isShowAnswer, setIsShowAnswer] = useState(false);
  const [grade, setGrade] = useState(1);
  const isLoading = useAppSelector((state) => state.app.isLoading);

  useEffect(() => {
    return () => {
      dispatch(cardsActions.setCurrent(null));
      dispatch(cardsActions.clearFilters());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!packId) {
      return;
    }

    dispatch(cardsActions.setFilters({ pageCount: Infinity }));
    dispatch(cardsThunks.setCurrent(packId));
  }, [packId, dispatch]);

  useEffect(() => {
    if (!current || !current.items.length) {
      return;
    }

    setIsShowAnswer(false);
    setGrade(1);

    setRandomCard(getRandomCard(current.items));
  }, [current]);

  if (current && !current.items.length) {
    return <Navigate to={PATHS.packs} />;
  }

  if (!current || !randomCard) {
    return (
      <LoaderWrapper>
        <CircularProgress size={60} />
      </LoaderWrapper>
    );
  }

  const handleShowAnswer = () => {
    setIsShowAnswer(true);
  };

  const handleChangeAnswer = (e: ChangeEvent<HTMLInputElement>) => {
    setGrade(+e.currentTarget.value);
  };

  const handleNextClick = () => {
    dispatch(cardsThunks.updateCardGrade({ card_id: randomCard._id, grade }));
  };

  return (
    <>
      <PackTitle>Learn “{current.packName}”</PackTitle>
      <WrapContainer>
        <Wrapper>
          <TextContainer>
            <QAContainer>
              <QATitle>Question:</QATitle> {randomCard.question}
            </QAContainer>
            <AttemptsContainer>
              Количество попыток ответов на вопрос:{" "}
              <AttemptsValue>{randomCard.shots}</AttemptsValue>
            </AttemptsContainer>
          </TextContainer>
          {isShowAnswer && (
            <>
              <QAContainer>
                <QATitle>Answer:</QATitle> {randomCard.answer}
              </QAContainer>
              <RateContainer>
                <RateTitle>Rate yourself:</RateTitle>
                <RadioGroup value={grade} onChange={handleChangeAnswer}>
                  {answerData.map(({ label, value }) => (
                    <FormControlLabel
                      value={value}
                      control={<Radio />}
                      label={label}
                      disabled={isLoading}
                      key={value}
                    />
                  ))}
                </RadioGroup>
              </RateContainer>
            </>
          )}
          {isShowAnswer ? (
            <Button
              variant="contained"
              onClick={handleNextClick}
              disabled={isLoading}
            >
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={handleShowAnswer}>
              Show answer
            </Button>
          )}
        </Wrapper>
      </WrapContainer>
    </>
  );
};
