exports.getDate = function() {
const todayFullDate = new Date();

const options = {
  weekday: "long",
  day: "numeric",
  month: "long"
}

return todayFullDate.toLocaleDateString("en-US", options);

}

exports.getDay = function() {
const todayFullDate = new Date();

const options = {
  weekday: "long",
}

return todayFullDate.toLocaleDateString("en-US", options);

}
