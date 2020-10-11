import { useForm } from "@fuse/hooks";
import FuseUtils from "@fuse/utils/FuseUtils";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeRegional,
  saveRegional,
  closeNewRegionalDialog,
  closeEditRegionalDialog,
} from "./store/regionalSlice";

const defaultFormState = {
  id: "",
  name: "",
  description: "",
};

function RegionalDialog(props) {
  const dispatch = useDispatch();
  const regionalDialog = useSelector(
    ({ regionalApp }) => regionalApp.regional.regionalDialog
  );

  const { form, handleChange, setForm } = useForm(defaultFormState);

  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (regionalDialog.type === "edit" && regionalDialog.data) {
      setForm({ ...regionalDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (regionalDialog.type === "new") {
      setForm({
        ...defaultFormState,
        ...regionalDialog.data,
        id: FuseUtils.generateGUID(),
      });
    }
  }, [regionalDialog.data, regionalDialog.type, setForm]);

  useEffect(() => {
    /**
     * After Dialog Open
     */
    if (regionalDialog.props.open) {
      initDialog();
    }
  }, [regionalDialog.props.open, initDialog]);

  function closeComposeDialog() {
    return regionalDialog.type === "edit"
      ? dispatch(closeEditRegionalDialog())
      : dispatch(closeNewRegionalDialog());
  }

  function canBeSubmitted() {
    return form.name.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(saveRegional(form));
    closeComposeDialog();
  }

  function handleRemove() {
    dispatch(removeRegional(form.id));
    closeComposeDialog();
  }

  return (
    <Dialog
      classes={{
        paper: "m-24 rounded-8",
      }}
      {...regionalDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={1}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {regionalDialog.type === "new"
              ? "Nueva Regional"
              : "Editar Regional"}
          </Typography>
        </Toolbar>
        <div className="flex flex-col items-center justify-center pb-24">
          {regionalDialog.type === "edit" && (
            <Typography variant="h6" color="inherit" className="pt-8">
              {form.name}
            </Typography>
          )}
        </div>
      </AppBar>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col md:overflow-hidden"
      >
        <DialogContent classes={{ root: "p-24" }}>
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">account_circle</Icon>
            </div>

            <TextField
              className="mb-24"
              label="Nombre Regional"
              autoFocus
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20" />
            <TextField
              className="mb-24"
              label="Descripción"
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>
        </DialogContent>

        {regionalDialog.type === "new" ? (
          <DialogActions className="justify-between p-8">
            <div className="px-16">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                type="submit"
                disabled={!canBeSubmitted()}
              >
                GUARDAR
              </Button>
            </div>
          </DialogActions>
        ) : (
          <DialogActions className="justify-between p-8">
            <div className="px-16">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleSubmit}
                disabled={!canBeSubmitted()}
              >
                GUARDAR
              </Button>
            </div>
            <IconButton onClick={handleRemove}>
              <Icon>delete</Icon>
            </IconButton>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}

export default RegionalDialog;
