import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseUtils from "@fuse/utils";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CitiesTable from "./CitiesTable";
import {
  openEditCityDialog,
  removeCity,
  selectCities,
} from "./store/citiesSlice";

function CitiesList(props) {
  const dispatch = useDispatch();
  const cities = useSelector(selectCities);
  const searchText = useSelector(
    ({ citiesApp }) => citiesApp.cities.searchText
  );

  const [filteredData, setFilteredData] = useState(null);

  const columns = React.useMemo(
    () => [
      {
        Header: "Código",
        accessor: "code",
        className: "font-bold",
        sortable: true,
      },
      {
        Header: "Nombre Ciudad",
        accessor: "name",
        className: "font-bold",
        sortable: true,
      },
      {
        Header: "Departamento",
        accessor: "department",
        sortable: true,
      },
      {
        id: "action",
        width: 128,
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                dispatch(removeCity(row.original.id));
              }}
            >
              <Icon>delete</Icon>
            </IconButton>
          </div>
        ),
      },
    ],
    [dispatch]
  );

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return cities;
      }
      return FuseUtils.filterArrayByString(cities, _searchText);
    }

    if (cities) {
      setFilteredData(getFilteredArray(cities, searchText));
    }
  }, [cities, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          No hay ciudades creadas
        </Typography>
      </div>
    );
  }

  return (
    <FuseAnimate animation="transition.slideUpIn" delay={300}>
      <CitiesTable
        columns={columns}
        data={filteredData}
        onRowClick={(ev, row) => {
          if (row) {
            dispatch(openEditCityDialog(row.original));
          }
        }}
      />
    </FuseAnimate>
  );
}

export default CitiesList;
