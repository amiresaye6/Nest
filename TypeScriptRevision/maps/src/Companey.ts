import { faker } from "@faker-js/faker";

export class Companey {
  public companeyName: string;
  public catchPhrase: string;
  public location: {
    lat: number;
    lng: number;
  };
  constructor() {
    this.companeyName = faker.company.name();
    this.catchPhrase = faker.company.catchPhrase();

    this.location = {
      lat: parseFloat(faker.address.latitude()),
      lng: parseFloat(faker.address.longitude()),
    };
  }
}
