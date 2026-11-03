import { FOCUS_MATRIX } from './src/data/focusMatrix.ts';

const baseHouseId = "4";
const currentHouseProfiles = FOCUS_MATRIX[baseHouseId] || {};
console.log("Casa 4 keys:", Object.keys(currentHouseProfiles));

const baseHouseIdNumber = 4;
const currentHouseProfilesNum = FOCUS_MATRIX[baseHouseIdNumber] || {};
console.log("Casa 4 (num) keys:", Object.keys(currentHouseProfilesNum));
