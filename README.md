# Finding beer in new (to you) styles

These scripts are finding new beers from your local beershop. You need to have two things be true for this to work:

1. You record your unique beers in untappd
2. You consider "new beers" being beers from a **style** you've not had before. There are 224 different styles of beer on untappd but it's really hard to see how a beer is classified just by looking at the can.
3. Your local puts their beers on untappd too
4. You're comfortable with some JS scripting.

## Usage

After you have followed the setup you can run the following script to get a CSV that you can print or take into the shop. The first argument to the script be the path to the shop data you

```sh
node src/missing-styles.js src/data/hopheads-point-cook.json
open out/shopping-list-hopheads-point-cook.csv
```

# Setup

## Instal deps

```sh
npm i
```

## Get your beer data

1. https://untappd.com/user/distributedlife/beers
2. Keep clicking the "Load More" page until you have all your beers or the beers since last extract
3. Open console and run the script below to convert data to JSON
4. Save the file in `src/data/beers.json`

```js
JSON.stringify(
  $$(".beer-item").map((c) => {
    return {
      name:
        c.querySelector(".beer-details .name a") && c.querySelector(".beer-details .name a").text,
      brewery:
        c.querySelector(".beer-details .brewery a") &&
        c.querySelector(".beer-details .brewery a").text,
      style:
        c.querySelector(".beer-details .style") &&
        c.querySelector(".beer-details .style").textContent.trim(),
      date:
        c.querySelector(".details .date a abbr") &&
        c.querySelector(".details .date a abbr").textContent.trim(),
    };
  })
);
```

## Beershop Data
> I chatted with peeps at Hopheads (a local beer shop near me) and they said that they add beers more readily than when they take them off from being out of stock. You may end up with some beers that are no longer available.

1. Find your beershop on Untappd e.g.
2. Filter by newest first and hide beers you've had
3. Keep clicking the "Load More" page until you have all your beers or the beers since last extract
4. Open console and run the script below to convert data to JSON
5. Save the file in `src/data/shopname.json` where `shopname` is the name you use for the shop

Data I have already

1. https://untappd.com/v/hopheads/2887575 -> `src/data/hopheads-point-cook.json`
2. https://untappd.com/v/hopheads-altona/8072907 -> `src/data/hopheads-altona.json`
3. https://untappd.com/v/hopheads-yarraville/10442156 -> `src/data/hopheads-yarraville.json`

```js
JSON.stringify(
  $$(".sorting-item").map((c) => {
    return {
      name:
        c.querySelector(".beer-info .beer-details h5 a") &&
        c.querySelector(".beer-info .beer-details h5 a").text,
      brewery:
        c.querySelector(".beer-info .beer-details h6 a") &&
        c.querySelector(".beer-info .beer-details h6 a").text,
      style:
        c.querySelector(".beer-info .beer-details h5 em") &&
        c.querySelector(".beer-info .beer-details h5 em").textContent.trim(),
      prices: [...c.querySelectorAll(".beer-prices p")].map((d) => {
        return {
          size: d.querySelector(".size").textContent.trim(),
          price: d.querySelector(".price").textContent.trim(),
        };
      }),
    };
  })
);
```
