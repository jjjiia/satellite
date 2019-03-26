
//$(function() {
//    queue()
//        .defer(d3.csv,"durations_moreThanDay.csv")
//        .defer(d3.csv,"allCentroids.csv")
//	.await(dataDidLoad);
//})
var placesFile = d3.csv("durations_moreThanDay.csv")
var centroidsFile = d3.csv("allCentroids.csv")

Promise.all([placesFile,centroidsFile])
.then(function(data){
	//console.log(data[0])
	dataDidLoad(data[0],data[1])
})

var finishedIds = 0
var finished = []
var centroidsData = null
var geoidIndex = 3
var placesData = null
function dataDidLoad(places,centroidsFile){
    centroidsData = makeDictionary(centroidsFile)
	placesData = getIdsFromDuration(places).sort()

	mapboxgl.accessToken ="pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ"
	  visitedTractIds.sort()
	
		var currentId ="1400000US"+ placesData[geoidIndex]
		//var currentId ="1400000US01003010500"
	
		var center = [centroidsData[currentId]["lng"],centroidsData[currentId]["lat"]]
		console.log(center)
		
   var map = new mapboxgl.Map({
        container: 'map',
        style:"mapbox://styles/jjjiia123/cjfo6vnob2pgp2rqux8au0p0o",
        center:center,
        zoom: 16,
        preserveDrawingBuffer: true    
    });


	map.on("load",function(){
		
		moveMap(map,center,currentId)
	})
}  
function getIdsFromDuration(data){
	var formatted = []
	for(var i in data){
		formatted.push(data[i].id)
	}
	return formatted
}
function makeDictionary(data){
    var formatted = {}
    for(var i in data){
        var gid = data[i]["Gid"]
        formatted[gid]=data[i]
    }
    return formatted
}
function zoomToBounds(map,boundary){
    //https://docs.mapbox.com/mapbox-gl-js/example/zoomto-linestring/
   // console.log(intervals[intervals.length-1])
    var coordinates = boundary.coordinates[0]
    var bounds = coordinates.reduce(function(bounds, coord) {
        return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
    map.fitBounds(bounds,{padding:20})
               
}
function loadBoundaries(map,gid){
	var file = d3.json("../geoProcessing/tract_geojsons/"+gid.replace("1400000US","")+".geojson")
	Promise.all([file])
	.then(function(d){
		var boundary = d[0].features[0].geometry
		zoomToBounds(map,boundary)
		map.addLayer({
			"id":"tract_boundaries",
			"name":"tract_boundaries",
			"type":"line",
			"source":{
				"type":"geojson",
				"data":{
					"type":"Feature",
					 "geometry":boundary
				}
			},
			"paint":{
				"line-color":"#fff"
			}
		})
	})
}
function moveMap(map,center,gid){
			loadBoundaries(map,gid)
	map.flyTo({
                center:center,
              });
                map.once('moveend',function(){
					
				    var filter = ['!=', 'AFFGEOID',gid];
					map.setFilter("tracts_highlight",filter)
					
                    setTimeout(function(){
						geoidIndex+=1
                        makePrint(map,gid)		
                     }, 5000);
                });            
    }

function makePrint(map, gid){
        var canvas = document.getElementsByClassName("mapboxgl-canvas")[0]
	
	    canvas.toBlob(function(blob) {
	               saveAs(blob, gid+".png");
	           }, "image/png");
			  var nextGid = "1400000US"+ placesData[geoidIndex]
			  // var nextGid ="1400000US01003010500"
			   
			   var nextCenter = centroidsData[nextGid]
			   //console.log(nextGid)
			 //  moveMap(map,nextCenter,nextGid)
		   }
