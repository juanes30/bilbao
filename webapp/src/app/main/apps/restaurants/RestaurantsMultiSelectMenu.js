import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeRestaurant } from "./store/restaurantsSlice";

function RestaurantsMultiSelectMenu(props) {
  const dispatch = useDispatch();
  const { selectedRestaurantIds } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  function openSelectedRestaurantMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function closeSelectedRestaurantsMenu() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        className="p-0"
        aria-owns={anchorEl ? "selectedRestaurantsMenu" : null}
        aria-haspopup="true"
        onClick={openSelectedRestaurantMenu}
      >
        <Icon>more_horiz</Icon>
      </IconButton>
      <Menu
        id="selectedRestaurantsMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeSelectedRestaurantsMenu}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              dispatch(removeRestaurant(selectedRestaurantIds));
              closeSelectedRestaurantsMenu();
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

export default RestaurantsMultiSelectMenu;
