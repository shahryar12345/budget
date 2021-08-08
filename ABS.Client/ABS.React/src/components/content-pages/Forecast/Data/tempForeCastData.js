import { defaultforecastSection } from "./forecast-section-default-values";

export const forecastData = [
  {
    id: "1",
    name: "forecast 1",
    description: "forecast 1",
    updateddate: "05-May-2020",
    user: "Shahryar",
    forecastMethodSections: [
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "annualization",
      },
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "copy",
      },
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "annualization",
      },
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "copy",
      },
    ],
  },
  {
    id: "2",
    name: "forecast 2",
    description: "forecast 2",
    updateddate: "05-May-2020",
    user: "Shahryar",
    forecastMethodSections: [
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "copy",
      },
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "annualization",
      },
    ],
  },
  {
    id: "3",
    name: "forecast 3",
    description: "forecast 3",
    updateddate: "15-Jan-2020",
    user: "Shahryar",
    forecastMethodSections: [
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "copy",
      },
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "annualization",
      },
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "copy",
      },
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "annualization",
      },
    ],
  },
  {
    id: "4",
    name: "forecast 4",
    description: "forecast 4",
    updateddate: "10-Feb-2020",
    user: "Shahryar",
    forecastMethodSections: [
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "annualization",
      },
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "copy",
      },
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "annualization",
      },
    ],
  },
  {
    id: "5",
    name: "forecast 5",
    description: "forecast 5",
    updateddate: "05-May-2020",
    user: "Shahryar",
    forecastMethodSections: [
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "copy",
      },
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "copy",
      },
      {
        ...JSON.parse(JSON.stringify(defaultforecastSection)),
        forecastType: "copy",
      },
    ],
  },
];
