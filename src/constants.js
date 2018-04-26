export const WORLD_SIZE = 512;
export const MERCATOR_A = 6378137.0; // 900913 projection property

export const PROJECTION_WORLD_SIZE = WORLD_SIZE / (MERCATOR_A * Math.PI) / 2;
export const DEG2RAD = Math.PI / 180;
export const RAD2DEG = 180 / Math.PI;
export const EARTH_CIRCUMFERENCE = 40075000; // In meters

const SPF = 1000 / 60;

const MainColor = 0x00fffc;

// components
export const Link = {
  Color: MainColor,
  Durations: [ 0, 16 * SPF, 206 * SPF, 16 * SPF ]
};

export const Box = {
  Color: MainColor,
};
