load("http.js"); //this loads the http libraries which you will need to make requests to the web server
load("sbbsdefs.js"); //loads a bunch-o-stuff that is probably beyond the understanding of mere mortals 

function bitcoinprice() {
		var totalHeight = console.screen_rows;
		var appHeight = (console.screen_rows - 6); //minus 3 top, minus 3 bottom
		var yAxisHeight = (appHeight - 2); //minus 2 more for max/min data points
		var appLength = (console.screen_columns - 1);
		var xAxisLength = (console.screen_columns - 4); //minus 3 for numbers on left, minus 1 for border on right 
		var gray = "\1n\001w"; //Synchronet Ctrl-A Code for Normal White (which looks gray)
		var white = "\001w\1h"; //Synchronet Ctrl-A Code for High Intensity White
		var darkyellow = "\001n\001y"; //Synchronet Ctrl-A Code for Dark (normal) Yellow
		var yellow = "\001y\1h"; //Synchronet Ctrl-A Code for High Intensity Yellow
		var darkblue = "\001n\001b"; //Synchronet Ctrl-A Code for Dark (normal) Blue
		var blue = "\001b\1h"; //Synchronet Ctrl-A Code for High Intensity Blue
		var darkred = "\001n\001r"; //Synchronet Ctrl-A Code for Dark (normal) Red
		var red = "\001r\1h"; //Synchronet Ctrl-A Code for High Intensity Red
		var darkcyan = "\001n\001c"; //Synchronet Ctrl-A Code for Dark (normal) Cyan
		var cyan = "\001c\1h"; //Synchronet Ctrl-A Code for High Intensity Cyan
		var darkgreen = "\001n\001g"; //Synchronet Ctrl-A Code for Dark (normal) Green
		var green = "\001g\1h"; //Synchronet Ctrl-A Code for High Intensity Green
		var darkmagenta = "\001n\001m"; //Synchronet Ctrl-A Code for Dark (normal) Magenta
		var magenta = "\001m\1h"; //Synchronet Ctrl-A Code for High Intensity Magenta
		var black = "\001n\001k"; //Synchronet Ctrl-A Code for Dark (normal) Black
		var darkgray = "\001k\1h"; //Synchronet Ctrl-A Code for High Intensity Black which looks Dark Gray
		console.clear();
		write(magenta + "\r\nPolling Live and Historical Bitcoin Prices... Please be patient.");
		var btcHeader = blue + "\r\n  Current Exchange Rate: \r\n" + 
			darkblue + " \325\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315 Bitcoin Price Chart (USD) \315\315";
		var btcFooter = darkmagenta + " \324\315oldest\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315\315newest\315\270\r\n" 
			+ darkmagenta + "  syncBTC:" + blue + "KenDB3  " + darkmagenta + "Data:" + blue + "Coinbase.com  " + darkmagenta + "Original Concept:" + blue + "BCR / BitSunrise.com " + darkmagenta + "\315\315\315\276\r\n";
			
		var btcxAxis = " \263";
        var reqExchangeRate = new HTTPRequest();
		var reqHistoricPriceDays = new HTTPRequest();

		var exchangeRate = reqExchangeRate.Get("https://api.coinbase.com/v2/exchange-rates?currency=BTC");
		var historicPriceDays = reqHistoricPriceDays.Get("https://api.coinbase.com/v2/prices/historic?currency=USD&days=" + xAxisLength);
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
		// (Obviously stolen from syncWXremix... this sits here a while) Check if the JSON is properly formatted. The "data" should wrap the entire object.
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
		var rateUSD = jsonExchangeRate.data.rates.USD;
		var rateGBP = jsonExchangeRate.data.rates.GBP;
		var rateEUR = jsonExchangeRate.data.rates.EUR;
		var l = jsonHistoricPriceDays.data.prices.length;
		
		var Intermezzo = [];
		var j = 0;
		while (j < l) {
			var addit = jsonHistoricPriceDays.data.prices[j].price;
			Intermezzo.push(addit);
			j++;
		}
		
		var btcArray = [];
		var btcMax = Math.max.apply(null, Intermezzo);
		var btcMaxWhole = Math.round(btcMax);
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
		
		//Draw the header, footer, chart axes, etc
		console.clear();
		console.gotoxy(1,1);
		console.putmsg(btcHeader);
		console.gotoxy(1,4);
		console.putmsg(darkblue + btcMaxWhole);
		var k = 0;
		while (k < (yAxisHeight + 1)) {
			console.gotoxy(1,(k + 5));
			if ((k / yAxisHeight) <= ((1/12) * 1)) {
				write(darkblue);
			} else if ((k / yAxisHeight) <= ((1/12) * 2)) {
				write(blue);
			} else if ((k / yAxisHeight) <= ((1/12) * 3)) {
				write(darkcyan);
			} else if ((k / yAxisHeight) <= ((1/12) * 4)) {
				write(cyan);
			} else if ((k / yAxisHeight) <= ((1/12) * 5)) {
				write(darkgreen);
			} else if ((k / yAxisHeight) <= ((1/12) * 6)) {
				write(green);
			} else if ((k / yAxisHeight) <= ((1/12) * 7)) {
				write(yellow);
			} else if ((k / yAxisHeight) <= ((1/12) * 8)) {
				write(darkyellow);
			} else if ((k / yAxisHeight) <= ((1/12) * 9)) {
				write(red);
			} else if ((k / yAxisHeight) <= ((1/12) * 10)) {
				write(darkred);
			} else if ((k / yAxisHeight) <= ((1/12) * 11)) {
				write(magenta);
			} else {
				write(darkmagenta);
			}
			write(btcxAxis);
			k++;
		}
		console.gotoxy(1,(totalHeight - 3));
		console.putmsg(darkmagenta + btcMinWhole);
		console.gotoxy(1,(totalHeight - 2));
		console.putmsg(btcFooter);
		console.crlf();
		console.gotoxy(26,1);
		//Draw current Exchange Rate at the top in USD, EUR, and GBP
		console.putmsg(darkcyan + "\044" + rateUSD + " USD/BTC" + " - \356" + rateEUR + " EUR/BTC" + " - \234" + rateGBP + " GPB/BTC");
		
		//Now to plot the data
		//When you plot these data points they are all backwards, you need to FLIP everything
		//start plotting X from the right, because most recent data is at the front of the JSON DB data
		//Y-axis (after the flip) needs a +5 to get above the footer area
		var plot = 0;
		while (plot < xAxisLength) {
			var flip = appHeight - btcArray[plot];
			console.gotoxy((appLength - plot),flip + 5);
			if ((flip / yAxisHeight) <= ((1/12) * 1)) {
				write(darkblue);
			} else if ((flip / yAxisHeight) <= ((1/12) * 2)) {
				write(blue);
			} else if ((flip / yAxisHeight) <= ((1/12) * 3)) {
				write(darkcyan);
			} else if ((flip / yAxisHeight) <= ((1/12) * 4)) {
				write(cyan);
			} else if ((flip / yAxisHeight) <= ((1/12) * 5)) {
				write(darkgreen);
			} else if ((flip / yAxisHeight) <= ((1/12) * 6)) {
				write(green);
			} else if ((flip / yAxisHeight) <= ((1/12) * 7)) {
				write(yellow);
			} else if ((flip / yAxisHeight) <= ((1/12) * 8)) {
				write(darkyellow);
			} else if ((flip / yAxisHeight) <= ((1/12) * 9)) {
				write(red);
			} else if ((flip / yAxisHeight) <= ((1/12) * 10)) {
				write(darkred);
			} else if ((flip / yAxisHeight) <= ((1/12) * 11)) {
				write(magenta);
			} else {
				write(darkmagenta);
			}
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
