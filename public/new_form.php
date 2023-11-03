<div id="stepForm">

    <div id="stepZero" class="step active">
        <h5 class="step-number">01.</h5>
        <h5 class="step-title">Strømstøtte (kompensasjonsordningen)</h5>
        <div class="radio-h">
            <input class="h-new" type="radio" id="gov1" name="GovSupport" value="1">
            <label for="gov1">
                <div class="image-container">
                    <img src="https://elkosmart.elko.no/hubfs/cabin2%5B43%5D.png" alt="Hytte">
                </div><b>Primærbolig</b> (inklusiv strømstøtte)
            </label><br>
            <input class="h-new" type="radio" id="gov2" name="GovSupport" value="2">
            <label for="gov2">
                <div class="image-container">
                    <img src="https://elkosmart.elko.no/hubfs/cabin2%5B43%5D.png" alt="Hytte">
                </div><b>Fritidsbolig</b> (eksklusiv strømstøtte)
            </label><br>
        </div>
        <div class="error-notice" id="error-gov">Feil: Vi trenger denne informasjonen til beregningen av dine
            besparelser.
        </div>
        <h5 class="step-number">02.</h5>
        <h5 class="step-title">Velg prisområde</h5>
        <div class="radio-h">
            <input type="radio" id="regionRadio01" name="RegionRadio" value="0">
            <label for="regionRadio01">Øst</label><br>
            <input type="radio" id="regionRadio02" name="RegionRadio" value="1">
            <label for="regionRadio02">Sør</label><br>
            <input type="radio" id="regionRadio03" name="RegionRadio" value="2">
            <label for="regionRadio03">Midt</label><br>
            <input type="radio" id="regionRadio04" name="RegionRadio" value="3">
            <label for="regionRadio04">Nord</label><br>
            <input type="radio" id="regionRadio05" name="RegionRadio" value="4">
            <label for="regionRadio05">Vest</label><br>
        </div>
        <div class="error-notice" id="error-map">Feil: Du har ikke valgt prisområde
        </div>
        <div class="button-space"><a href="#stepForm"><button class="button-continue" id="newZeroButton">Neste</button>
        </div></a>
        <div class="progress">
            <div class="bar">
                <div class="indicator"></div>
            </div>
            <div class="progress-text">0%</div>
        </div>
    </div>

    <div id="stepOne" class="step">

        <h5 class="step-number">03.</h5>
        <h5 class="step-title">Nettselskap</h5>
        <radio id="gridCompanySelect">
        </radio>
        <div class="button-space">
            <a href="#stepForm"><button class="back-button">Tilbake</button></a>
            <a href="#stepForm"><button class="button-continue" id="newOneButton">Neste</button></a>
        </div>
        <div class="progress" id="map-progress">
            <div class="bar">
                <div class="indicator p20"></div>
            </div>
            <div class="progress-text">20%</div>
        </div>


    </div>

    <div id="stepTwo" class="step">


        <div class="error-notice" id="error-grid">Vennligst velg nettleverandør!
        </div>
        <div class="button-space"><a href="#stepForm"><button class="back-button">Tilbake</button></a>
            <a href="#stepForm"><button class="button-continue" id="newTwoButton">Neste</button></a>
        </div>
        <div class="progress" id="providers-progress">
            <div class="bar">
                <div class="indicator p40"></div>
            </div>
            <div class="progress-text">40%</div>
        </div>

    </div>

    <div id="stepThree" class="step">
        <h5 class="step-number">04.</h5>
        <h5 class="step-title">Årlig strømforbruk</h5>
        <p class="step-description">For mest nøyaktig kalkulering skriv inn ditt årlige strømforbruk (kWh) eller bruk
            størrelsen på boligen din dersom du er usikker på forbruket. Vi vil da estimere forbruket ditt og beregner
            122 kWh per kvadratmeter basert på gjennomsnittstall fra SSB.</p>

        <div class="input-space">
            <input class="inp" id="squareMeters" type="number" step="1" min="20" max="500" placeholder="Kvadratmeter">
            <label for="squareMeters" class="inputs-sqm-kwh">m2</label>
        </div>
        <div class="input-space" id="wattHoursSpace">
            <input class="inp" id="wattHours" type="number" step="10" min="2440" max="61000"
                placeholder="Årlig strømforbruk">
            <label for="wattHours" class="inputs-sqm-kwh">kWh</label>
        </div>

        <div class="error-notice" id="error-sqm">Feil: Størrelsen er ikke innenfor grenseverdiene til kalkulatoren
        </div>

        <div class="button-space"><a href="#stepForm"><button class="back-button">Tilbake</button></a>
            <a href="#stepForm"><button class="button-continue" id="stepThreeButton">Neste</button></a>
        </div>

        <div class="progress">
            <div class="bar">
                <div class="indicator p60"></div>
            </div>
            <div class="progress-text">60%</div>
        </div>

    </div>

    <div id="stepFour" class="step">
        <h5 class="step-number">05.</h5>
        <h5 class="step-title">Antall elbilladere</h5>
        <p class="step-description">Hvor mange elbilladere har du eller planlegger du å ha? Elbilladere er en viktig
            komponent å styre smart for å oppnå god effektbalansering og dermed lavere nettleiekostnader.</p>
        <input type="radio" id="ev0" name="EVamt" value="0">
        <label for="ev0">0</label><br>
        <input type="radio" id="ev1" name="EVamt" value="1">
        <label for="ev1">1</label><br>
        <input type="radio" id="ev2" name="EVamt" value="2">
        <label for="ev2">2</label><br>
        <input type="radio" id="ev3" name="EVamt" value="3">
        <label for="ev3">3</label><br>
        <div class="error-notice" id="error-ev">Vennligst fyll inn antall elbilladere!
        </div>
        <div class="button-space"><a href="#stepForm"><button class="back-button">Tilbake</button></a>
            <button class="button-continue" id="stepFourButton">Neste</button>
        </div>
        <div class="progress">
            <div class="bar">
                <div class="indicator p80"></div>
            </div>
            <div class="progress-text">80%</div>
        </div>
    </div>

    <div id="stepFive" class="step">
        <a class="last-step">Regn ut besparelse én gang til</a><span style="margin:0px 8px;"> </span><a
            class="modal-trigger" href="#disclaimer-open">Kalkulator detaljer</a>
    </div>

</div>

</div>