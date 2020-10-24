import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseUtils from "@fuse/utils";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
        Header: "URL Menú",
        accessor: "url",
        sortable: true,
        Cell: ({ row }) => (
          <div className="flex items-center">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                Object.assign(document.createElement("a"), {
                  target: "_blank",
                  href: row.original.url,
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
      <RestaurantsTable columns={columns} data={filteredData} />
    </FuseAnimate>
  );
}

export default RestaurantsList;
