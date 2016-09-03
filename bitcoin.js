//Thanks to http://www.xe.com/symbols.php for help with some of the currency symbols

load("http.js"); //this loads the http libraries which you will need to make requests to the web server
load("sbbsdefs.js"); //loads a bunch-o-stuff that is probably beyond the understanding of mere mortals 
load(js.exec_dir + "ctrl-a_colors.js"); //predefined a whole bunch of Ctrl-A (Sync) Color Codes
var opts=load({},"modopts.js","SyncBTC"); 

if (typeof opts.chartCurrency === 'undefined') {
	var chartCurrency = 'USD'; //Default to USD if this field is left blank or does not exist in modopts.ini
} else {
	var chartCurrency = opts.chartCurrency.toUpperCase(); //otherwise, load the chosen currency
}

if (chartCurrency == "USD" || chartCurrency == "XCD" || chartCurrency == "AUD" || chartCurrency == "BSD" || chartCurrency == "BBD" || chartCurrency == "BZD" || chartCurrency == "BMD" || chartCurrency == "BND" || chartCurrency == "CAD" || chartCurrency == "KYD" || chartCurrency == "GYD" || chartCurrency == "HKD" || chartCurrency == "JMD" || chartCurrency == "LRD" || chartCurrency == "NAD" || chartCurrency == "NZD" || chartCurrency == "SGD" || chartCurrency == "SBD" || chartCurrency == "SRD" || chartCurrency == "TWD" || chartCurrency == "TTD" || chartCurrency == "BOB" || chartCurrency == "BRL" || chartCurrency == "CVE" || chartCurrency == "CLP" || chartCurrency == "COP" || chartCurrency == "DOP" || chartCurrency == "SVC" || chartCurrency == "FJD" || chartCurrency == "MXN" || chartCurrency == "NIO" || chartCurrency == "TVD" || chartCurrency == "UYU" || chartCurrency == "ZWD") {
	var currSymbol = "\044"; //CP437 dollar sign $
} else if (chartCurrency == "EUR") {
	var currSymbol = "\356"; //CP437 uppercase Epsilon to symbolize the Euro
} else if (chartCurrency == "CRC" || chartCurrency == "GHS" || chartCurrency == "") {
	var currSymbol = "\233"; //CP437 cent symbol
} else if (chartCurrency == "GBP" || chartCurrency == "EGP" || chartCurrency == "FKP" || chartCurrency == "GIP" || chartCurrency == "GGP" || chartCurrency == "IMP" || chartCurrency == "JEP" || chartCurrency == "LBP" || chartCurrency == "SHP" || chartCurrency == "SYP") {
	var currSymbol = "\234"; //CP437 pound symbol
} else if (chartCurrency == "JPY" || chartCurrency == "CNY") {
	var currSymbol = "\235"; //CP437 yen or yuan symbol
} else if (chartCurrency == "AWG" || chartCurrency == "ANG") {
	var currSymbol = "\237"; //CP437 the florin sign
} else if (chartCurrency == "GTQ") {
	var currSymbol = "Q"; //CP437 capital Q to symbolize Guatemala Quetzal
} else if (chartCurrency == "HNL") {
	var currSymbol = "L"; //CP437 capital L to symbolize Honduras Lempira
} else if (chartCurrency == "SOS") {
	var currSymbol = "S"; //CP437 capital S to symbolize Somalia Shilling
} else if (chartCurrency == "ZAR") {
	var currSymbol = "R"; //CP437 capital R to symbolize South Africa Rand
} else {
	var currSymbol = "";
}
	
