/**
 * Created by Jeffrey on 2018/4/20.
 */

// https://github.com/mapbox/mapbox-gl-js/blob/03680eb57489cf442f8c538141ea27c73d98d532/src/geo/transform.js#L115
export const WORLD_SIZE = 512;

// https://github.com/mapbox/mapbox-gl-js/blob/03680eb57489cf442f8c538141ea27c73d98d532/src/geo/transform.js#L59
export const LAT_RANGE = [-85.05113, 85.05113];

// https://github.com/mapbox/mapbox-gl-js/blob/03680eb57489cf442f8c538141ea27c73d98d532/src/geo/transform.js#L66
export const FOV = 0.6435011087932844;

export const MERCATOR_A = 6378137.0;

export const PROJECTION_WORLD_SIZE = WORLD_SIZE / (MERCATOR_A * Math.PI) / 2;
export const DEG2RAD = Math.PI / 180;

export const RAD2DEG = 180 / Math.PI;
export const EARTH_CIRCUMFERENCE = 40075000;
