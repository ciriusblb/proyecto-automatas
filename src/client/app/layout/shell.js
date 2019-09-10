
(function(){
'use strict';
	angular.module('app')
		.controller('shellController',shell);


		function shell(socket){
			console.log(socket);
			var vm = this;

			vm.latitude="";
			vm.longitude="";

			socket.on('data',function(data){
				vm.latitude=data[0].latitude;
				vm.longitude=data[0].longitude;

			})

		}
}());