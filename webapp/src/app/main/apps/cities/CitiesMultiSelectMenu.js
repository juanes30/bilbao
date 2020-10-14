import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeCity } from "./store/citiesSlice";

function CitiesMultiSelectMenu(props) {
  const dispatch = useDispatch();
  const { selectedCityIds } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  function openSelectedCityMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function closeSelectedCitiesMenu() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        className="p-0"
        aria-owns={anchorEl ? "selectedCitiesMenu" : null}
        aria-haspopup="true"
        onClick={openSelectedCityMenu}
      >
        <Icon>more_horiz</Icon>
      </IconButton>
      <Menu
        id="selectedCitiesMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeSelectedCitiesMenu}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              dispatch(removeCity(selectedCityIds));
              closeSelectedCitiesMenu();
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

export default CitiesMultiSelectMenu;
