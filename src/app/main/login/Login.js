import FuseAnimate from "@fuse/core/FuseAnimate";
import { TextFieldFormsy } from "@fuse/core/formsy";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Formsy from "formsy-react";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { submitLoginWithFireBase } from "app/auth/store/loginSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: "url(assets/images/backgrounds/dislicores.png)",
    backgroundSize: "cover",
    overflow: "hidden",
    color: theme.palette.primary.contrastText,
  },
}));

function Login() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const login = useSelector(({ auth }) => auth.login);

  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    dispatch(submitLoginWithFireBase(model));
  }

  return (
    <div
      className={clsx(
        classes.root,
        "flex flex-col flex-auto flex-shrink-0 p-24 md:flex-row md:p-0"
      )}
    >
      <div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
        <FuseAnimate animation="transition.expandIn">
          <img
            className="w-128 mb-32"
            src="assets/images/logos/dislicores-white.webp"
            alt="Logo Dislicores"
          />
        </FuseAnimate>

        <FuseAnimate animation="transition.slideUpIn" delay={300}>
          <Typography variant="h3" color="inherit" className="font-light">
            Bienvenido
          </Typography>
        </FuseAnimate>

        <FuseAnimate delay={400}>
          <Typography
            variant="subtitle1"
            color="inherit"
            className="max-w-512 mt-16"
          >
            Plataforma de gestion de restaurantes Share of Menu
          </Typography>
        </FuseAnimate>
      </div>

      <FuseAnimate animation={{ translateX: [0, "100%"] }}>
        <Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
          <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">
            <Typography variant="h6" className="md:w-full mb-32">
              INGRESA A TU CUENTA
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
                value="juanestebanlt@gmail.com"
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
                required
              />

              <TextFieldFormsy
                className="mb-16"
                type="password"
                name="password"
                value="Abcd1234*"
                label="Contraseña"
                validations={{
                  minLength: 7,
                }}
                validationErrors={{
                  minLength: "El tamaño minimo es 7",
                }}
                InputProps={{
                  className: "pr-2",
                  type: showPassword ? "text" : "password",
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
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
    </div>
  );
}

export default Login;
