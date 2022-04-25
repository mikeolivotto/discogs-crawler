const axios = require("axios");
var Bottleneck = require("bottleneck/es5");
fs = require("fs");

const { argv } = require('process');

const max25pm = new Bottleneck({
  minTime: 2600, // 1000 ms per minute
});

const getArtistAPI = async (id) => {
  response = await axios.get(`https://api.discogs.com/artists/${id}`);
  return response;
};

const getArtist = max25pm.wrap(getArtistAPI);

// [band id, band name]
let bands = {};

// [band id, person id]... {band: [members]}
let bandsMembers = {};

// [person id, person name]
let musicians = {};

const maxBandsToReturn = 2;

const getBand = async (bandId) => {
  try {
    const response = await getArtist(bandId);
    console.log(`Adding band ${response.data.name}`);
    !bands[bandId] && (bands[bandId] = response.data.name);
  } catch (err) {
    console.log(`Could not retrieve band with ID '${bandId}'`);
  }
};

const getBands = async () => {
  for (var musician in musicians) {
    try {
      const response = await getArtist(musician);
      const { groups } = response.data;
      for (const band in groups) {
        if (!bands[groups[band].id]) {
          console.log(`Adding band ${groups[band].name}`);
          bands[groups[band].id] = groups[band].name;
        }
      }
    } catch (err) {
      console.log(
        `could not retrieve musician ${musician}: ${musicians[musician]}`
      );
    }
  }
  console.log("iterated though getBands");
};

const getBandMembers = async () => {
  // go through each band in the bands list
  for (var band in bands) {
    // if the band doesn't have members in the band members list
    if (!bandsMembers[band]) {
      // create an empty band Members array
      bandsMembers[band] = [];

      try {
        // hit the API to get the members
        const response = await getArtist(band);
        console.log(`--Adding band members in ${response.data.name}`);
        const { members } = response.data;

        members.forEach((member) => {
          //   if the member is not already in the musicians list, add them
          if (!musicians[member.id]) {
            console.log(`  *adding musician ${member.name}`);
            musicians[member.id] = member.name;
          }
          bandsMembers[band].push(member.id);
        });
      } catch (err) {
        console.log(`could not retrieve band members for ${band}`);
      }
    }
  }
  console.log("iterated though getBandMembers");
};


const spider = async (seedBandId) => {
  await getBand(seedBandId);

  if (Object.keys(bands).length > 0) {
      while (Object.keys(bands).length < maxBandsToReturn) {
        await getBands(); // Go through 'musicians' list and get all bands they belong to. Eg AOF = 13 other bands
        await getBandMembers(); // Go through 'bands' list and get all their members 
      }
      const bandsJSON = JSON.stringify(bands);
      fs.writeFile(`${seedBandId}-bands.json`, bandsJSON, function (err) {
        err ? console.log(err) : console.log("Bands JSON file saved");
    
      });
    
      const bandsMembersJSON = JSON.stringify(bandsMembers);
      fs.writeFile(`${seedBandId}-bandsMembers.json`, bandsMembersJSON, function (err) {
        err ? console.log(err) : console.log("Bands-Members JSON file saved");
      });
    
      const musiciansJSON = JSON.stringify(musicians);
      fs.writeFile(`${seedBandId}-musicians.json`, musiciansJSON, function (err) {
        err ? console.log(err) : console.log("Musicians JSON file saved");
      });
  }

  if (Object.keys(bands).length === 0) {
      console.log("Re-run program with valid artist ID");
  }

};

spider(argv[2]);