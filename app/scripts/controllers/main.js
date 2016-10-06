'use strict';

/**
 * @ngdoc function
 * @name kromotologyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the kromotologyApp
 */
angular.module('kromotologyApp')
  .controller('MainCtrl', function ($scope,$http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.prjName='Kromotology'
    $scope.prjRepo='https://github.com/densitydesign/strumentalia-kromotology'
    $scope.backendAddress='http://131.175.56.235:8080'
    // $scope.backendAddress='http://localhost:8080'

    //Object used for displaying or hiding elements based on boolean values
    $scope.showElements = {
    	go:false,
    	svg:false,
    	download:false,
    	retry:false
    }

    $scope.$watch('urlList', function() {
    	if ($scope.urlList) {
	    	$scope.showElements.go = true
    	} else {
    		$scope.showElements.go = false
    	}
	});

	$scope.addRandomUrl = function() {
		$scope.urlList = 'http://wallpoper.com/images/00/33/25/75/cars-classic_00332575.jpg\nhttp://www.iloveindia.com/cars/pics/vintage-cars.jpg\nhttp://www.carwallpapershq.com/wp-content/uploads/2016/02/classic_cars_photo_hq.jpg\nhttp://s1.picswalls.com/wallpapers/2014/06/18/free-vintage-cars-wallpaper_054104521_44.jpg\nhttp://www.motory.com/tinymce/Classic-Cars-11.jpg\nhttp://mixhdwallpapers.com/wp-content/uploads/2014/06/77.jpg\nhttps://mycamerajournal.files.wordpress.com/2013/03/rodrun-2.jpg\nhttps://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/1925_Flint.jpg/250px-1925_Flint.jpg\nhttp://www.vintagecarsandbikes.in/image/bnr1.jpg\nhttp://www.hybridlava.com/wp-content/uploads/Vintage_cars_019.jpg\nhttp://gearpatrol.com/wp-content/uploads/2016/06/vintage-car-under-15k-gear-patrol-full-lead.jpg\nhttps://s-media-cache-ak0.pinimg.com/originals/9e/a6/14/9ea6146f13769794007b6a947bd3a903.jpg\nhttp://hd.wallpaperswide.com/thumbs/classic_jaguar_xj6-t1.jpg\nhttp://media1.santabanta.com/full1/Cars/Vintage and Classic Cars/vintage-and-classic-cars-79a.jpg\nhttp://randomwallpapers.net/vintage-cars-retro-1920x1080-wallpaper524186.jpg\nhttp://bpc.h-cdn.co/assets/16/14/980x490/landscape-1460048341-porsche-356-classic.jpg\nhttp://assets.bauer-wolke.co.uk/imagegen/p/152/114/s3/digital-cougar-assets-uk/MomoAds/2016/09/23/103247/Singer_BJL356_1.jpg\nhttp://www.queensofvintage.com/wp-content/uploads/2013/10/HMP_5312-2.jpg\nhttp://s4.weddbook.com/t4/8/8/9/889147/vintage-cars.jpg\nhttp://www.magic4walls.com/wp-content/uploads/2013/12/beautiful-vintage-car-108642.jpg\nhttps://s-media-cache-ak0.pinimg.com/originals/e2/02/38/e20238b7d3dc4b7f9809db80225df9fb.jpg\nhttp://cdn.wallpapersafari.com/31/30/JMlaV5.jpg\nhttp://assets.bauer-wolke.co.uk/imagegen/p/152/114/s3/digital-cougar-assets-uk/MomoAds/2016/09/23/105946/1.JPG\nhttp://skyryedesign.com/wp-content/uploads/2016/01/The-Best-Vintage-Car-Wallpapers-22-Best-Vintage-Car-wv-aston-martin-ferarri.jpg'
		// $scope.urlList = 'http://www.iosonosempreio.com/labs/img_c.jpg\nhttp://www.iosonosempreio.com/labs/img.jpg\nhttp://wallpoper.com/images/00/33/25/75/cars-classic_00332575.jpg\nhttp://www.iloveindia.com/cars/pics/vintage-cars.jpg'
	}

	$scope.fetchColors = function(){
		
		// http://131.175.56.235:8080/single?img=http://stephenplusplus.github.io/yeoman.io/assets/img/yeoman-logo.png&k=5
		$scope.listToParse = $scope.urlList.split('\n')

		$scope.parsedImages = []
		$scope.errors = 0;

		var position = 0;
		$scope.recursiveFetch(position)
	}

	$scope.recursiveFetch = function(position){
		if(position < $scope.listToParse.length){

			var imageAddress = $scope.listToParse[position]
			var url = imageAddress
			var i = position

			var callString = $scope.backendAddress+"/single?img="+imageAddress+"&k=5"

			$http.get(callString)
				.then(function(response){
					response.data.id = i
					response.data.parsed = true
					$scope.parsedImages.push(response.data)
					$scope.parsedImages.sort(function(a,b) { return a.id - b.id; })
					if($scope.parsedImages.length > 0 && $scope.showElements.download == false) {
						$scope.showElements.download = true
						$scope.showElements.go = false
					}
					// the function calls itself here in order to not process multiple asyncronous calls at the same time
					// this is because the server fail to process some images due to the large number of simultaneous operations
					position++;
					$scope.recursiveFetch(position)
				}, function(error){
					console.log('error for the no. '+(1*position+1)+': ', url, '\n', callString)
					$scope.errors++
					error.config.id = i
					error.config.parsed = false
					error.config.apiCall = error.config.url
					error.config.url = url
					$scope.parsedImages.push(error.config)
					$scope.parsedImages.sort(function(a,b) { return a.id - b.id; })
					// the function calls itself here in order to not process multiple asyncronous calls at the same time
					// this is because the server fail to process some images due to the large number of simultaneous operations
					position++;
					$scope.recursiveFetch(position)
				});	
		} else {
			console.log('All tried. Errors: ', $scope.errors)
			if($scope.errors > 0){
				$scope.showElements.retry = true
			}
		}
	}

	$scope.retryErrors = function() {
		var position=0;
		$scope.fetchOnlyErrors(position)
	}

	$scope.fetchOnlyErrors = function(position){
		$scope.showElements.retry = false
		if(position < $scope.parsedImages.length) {
			
			//retry only imaged that have not been parsed before
			if($scope.parsedImages[position].parsed == false){ 

				// From now is similar to the former function, with some differences in the storing of the data
				var url = $scope.parsedImages[position].url
				var i = position

				var callString = $scope.backendAddress+":/single?img="+url+"&k=5"
				$http.get(callString)
					.then(function(response){
						
						response.data.id = i
						response.data.parsed = true

						// replace the corresponding object with the new data
						$scope.parsedImages[position] = response.data
						
						// If one of the failed is now successful cancel an error
						$scope.errors--

						// the function calls itself here in order to not process multiple asyncronous calls at the same time
						// this is because the server fail to process some images due to the large number of simultaneous operations
						position++;
						$scope.fetchOnlyErrors(position);
					}, function(error){
						// Do not do anything else and leave the object as it is

						console.log('error for the no. '+(1*position+1)+': ', url, '\n', callString)
						
						// the function calls itself here in order to not process multiple asyncronous calls at the same time
						// this is because the server fail to process some images due to the large number of simultaneous operations
						position++;
						$scope.fetchOnlyErrors(position);
					});	
			} else {
				// if the parsed value is false, do the following and go on with the cycle
				position++;
				$scope.fetchOnlyErrors(position);
			}
		} else {
			console.log('All tried. Errors: ', $scope.errors)
			if($scope.errors > 0){
				$scope.showElements.retry = true
			} else {
				$scope.showElements.retry = false
			}
		}
	}

	$scope.getSVG = function(){
	    document.getElementById("chart").innerHTML = "";

	    var size = 100;
	    var rowsLenght = 8;
	    var imgPadding = 30;
	    var margin = {'top':10, 'right':10,'bottom':10,'left':10};
	    var height = (size+imgPadding) * Math.ceil($scope.parsedImages.length/rowsLenght);
	    var width = (size+imgPadding)*rowsLenght;

	    var chart = d3.select(".chart")
	      .attr("width", width)
	      .attr("height", height);

	    var data = _.cloneDeep($scope.parsedImages)

	    data = data.filter(function(img){
	    	return img.parsed == true;
	    })

	    var flag = chart.selectAll("g")
	        .data(data)
	      .enter().append("g")
	        .attr("transform", function(d, i) {
	            //Organize results in rows composed by "rowsLenght" elements
	            return "translate(" + (i%rowsLenght)*(size+imgPadding) + "," + Math.floor(i/rowsLenght) * (size+imgPadding) + ")";
	        })
	          .each(function(e,j){
	            d3.select(this).selectAll('rect')
	               .data(function (d, i) { return d.clusters; })
	             .enter().append('rect')
	               .attr("x", function(d, i) { return d.totperc } )
	               .attr("y", 0)
	               .attr("height", size)
	               .attr("width", function(d,i) { return d.perc })
	               .attr("fill", function(d) { return 'rgb('+ d.rgb[0] +','+ d.rgb[1] +','+ d.rgb[2] +')' })

	            d3.select(this).append("a")
	              .attr("xlink:href", function(d) { return d.url; })
	              .attr("target", "_blank")
	              .append("text")
	                .attr("x", size/2)
	                .attr("y", size+(imgPadding*0.6))
	                .attr("text-anchor", "middle")
	                .text(function(d) { return "id: " + d.id})

	           })

	    var svgToSave = document.getElementById("svg-container").innerHTML;
	    var blob = new Blob([svgToSave], { type: 'data:image/svg+xml;charset=utf-8' });
	    saveAs(blob, $scope.prjName + '-viz.svg');
	}

	$scope.getTSV = function() {
	    console.log('getTSV')

	    var csvtxt = 'id\turl\tparsed\twidth\theight\tcolorName\tpercentage\thexadecimal\n'

	    function componentToHex(c) {
		    var hex = c.toString(16);
		    return hex.length == 1 ? "0" + hex : hex;
		}

		function rgbToHex(r, g, b) {
		    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
		}

	    $scope.parsedImages.forEach(function(img){
	    	if (img.parsed) {
	    		img.clusters.forEach(function(cluster){
	    			var hexString = rgbToHex(cluster.rgb[0],cluster.rgb[1],cluster.rgb[2])
	    			csvtxt+=img.id + '\t' + img.url + '\t' + img.parsed + '\t' + img.size.width + '\t' + img.size.height +'\t'+ cluster.label +'\t'+ cluster.perc +'\t'+ hexString.toUpperCase() +'\n'
	    		})
	    	} else {
	    		csvtxt+=img.id + '\t' + img.url + '\t' + img.parsed + '\t\t\t\t\t\n'
	    	}
	    })

	    var blob = new Blob([csvtxt], { type: 'data:text/csv;charset=utf-8' });
	    saveAs(blob, $scope.prjName + '-data.tsv');

	}
    
  });
