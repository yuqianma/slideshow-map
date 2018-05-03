export const WORLD_SIZE = 512;
export const MERCATOR_A = 6378137.0; // 900913 projection property

export const PROJECTION_WORLD_SIZE = WORLD_SIZE / (MERCATOR_A * Math.PI) / 2;
export const DEG2RAD = Math.PI / 180;
export const RAD2DEG = 180 / Math.PI;
export const EARTH_CIRCUMFERENCE = 40075000; // In meters

export const SPF = 1000 / 60;

export const MainColor = 0x00fffc;

// components

export const Box = {
  Color: MainColor,
  Durations: [ 30 * SPF, 232 * SPF, 30 * SPF ]
};

export const Link = {
  Color: MainColor,
  Durations: [ 30 * SPF, 16 * SPF, 206 * SPF, 16 * SPF ]
};

export const RadioWave = {
  Color: MainColor
};

export const Card = {
  Color: MainColor,
  Gradient: [MainColor, 0x358bff]
};
