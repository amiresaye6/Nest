import { faker } from "@faker-js/faker";

export class User {
  public location: { lat: number; lng: number };
  public name: string;
  constructor() {
    this.name = `${faker.name.firstName("male")} ${faker.name.lastName("male")}`;

    this.location = {
      lat: parseFloat(faker.address.latitude()),
      lng: parseFloat(faker.address.longitude()),
    };
  }
}
