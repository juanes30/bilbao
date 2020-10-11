import FuseUtils from "@fuse/utils";
import _ from "@lodash";
import mock from "../mock";

const departmentDb = {
  departments: [
    "Amazonas",
    "Antioquía",
    "Arauca",
    "Atlántico",
    "Bogotá DC",
    "Bolivar",
    "Boyacá",
    "Caldas",
    "Caquta",
    "Casanare",
    "Cauca",
    "Cesar",
    "Choco",
    "Cordoba",
    "Cundinamarca",
    "Guainia",
    "Guaviare",
    "Huila",
    "La Guajira",
    "Magdalena",
    "Meta",
    "Nariño",
    "Norte de Santander",
    "Putumayo",
    "Quindio",
    "Risaralda",
    "Santander",
    "Sucre",
    "Tolima",
    "Valle del cauca",
    "Vaupes",
    "Vichada",
  ],
};

mock.onGet("/api/departments").reply((config) => {
  return [200, departmentDb.departments];
});
