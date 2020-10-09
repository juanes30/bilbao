import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseUtils from "@fuse/utils";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UsersMultiSelectMenu from "./UsersMultiSelectMenu";
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
        Header: ({ selectedFlatRows }) => {
          const selectedRowIds = selectedFlatRows.map((row) => row.original.id);

          return (
            selectedFlatRows.length > 0 && (
              <UsersMultiSelectMenu selectedUserIds={selectedRowIds} />
            )
          );
        },
        accessor: "avatar",
        Cell: ({ row }) => {
          return (
            <Avatar
              className="mx-8"
              alt={row.original.name}
              src={row.original.avatar}
            />
          );
        },
        className: "justify-center",
        width: 64,
        sortable: false,
      },
      {
        Header: "First Name",
        accessor: "name",
        className: "font-bold",
        sortable: true,
      },
      {
        Header: "Last Name",
        accessor: "lastName",
        className: "font-bold",
        sortable: true,
      },
      {
        Header: "Company",
        accessor: "company",
        sortable: true,
      },
      {
        Header: "Job Title",
        accessor: "jobTitle",
        sortable: true,
      },
      {
        Header: "Email",
        accessor: "email",
        sortable: true,
      },
      {
        Header: "Phone",
        accessor: "phone",
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
