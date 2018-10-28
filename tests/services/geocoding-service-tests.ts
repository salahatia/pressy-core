import { GeocodingService } from "../../src/common/services/geocoding-service";

describe("Geocoding service test suit", async () => {

  const service = new GeocodingService;

  it("Fetches Zenpark address components from it's placeId", async (done) => {

    const zenparkPlaceId = "ChIJPZVtpz1u5kcRQyeKkuEZ2LQ";

    const address = await service.getAddressWithPlaceId(zenparkPlaceId);
    
    expect(address.city).toEqual("Paris");
    expect(address.country).toEqual("France");
    expect(address.formattedAddress).toEqual("142 Rue Montmartre, 75002 Paris, France");
    expect(address.streetName).toEqual("Rue Montmartre");
    expect(address.streetNumber).toEqual("142");
    expect(address.zipcode).toEqual("75002");
    
    done();
    
  }, 60000);

  it("Fetches Zenpark address components from coordinates", async (done) => {

    const homeCoordinates = {
      latitude: 48.8144503, longitude: 2.2314194
    }

    const address = await service.getAddressWithCoordinates(homeCoordinates);
    
    expect(address.city).toEqual("Meudon");
    expect(address.country).toEqual("France");
    expect(address.formattedAddress).toEqual("41 Avenue du Château, 92190 Meudon, France");
    expect(address.streetName).toEqual("Avenue du Château");
    expect(address.streetNumber).toEqual("41");
    expect(address.zipcode).toEqual("92190");

    done();

  }, 60000);

  it("Returns an error when no or wrong placeId is given", async (done) => {

    const wrongPlaceId = "WRONG_PLACE_ID";

    try {

      await service.getAddressWithPlaceId(wrongPlaceId)
      done.fail();

    } catch (error) {
      done();
    }

  });

});