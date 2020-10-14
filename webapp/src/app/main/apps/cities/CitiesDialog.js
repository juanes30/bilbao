import _ from "@lodash";
import { useForm } from "@fuse/hooks";
import FuseUtils from "@fuse/utils/FuseUtils";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeCity,
  saveCity,
  closeNewCityDialog,
  closeEditCityDialog,
} from "./store/citiesSlice";

const defaultFormState = {
  id: "",
  name: "",
  code: "",
  department: "",
};

function CityDialog(props) {
  const dispatch = useDispatch();
  const cityDialog = useSelector(
    ({ citiesApp }) => citiesApp.cities.cityDialog
  );
  const departments = useSelector(({ citiesApp }) => citiesApp.departments.data);

  const { form, handleChange, setForm } = useForm(defaultFormState);
  const [departmentValue, setDepartmentValue] = useState(null);

  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (cityDialog.type === "edit" && cityDialog.data) {
      setForm({ ...cityDialog.data });
      setDepartmentValue(cityDialog.data.department)
    }

    /**
     * Dialog type: 'new'
     */
    if (cityDialog.type === "new") {
      setForm({
        ...defaultFormState,
        ...cityDialog.data,
        id: FuseUtils.generateGUID(),
      });
      setDepartmentValue(null)
    }
  }, [cityDialog.data, cityDialog.type, setForm]);

  useEffect(() => {
    /**
     * After Dialog Open
     */
    if (cityDialog.props.open) {
      initDialog();
    }
  }, [cityDialog.props.open, initDialog]);

  function closeComposeDialog() {
    return cityDialog.type === "edit"
      ? dispatch(closeEditCityDialog())
      : dispatch(closeNewCityDialog());
  }

  function canBeSubmitted() {
    return form.name.length > 0 && form.department.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(saveCity(form));
    closeComposeDialog();
  }

  function handleRemove() {
    dispatch(removeCity(form.id));
    closeComposeDialog();
  }

  return (
    <Dialog
      classes={{
        paper: "m-24 rounded-8",
      }}
      {...cityDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={1}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {cityDialog.type === "new" ? "Nueva Ciudad" : "Editar Ciudad"}
          </Typography>
        </Toolbar>
        <div className="flex flex-col items-center justify-center pb-24">
          {cityDialog.type === "edit" && (
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
              label="Código"
              autoFocus
              id="code"
              name="code"
              value={form.code}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20" />
            <TextField
              className="mb-24"
              label="Nombre Ciudad"
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
            <Autocomplete
              id="department"
              options={departments}
              getOptionLabel={(department) => department}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Departamento"
                  variant="outlined"
                />
              )}
              value={departmentValue}
              onChange={(event, newInputValue) => {
                setDepartmentValue(newInputValue);
                event.persist();
                if (
                  (event.type === "click" || event.type === "keydown") &&
                  newInputValue
                ) {
                  setForm((_form) =>
                    _.setIn({ ..._form }, "department", newInputValue)
                  );
                } else {
                  setForm((_form) => _.setIn({ ..._form }, "department", ""));
                }
              }}
              fullWidth
            />
          
          </div>
        </DialogContent>

        {cityDialog.type === "new" ? (
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

export default CityDialog;
