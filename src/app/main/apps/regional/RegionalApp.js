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
import RegionalDialog from "./RegionalDialog";
import RegionalHeader from "./RegionalHeader";
import RegionalList from "./RegionalList";
import reducer from "./store";
import { getRegional, openNewRegionalDialog } from "./store/regionalSlice";

const useStyles = makeStyles({
  addButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 99,
  },
});

function RegionalApp(props) {
  const dispatch = useDispatch();

  const pageLayout = useRef(null);
  const routeParams = useParams();
  const classes = useStyles(props);

  useDeepCompareEffect(() => {
    dispatch(getRegional(routeParams));
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
        header={<RegionalHeader pageLayout={pageLayout} />}
        content={<RegionalList />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
      <FuseAnimate animation="transition.expandIn" delay={300}>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.addButton}
          onClick={(ev) => dispatch(openNewRegionalDialog())}
        >
          <Icon>person_add</Icon>
        </Fab>
      </FuseAnimate>

      <RegionalDialog />
    </>
  );
}

export default withReducer("regionalApp", reducer)(RegionalApp);
