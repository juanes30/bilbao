import PropTypes from "prop-types";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { TextFieldFormsy } from "@fuse/core/formsy";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Formsy from "formsy-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createAccountWithFireBase } from "app/auth/store/loginSlice";

const CreateAccountForm = ({ email, password }) => {
  const dispatch = useDispatch();

  const login = useSelector(({ auth }) => auth.login);

  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    if (login.error && (login.error.email || login.error.password)) {
      formRef.current.updateInputsWithError({
        ...login.error,
      });
      disableButton();
    }
  }, [login.error]);

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model) {
    dispatch(createAccountWithFireBase({ ...model, id: login.id }));
  }

  return (
    <FuseAnimate animation={{ translateX: [0, "100%"] }}>
      <Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
        <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">
          <Typography variant="h6" className="md:w-full mb-32">
            ACTIVA TU CUENTA
          </Typography>

          <Formsy
            onValidSubmit={handleSubmit}
            onValid={enableButton}
            onInvalid={disableButton}
            ref={formRef}
            className="flex flex-col justify-center w-full"
          >
            <TextFieldFormsy
              className="mb-16"
              type="text"
              name="email"
              value={email}
              label="Correo"
              validations={{
                minLength: 4,
                isEmail: true,
              }}
              validationErrors={{
                minLength: "El tamaño minimo es 4",
                isEmail: "El formato del correo es incorrecto",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon className="text-20" color="action">
                      email
                    </Icon>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              disabled
            />

            <TextFieldFormsy
              className="mb-16"
              type="password"
              name="password"
              value={password}
              label="Contraseña"
              validations={{
                minLength: 4,
              }}
              validationErrors={{
                minLength: "El tamaño minimo es 4",
              }}
              InputProps={{
                className: "pr-2",
                type: showPassword ? "text" : "password",
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      <Icon className="text-20" color="action">
                        {showPassword ? "visibility" : "visibility_off"}
                      </Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
            />

            <TextFieldFormsy
              className="mb-16"
              type="password"
              name="confirmPassword"
              label="Confirmar Contraseña"
              validations={{
                minLength: 4,
              }}
              validationErrors={{
                minLength: "El tamaño minimo es 4",
              }}
              InputProps={{
                className: "pr-2",
                type: showConfirmPassword ? "text" : "password",
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Icon className="text-20" color="action">
                        {showConfirmPassword ? "visibility" : "visibility_off"}
                      </Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-full mx-auto mt-16 normal-case"
              aria-label="LOG IN"
              disabled={!isFormValid}
              value="legacy"
            >
              INGRESAR
            </Button>
          </Formsy>
        </CardContent>
      </Card>
    </FuseAnimate>
  );
};

CreateAccountForm.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default CreateAccountForm;
