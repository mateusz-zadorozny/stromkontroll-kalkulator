(function ($) {
	'use strict';

	// api values + current step number

	var houseTypeSavings = []; // table with grid provider data
	var regionShares = []; // data of region price difference
	var currentStep = 0; //start with zero step

	//global vars

	var govSupported;
	var houseType;
	var currentGridCompany;
	var currentRegion;
	var evQuant;
	var providersLength; // for counting average values

	// read from radio inputs

	function getRadioValue(theRadioGroup) {
		var elements = document.getElementsByName(theRadioGroup);
		for (var i = 0, l = elements.length; i < l; i++) {
			if (elements[i].checked) {
				return elements[i].value;
			}
		}
	}

	$(window).load(function () {
		// Find all .step elements inside #stepForm and store them
		window.steps = document.querySelectorAll('#stepForm .step');
	});

	function showStep(stepIndex) {
		// Remove 'active' class from all steps
		window.steps.forEach(function (step, index) {
			step.classList.remove('active');
		});

		// Add 'active' class to the current step
		if (window.steps[stepIndex] != null) {
			window.steps[stepIndex].classList.add('active');
		} else {
			console.error('Step ' + stepIndex + ' does not exist.');
		}
	}


	function resetToFirstStep() {
		showStep(0); // Show the first step
	}

	function nextStep() {
		// Find the currently active step
		var currentStepIndex = Array.from(window.steps).findIndex(function (step) {
			return step.classList.contains('active');
		});
		console.log('Current step index:', currentStepIndex); // Log the current index

		// If there is a next step, show it
		if (currentStepIndex >= 0 && currentStepIndex < window.steps.length - 1) {
			showStep(currentStepIndex + 1);
		} else {
			console.log('No next step found or already at the last step');
		}
	}

	function previousStep() {
		// Find the currently active step
		var currentStepIndex = Array.from(window.steps).findIndex(function (step) {
			return step.classList.contains('active');
		});

		// If there is a previous step, show it
		if (currentStepIndex > 0) {
			showStep(currentStepIndex - 1);
		}
	}

	// go back one step - same for every step

	$(function () {
		jQuery(".back-button").click(function () {
			/*--currentStep;
			showStep(currentStep);*/
			previousStep();
		});
	});

	// Global fields verification
	// selection of GovSupport
	function checkGovSupport() {
		console.log("Checking Goverment Support selection ...");
		govSupported = getRadioValue("GovSupport");
		if (typeof govSupported === "undefined") {
			document.getElementById("error-gov").classList.add("error-visible");
			console.warn("No goverment support picked! ", govSupported);
			return (false);
		} else {
			document.getElementById("error-gov").classList.remove("error-visible");
			console.log("Goverment support:", govSupported, "(1 - with support, 2 - without support)");
			return (true);
		}
	}
	// selection of Region
	function checkRegionSelection() {
		console.log("Checking region selection ...");
		if (document.getElementById("newZeroButton") !== null) {
			console.log("New form is active - #newZeroButton is present");
			currentRegion = parseInt(getRadioValue("RegionRadio"), 10);
		}

		if (!isNaN(currentRegion) && currentRegion < 5) {
			console.log("Currently selected region ID:", currentRegion);
			document.getElementById("error-map").classList.remove("error-visible");
			// hide error notice
			resetRadioClasses(); // reset classes on radio element
			window.radioProvidersList.classList.add(`NO${currentRegion + 1}`);
			// add region picked class to radio element, to hide providers not active in picked region
			return true;
		} else {
			console.warn("No region selected.")
			document.getElementById("error-map").classList.add("error-visible");
			return false;
		}
	}
	// selection of Provider
	function checkProviderSelection() {
		console.log("Checking provider selection ...");
		currentGridCompany = getRadioValue("gridCompanySelect");

		if (typeof currentGridCompany === "undefined") {
			document.getElementById("error-grid").classList.add("error-visible");
			return false;
		}

		if (typeof currentGridCompany === "string") {
			document.getElementById("error-grid").classList.remove("error-visible");
			return true;
		}
	}
	// input of SQM
	function checkHouseSQM() {
		console.log("Checking SQM value ...");
		window.squareMeters = document.getElementById("squareMeters").value;
		if (window.squareMeters >= 10 && window.squareMeters <= 5000) {
			document.getElementById("error-sqm").classList.remove("error-visible");
			houseType = determineHouseType(window.squareMeters);
			console.log("House SQM value:", window.squareMeters, ", House type:", houseType);
			return true;
		} else {
			document.getElementById("error-sqm").classList.add("error-visible");
			console.warn("Wrong SQM value or none.");
			return false;
		}
	}
	// choice of EVSE as last step
	function checkEVSE() {
		console.log("Checking EVSE pick ...");
		evQuant = getRadioValue("EVamt"); // read from EVSE radio

		if (typeof evQuant === "undefined") {
			document.getElementById("error-ev").classList.add("error-visible");
			return false;
		} else {
			document.getElementById("error-ev").classList.remove("error-visible");
			return true;
		}
	}
	// make calculation
	function calculateEverything() {

		const stepSavings = houseTypeSavings[currentGridCompany][houseType]; // dividing change from 18.11.2022 moved to step calculation part
		console.log("%cStep savings from lower step tariffs: " + stepSavings, "background-color: lightgreen;");

		calculateSave(
			calculateYearlyConsupmtion(window.squareMeters), //calculate yearly consumption from sqm estimation
			evQuant,
			stepSavings, //pick value from steps data of providers
			currentGridCompany
		);
	}
	// FigPii custom funtion
	function FigPiiConversion(event) {
		window._fpEvent = window._fpEvent || [];
		window._fpEvent.push(["eventConversion", { value: event }]); // FigPii conversion
	}

	// NEWFORM: Step 0: GOV+REGION
	$(function () {
		jQuery("#newZeroButton").click(function () {
			console.log("Going to next step ...");
			if (checkGovSupport() && checkRegionSelection()) {
				// was true
				console.log("Data picked. Showing next step.");
				nextStep();
				// send calculationsStart to FigPii
				FigPiiConversion("calculationsStart");
			} else {
				console.warn("Can't proceed to next step.");
			}

		});
	});
	// NEWFORM: Step 1: PROVIDER
	$(function () {
		jQuery("#newOneButton").click(function () {
			console.log("Going to next step ...");
			if (checkProviderSelection()) {
				console.log("Data picked. Showing next step.");
				nextStep();
			} else {
				console.warn("Can't proceed to next step.");
			}
		});
	});
	// NEWFORM: Step 2: HOUSE SQM + EVSE
	$(function () {
		jQuery("#newTwoButton").click(function () {
			console.log("Going to next step ...");
			if (checkHouseSQM() && checkEVSE()) {
				console.log("Data picked. Showing next step.");
				// calculate the results
				calculateEverything();
				// show next step
				nextStep();
				// send FigPii event
				FigPiiConversion("calculateSave");
			} else {
				console.warn("Can't proceed to next step.");
			}
		});
	});

	// step 0 - gov question step for old form

	$(function () {
		jQuery("#stepZeroButton").click(function () {

			if (checkGovSupport()) {
				// was true
				currentStep = 1;
				showStep(currentStep);
				// send calculationsStart to FigPii
				window._fpEvent = window._fpEvent || [];
				window._fpEvent.push(["eventConversion", { value: "calculationsStart" }]);
			} else {
				console.warn("No choice on Goverment support");
			}

		});
	});

	// go back one step - same for every step


	$(function () {
		jQuery(".last-step").click(function () {
			resetToFirstStep();
			resultsElementsVisible(false);
		});
	});

	// show & hide bluetop row & results row

	function resultsElementsVisible(state) {

		// get blue box & lower results row

		const blueTop = document.getElementById("bluetop");
		const resultsRow = document.getElementById("resultsrow");

		if (state) {
			blueTop.classList.add("active");
			resultsRow.classList.add("active");
			setTimeout(function () {
				blueTop.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
			}, 100);
		} else {
			blueTop.classList.remove("active");
			resultsRow.classList.remove("active");
		}

	}

	// step one - validate regions and get IDs from the map + link with radio list
	$(window).load(function () {

		window.area01 = document.getElementById("NO1");
		window.area02 = document.getElementById("NO2");
		window.area03 = document.getElementById("NO3");
		window.area04 = document.getElementById("NO4");
		window.area05 = document.getElementById("NO5");
		window.radioProvidersList = document.getElementById("gridCompanySelect");

	});

	// remove active from region, when picking another
	function resetAreas() {
		window.area01.classList.remove("active");
		window.area02.classList.remove("active");
		window.area03.classList.remove("active");
		window.area04.classList.remove("active");
		window.area05.classList.remove("active");
	}

	// remove region classes before adding picked class
	function resetRadioClasses() {
		window.radioProvidersList.classList.remove("NO1");
		window.radioProvidersList.classList.remove("NO2");
		window.radioProvidersList.classList.remove("NO3");
		window.radioProvidersList.classList.remove("NO4");
		window.radioProvidersList.classList.remove("NO5");
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

		document.getElementById("map-progress").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
		// scroll to visible progress bar function 

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
			console.log("Going to next step ...");
			if (checkRegionSelection()) {
				// was selected
				nextStep();
			} else {
				console.warn("No region selected.");
				// no region selected
			}
		});
	});

	// scroll after picking the provider to make sure buttons are visible
	$(function () {

		$('#gridCompanySelect').change(function () {
			if ($(window).width() < 768) {
				document.getElementById("providers-progress").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
				// scroll to visible progress bar function
			}
		});
	});

	// validate second step
	$(function () {
		jQuery("#stepTwoButton").click(function () {
			console.log("Going to next step ...");
			currentGridCompany = getRadioValue("gridCompanySelect");
			if (checkProviderSelection()) {
				console.log("Showing next step ...");
				nextStep();
			} else {
				console.warn("Can't proceed to next step.")
			}
		});
	});

	// validate third step // squareMeters
	//var squareMeters;

	$(function () {

		jQuery("#stepThreeButton").click(function () {
			window.squareMeters = document.getElementById("squareMeters").value;
			if (checkHouseSQM()) {
				console.log("Showing next step...")
				nextStep();
			} else {
				console.warn("Error validating step 3.")
			}
		});
	});

	// sync sqm & consumption fields

	$(function () {
		$("#squareMeters").on("input", function () {
			$("#wattHours").val($("#squareMeters").val() * 122);
		});
		$("#wattHours").on("input", function () {
			$("#squareMeters").val(Math.round($("#wattHours").val() / 122));
		});
	});

	// validate last step & calculate the save
	$(function () {

		jQuery("#stepFourButton").click(function () {
			evQuant = getRadioValue("EVamt");

			if (checkEVSE()) {
				// calculate the results
				calculateEverything();
				// show next step
				nextStep();
				// send FigPii event
				FigPiiConversion("calculateSave");
			} else {
				console.warn("No ESVE field picked.");
			}
		});
	});

	// get estimated yearl consumption based on sqm

	function calculateYearlyConsupmtion(sqm) {

		return sqm * 122;
	}

	// depending on the sqm set the house type

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

		// set VAT

		const vat = 1;

		// EV
		const carChargingPerYear = 2440; //kWh
		console.log("Car - region share %: " + regionShares[region][1]);


		var carSave = Math.round(vat * (carChargingPerYear * evs * regionShares[region][1]));

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


		heatingSave = Math.round(vat * (heatingSave * regionShares[region][0] * yearlyKWh * movableHeatingShare));
		console.log("Heating (region): " + heatingSave);

		// Boiler
		const boilerConsupmtionShare = 0.2;
		const movableBoilerShare = 1;
		var boilerSave = Math.round(vat * (boilerConsupmtionShare * movableBoilerShare * regionShares[region][2] * yearlyKWh));
		console.log("Boiler (region): " + boilerSave);

		// return an array from region saves: car, heating, boiler

		return [carSave + heatingSave + boilerSave, carSave, heatingSave, boilerSave]; // return savings based on daily prices algorythm
	}

	function calculateSave(yc, ev, hs, gr) {

		let stepResults = calculateFromStepReductionData(
			yc,
			ev,
			hs,
			gr);

		let regionResults = calculateFromRegionData(
			currentRegion,
			yc,
			houseType,
			ev);

		console.log("Total save: " + stepResults[0] + regionResults[0]);

		showResults(stepResults, regionResults, yc, ev, currentRegion);

		valueSave(
			regionShares[currentRegion][4],
			houseTypeSavings[gr][4],
			ev,
			window.squareMeters,
			stepResults[0] + regionResults[0]); // total

	}

	// grid saving function

	function calculateFromStepReductionData(yc, ev, hs, gr) {

		// set VAT & divide by 2 as agreed on 18.11 // no division as 6.10.2023 - VAT included in price

		const vat = 1;

		/* Grid fee cost reduction, EV charging	*/
		const carChargingPerYear = 2440;
		const movableShareOfCharging = 0.5;
		var evMovedToNight = carChargingPerYear * movableShareOfCharging * ev;
		var evSavings =
			vat * ((evMovedToNight * (houseTypeSavings[gr][5] - houseTypeSavings[gr][6])) /
				100);

		console.log("%cEVSE step saves: " + evSavings, "background-color: lightgreen;");

		/* Grid fee cost reduction, Water boiler */

		var boilerShare = 0.2;
		var boilerMovableShare = 0.5;
		var boilerMovedToNight = boilerShare * boilerMovableShare * yc;
		var boilerSavings =
			vat * ((boilerMovedToNight * ((houseTypeSavings[gr][5] - houseTypeSavings[gr][6])) /
				100));

		console.log("%cBoiler step saves: " + boilerSavings, "background-color: lightgreen;");


		/* Grid fee cost reduction, Heating */

		var heatingShare = 0.55;
		var heatingMovableShare = 0.1;
		var heatingMovedToNight = heatingShare * heatingMovableShare * yc;
		var heatingSavings = vat * ((heatingMovedToNight *
			(houseTypeSavings[gr][5] - houseTypeSavings[gr][6])) /
			100);
		console.log("%cHeating step saves: " + heatingSavings, "background-color: lightgreen;");

		console.log("%cStep reductions with VAT: " + vat * hs, "background-color: lightgreen;");

		let totalSave = [
			Math.round(evSavings + heatingSavings + boilerSavings + hs * vat),
			Math.round(hs * vat),
			Math.round(evSavings),
			Math.round(heatingSavings),
			Math.round(boilerSavings),
		]
		console.log(totalSave);

		return totalSave
	}

	// show the results

	function showResults(
		gridSaves,
		regionResults,
		yearlyConsumption,
		evse,
		regionSelected
	) {
		// get respective elements
		const totalDisplay = document.getElementById("bluetop-sum");
		//const supportText = document.getElementById("support-text");
		const gridDisplay = document.getElementById("nett-save");
		const carDisplay = document.getElementById("ev-save");
		const heatingDisplay = document.getElementById("opp-save");
		const boilerDisplay = document.getElementById("vvb-save");

		let total;
		let regionHeating = regionResults[2];
		let regionBoiler = regionResults[3];
		let regionCar = regionResults[1];
		let supportAmmount;

		if (govSupported == 1) { // we adjust calculations to gov support and show custom text
			supportAmmount = calculateGovermentSupport(yearlyConsumption, evse, regionSelected);
			//supportText.innerText = 'Includes adjusted GOV support difference of ' + Math.round(supportAmmount[0] - supportAmmount[1]) + 'NOK';
			total = Math.round(gridSaves[0] + regionResults[0] - supportAmmount[0]);
			regionHeating = Math.round(regionHeating - supportAmmount[1]);
			regionBoiler = Math.round(regionBoiler - supportAmmount[2]);
			regionCar = Math.round(regionCar - supportAmmount[3]);
		} else { // if 2 then we ignore all gov support
			total = Math.round(gridSaves[0] + regionResults[0]);
			//supportText.innerText = '';
		}


		// change the inner values

		totalDisplay.innerText = total;
		gridDisplay.innerText = gridSaves[0];
		carDisplay.innerText = regionCar;
		heatingDisplay.innerText = regionHeating;
		boilerDisplay.innerText = regionBoiler;

		resultsElementsVisible(true);

		if (document.getElementById("contact-form") != null) {
			document.getElementById("contact-form").style.display = "block"; //show contact form div
		}

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

		/*if (typeof document.getElementsByClassName("fluentform") != "undefined") {

			if (typeof document.getElementsByName("userRegion") != "undefined") {
				document.getElementsByName("userRegion")[0].value = userRegion;
			} //names for hidden fields
			document.getElementsByName("gp")[0].value = passGridProvider;
			document.getElementsByName("evs")[0].value = passEVs;
			document.getElementsByName("sqm")[0].value = passSqm;
			document.getElementsByName("ts")[0].value = Math.round(passSaves);

		}*/

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
	}

	// CALCULATE GOV SUPPORT

	function calculateGovermentSupport(yearlyWatts, evChargers, regionSelected) {

		// calculate gov support without Futurehome (bigger)
		let fullGovHeatingSupport = yearlyWatts * 0.55 * regionShares[regionSelected][5];
		let fullGovBoilerSupport = yearlyWatts * 0.2 * regionShares[regionSelected][7];
		let fullGovEVSESupport = evChargers * 2440 * regionShares[regionSelected][9];
		// calculate adjusted gov support with Futurome (smaller due to lower energy consupmtion)
		let fhHeatingSupport = yearlyWatts * 0.55 * regionShares[regionSelected][6];
		let fhBoilerSupport = yearlyWatts * 0.2 * regionShares[regionSelected][8];
		let fhEVSESupport = evChargers * 2440 * regionShares[regionSelected][10];

		let fullGovSupport = fullGovHeatingSupport + fullGovBoilerSupport + fullGovEVSESupport;
		let fhSupportTotal = fhHeatingSupport + fhBoilerSupport + fhEVSESupport;
		let fullDifference = fullGovSupport - fhSupportTotal;
		let heatingDifference = fullGovHeatingSupport - fhHeatingSupport;
		let boilerDifference = fullGovBoilerSupport - fhBoilerSupport;
		let evseDifference = fullGovEVSESupport - fhEVSESupport;
		console.warn("Full support: ", fullGovSupport);
		console.warn("Adjusted support: ", fhSupportTotal);

		return [fullDifference, heatingDifference, boilerDifference, evseDifference];

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
				console.log("Providers VVV");
				console.log(providers);
				providersLength = 0;
				jQuery.each(providers, function (i, provider) {

					houseTypeSavings[i] = [
						parseInt(providers[i].meta_box?.step_reductions_app),
						parseInt(providers[i].meta_box?.step_reductions_townhouse),
						parseInt(providers[i].meta_box?.step_reductions_house),
						i,
						providers[i].title?.rendered,
						parseFloat(providers[i].meta_box?.day_tariff),
						parseFloat(providers[i].meta_box?.night_tariff),
						providers[i].meta_box?.hidden_in_regions // add hidden regions as array
					];
					++providersLength;

					let hiddenClass = "";

					for (let x = 0; x < houseTypeSavings[i][7].length; x++) {
						hiddenClass += houseTypeSavings[i][7][x] + " ";
					}

					$providers.append(
						'<div class="' +
						hiddenClass +
						'provider"><input type="radio" id=' +
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
				const annetElementNO1 = `<div class="provider NO2 NO3 NO4 NO5"><input type="radio" id="Annet01" name="gridCompanySelect" value="${providersLength}"><label for="Annet01">Gjennomsnitt nettselskap Østlandet</label><br></div>`;
				const annetElementNO2 = `<div class="provider NO1 NO3 NO4 NO5"><input type="radio" id="Annet02" name="gridCompanySelect" value="${providersLength + 1}"><label for="Annet02">Gjennomsnitt nettselskap Sørlandet</label><br></div>`;
				const annetElementNO3 = `<div class="provider NO1 NO2 NO4 NO5"><input type="radio" id="Annet03" name="gridCompanySelect" value="${providersLength + 2}"><label for="Annet03">Gjennomsnitt nettselskap Midt-Norge</label><br></div>`;
				const annetElementNO4 = `<div class="provider NO1 NO2 NO3 NO5"><input type="radio" id="Annet04" name="gridCompanySelect" value="${providersLength + 3}"><label for="Annet04">Gjennomsnitt nettselskap Nord-Norge</label><br></div>`;
				const annetElementNO5 = `<div class="provider NO1 NO2 NO3 NO4"><input type="radio" id="Annet05" name="gridCompanySelect" value="${providersLength + 4}"><label for="Annet05">Gjennomsnitt nettselskap Vestlandet</label><br></div>`;

				$providers.append(annetElementNO1);
				$providers.append(annetElementNO2);
				$providers.append(annetElementNO3);
				$providers.append(annetElementNO4);
				$providers.append(annetElementNO5);

				// run for each region separate average

				for (let x = 0; x < 5; x++) {

					var totalApp = 0;
					var totalTH = 0;
					var totalHouse = 0;
					var avDay = 0;
					var avNight = 0;
					var providersInRegion = 0;

					for (let i = 0; i < providersLength; i++) {

						let stringHideID = `NO${x + 1}`;

						if (houseTypeSavings[i][7].includes(stringHideID)) {
							//console.log("x = ", x, "| i = ", i, " - the operator is hidden");
						} else {
							totalApp += houseTypeSavings[i][0];
							totalTH += houseTypeSavings[i][1];
							totalHouse += houseTypeSavings[i][2];
							avDay += houseTypeSavings[i][5];
							avNight += houseTypeSavings[i][6];
							providersInRegion++;
						}
					}

					houseTypeSavings[providersLength + x] = [
						0,
						0,
						0,
						providersLength + x,
						`Annet NO${x + 1}`,
						0,
						0
					];
					houseTypeSavings[providersLength + x][0] = Math.round(totalApp / providersInRegion);
					houseTypeSavings[providersLength + x][1] = Math.round(totalTH / providersInRegion);
					houseTypeSavings[providersLength + x][2] = Math.round(totalHouse / providersInRegion);
					houseTypeSavings[providersLength + x][5] = Math.round(avDay / providersInRegion);
					houseTypeSavings[providersLength + x][6] = Math.round(avNight / providersInRegion);
				}

				console.log(houseTypeSavings);
				//document.getElementById("gridCompanyNumber").innerHTML = providersLength; //change displayed number with results

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
						regions[i].title?.rendered,
						parseFloat(regions[i].meta_box?.gov_support_heating),
						parseFloat(regions[i].meta_box?.gov_support_heating_with_FH),
						parseFloat(regions[i].meta_box?.support_boiler),
						parseFloat(regions[i].meta_box?.support_boiler_with_fh),
						parseFloat(regions[i].meta_box?.support_evse),
						parseFloat(regions[i].meta_box?.support_evse_with_fh)
					]; // + tariffs

				});


			}
		});
		console.log(regionShares);

	}); //function end


})(jQuery);
