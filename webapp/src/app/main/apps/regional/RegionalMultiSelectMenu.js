import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeRegional } from "./store/regionalSlice";

function RegionalMultiSelectMenu(props) {
  const dispatch = useDispatch();
  const { selectedRegionalIds } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  function openSelectedRegionalMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function closeSelectedRegionalMenu() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        className="p-0"
        aria-owns={anchorEl ? "selectedRegionalMenu" : null}
        aria-haspopup="true"
        onClick={openSelectedRegionalMenu}
      >
        <Icon>more_horiz</Icon>
      </IconButton>
      <Menu
        id="selectedRegionalMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeSelectedRegionalMenu}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              dispatch(removeRegional(selectedRegionalIds));
              closeSelectedRegionalMenu();
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

export default RegionalMultiSelectMenu;
