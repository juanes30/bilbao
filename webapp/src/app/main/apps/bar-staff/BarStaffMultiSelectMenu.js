import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeBarStaff } from "./store/barStaffSlice";

function BarStaffMultiSelectMenu(props) {
  const dispatch = useDispatch();
  const { selectedBarStaffIds } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  function openSelectedBarStaffMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function closeSelectedBarStaffMenu() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        className="p-0"
        aria-owns={anchorEl ? "selectedBarStaffMenu" : null}
        aria-haspopup="true"
        onClick={openSelectedBarStaffMenu}
      >
        <Icon>more_horiz</Icon>
      </IconButton>
      <Menu
        id="selectedBarStaffMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeSelectedBarStaffMenu}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              dispatch(removeBarStaff(selectedBarStaffIds));
              closeSelectedBarStaffMenu();
            }}
          >
            <ListItemIcon className="min-w-40">
              <Icon>delete</Icon>
            </ListItemIcon>
            <ListItemText primary="Remove" />
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}

export default BarStaffMultiSelectMenu;
