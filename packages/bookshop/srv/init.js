module.exports = db => {
  const { A_BusinessPartnerAddress: Addresses } = db.entities(
    'API_BUSINESS_PARTNER'
  )

  DELETE.from(Addresses)
  INSERT.into(Addresses).entries(
    {
      BusinessPartner: '1234567',
      AddressID: '11111',
      CityName: 'Walldorf',
      PostalCode: '69190',
      Country: 'Germany',
      StreetName: 'Dietmar-Hopp-Allee',
      HouseNumber: '111'
    },
    {
      BusinessPartner: '1234567',
      AddressID: '22222',
      CityName: 'Walldorf',
      PostalCode: '69190',
      Country: 'Germany',
      StreetName: 'Dietmar-Hopp-Allee',
      HouseNumber: '222'
    },
    {
      BusinessPartner: '1003765',
      AddressID: '28241',
      CityName: 'Palo Alto',
      PostalCode: '94306',
      Country: 'United States',
      StreetName: 'Hillview Avenue',
      HouseNumber: '26'
    },
    {
      BusinessPartner: '1003766',
      AddressID: '28244',
      CityName: 'Hallbergmoos',
      PostalCode: '85396',
      Country: 'Germany',
      StreetName: 'Zeppelinstraße',
      HouseNumber: '93'
    },
    {
      BusinessPartner: '1003767',
      AddressID: '28247',
      CityName: 'Potsdam',
      PostalCode: '14467',
      Country: 'Germany',
      StreetName: 'Konrad-Zuse-Ring',
      HouseNumber: '29'
    }
  )
}
