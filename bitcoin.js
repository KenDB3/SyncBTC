load("http.js"); //this loads the http libraries which you will need to make requests to the web server
load("sbbsdefs.js"); //loads a bunch-o-stuff that is probably beyond the understanding of mere mortals 

function bitcoinprice() {
		var totalHeight = console.screen_rows;
		var appHeight = (console.screen_rows - 7); //minus 3 top, minus 3 bottom
		var yAxisHeight = (appHeight - 2); //minus 2 more for max/min data points
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
        var reqSpotPrice = new HTTPRequest();
		var reqHistoricPriceDays = new HTTPRequest();

		var exchangeRate = reqExchangeRate.Get("https://api.coinbase.com/v2/exchange-rates?currency=BTC");
		var historicPriceDays = reqHistoricPriceDays.Get("https://api.coinbase.com/v2/prices/historic?currency=USD&days=76");
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
		/* make some error checking at some point
		*/
		var rateUSD = jsonExchangeRate.data.rates.USD;
		var rateGBP = jsonExchangeRate.data.rates.GBP;
		var rateEUR = jsonExchangeRate.data.rates.EUR;
		
		var Intermezzo = [];
		var j = 0;
		while (j < 76) {
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
		var l = jsonHistoricPriceDays.data.prices.length;
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
		console.gotoxy(1,(totalHeight - 4));
		console.putmsg(darkmagenta + btcMinWhole);
		console.gotoxy(1,(totalHeight - 3));
		console.putmsg(btcFooter);
		console.crlf();
		console.gotoxy(26,2);
		//Draw current Exchange Rate at the top in USD, EUR, and GBP
		console.putmsg(darkcyan + "\044" + rateUSD + " USD/BTC" + " - \356" + rateEUR + " EUR/BTC" + " - \234" + rateGBP + " GPB/BTC");
		
		//Now to plot the data
		//When you plot these data points they are all backwards, you need to FLIP everything
		//start plotting X from the right, because most recent data is at the front of the JSON DB data
		//Y-axis (after the flip) needs a +5 to get above the footer area
		var plot = 0;
		while (plot < 76) {
			var flip = appHeight - btcArray[plot];
			console.gotoxy((79 - plot),flip + 5);
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
