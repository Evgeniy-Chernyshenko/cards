import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  FiltersType,
  initialFilters,
  packsActions,
  packsThunks,
} from "../../store/packs-reducer";
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

  useEffect(() => {
    return () => {
      dispatch(packsActions.setCurrent(null));
      dispatch(packsActions.clearFilters());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isInit) {
      return;
    }

    const packName = searchParams.get("packName");
    const min = parseInt(String(searchParams.get("min")));
    const max = parseInt(String(searchParams.get("max")));
    const sortPacks = searchParams.get("sortPacks");
    const page = parseInt(String(searchParams.get("page")));
    const pageCount = parseInt(String(searchParams.get("pageCount")));
    const showMyPacks = searchParams.get("showMyPacks");

    dispatch(
      packsActions.setFilters({
        ...(packName && { packName }),
        ...(!isNaN(min) && { min }),
        ...(!isNaN(max) && { max }),
        ...(sortPacks && { sortPacks }),
        ...(!isNaN(page) && { page }),
        ...(!isNaN(pageCount) && { pageCount }),
        ...(showMyPacks &&
          ["true", "false"].includes(showMyPacks) && {
            showMyPacks: JSON.parse(showMyPacks) as boolean,
          }),
      })
    );

    setIsInit(true);
  }, [isInit, searchParams, dispatch]);

  useEffect(() => {
    isInit && dispatch(packsThunks.setCurrent());
  }, [isInit, filters, dispatch]);

  useEffect(() => {
    if (!isInit) {
      return;
    }

    const differenceFilters: any = {};
    for (const prop in filters) {
      if (
        filters[prop as keyof FiltersType] !==
        initialFilters[prop as keyof FiltersType]
      ) {
        differenceFilters[prop] = filters[prop as keyof FiltersType];
      }
    }

    setSearchParams(new URLSearchParams(differenceFilters), { replace: true });
  }, [isInit, filters, setSearchParams]);

  const handleAddNewPack = async () => {
    (await dispatch(
      packsThunks.createPack({ name: `New pack ${Date.now()}` })
    )) && dispatch(packsThunks.setCurrent());
  };

  return (
    <>
      <HeaderContainer>
        <h1>Packs list</h1>
        <Button
          variant="contained"
          disabled={isLoading}
          onClick={handleAddNewPack}
        >
          Add new pack
        </Button>
      </HeaderContainer>
      <PacksFiltersContainer>
        <PacksFilters />
      </PacksFiltersContainer>
      <PacksTable />
    </>
  );
};
