# SyncBTC
A Bitcoin Exchange Rate external program (door) written in javascript for  Synchronet BBS and ANSI capable terminals.

## Synopsis
SyncBTC is a Bitcoin Exchange Rate External Program (Door) written in JavaScript for Synchronet BBS and ANSI capable terminals. It is based off of something cool I saw at BitSunrise.com (aka: Black Country Rock/Bit Sunrise). All of my code was original, but the look and feel of the app is based on the BCR original program: BCR Coins v1.0. Data is pulled from Coinbase.com and no API Key is needed. Sysop configures their local currency in /ctrl/modopts.ini file. Graph of rates adapts to terminal size. Minimum Terminal Size = 80 Columns by 12 Rows. However, there is no Maximum. In fact, I encourage you to try a bigger terminal to see the results.

## Screenshots 
![Regular Terminal Size 80x24](http://bbs.kd3.us/screenshots/SyncBTC-Screenshot-2016-09-03_small.png)

## Code Example

Request the Data:
		var exchangeRate = reqExchangeRate.Get("https://api.coinbase.com/v2/exchange-rates?currency=BTC");
		var historicPriceDays = reqHistoricPriceDays.Get("https://api.coinbase.com/v2/prices/historic?currency="+ chartCurrency + "&days=" + xAxisLength);

Parse the JSON response:
		var jsonExchangeRate = JSON.parse(exchangeRate);
		var jsonHistoricPriceDays = JSON.parse(historicPriceDays);

Plotting the data points was a trick on a terminal screen. You had to normalize the data to fit your Row height. When you plot these data points they are all backwards, you need to FLIP everything (X and Y). Start plotting X from the right, because most recent data is at the front of the JSON DB data (starting from 0). Y-axis (after the flip) needs a modifier to get above the footer area, this turned out to be floating, so you need to use the normalized Bitcoin Minimum... this took me ages to figure out. The number 4 comes from getting above the X-axis line, App info line, Pause Prompt, Bottom blank line. This could get you either a positive or negative number, but that evens out when you subtract it from the variable "flip".
		var normYAxis = 4 - normBtcMin; 
		var plot = 0;
		while (plot < xAxisLength) {
		var flip = totalHeight - btcArray[plot];
		console.gotoxy((appLength - plot),(flip - normYAxis));
		var colorcode = (appHeight - (btcArray[plot] - normBtcMin + 1)); //steal the color from drawing the Y-axis line
		write(colorArray[colorcode]);
		write("\052");
		plot++;
		}

## Installation

Check out [sysop.txt](https://github.com/KenDB3/SyncBTC/blob/master/sysop.txt) for full installation instructions.