function bitcoinprice() {
		var totalHeight = console.screen_rows;
		var appHeight = (console.screen_rows - 6); //minus 3 top, minus 3 bottom
		var yAxisHeight = (appHeight - 2); //minus 2 more for max/min data points
		var totalLength = console.screen_columns;
		var appLength = (console.screen_columns - 1);
		var xAxisLength = (console.screen_columns - 4); //minus 3 for numbers on left, minus 1 for border on right 
		
		if (totalHeight < 11) {
			console.clear();
			write(magenta + "\r\nYour terminal height is too few rows for this app to run. \r\nReturning you to the BBS...");
			console.aborted = false;
			exit();
		}
		
		if (totalLength < 80) {
			console.clear();
			write(magenta + "\r\nYour terminal length is too few columns for this app to run. \r\nReturning you to the BBS...");
			console.aborted = false;
			exit();
		}
		
		console.clear();
		write(magenta + "\r\nPolling Live and Historical Bitcoin Prices... Please be patient.");
		var btcHeader = blue + "\r\n  Current Exchange Rate: \r\n" + 
			darkblue + " \325\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315 " + blue + "Bitcoin Price Chart (" + chartCurrency + ")" + darkblue + " \315\315";
		var btcFooter = darkmagenta + " \324\315oldest\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\r\n" 
			+ darkmagenta + "  syncBTC:" + blue + "KenDB3  " + darkmagenta + "Data:" + blue + "Coinbase.com  " + darkmagenta + "Original Concept:" + blue + "BCR / BitSunrise.com " + darkmagenta + "\315\315\315\r\n";
		var btcFooterEnd1 = "\270";
		var btcFooterEnd2 = "\276";
		var btcxAxis = " \263";
        var reqExchangeRate = new HTTPRequest();
		var reqHistoricPriceDays = new HTTPRequest();

		var exchangeRate = reqExchangeRate.Get("https://api.coinbase.com/v2/exchange-rates?currency=BTC");
		var historicPriceDays = reqHistoricPriceDays.Get("https://api.coinbase.com/v2/prices/historic?currency="+ chartCurrency + "&days=" + xAxisLength);
		// Make sure we actually got a response. If not, log an error and exit.
		if (exchangeRate === undefined || historicPriceDays === undefined) {
			log("ERROR in coinbase.js: Request to api.coinbase.com returned 'undefined'");
			console.center("There was a problem getting data from Coinbase.com.");
			console.center("The sysop has been notified.");
			console.pause();
			exit();
		}
		// Parse the JSON responses.
		var jsonExchangeRate = JSON.parse(exchangeRate);
		var jsonHistoricPriceDays = JSON.parse(historicPriceDays);
		// Check if the JSON is properly formatted. The "data" should wrap the entire object.
		/* make some error checking at some point
		if (jsonExchangeRate.hasOwnProperty("data") ) {
			// Check if the response contains an error message. If so, log the error and exit.
			if (cu["response"].hasOwnProperty("error")) {
				var errtype = cu["response"]["error"]["type"];
				var errdesc = cu["response"]["error"]["description"];
				log("ERROR in weather.js: api.wunderground.com returned a '" + errtype + "' error with this description: '" + errdesc + "'.");
				log(LOG_DEBUG,"DEBUG for weather.js. API call looked like this at time of error: " + "http://api.wunderground.com/api/" + wungrndAPIkey + "/conditions/forecast/astronomy/alerts/" + WXlang + "q/" + wungrndQuery);
				log(LOG_DEBUG,"DEBUG for weather.js. The user.connection object looked like this at the time of error: " + user.connection);
				log(LOG_DEBUG,"DEBUG for weather.js. The dialup variable looked like this at the time of error: " + dialup);
				log(LOG_DEBUG,"DEBUG for weather.js. The language defined in /ctrl/modopts.ini is: " + opts.language);
				console.center("There was a problem getting data from Weather Underground.");
				console.center("The sysop has been notified.");
				console.pause();
				exit();
			}
		}
		*/
		var rateUSD = jsonExchangeRate.data.rates.USD; //US Dollar
		var rateCAD = jsonExchangeRate.data.rates.CAD; //Canadian Dollar
		var rateGBP = jsonExchangeRate.data.rates.GBP; //Great Britain Pound
		var rateEUR = jsonExchangeRate.data.rates.EUR; //Euro
		var rateJPY = jsonExchangeRate.data.rates.JPY; //Japanese Yen
		var rateCNY = jsonExchangeRate.data.rates.CNY; //Chinese Yuan
		var rateCHF = jsonExchangeRate.data.rates.CHF; //Swiss Franc
		var rateAUD = jsonExchangeRate.data.rates.AUD; //Australian Dollar
		var rateNZD = jsonExchangeRate.data.rates.NZD; //New Zealand Dollar
		var l = jsonHistoricPriceDays.data.prices.length; //That's a lowercase letter "L", as in length
		
		//This got messy and difficult, so creating an intermediate array to hold the data made things easier
		var Intermezzo = [];
		var j = 0;
		while (j < l) {
			var addit = jsonHistoricPriceDays.data.prices[j].price;
			Intermezzo.push(addit);
			j++;
		}
		
		//This is the real array we want, the values of the data are too high (obviously)
		//So, we are normalizing the data to make it fit on a terminal window (typically 24/25 rows, but hopefully we can make it variable)
		var btcArray = [];
		var btcMax = Math.max.apply(null, Intermezzo);
		var btcMaxWhole = Math.round(btcMax);
		if (btcMaxWhole.toString().length > 3) {
			xAxisLength = (xAxisLength - (btcMaxWhole.toString().length - 3));
		}
		var btcMin = Math.min.apply(null, Intermezzo);
		var btcMinWhole = Math.round(btcMin);
		var ratio = ((btcMaxWhole - btcMinWhole) / (appHeight - 1));
		var i = 0;
		while (i < l) {
			var normalizeData = (Intermezzo[i]/ratio) - appHeight;
			var wholeNumNormData = (Math.round(normalizeData));
			btcArray.push(wholeNumNormData);
			i++;
		}
		var normBtcMax = Math.max.apply(null, btcArray);
		var normBtcMin = Math.min.apply(null, btcArray);
		
		//Draw the header, footer, chart x and y axis, etc
		console.clear();
		//The header is going to be at least 79 characters long.
		console.gotoxy(1,1);
		console.putmsg(btcHeader);
		//If the user's terminal window is longer, we extend it
		if (appLength > 79) {
			console.gotoxy(79,3);
			write (darkblue);
			var headerExt = 78;
			while (headerExt < appLength) {
				write ("\315");
				headerExt++;
			}
		}
		console.gotoxy(1,4);
		//Write the Max value of the y-axis
		console.putmsg(blue + btcMaxWhole);
		//Draw a color coded y-axis
		var k = 0;
		var colorArray = [];
		colorArray.push(darkblue);
		while (k < (yAxisHeight + 1)) {
			console.gotoxy(1,(k + 5));
			if ((k / yAxisHeight) <= ((1/12) * 1)) {
				write(darkblue);
				colorArray.push(darkblue);
			} else if ((k / yAxisHeight) <= ((1/12) * 2)) {
				write(blue);
				colorArray.push(blue);
			} else if ((k / yAxisHeight) <= ((1/12) * 3)) {
				write(darkcyan);
				colorArray.push(darkcyan);
			} else if ((k / yAxisHeight) <= ((1/12) * 4)) {
				write(cyan);
				colorArray.push(cyan);
			} else if ((k / yAxisHeight) <= ((1/12) * 5)) {
				write(darkgreen);
				colorArray.push(darkgreen);
			} else if ((k / yAxisHeight) <= ((1/12) * 6)) {
				write(green);
				colorArray.push(green);
			} else if ((k / yAxisHeight) <= ((1/12) * 7)) {
				write(yellow);
				colorArray.push(yellow);
			} else if ((k / yAxisHeight) <= ((1/12) * 8)) {
				write(darkyellow);
				colorArray.push(darkyellow);
			} else if ((k / yAxisHeight) <= ((1/12) * 9)) {
				write(red);
				colorArray.push(red);
			} else if ((k / yAxisHeight) <= ((1/12) * 10)) {
				write(darkred);
				colorArray.push(darkred);
			} else if ((k / yAxisHeight) <= ((1/12) * 11)) {
				write(magenta);
				colorArray.push(magenta);
			} else {
				write(darkmagenta);
				colorArray.push(darkmagenta);
			}
			write(btcxAxis);
			k++;
		}
		colorArray.push(darkmagenta);
		console.gotoxy(1,(totalHeight - 3));
		//Write the Min value of the y-axis
		console.putmsg(magenta + btcMinWhole);
		console.gotoxy(1,(totalHeight - 2));
		//Write the footer, which is at least 79 characters long
		console.putmsg(btcFooter);
		//If the user's terminal window is longer, we extend it
		if (appLength > 79) {
			console.gotoxy(79,(totalHeight - 2));
			write (darkmagenta);
			var footerExt = 79;
			while (footerExt < appLength) {
				write ("\315");
				footerExt++;
			}
			write(btcFooterEnd1);
			console.gotoxy((totalLength - 9),(totalHeight - 2));
			write (darkmagenta);
			write ("newest");
		} else {
			console.gotoxy(79,(totalHeight - 2));
			write (darkmagenta);
			write(btcFooterEnd1);
			console.gotoxy((totalLength - 9),(totalHeight - 2));
			write (darkmagenta);
			write ("newest");
		}
		if (appLength > 79) {
			console.gotoxy(79,(totalHeight - 1));
			write (darkmagenta);
			var footerExt = 79;
			while (footerExt < appLength) {
				write ("\315");
				footerExt++;
			}
			write(btcFooterEnd2);
			console.gotoxy(1,(totalHeight));
		} else {
			console.gotoxy(79,(totalHeight - 1));
			write (darkmagenta);
			write(btcFooterEnd2);
			console.gotoxy(1,(totalHeight));
		}
		//this next crlf bumps everything UP one line on the terminal, and therefore affects where we put the data. 
		//trying to decide if this is good or bad or neutral
		console.crlf();
		console.gotoxy(26,1);
		//Draw current Exchange Rate at the top in USD, EUR, and GBP
		console.putmsg(darkcyan + "\044" + rateUSD + " USD/BTC" + " - \044" + rateCAD + " CAD/BTC");
		
		
		if (appLength > (59 + rateUSD.length + rateCAD.length + rateEUR.length)) {
			console.putmsg(darkcyan + " - \356" + rateEUR + " EUR/BTC");
		}
		if (appLength > (70 + rateUSD.length + rateCAD.length + rateEUR.length + rateGBP.length)) {
			console.putmsg(darkcyan + " - \234" + rateGBP + " GBP/BTC");
		}
		if (appLength > (82 + rateUSD.length + rateCAD.length + rateEUR.length + rateGBP.length + rateJPY.length)) {
			console.putmsg(darkcyan + " - \235" + rateJPY + " JPY/BTC");
		}
		if (appLength > (94 + rateUSD.length + rateCAD.length + rateEUR.length + rateGBP.length + rateJPY.length + rateCNY.length)) {
			console.putmsg(darkcyan + " - \235" + rateCNY + " CNY/BTC");
		}
		if (appLength > (108 + rateUSD.length + rateCAD.length + rateEUR.length + rateGBP.length + rateJPY.length + rateCNY.length + rateCHF.length)) {
			console.putmsg(darkcyan + " - SFr" + rateCHF + " CHF/BTC");
		}
		if (appLength > (120 + rateUSD.length + rateCAD.length + rateEUR.length + rateGBP.length + rateJPY.length + rateCNY.length + rateCHF.length + rateAUD.length)) {
			console.putmsg(darkcyan + " - \044" + rateAUD + " AUD/BTC");
		}
		if (appLength > (132 + rateUSD.length + rateCAD.length + rateEUR.length + rateGBP.length + rateJPY.length + rateCNY.length + rateCHF.length + rateAUD.length + rateNZD.length)) {
			console.putmsg(darkcyan + " - \044" + rateNZD + " NZD/BTC");
		}
		
		//Now to plot the normalized data
		//When you plot these data points they are all backwards, you need to FLIP everything
		//start plotting X from the right, because most recent data is at the front of the JSON DB data (starting from 0) 
		//Y-axis (after the flip) needs a modifier to get above the footer area, this turned out to be floating, so you need to use the normalized Bitcoin Minimum... this took me ages to figure out
		var normYAxis = 4 - normBtcMin;
		var plot = 0;
		while (plot < xAxisLength) {
			var flip = totalHeight - btcArray[plot];
			console.gotoxy((appLength - plot),(flip - normYAxis));
			var colorcode = (appHeight - (btcArray[plot] - normBtcMin + 1));
			
			write(colorArray[colorcode]);
			write("\052");
			plot++;
		}
		console.gotoxy(1,(totalHeight - 1));
}

bitcoinprice();
console.pause();
console.clear();
console.aborted = false;
exit();
