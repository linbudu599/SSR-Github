import moment from "moment";

export const getLastUpdated = time => {
  return moment(time).fromNow();
};
