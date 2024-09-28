# Crypto Visualizer

Crypto Visualizer is a web-based application that allows users to track and analyze cryptocurrency prices in real-time. It provides a visual representation of price trends for multiple cryptocurrencies and offers a comparison tool for in-depth analysis.

## Features

- Real-time price tracking for multiple cryptocurrencies
- Combined chart view for all tracked cryptocurrencies
- Individual charts for each cryptocurrency
- Custom cryptocurrency addition
- Persistence of custom cryptocurrencies using local storage
- Cryptocurrency comparison tool

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js for data visualization
- CoinGecko API for cryptocurrency data

## Project Structure

- `visualizer.html`: Main page for cryptocurrency visualization
- `analysis.html`: Page for cryptocurrency comparison analysis
- `script.js`: JavaScript file for the main visualizer functionality
- `analysis.js`: JavaScript file for the analysis page functionality
- `styles.css`: CSS file for styling both pages

## Setup and Usage

1. Clone the repository or download the project files.
2. Open `visualizer.html` in a web browser to view the main cryptocurrency tracker.
3. Use the "Add Custom Coin" form to add new cryptocurrencies to track.
4. Click on the "Analysis" link in the navigation bar to access the comparison tool.
5. On the analysis page, enter the names of two cryptocurrencies to compare their metrics.

## API Usage

This project uses the CoinGecko API to fetch cryptocurrency data. No API key is required for basic usage, but be aware of rate limiting for frequent requests.

## Contributing

Contributions to improve Crypto Visualizer are welcome. Please feel free to submit a Pull Request.

## Disclaimer

This tool is for informational purposes only. It is not intended to provide financial advice. Always conduct your own research before making investment decisions.
