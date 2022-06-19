let axios = require("axios");

class Test {
  constructor(
    countryName,
    capital,
    population,
    currency,
    flag,
    exchangeRate,
    exchangeRateDate
  ) {
    this.countryName = countryName;
    this.capital = capital;
    this.population = population;
    this.currency = currency;
    this.flag = flag;
    this.exchangeRateDate = exchangeRateDate;
    this.exchangeRate = exchangeRate;
  }
}

let countryName;
let capital;
let population;
let currency;
let flag;
let exchangeRate;
let exchangeRateDate;

let countryCurrency = ["AUD", "BRL", "JPY", "GBP", "USD"];

const sendDataToSheet = (data) => {
  let d = JSON.stringify(data);
  var config = {
    method: "post",
    url: "https://sheet.best/api/sheets/342120a5-5de1-415c-8e97-0d7e8c943df2",
    headers: {
      "Content-Type": "application/json",
      mode: "cors",
    },
    data: d,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};

const fetchCountryExchangeRate = (base) => {
  let exchangeRateConfig = {
    method: "get",
    url: `https://api.apilayer.com/fixer/latest?base=${base}`,
    headers: {
      apiKey: "zlmno9aICdEnjBiTfzGcgM4FuPH9L12H",
    },
  };

  axios(exchangeRateConfig)
    .then(function (response) {
      //console.log(JSON.stringify(response.data));
      exchangeRate = response.data.rates.INR;
      exchangeRateDate = response.data.date;
      //console.log("exchangeRate: ", exchangeRate);
      //console.log("exchangeRateDate: ", exchangeRateDate);
    })
    .catch(function (error) {
      console.log(error);
    });

  return axios(exchangeRateConfig);
};

const fetchCountryData = async () => {
  const base_url = "https://restcountries.com/v3.1/name/";
  const countries = ["AUS", "BRA", "Japan", "Britain", "USA"];

  const promises = countries.map((v) => base_url + v).map(axios.get);

  Promise.all(promises).then((res) =>
    res.map((i) => {
      countryName = i.data[0].name.common;
      capital = i.data[0].capital[0];
      population = i.data[0].population;
      currency = i.data[0].cca3;
      flag = i.data[0].flag;
      let test = new Test(
        countryName,
        capital,
        population,
        currency,
        flag,
        exchangeRate,
        exchangeRateDate
      );

      console.log(test);
      sendDataToSheet(test);
      //return new Test(countryName, capital, population, currency, flag);
    })
  );
};

for (let i = 0; i < countryCurrency.length; i++) {
  fetchCountryData();
  fetchCountryExchangeRate(countryCurrency[i]);
}
