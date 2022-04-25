# discogs-crawler

The application crawls the Discogs API to save relations between musical groups and artists associated to those groups.

Requests to the API are unauthenticated by default, therefore they are throttled to <25 requests /min. If Authentication is used in future, requests may increase to <60 requests /min.

Note: To get an Artist ID, look them up on discogs.com. The artist's page will have a URL similar to `/artist/XXXXXX-Artistname`, the ID is the sequence of numbers (represented here by XXXXXX) preceding the artist's name

## Quickstart

1. Fork and pull this repository to your local machine
1. `yarn install` to install dependencies
2. `yarn start [GROUP_ID] [MAX_#_GROUPS] [REQUESTS_PER_MIN]`
    - `[GROUP_ID]` - Required. a valid discogs artist ID to seed
    - `[MAX_#_GROUPS]` - max. number of musical groups to return (Default set at 10)
    - `[REQUESTS_PER_MIN]` - max number of API requests per minute. (Default is 25)
