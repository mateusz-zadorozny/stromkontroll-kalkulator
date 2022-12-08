(function ($) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */


	// api values + current step number

	var houseTypeSavings = []; // table with grid provider data
	var regionShares = []; // data of region price difference
	var currentStep = 0; //start with zero step

	// jquery wp conflict

	//var $ = jQuery.noConflict();

	//global vars

	var houseType;
	var houseSavings;
	var currentGridCompany;
	var currentRegion;
	var evQuant;
	var providersLength; // for counting average values
	var totalSave;

	// read from radio inputs

	function getRadioValue(theRadioGroup) {
		var elements = document.getElementsByName(theRadioGroup);
		for (var i = 0, l = elements.length; i < l; i++) {
			if (elements[i].checked) {
				return elements[i].value;
			}
		}
	}

	// step change read the ID of step divs

	$(window).load(function () {

		window.step0 = document.getElementById("stepZero");
		window.step1 = document.getElementById("stepOne");
		window.step2 = document.getElementById("stepTwo");
		window.step3 = document.getElementById("stepThree");
		window.step4 = document.getElementById("stepFour");
		window.step5 = document.getElementById("stepFive");

	});



	function showStep(step) {
		if (step === 0) {
			window.step0.classList.add("active");
			window.step1.classList.remove("active");
		} else if (step === 1) {
			window.step0.classList.remove("active");
			window.step1.classList.add("active");
			window.step2.classList.remove("active");
			window.step5.classList.remove("active");
		} else if (step === 2) {
			window.step1.classList.remove("active");
			window.step2.classList.add("active");
			window.step3.classList.remove("active");
		} else if (step === 3) {
			window.step2.classList.remove("active");
			window.step3.classList.add("active");
			window.step4.classList.remove("active");
		} else if (step === 4) {
			window.step3.classList.remove("active");
			window.step4.classList.add("active");
			window.step5.classList.remove("active");
		} else if (step === 5) {
			window.step4.classList.remove("active");
			window.step5.classList.add("active");
		}
	}

	// go back one step - same for every step

	$(function () {
		jQuery(".back-button").click(function () {
			--currentStep;
			showStep(currentStep);
		});
	});

	// step 0 - just continue with form filling

	$(function () {
		jQuery("#stepZeroButton").click(function () {
			currentStep = 1;
			showStep(currentStep);
		});
	});

	// go back one step - same for every step


	$(function () {
		jQuery(".last-step").click(function () {
			currentStep = 1;
			showStep(currentStep);
		});
	});

	// step one - validate regions and get IDs from the map

	$(window).load(function () {

		window.area01 = document.getElementById("NO1");
		window.area02 = document.getElementById("NO2");
		window.area03 = document.getElementById("NO3");
		window.area04 = document.getElementById("NO4");
		window.area05 = document.getElementById("NO5");

	});

	// remove active from region, when picking another

	function resetAreas() {
		window.area01.classList.remove("active");
		window.area02.classList.remove("active");
		window.area03.classList.remove("active");
		window.area04.classList.remove("active");
		window.area05.classList.remove("active");
	}

	// show picked region on the map + save the selection for calculations

	function regionPicker(regionID) {
		resetAreas();
		switch (regionID) {
			case "NO1":
				currentRegion = 0;
				window.area01.classList.add("active");
				break;
			case "NO2":
				currentRegion = 1;
				window.area02.classList.add("active");
				break;
			case "NO3":
				currentRegion = 2;
				window.area03.classList.add("active");
				break;
			case "NO4":
				currentRegion = 3;
				window.area04.classList.add("active");
				break;
			case "NO5":
				currentRegion = 4;
				window.area05.classList.add("active");
				break;
		}
		console.log("Region selected: " + regionShares[currentRegion][4]);

	}

	// activate regionPicker on map clicks

	$(function () {
		jQuery(".region-link").click(function (event) {

			regionPicker(event.target.id);

		});
	})



	// validate first step

	$(function () {
		jQuery("#stepOneButton").click(function () {
			if (typeof currentRegion === "undefined") {
				document.getElementById("error-map").style.display = "block";
			} else {
				document.getElementById("error-map").style.display = "none";
				currentStep = 2;
				showStep(currentStep);
			}
		});
	})

	// validate second step

	$(function () {

		jQuery("#stepTwoButton").click(function () {
			currentGridCompany = getRadioValue("gridCompanySelect");

			if (typeof currentGridCompany === "undefined") {
				document.getElementById("error-grid").style.display = "block";
			} else {
				document.getElementById("error-grid").style.display = "none";
				//console.log("Picked: " + houseTypeSavings[currentGridCompany][houseType]);
				//console.log("HouseSavings: " + houseSavings); //calculate based on house type & grid provider - table set from api values
				currentStep = 3;
				showStep(currentStep);
			}
		});

	});

	// validate third step // squareMeters

	//var squareMeters;

	$(function () {

		jQuery("#stepThreeButton").click(function () {
			window.squareMeters = document.getElementById("squareMeters").value;
			if (window.squareMeters >= 10 && window.squareMeters <= 5000) {
				document.getElementById("error-sqm").style.display = "none";
				currentStep = 4;
				showStep(currentStep);

				houseType = determineHouseType(window.squareMeters);

			} else {
				document.getElementById("error-sqm").style.display = "block";
			}
		});
	});

	// sync sqm & consumption fields

	$(function () {

		$("#squareMeters").on("input", function () {
			$("#wattHours").val($("#squareMeters").val() * 122);
		});

		$("#wattHours").on("input", function () {
			$("#squareMeters").val($("#wattHours").val() / 122);
		});

	});

	// validate last step & calculate the save

	$(function () {

		jQuery("#stepFourButton").click(function () {
			evQuant = getRadioValue("EVamt"); //

			if (typeof evQuant === "undefined") {
				document.getElementById("error-ev").style.display = "block";
			} else {
				document.getElementById("error-ev").style.display = "none";
				//console.log("EV chargers: " + evQuant);

				//        houseSavings = houseTypeSavings[currentGridCompany][houseType];
				const stepSavings = houseTypeSavings[currentGridCompany][houseType] / 2; //change from 18.11.2022

				calculateSave(
					calculateYearlyConsupmtion(window.squareMeters), //calculate yearly consumption from sqm estimation
					evQuant,
					stepSavings, //pick value from steps data of providers
					currentGridCompany
				);

				currentStep = 5;
				showStep(currentStep);
			}
		});
	});


	function calculateYearlyConsupmtion(sqm) {

		return sqm * 122;
	}

	function determineHouseType(sqm) {

		if (sqm < 92.41) {
			return 0;
		} else if (sqm < 142.13) {
			return 1;
		} else {
			return 2;
		}
	}

	// show last step and results

	function calculateFromRegionData(region, yearlyKWh, housePicked, evs) {

		// EV
		const carChargingPerYear = 2440; //kWh
		console.log("Car - region share %: " + regionShares[region][1]);


		var carSave = carChargingPerYear * evs * regionShares[region][1];

		console.log("Car (region): " + carSave);

		console.log("House picked: ", housePicked);


		// Heating
		var heatingSave = 0;
		var movableHeatingShare = 1;
		switch (housePicked) { //share of total consumption based on house type
			case 0:
				heatingSave = 0.55;
				break;
			case 1:
				heatingSave = 0.55;
				break;
			case 2:
				heatingSave = 0.55;
				break;
		}

		console.log("Heating multiplier: " + heatingSave); console.log("Yearly kWh: ", yearlyKWh); console.log("Average price reduction: ", regionShares[region][0]);


		heatingSave = heatingSave * regionShares[region][0] * yearlyKWh * movableHeatingShare;
		console.log("Heating (region): " + heatingSave);

		// Boiler
		const boilerConsupmtionShare = 0.2;
		const movableBoilerShare = 1;
		var boilerSave = boilerConsupmtionShare * movableBoilerShare * regionShares[region][2] * yearlyKWh;
		console.log("Boiler (region): " + boilerSave);



		return carSave + heatingSave + boilerSave; // return savings based on daily prices algorythm
	}

	function calculateSave(yc, ev, hs, gr) {
		/* Grid fee cost reduction, EV charging	*/
		const carChargingPerYear = 2440;
		const movableShareOfCharging = 0.25;
		var evMovedToNight = carChargingPerYear * movableShareOfCharging * ev;
		var evSavings =
			(evMovedToNight * (houseTypeSavings[gr][5] - houseTypeSavings[gr][6])) /
			100;
		console.log("EV STEP SAVE: " + evSavings);

		/* Grid fee cost reduction, Water boiler */

		var boilerShare = 0.2;
		var boilerMovableShare = 0.25;
		var boilerMovedToNight = boilerShare * boilerMovableShare * yc;
		var boilerSavings =
			(boilerMovedToNight * (houseTypeSavings[gr][5] - houseTypeSavings[gr][6])) /
			100;

		console.log("BOILER STEP SAVE: " + boilerSavings);


		/* Grid fee cost reduction, Heating */

		var heatingShare = 0.55;
		var heatingMovableShare = 0.05;
		var heatingMovedToNight = heatingShare * heatingMovableShare * yc;
		var heatingSavings =
			(heatingMovedToNight *
				(houseTypeSavings[gr][5] - houseTypeSavings[gr][6])) /
			100;

		console.log("HEATING STEP SAVE: " + heatingSavings);


		console.log("Step reductions: ", hs);

		totalSave = 1.25 * (hs + evSavings + heatingSavings + boilerSavings) + calculateFromRegionData(
			currentRegion,
			yc,
			houseType,
			ev); // sum of all savings with VAT (25%)
		console.log("Total save (with VAT): " + totalSave);

		if (gr == providersLength) {
			// other selected
			document.getElementById("totalSaveResult").style.display = "none"; //hide save result
			document.getElementById("totalSaveResultOther").style.display = "block"; //show other save result
			document.getElementById("totalSaveResultNOKOther").innerHTML =
				"<b>" +
				Math.round(totalSave * 0.5) +
				" NOK </b>to <b>" +
				Math.round(totalSave * 1.5); //round and show save range
		} else {
			// normal grid

			document.getElementById("totalSaveResult").style.display = "block"; //show save result
			document.getElementById("totalSaveResultOther").style.display = "none"; //hide other save result
			document.getElementById("totalSaveResultNOK").textContent = Math.round(
				totalSave
			); //round and show save
		}

		valueSave(regionShares[currentRegion][4], houseTypeSavings[gr][4], ev, window.squareMeters, totalSave);

		//document.getElementById("contact-form").style.display = "block"; //show contact form div

		// BLOCK SHOW & HIDE BEFORE

		//document.getElementById("fair-to-say").style.display = "block"; //show "fair to say" div
		//document.getElementById("results-text").style.display = "none";
	}

	// pass values to fluent forms, datalayer for GTM and push custom FB event

	function valueSave(
		userRegion,
		passGridProvider,
		passEVs,
		passSqm,
		passSaves
	) {
		// change the FF values

		/*

		if (typeof document.getElementsByClassName("fluentform") != "undefined") {

			document.getElementsByName("userRegion")[0].value = userRegion; //names for hidden fields
			document.getElementsByName("gp")[0].value = passGridProvider;
			document.getElementsByName("evs")[0].value = passEVs;
			document.getElementsByName("sqm")[0].value = passSqm;
			document.getElementsByName("ts")[0].value = Math.round(passSaves);

		} */

		// we will push some datalayer, push it real good

		var sqmRounder = passSqm / 10;
		sqmRounder = Math.round(sqmRounder) * 10;

		var saveRounder = passSaves / 100;
		saveRounder = Math.round(saveRounder) * 100;

		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			event: "calculationsComplete",
			userRegion: userRegion,
			gridProvider: passGridProvider,
			evs: passEVs,
			sqm: sqmRounder,
			save: saveRounder
		});

		if (typeof fbq === "undefined") {
			console.log("Facebook Pixel not initialised");
		} else {
			fbq("trackCustom", "CalculationCompleted");
			console.log("Calculations complete");
		} // custom Facebook event
	}

	// GET THE PROVIDERS

	jQuery(document).ready(function () {
		let endpoint = "https://kalkulator.stromkontroll.no/wp-json/wp/v2/provider";
		let apiKey = "orderby=slug&order=asc&per_page=100"; //sort by abc
		var $providers = $("#gridCompanySelect");

		jQuery.ajax({
			url: endpoint + "?" + apiKey,
			contentType: "application/json",
			dataType: "json",
			type: "GET",
			success: function (providers) {
				//console.log(providers);
				providersLength = 0;
				jQuery.each(providers, function (i, provider) {
					//dayPrice[i] = providers[i].meta_box?.day_tariff;
					//nightPrice[i] = providers[i].meta_box?.night_tariff;
					houseTypeSavings[i] = [
						parseInt(providers[i].meta_box?.step_reductions_app),
						parseInt(providers[i].meta_box?.step_reductions_townhouse),
						parseInt(providers[i].meta_box?.step_reductions_house),
						i,
						providers[i].title?.rendered,
						parseFloat(providers[i].meta_box?.day_tariff),
						parseFloat(providers[i].meta_box?.night_tariff)
					]; // + tariffs
					++providersLength;

					//console.log(houseTypeSavings);

					//console.log(providers[i].id);
					$providers.append(
						'<div><input type="radio" id=' +
						i +
						' name="gridCompanySelect" value="' +
						i +
						'"><label for="' +
						i +
						'">' +
						providers[i].title?.rendered +
						"</label><br></div>"
					);
				});

				// add other average results
				const annetElement = `<div><input type="radio" id="Annet" name="gridCompanySelect" value="${providersLength}"><label for="Annet">Annet</label><br></div>`;
				$providers.append(annetElement);
				var totalApp = 0;
				var totalTH = 0;
				var totalHouse = 0;
				var avDay = 0;
				var avNight = 0;

				for (let i = 0; i < providersLength; i++) {
					totalApp += houseTypeSavings[i][0];
					totalTH += houseTypeSavings[i][1];
					totalHouse += houseTypeSavings[i][2];
					avDay += houseTypeSavings[i][5];
					avNight += houseTypeSavings[i][6];
				}

				houseTypeSavings[providersLength] = [
					0,
					0,
					0,
					providersLength,
					"Annet",
					0,
					0
				];
				houseTypeSavings[providersLength][0] = totalApp / providersLength;
				houseTypeSavings[providersLength][1] = totalTH / providersLength;
				houseTypeSavings[providersLength][2] = totalHouse / providersLength;
				houseTypeSavings[providersLength][5] = avDay / providersLength;
				houseTypeSavings[providersLength][6] = avNight / providersLength;

				console.log(houseTypeSavings);
				document.getElementById("gridCompanyNumber").innerHTML = providersLength; //change displayed number with results

			}
		});

	}); //function end


	// GET THE NO REGIONS

	jQuery(document).ready(function () {
		let endpoint = "https://kalkulator.stromkontroll.no/wp-json/wp/v2/no-region";
		let apiKey = "orderby=slug&order=asc"; //sort by abc

		jQuery.ajax({
			url: endpoint + "?" + apiKey,
			contentType: "application/json",
			dataType: "json",
			type: "GET",
			success: function (regions) {
				//console.log(regions);
				//regionsLength = 0;
				jQuery.each(regions, function (i, region) {

					regionShares[i] = [
						parseFloat(regions[i].meta_box?.heating),
						parseFloat(regions[i].meta_box?.ev),
						parseFloat(regions[i].meta_box?.boiler),
						i,
						regions[i].title?.rendered
					]; // + tariffs

				});


			}
		});
		console.log(regionShares);

	}); //function end


})(jQuery);
