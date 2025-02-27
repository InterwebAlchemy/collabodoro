console.log(process.env);
export const WORK_TIME = process.env.NODE_ENV === "development" ? 15 : 1500;
export const REST_TIME = process.env.NODE_ENV === "development" ? 5 : 300;
export const TIME_SYNC_INTERVAL = 5000;
