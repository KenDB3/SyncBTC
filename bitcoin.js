load("http.js"); //this loads the http libraries which you will need to make requests to the web server
load("sbbsdefs.js"); //loads a bunch-o-stuff that is probably beyond the understanding of mere mortals 

function bitcoinprice() {
        var reqExchangeRate = new HTTPRequest();
        var reqSpotPrice = new HTTPRequest();
		var reqHistoricPriceDays = new HTTPRequest();
		//This query combines 4 different queries into 1 and saves you API calls that count against your free (or paid) total
		//It pulls down info for conditions, forecast, astronomy (all 3 are Stratus Plan), and alerts (Cumulus Plan). 
		var exchangeRate = reqExchangeRate.Get("https://api.coinbase.com/v2/exchange-rates?currency=BTC");
		var spotPrice = reqSpotPrice.Get("https://api.coinbase.com/v2/prices/spot?currency=USD");
		var historicPriceDays = reqHistoricPriceDays.Get("https://api.coinbase.com/v2/prices/historic?currency=USD&days=60");
		// Make sure we actually got a response. If not, log an error and exit.
		if (exchangeRate === undefined || spotPrice === undefined || historicPriceDays === undefined) {
			log("ERROR in coinbase.js: Request to api.coinbase.com returned 'undefined'");
			console.center("There was a problem getting data from Coinbase.com.");
			console.center("The sysop has been notified.");
			console.pause();
			exit();
		}
		// Parse the JSON responses.
		var jsonExchangeRate = JSON.parse(exchangeRate);
		var jsonSpotPrice = JSON.parse(spotPrice);
		var jsonHistoricPriceDays = JSON.parse(historicPriceDays);
		/* make some error checking at some point
		*/
		var rateUSD = jsonExchangeRate.data.rates.USD;
		var rateGBP = jsonExchangeRate.data.rates.GBP;
		var rateEUR = jsonExchangeRate.data.rates.EUR;
		var spotUSD = jsonSpotPrice.data.amount;
		
		var Intermezzo = [];
		var j = 0;
		while (j < 60) {
			var addit = jsonHistoricPriceDays.data.prices[j].price;
			Intermezzo.push(addit);
			j++;
		}
		
		var BTCarray = [];
	
		//var whatup = Math.max.apply(null, jsonHistoricPriceDays.data.prices[].price);
		var whatupwichu = Math.max.apply(null, Intermezzo);
		
		var ratio = Math.max.apply(null, Intermezzo) / 24;
		var l = jsonHistoricPriceDays.data.prices.length;
		var i = 0;
		var silliness2 = Intermezzo[1]/ratio;
		var moresilliness2 = (Math.round(silliness2));
		
		while (i < 60) {
			var silliness = Intermezzo[i]/ratio;
			var moresilliness = (Math.round(silliness));
			BTCarray.push(moresilliness);
			i++;
		}
			
		write(jsonHistoricPriceDays.data.prices[0].price);
		console.crlf();
		write(Intermezzo[0]);
		console.crlf();
		write(whatupwichu);
		console.crlf();
		//write(whatup);
		//console.crlf();
		write(ratio);
		console.crlf();
		write(l);
		console.crlf();
		write(silliness2);
		console.crlf();
		write(moresilliness2);
		console.crlf();
		console.pause();
			
	
		console.clear();
		write("USD: " + rateUSD);
		console.crlf();
		write("Spot Price (USD): " + spotUSD);
		console.crlf();
		write("Historic Prices (USD): \r\n" + jsonHistoricPriceDays.data.prices[0].time + ": " + jsonHistoricPriceDays.data.prices[0].price + "\r\n" + jsonHistoricPriceDays.data.prices[1].time + ": " + jsonHistoricPriceDays.data.prices[1].price + "\r\n" + jsonHistoricPriceDays.data.prices[2].time + ": " + jsonHistoricPriceDays.data.prices[2].price);
		console.crlf();
		write("Transformed Data: " + "\r\n" + BTCarray[0] + "\r\n" + BTCarray[1] + "\r\n" + BTCarray[2]);
		console.crlf();
		write(" syncBTC:KenDB3 data:Coinbase.com\r\n");
}

bitcoinprice();
console.pause();
console.clear();
console.aborted = false;
exit();
