import styled from "@emotion/styled";
import { Button } from "@mui/material";
import _ from "lodash";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AddPackModal, AddPackInputsType } from "./AddPackModal";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { packsActions, packsThunks } from "../../store/packs-reducer";
import { convertString } from "../../utils/convertString";
import { PacksFilters } from "./PacksFilters";
import { PacksTable } from "./PacksTable";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  gap: 30px;
`;

const PacksFiltersContainer = styled.div`
  margin-bottom: 25px;
`;

export const PacksPage = () => {
  const isLoading = useAppSelector((state) => state.app.isLoading);
  const filters = useAppSelector((state) => state.packs.filters);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInit, setIsInit] = useState(false);
  const setSearchParamsRef = useRef(setSearchParams);
  const [Modal, setModal] = useState<ReactNode>(null);

  useEffect(() => {
    return () => {
      dispatch(packsActions.setCurrent(null));
      dispatch(packsActions.clearFilters());
    };
  }, [dispatch]);

  useEffect(() => {
    isInit && dispatch(packsThunks.setCurrent());
  }, [filters, isInit, dispatch]);

  useEffect(() => {
    const searchParamsFilters = _.omitBy(
      {
        packName: searchParams.get("packName"),
        min: convertString<number>(searchParams.get("min")),
        max: convertString<number>(searchParams.get("max")),
        sortPacks: searchParams.get("sortPacks"),
        page: convertString<number>(searchParams.get("page")),
        pageCount: convertString<number>(searchParams.get("pageCount")),
        showMyPacks: convertString<boolean>(
          searchParams.get("showMyPacks") || localStorage.getItem("showMyPacks")
        ),
      },
      _.isNil
    );

    localStorage.setItem(
      "showMyPacks",
      String(!!searchParamsFilters.showMyPacks)
    );

    dispatch(packsActions.setFilters(searchParamsFilters));

    !isInit && setIsInit(true);
  }, [isInit, searchParams, dispatch]);

  useEffect(() => {
    isInit &&
      setSearchParamsRef.current(
        new URLSearchParams(filters as { [key: string]: string }),
        { replace: true }
      );
  }, [filters, isInit, setSearchParamsRef]);

  const handleClickAddNewPack = () => {
    setModal(
      <AddPackModal onClose={() => setModal(null)} onSave={handleAddNewPack} />
    );
  };

  const handleAddNewPack = async (values: AddPackInputsType) => {
    (await dispatch(packsThunks.createPack(values))) &&
      dispatch(packsThunks.setCurrent());
  };

  return (
    <>
      <HeaderContainer>
        <h1>Packs list</h1>
        <Button
          variant="contained"
          disabled={isLoading}
          onClick={handleClickAddNewPack}
        >
          Add new pack
        </Button>
      </HeaderContainer>
      <PacksFiltersContainer>
        <PacksFilters />
      </PacksFiltersContainer>
      <PacksTable />
      {Modal}
    </>
  );
};
