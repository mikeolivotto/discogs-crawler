# discogs-crawler

Starting with the Artist ID (see note below) of a seed band, the application crawls the Discogs API to save relations between musical groups and artists associated to those groups.

Requests to the API are unauthenticated, therefore they are throttled to <25 requests /min. If Authentication is used in future, requests may increase to <60 requests /min.

Note: To get an Artist ID, look them up on discogs.com. The artist's page will have a URL similar to https://www.discogs.com/artist/XXXXXX-Artistname, the ID is the sequence of numbers (represented here by XXXXXX) preceding the artist's name

## Quickstart

1. `yarn install` to install dependencies
2. Edit the function invokation to `spider()` at the bottom of `index.js`, passing in a valid discogs artist ID to seed from
3. Update the value of `maxBandsToReturn` as appropriate
4.  `node index.js`
