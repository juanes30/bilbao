import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseUtils from "@fuse/utils";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UsersTable from "./UsersTable";
import {
  openEditUserDialog,
  removeUser,
  selectUsers,
} from "./store/usersSlice";

function UsersList(props) {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const searchText = useSelector(({ usersApp }) => usersApp.users.searchText);

  const [filteredData, setFilteredData] = useState(null);

  const columns = React.useMemo(
    () => [
      {
        Header: "Nombres",
        accessor: "name",
        className: "font-bold",
        sortable: true,
      },
      {
        Header: "Apellidos",
        accessor: "lastName",
        className: "font-bold",
        sortable: true,
      },
      {
        Header: "Correo",
        accessor: "email",
        sortable: true,
      },
      {
        Header: "Telefono",
        accessor: "phone",
        sortable: true,
      },
      {
        id: "active",
        Header: "Activo",
        sortable: true,
        Cell: ({ row }) => (
          <div className="flex items-center">
            <Checkbox
              checked={row.original.active}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
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
                dispatch(removeUser(row.original.id));
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
        return users;
      }
      return FuseUtils.filterArrayByString(users, _searchText);
    }

    if (users) {
      setFilteredData(getFilteredArray(users, searchText));
    }
  }, [users, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          No hay usuarios creados
        </Typography>
      </div>
    );
  }

  return (
    <FuseAnimate animation="transition.slideUpIn" delay={300}>
      <UsersTable
        columns={columns}
        data={filteredData}
        onRowClick={(ev, row) => {
          if (row) {
            dispatch(openEditUserDialog(row.original));
          }
        }}
      />
    </FuseAnimate>
  );
}

export default UsersList;
