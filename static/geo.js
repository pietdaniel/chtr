function doGeoLocationJazz(callback) {
  if(navigator.geolocation) {
    // set the options
    featureOpts = getMapFeatureOpts();
    styledMapOptions = { name: 'Custom Style' };
    customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
    MY_MAPTYPE_ID = 'custom_style';
    mapOptions = getMapOptions(MY_MAPTYPE_ID);

    // create the map
    MY_MAP = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    MY_MAP.locationArray = new Array();

    function markPosition(image) {
      return function(x,y) {
        pos = new google.maps.LatLng(x,y);
        MY_MAP.locationArray.push(pos)
        new google.maps.Marker({
          position: pos,
          map: MY_MAP,
          icon: image
        });
      }
    }

    MY_MAP.addPosition = markPosition('icon-map-pin.png');
    MY_MAP.myPosition = markPosition('map_location_pin_map-marker-48.png');

    MY_MAP.getBounds = function() {
      var bounds = new google.maps.LatLngBounds();
      if (MY_MAP.locationArray.length > 1) {
        for (var i = 0; i < MY_MAP.locationArray.length; i++) {
          bounds.extend(MY_MAP.locationArray[i]);
        }
        MY_MAP.fitBounds(bounds);
      }
    }

    MY_MAP.mapTypes.set(MY_MAPTYPE_ID, customMapType);

    navigator.geolocation.getCurrentPosition(callback, function(){lg('error with google maps')});

  } else {
    lg('error with google maps, unsupported');
  }
}


function getMapOptions(MY_MAPTYPE_ID) {
  return {zoom:12,mapTypeControlOptions:{mapTypeIds:[google.maps.MapTypeId.ROADMAP,MY_MAPTYPE_ID]},disableDefaultUI:true,mapTypeId:MY_MAPTYPE_ID};
}

function getMapFeatureOpts() {
  return[{stylers:[{hue:'#0000ff'},{visibility:'simplified'},{gamma:0.5},{weight:0.5}]},{elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'water',stylers:[{color:'#000089'}]}];
}
