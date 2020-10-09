import FuseAnimate from "@fuse/core/FuseAnimate";
import FusePageSimple from "@fuse/core/FusePageSimple";
import withReducer from "app/store/withReducer";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useDeepCompareEffect } from "@fuse/hooks";
import UsersDialog from "./UsersDialog";
import UsersHeader from "./UsersHeader";
import UsersList from "./UsersList";
import reducer from "./store";
import { getUsers, openNewUserDialog } from "./store/usersSlice";

const useStyles = makeStyles({
  addButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 99,
  },
});

function UsersApp(props) {
  const dispatch = useDispatch();

  const pageLayout = useRef(null);
  const routeParams = useParams();
  const classes = useStyles(props);

  useDeepCompareEffect(() => {
    dispatch(getUsers(routeParams));
  }, [dispatch, routeParams]);

  return (
    <>
      <FusePageSimple
        classes={{
          contentWrapper: "p-0 sm:p-24 h-full",
          content: "flex flex-col h-full",
          leftSidebar: "w-256 border-0",
          header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
          wrapper: "min-h-0",
        }}
        header={<UsersHeader pageLayout={pageLayout} />}
        content={<UsersList />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
      <FuseAnimate animation="transition.expandIn" delay={300}>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.addButton}
          onClick={(ev) => dispatch(openNewUserDialog())}
        >
          <Icon>person_add</Icon>
        </Fab>
      </FuseAnimate>

      <UsersDialog />
    </>
  );
}

export default withReducer("usersApp", reducer)(UsersApp);
