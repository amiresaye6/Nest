/// <reference types="@types/google.maps" />
import { User } from "./User";
import { Companey } from "./Companey";
import { CustomMap } from "./CustomMap";

const mapContainer = document.getElementById("map");
const user = new User();
const companey = new Companey();

let map: CustomMap;

console.log(user);
console.log(companey);
if (mapContainer) {
  map = new CustomMap(mapContainer);
  map.addMarker(user);
  map.addMarker(companey);
}
