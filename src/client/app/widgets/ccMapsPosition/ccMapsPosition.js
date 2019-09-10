(function(){
	'use strict';
	angular.module('app.widgets')
		.directive('ccMapsPosition',ccMapsPosition);

	function ccMapsPosition(socket){
		return{
			templateUrl : 'app/widgets/ccMapsPosition/ccMapsPosition.html',
			link : function(scope,el,attrs){
				
				scope.lat = attrs.lat;
				scope.long = attrs.long;
				scope.initialized = false;

				//variable mapa
				var map;
				//Radio de abarcacion
				var radiusInKm = 0.5;

				var center = [parseFloat(scope.lat),parseFloat(scope.long)];

				function initializeMap(){
					console.log('iniciando mapa');
					scope.loc = new google.maps.LatLng(center[0],center[1]);
					console.log('elemento : ',el[0]);

					map = new google.maps.Map(document.getElementById("map-canvas"),{
						center : scope.loc ,
						zoom : 17,
						mapTypeId : google.maps.MapTypeId.ROADMAP,
						mapTypeControlOptions : {
							position : google.maps.ControlPosition.TOP_CENTER
						},
						draggable : true,
						panControl : false
					});
				}

				function createVehicleMarker(vehicle){


					var position  = new google.maps.LatLng(vehicle.latitude,vehicle.longitude);
					var image = 'content/libre.png';
					console.log("marcdor",vehicle);
					var marker = new google.maps.Marker({
						icon: image,						
						position : position,
						map : map,
					});

					return marker;
				}				
 				
				function addMarker(location, map) {

					 var image = 'content/images/marcadores/ubicacion.png';
					 var marker = new google.maps.Marker({
					    position: location,
					    icon: image,
					    map: map,
					 });
					 return marker;
				}

				/* Returns true if the two inputted coordinates are approximately equivalent */
                function coordinatesAreEquivalent(coord1, coord2) {
                    return (Math.abs(coord1 - coord2) < 0.000001);
                }

                /*Retorna mi ubicacion por el navegador*/
                scope.miUbicacion = function(){
                	if (!scope.markerUser[0]) {
                		var lat;
	                	var long;
	                	if (navigator.geolocation) {
				          navigator.geolocation.getCurrentPosition(function(position) {
				            lat = position.coords.latitude;
							long = position.coords.longitude;
							var position = new google.maps.LatLng(lat,long);
							scope.markerUser.push(addMarker(position, map));
							scope.$apply();
							decodificarDireccion(position);
							
				          });
			      		}
                	}
                }
                
                scope.selectUbicacion = function(){
                	if(!scope.markerUser[0])
                	{
    					google.maps.event.addListener(map, 'click', function(event) {
    						if (!scope.markerUser[0]) {
							    scope.markerUser.push(addMarker(event.latLng, map));
							    scope.$apply();

			                    var objConfigDr = {
				                	map : map,
				                };
				                var obConfigDs = {
				                	origin: scope.loc,
				                	destination : event.latLng,
				                	travelMode : google.maps.TravelMode.DRIVING 
				                };
				                //objInformation
				                var ds = new google.maps.DirectionsService();
				                var dr = new google.maps.DirectionsRenderer(objConfigDr);

				                function fnRutear(resultados,status){
					                	//mostramos la linea entre A y B
					                	if (status =='OK') {
					                		dr.setDirections(resultados);
					                	}else{
					                		alert("error");
					                		console.log(status);
					                	}
				                }

				                // ds.route(obConfigDs,fnRutear);
				                decodificarDireccion(event.latLng);
    						}
						    
				  		});
					}
                	
                }
                
                function decodificarDireccion(event){
                	var geocoder = new google.maps.Geocoder();
			     		geocoder.geocode({
						    'latLng': event
							// 'latLng': latlng si lo que queremos ejecutar en geocodificación inversa
						  }, function (results, status) {
						    if (status == google.maps.GeocoderStatus.OK) {
						      console.log("calle : ", results[0].formatted_address);
						      scope.$apply(function(){
						      	scope.reserva.position = event;
						      	scope.miubicacion = results[0].formatted_address;
						      	scope.reserva.ubicacion = results[0].formatted_address;
						      });
						      
						    }
							// Se detallan los diferentes tipos de error
							else {
						      alert('Geocode no tuvo éxito por la siguiente razón: ' + status)
						    }
				  		});
                }

				/* Animates the Marker class (based on https://stackoverflow.com/a/10906464) */
                google.maps.Marker.prototype.animatedMoveTo = function(newLocation) {
                    var toLat = newLocation[0];
                    var toLng = newLocation[1];

 					var fromLat = this.getPosition().lat();
                    var fromLng = this.getPosition().lng();

                    if (!coordinatesAreEquivalent(fromLat, toLat) || !coordinatesAreEquivalent(fromLng, toLng)) {
                        var percent = 0;
                        var latDistance = toLat - fromLat;
                        var lngDistance = toLng - fromLng;
                        var interval = window.setInterval(function () {
                            percent += 0.0001;
                            var curLat = fromLat + (percent * latDistance);
                            var curLng = fromLng + (percent * lngDistance);
                            var pos = new google.maps.LatLng(curLat, curLng);
                            this.setPosition(pos);
                            if (percent >= 1) {
                                window.clearInterval(interval);
                            }
                        }.bind(this), 50);
                    }
                };

                initializeMap();

		// console.log('socket ',socket);

		// socket.on('data',function(data){
		// 	console.log('recibe ',data  );
		// })
		var marcador=[];
                socket.on('data', function(data){
                	var vehicleInquery = data;

                	if(vehicleInquery){
	                	var vehicle = [];
	                	setTimeout(function(){ 
	                		console.log('tamaño',data.length);
	                	for (var i = 0; i < data.length; i++) {
	                		var vehicle = data[i];
	                		if (marcador[i]== null) {
			                	console.log("crendp marcador");
	                			vehicle.marker = createVehicleMarker(vehicle);
	                			marcador[i] = vehicle;	 
	                		}
	                		if (marcador[i].latitude != vehicle.latitude ||  marcador[i].longitude!= vehicle.longitude) {
	                				console.log('movirndo');
	                			
	                				var position = [vehicle.latitude,vehicle.longitude];
	                				marcador[i].marker.animatedMoveTo(position); 
	                			
	                			
	                		}	
                		}
                		}, 5000);
                	}
				});

			}
		
		};
	}


}());