var five = require("johnny-five");
var board = new five.Board();

var data ={
  latitude:null,
  longitude:null
}


board.on("ready", function() {
  var gps = new five.GPS({
    pins: {
      rx: 11,
      tx: 10,
    }
  });

  // If latitude, longitude change log it
  gps.on("change", function() {
    // console.log("position");
    // console.log("  latitude   : ", this.latitude);
    // console.log("  longitude  : ", this.longitude);
    // console.log("  altitude   : ", this.altitude);
    // console.log("--------------------------------------");

    data.latitude=this.latitude;
    data.longitude=this.longitude;
  });
  // If speed, course change log it
  gps.on("navigation", function() {
    // console.log("navigation");
    // console.log("  speed   : ", this.speed);
    // console.log("  course  : ", this.course);
    // console.log("--------------------------------------");
  });
});

    module.exports = data;
