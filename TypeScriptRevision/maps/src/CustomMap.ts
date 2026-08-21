interface Mappable {
  location: { lat: number; lng: number };
}

export class CustomMap {
  private reference: google.maps.Map;
  constructor(public mapContainer: HTMLElement) {
    this.reference = new google.maps.Map(mapContainer, {
      zoom: 1,
      backgroundColor: "lightgreen",
      center: {
        lat: 0,
        lng: 0,
      },
    });
  }

  addMarker(mappable: Mappable) {
    new google.maps.Marker({
      map: this.reference,
      position: mappable.location,
    });
  }

}