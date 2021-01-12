import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseUtils from "@fuse/utils";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import XLSX from "xlsx";

import RestaurantsTable from "./RestaurantsTable";
import { removeRestaurant, selectRestaurants } from "./store/restaurantsSlice";

function RestaurantsList(props) {
  const dispatch = useDispatch();
  const restaurants = useSelector(selectRestaurants);
  const searchText = useSelector(
    ({ restaurantsApp }) => restaurantsApp.restaurants.searchText
  );

  const [filteredData, setFilteredData] = useState(null);

  const columns = React.useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "name",
        className: "font-bold",
        sortable: true,
      },
      {
        Header: "NIT",
        accessor: "nit",
        className: "font-bold",
        sortable: true,
      },
      {
        Header: "Ciudad",
        accessor: "city",
        sortable: true,
      },
      {
        Header: "Regional",
        accessor: "regional",
        sortable: true,
      },
      {
        Header: "Nombre Usuario",
        accessor: "user",
        sortable: true,
      },
      {
        Header: "URL Menú",
        accessor: "url",
        sortable: true,
        Cell: ({ row }) => (
          <div className="flex items-center">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                const url =
                  row.original.url === "N/A"
                    ? row.original.imageUrl
                    : row.original.url;
                Object.assign(document.createElement("a"), {
                  target: "_blank",
                  href: url,
                }).click();
              }}
            >
              Ver URL
            </Button>
          </div>
        ),
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
                dispatch(removeRestaurant(row.original.id));
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
        return restaurants;
      }
      return FuseUtils.filterArrayByString(restaurants, _searchText);
    }

    if (restaurants) {
      setFilteredData(getFilteredArray(restaurants, searchText));
    }
  }, [restaurants, searchText]);

  if (!filteredData) {
    return null;
  }

  const exportToExcel = () => {
    const exportData = filteredData.map((data) => {
      return {
        Nombre: data.name,
        NIT: data.nit,
        Ciudad: data.city,
        Regional: data.regional,
        NombreUsuario: data.user,
        Url: data.url,
      };
    });
    const wb = XLSX.utils.book_new();
    const wsAll = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, wsAll, "Restaurantes");
    XLSX.writeFile(wb, "Resturantes-Menu.xlsx");
  };

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          No hay restaurantes creados
        </Typography>
      </div>
    );
  }

  return (
    <FuseAnimate animation="transition.slideUpIn" delay={300}>
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={exportToExcel}
          className="w-1/6 mb-10"
        >
          Exportar
        </Button>
        <RestaurantsTable columns={columns} data={filteredData} />
      </>
    </FuseAnimate>
  );
}

export default RestaurantsList;
