import axios  from "axios";

const DATE_GRID_API = "https://calirdr.usedirect.com/RDR/rdr/search/grid";
const CRYSTAL_COVE_FACILITY_ID = "757";
// const CRYSTAL_COVE_FACILITY_ID = "447"; // Campground with better availability for testing
const REQUEST_TIMEOUT = 100;

// Premium cottages with room for at least six people
const SIX_PERSON_UNITS = ["2", "14", "16", "19A", "27", "32", "33", "37"];
// Premium cottages with unknown amount of room
const OTHER_UNITS = ["29", "38", "39"];
const TARGET_UNITS = [...SIX_PERSON_UNITS, ...OTHER_UNITS];

const wait = (ms = REQUEST_TIMEOUT) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const pad = (num) => {
  const numString = String(num);
  return numString.length === 1 ? "0" + numString : numString;
};

const pushIfUnique = (arr, newItem) => {
  return Array.from(new Set([...arr, newItem]));
}

const objectFilter = (obj, filterFn) => {
  const entries = Object.entries(obj);
  const filteredObject = entries.reduce((newObj, entry) => {
    if (filterFn(entry[1])) {
      newObj[entry[0]] = entry[1];
    }
    return newObj;
  }, {});
  return filteredObject;
};

const sortObjectKeys = obj => {
  const sortedEntries = Object.entries(obj).sort((a, b) =>{
    if (a[0] > b[0]) {
      return 1;
    }
    if (a[0] < b[0]) {
      return -1;
    }
    return 0;
  });
  return Object.fromEntries(sortedEntries);
}

const getDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = pad(dateObj.getMonth() + 1);
  const date = pad(dateObj.getDate());
  return `${year}-${month}-${date}`;
};

const apiRequest = async (facilityId, startDate, endDate) => {
  const headers = {
    "accept": "application/json",
    "accept-encoding": "gzip, deflate, compress",
    "content-type": "application/json"

  }
  const payload = {
    IsADA: false,
    MinVehicleLength: 0,
    UnitCategoryId: 0,
    StartDate: startDate,
    WebOnly: true,
    UnitTypesGroupIds: [],
    SleepingUnitId: 0,
    EndDate: endDate,
    UnitSort: "orderby",
    InSeasonOnly: true,
    FacilityId: facilityId,
    RestrictADA: false,
  };
  const response = await axios({
    url: DATE_GRID_API,
    method: "POST",
    data: payload,
    headers
  })
    .then((response) => response.data)
    .catch((error) => {
      console.log("error:", error);
      return null;
    });
  return response;
};

const checkParkAvailability = async (
  facilityId,
  startingDate,
  targetUnits,
  numNights
) => {
  const dateMap = {};
  let startDate = new Date(startingDate);
  let endDate = new Date(startingDate);
  endDate.setDate(endDate.getDate() + numNights);
  const finalDate = new Date();
  finalDate.setMonth(startDate.getMonth() + 6);
  const finalDatestamp = finalDate.getTime();

  while (endDate.getTime() <= finalDatestamp) {
    const response = await apiRequest(facilityId, startDate, endDate);
    if (response) {
      const units = response.Facility.Units;
      for (const key in units) {
        const unit = units[key];
        if (!targetUnits.includes(unit.ShortName)) {
          continue;
        }
        const slices = objectFilter(unit.Slices, slice => slice.IsFree);
        for (const sliceKey in slices) {
          const slice = slices[sliceKey];
          if (!(slice.Date in dateMap)) {
            dateMap[slice.Date] = [unit.ShortName]
          } else {
            dateMap[slice.Date] = pushIfUnique(dateMap[slice.Date], unit.ShortName);
          }
        }
      }
    }
    startDate = new Date(endDate.getTime());
    endDate = new Date(startDate.getTime());
    endDate.setDate(startDate.getDate() + numNights);
    await wait(REQUEST_TIMEOUT);
  }
  const sortedDates = sortObjectKeys(dateMap);
  return sortedDates;
};

export const runErinsCheck = () => {
  return checkParkAvailability(
    CRYSTAL_COVE_FACILITY_ID,
    getDateString(new Date()),
    TARGET_UNITS,
    7
  );
}



export default checkParkAvailability;