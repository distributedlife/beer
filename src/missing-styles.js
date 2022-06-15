const fs = require("fs");
const { unparse } = require("papaparse");
const beers = require("./data/beers");
const styles = require("./data/styles.json");

const pubPath = process.argv[2];
const pubName = pubPath
  .split("/")
  .filter((part) => ![".", "src", "data", ".json"].includes(part))
  .join("")
  .split(".")
  .filter((part) => !["json"].includes(part))
  .join("");

const pub = require(`./data/${pubName}.json`);

const byStyleByPrice = (a, b) => {
  if (a.style < b.style) {
    return -1;
  }

  if (a.style > b.style) {
    return 1;
  }

  // same style, find cheapest unit price
  const aPrices = Math.min(...a.prices.map(({ price }) => Number.parseFloat(price)));
  const bPrices = Math.min(...b.prices.map(({ price }) => Number.parseFloat(price)));

  return aPrices - bPrices;
};

const stylesHad = beers
  .map((beer) => beer.style)
  .reduce((all, v) => (all.includes(v) ? all : [...all, v]), []);

const missingStyles = styles.filter((style) => !stylesHad.includes(style));

const missingStylesAtPub = pub.filter((beer) => missingStyles.includes(beer.style));

const bottleOrCanOnly = missingStylesAtPub.filter((beer) => {
  const canTakeaway = beer.prices.filter(({ size }) => {
    return size.toLowerCase().includes("bottle") || size.toLowerCase().includes("can");
  });

  return canTakeaway.length > 0;
});

const sorted = [...bottleOrCanOnly].sort(byStyleByPrice);
const sansPrice = sorted.map(({ name, style, brewery }) => ({
  style,
  brewery,
  name,
}));

const stylesWeCanGet = sansPrice
  .map(({ style }) => style)
  .reduce((all, v) => (all.includes(v) ? all : [...all, v]), []);

const csv = unparse(sansPrice);

console.log(stylesWeCanGet, stylesWeCanGet.length);

fs.writeFileSync(`out/shopping-list-${pubName}.csv`, csv);
