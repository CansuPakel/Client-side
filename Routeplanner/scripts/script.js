
/**
* Project Client Side
* Cansu Pakel
* 2ICT6
*/
import '../node_modules/jquery/dist/jquery.js'; 
import '../node_modules/jquery/dist/jquery.min.js'; 
import '../node_modules/datetimepicker-master/jquery.js';
import '../node_modules/datetimepicker-master/build/jquery.datetimepicker.full.js';

;(function($) { 
	'use strict';
	const localStorage = window.localStorage;

	$(window).on('load', function() {	
		$('#departureDateTime').datetimepicker();
		/**
		*Here you get the connections between the trains. If there is no connection, 
		*an error message will be displayed
		*/
		var getDataRail = function(){	
			$('#output #connenctionsOutput').remove();
			$('#output #error').remove();
			var departure = $('#departure').val();
			var arrival = $('#arrival').val();

			//retrieve selected date and time
			var dateAndTime = $('#departureDateTime').datetimepicker('getDate').val();
			var date = dateAndTime.replace('.','');
			var year = date.substring(7,9);
			date = date.substring(0,4)+''+year;

			//take out the time (-5 last)
			var hour = dateAndTime.slice(-5);
			hour = hour.replace(':','');

			$.ajax({
				url: `https://api.irail.be//connections/?from=${departure}&to=${arrival}&date=${date}&time=${hour}&timesel=departure&format=json&typeOfTransport=trains&results=6`,
				type: 'GET',
				headers: {
					'user-agent' : 'MyRailAPP (local school project), cansu.pakel@student.odisee.be',
					'Accept': 'application/json'
				}, datatype: 'json',
				success: function(data) {
					getDetailsData(data);
					$('#output').append('<table id="connenctionsOutput"> <tr> <th>From</th> <th>Departure Time</th> <th>To</th> <th>Arrival Time </th> <th>Duration</th> </tr> </table>');	
					for(var i = 0 ; i < data.connection.length ; i++){
						var dataCon = data.connection[i];
						var departureStade = dataCon.departure.station;
						var arrivalStade = dataCon.arrival.station;
						var departureTimeStamp = dataCon.departure.time;
						var arrivalTimeStamp = dataCon.arrival.time;
						var duration = dataCon.duration;
						var spoorDeparture = dataCon.departure.platform;
						var spoorArrival = dataCon.arrival.platform;
						$('#connenctionsOutput').append('<tr> <td data-from>' + departureStade + '</td> <td><span id="time" data-depTime>' + timeStampToHuman(departureTimeStamp) + '</span><br> Pl. ' + spoorDeparture + '</td> <td data-to>' + arrivalStade + '</td> <td><span id="time" data-arrTime>' + timeStampToHuman(arrivalTimeStamp) + '</span><br> Pl. ' + spoorArrival	+ '</td> <td> ' + toHours(duration/60) + '</td> </tr>');
					}

					$('#output').css({
						'width':'55%'
					})
				}, error: function(err) {
					$('#detailsOutput  p').remove();
					$('#detailsOutput  svg').remove();
					$('#detailsOutput  br').remove();
					$('#mapSection #mapid').remove();
					$('#detailsOutput #localStorage').remove();
					$('#localStorageOutput').remove();
					$('#output').append(`<div id="error">There is no route from ${departure} to ${arrival}</div>`);

					$('#error').css({
						'color': '#D8000C', 'background-color': '#FFBABA', 'border': '0.15rem solid #ff3300', 'width': '36%',
						'text-align': 'center','margin': 'auto','padding': '4rem'
					});

					$('#output').css({
						'width':'100%'
					});
				}
			});
		};
		

		$('#submit').click(function(){
			getDataRail()
		});


		//stations https://gomakethings.com/how-to-create-a-form-input-autocomplete-without-a-library-or-framework/
		//Insert all stations in a datalist
		var getStades = function() {
			var standardNames=[];		
			$.ajax({
				url: `https://api.irail.be/stations/?format=json&lang=en`,
				type: 'GET',
				headers: {
					'user-agent' : 'MyRailAPP (local school project), cansu.pakel@student.odisee.be',
					'Accept': 'application/json'
				}, datatype: 'json',
				success: function(data) {
					$('#form').append('<datalist id="stades">');
					for(var i = 0 ; i < data.station.length ; i++){
						$('#stades').append('<option>' + data.station[i].standardname + '</option>');
					}
					$('#form').append('</datalist>');
				}, error: function(err) {
					console.log(err);
				}
			});
		}();



		//Details of chosen route
		var getDetailsData = function(data){
			$('#output').on('click','#connenctionsOutput tr',function(){

				//change color as you select
				var selected = $(this).hasClass('ChangeColor');
				$('#output tr').removeClass('ChangeColor');
				if(!selected){
					$(this).addClass('ChangeColor');
				}

				$('p').remove();
				$('#detailsOutput  p').remove();
				$('#detailsOutput  svg').remove();
				$('#detailsOutput  br').remove();
				$('#mapSection #mapid').remove();
				$('#detailsOutput #localStorage').remove();
				$('#localStorageOutput').remove();

				//to get the via's
				$('#detailsOutput').append(`<p><img src="../images/metro.png" alt="Train">&emsp;${data.connection[($(this).index()-1)].departure.station}<span id='PL'>${data.connection[($(this).index()-1)].departure.platform}</span></p>`);
				try{
					for(var x = 0 ; x < data.connection[($(this).index()-1)].vias.via.length ; x++ ){
						$('#detailsOutput').append(`<p id='via'>&emsp;&emsp;${data.connection[($(this).index()-1)].vias.via[x].direction.name}</p></br>`);
					}
				}catch(err){
					console.log(err.message + 'no via');
				}
				$('#detailsOutput').append(`<p><img src="../images/circle-outline.png" alt="Circle">&emsp;&emsp;${data.connection[($(this).index()-1)].arrival.station}<span id='PL'>${data.connection[($(this).index()-1)].arrival.platform}</span></p>`);
				$('#detailsOutput').append('<input type="button" name="btnLocalStorage" value="Save route" id="localStorage">');



				//bron:https://leafletjs.com/examples.html
				//Where the departure train is now
				$('#mapSection').append('<div id="mapid"></div>');
				var x =  data.connection[($(this).index()-1)].departure.stationinfo.locationX;
				var y = data.connection[($(this).index()-1)].departure.stationinfo.locationY;

				var mymap = L.map('mapid').setView([y, x], 13);
				var marker = L.marker([y, x]).addTo(mymap);
				L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2Fuc3VwYWtlbCIsImEiOiJjanBjeDl4c2owZnRpM2twbGxoNDRxbTZ1In0.qkaxfimkknitlDCrxz_M9Q', {
					attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
					maxZoom: 18,
					id: 'mapbox.streets',
					accessToken: 'pk.eyJ1IjoiY2Fuc3VwYWtlbCIsImEiOiJjanBjeDl4c2owZnRpM2twbGxoNDRxbTZ1In0.qkaxfimkknitlDCrxz_M9Q'
				}).addTo(mymap);


				$('#detailsOutput #via').css({
					'border-left': 'thick solid black','margin': '5rem 5rem 4rem 0.8rem','margin-left': '0.8rem'
				});

				$('#detailsOutput #PL').css({
					'float':'right','margin-right': '2rem'
				});

				$('#detailsOutput #localStorage').css({
					'float':'right', 'font-size':' 1.4rem', 'cursor': 'pointer','padding': '0.4rem',
	    			'padding-left': '2rem','padding-right': '2rem','margin-left': '1.2rem','margin-right': '1rem','border': 'none',
	    			'border-radius': '0.4rem','background-color': '#006699','color': 'white'
				});

				//Insert to the local storage
				var conData = data.connection[$(this).index()-1];
				var departureStade = conData.departure.station;
				var arrivalStade = conData.arrival.station;
				var departureTimeStamp = conData.departure.time;
				var arrivalTimeStamp = conData.arrival.time;
				var duration = conData.duration;
				var spoorDeparture = conData.departure.platform;
				var spoorArrival = conData.arrival.platform;

				$('#detailsOutput').on('click','#localStorage',function(){
					localStorage.setItem('ID:' + conData.id + ' -> Departure: ' + departureStade + ' Time:' + timeStampToHuman(departureTimeStamp) + ' Arrival:' +  arrivalStade + ' Time:' + timeStampToHuman(arrivalTimeStamp)  ,'<tr><td>'+ departureStade + '</td><td>' + timeStampToHuman(departureTimeStamp) + '<br>Pl.' + spoorDeparture + '</td><td>' +  arrivalStade + '</td><td>' + timeStampToHuman(arrivalTimeStamp) + '<br>Pl.' + spoorArrival + '</td> <td>' +  toHours(duration/60) + '</td></tr>');
				});	
				//stop refresh
				return false;
			});
		}


			
		//Where al you saved routes are.
		$('body').on('click','#savedRoute',function(){
			$('#form').remove();
			$('#output').remove();
			$('#detailsOutput  p').remove();
			$('#detailsOutput  svg').remove();
			$('#detailsOutput  br').remove();
			$('#localStorageOutput table').remove();
			$('#mapSection #mapid').remove();
			$('#detailsOutput #localStorage').remove();

			var outputLocalStorage = '<table>';
			outputLocalStorage += '<tr> <th>From</th> <th>Departure time</th> <th>To</th> <th>Arrival time</th> <th>Duration</th> </tr>';
			for(var i = 0 ;i < localStorage.length ; i++){
				outputLocalStorage +='<tr>' + localStorage.getItem(localStorage.key(i)) + '</tr>';
			}
			outputLocalStorage += '</table>';

			$('#localStorageOutput').append(outputLocalStorage);	
			$('#detailsOutput').css({ 'margin-top':'0rem'});
			$('#output').css({ 'margin-top':'0rem'});

			return false;
		});


		//Liveboard of each train, you choose.
		var liveBoardData = function(){
			var searchStop = $('#searchStop').val();
			var date = new Date();
			$.ajax({
				url: `https://api.irail.be//liveboard/?station=${searchStop}&date=${(date.getDate()<10?'0':'') + date.getDate()}${((date.getMonth() +1)<10?'0':'') + (date.getMonth() + 1)}${date.getFullYear().toString().substr(-2)}&time=${(date.getHours()<10?'0':'') + date.getHours()}${(date.getMinutes()<10?'0':'') + date.getMinutes()}&arrdep=departure&lang=en&format=json`,
				type: 'GET',
				headers: {
					'user-agent' : 'MyRailAPP (local school project), cansu.pakel@student.odisee.be',
					'Accept': 'application/json'
				}, datatype: 'json',
				success: function(data) {
					$('#detailsOutput  p').remove();
					$('#detailsOutput  svg').remove();
					$('#detailsOutput  br').remove();
					$('#output #connenctionsOutput').remove();
					$('#form').remove();
					$('#output #lijst').remove();
					$('#localStorageOutput').remove();
					$('#mapSection #mapid').remove();
					$('#detailsOutput #localStorage').remove();
					$('#error').remove();
					
					$('#output').append('<table id="lijst"><tr> <th>From</th> <th>Departure Time</th> <th>Platform</th> </tr></table>');	
					for(var i = 0 ; i < data.departures.departure.length ; i++){
						var departureStade = data.departures.departure[i].station;
						var departureTime = data.departures.departure[i].time
						var spoorDeparture = data.departures.departure[i].platform
						$('#lijst').append('<tr><td>' + departureStade + '</td><td>' + timeStampToHuman(departureTime) + '</td><td>' + spoorDeparture + '</td></tr>');
					}

					$('#output').css({ 'width':'100%', 'padding-left':'0rem', 'margin-top':'0rem' });
					$('#detailsOutput').css({ 'margin-top':'0rem'});
				}, error: function(err) {
					$('#detailsOutput  p').remove();
					$('#detailsOutput  svg').remove();
					$('#detailsOutput  br').remove();
					$('#output #connenctionsOutput').remove();
					$('#output #lijst').remove();
					$('#localStorageOutput').remove();
					$('#mapSection #mapid').remove();
					$('#detailsOutput #localStorage').remove();

					console.log(err);
					$('#output').append(`<div id="error">There is liveboard of ${$('#searchStop').val()}</div>`);

					$('#error').css({
						'color': '#D8000C', 'background-color': '#FFBABA', 'border': '0.15rem solid #ff3300', 'width': '36%',
						'text-align': 'center','margin': 'auto','padding': '4rem'
					});

					$('#output').css({
						'margin-top':'3rem',
						'width':'100%'
					});

				}
			});
		};
		


		$('#submitSearch').click(function(){
			liveBoardData();
		});



		/**bron:https://stackoverflow.com/questions/5416920/timestamp-to-human-readable-format
		*bron:https://stackoverflow.com/questions/6040515/how-do-i-get-month-and-date-of-javascript-in-2-digit-format
		*Set timestamp to human readable format. Where is a min or hour is less than 10, than I put a 0 before the digit.
		*/
		var timeStampToHuman = function(departureTimeStamp){
			var departureTime = new Date(departureTimeStamp * 1000),
			dateValues = [
				departureTime.getHours(),
				departureTime.getMinutes(),
			];
			var hours = dateValues[0];
			var minutes = dateValues[1];
			if(hours <10){
				hours = '0' + dateValues[0];
			}
			if(minutes < 10){
				minutes ='0' + dateValues[1];
			}
			return  `${hours}:${minutes}`;
		}


		//Set minutes to hours for the duration
		var toHours  = function(minutes){
			var hours = (minutes / 60);
			var rhours = Math.floor(hours);
			var minutes = (hours - rhours) * 60;
			var rminutes = Math.round(minutes);
			return rhours + ' hour(s) and ' + rminutes + ' minute(s).';
		}

	});
})(jQuery);


