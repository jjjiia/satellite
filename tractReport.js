Promise.all([d3.csv("tracts_withDuration.csv"),d3.csv("durations_86400_to_any_seconds.csv")])
.then(function(data){
 	var sortedDurations = sortByValue(data[1], "duration")	
	console.log(sortedDurations[0])
	drawTract(sortedDurations[0])
	var id = sortedDurations[0].id
	drawCharts(id)
})
	

function sortByValue(array, key){
	return array.sort(function(a,b){
		return parseInt(b[key])-parseInt(a[key])
	})
}

function drawTract(data){
	d3.select("#map")
	.append("img")
	.attr("id","tractImage")
	.attr("src","../moreThan1Day/1400000US27053003800.png")
}

function drawCharts(id){
	Promise.all([d3.csv("tracts_withDuration.csv"),d3.csv("durations_86400_to_any_seconds.csv")])
}