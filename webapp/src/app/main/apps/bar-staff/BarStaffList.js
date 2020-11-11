import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseUtils from "@fuse/utils";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import XLSX from "xlsx";

import BarStaffTable from "./BarStaffTable";
import { removeBarStaff, selectBarStaff } from "./store/barStaffSlice";

function BarStaffList(props) {
  const dispatch = useDispatch();
  const barStaff = useSelector(selectBarStaff);
  const searchText = useSelector(
    ({ barStaffApp }) => barStaffApp.barStaff.searchText
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
        Header: "Apellido",
        accessor: "lastName",
        sortable: true,
      },
      {
        Header: "Correo",
        accessor: "email",
        sortable: true,
      },
      {
        Header: "Teléfono",
        accessor: "cellphone",
        sortable: true,
      },
      {
        Header: "Establecimiento",
        accessor: "establishment",
        sortable: true,
      },
      {
        Header: "Cargo",
        accessor: "position",
        sortable: true,
      },
      {
        Header: "Regional",
        accessor: "regional",
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
                dispatch(removeBarStaff(row.original.id));
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
        return barStaff;
      }
      return FuseUtils.filterArrayByString(barStaff, _searchText);
    }

    if (barStaff) {
      setFilteredData(getFilteredArray(barStaff, searchText));
    }
  }, [barStaff, searchText]);

  if (!filteredData) {
    return null;
  }

  const exportToExcel = () => {
    const exportData = filteredData.map((data) => {
      return {
        Nombres: data.name,
        Apellidos: data.lastName,
        Correo: data.email,
        Teléfono: data.cellphone,
        Establecimiento: data.establishment,
        Cargo: data.position,
        Regional: data.regional,
      };
    });
    const wb = XLSX.utils.book_new();
    const wsAll = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, wsAll, "Mesa y Bar");
    XLSX.writeFile(wb, "Mesa y Bar-Menu.xlsx");
  };

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          No hay datos
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
        <BarStaffTable columns={columns} data={filteredData} />
      </>
    </FuseAnimate>
  );
}

export default BarStaffList;
