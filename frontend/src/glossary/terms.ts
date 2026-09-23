export type Category = 'Basics' | 'Buying & Selling' | 'Prices & Charts' | 'Coin Numbers' | 'Risk' | 'Data & Sources'

export interface Term {
  id: string
  term: string
  category: Category
  eli5: string
  definition: string
  example: string
  related: string[]
}

export const TERMS: Term[] = [
  {
    id: 'crypto',
    term: 'Cryptocurrency',
    category: 'Basics',
    eli5: 'Crypto is money that only exists on computers. Instead of a bank keeping track of who owns what, thousands of computers keep the same record book and check each other.',
    definition:
      'A digital asset whose ownership is recorded on a blockchain, a shared ledger kept by many computers, so it can move between people without a bank.',
    example: 'Bitcoin (BTC) and Ether (ETH) are the two largest cryptocurrencies by market cap.',
    related: ['coin', 'exchange', 'stablecoin'],
  },
  {
    id: 'coin',
    term: 'Coin',
    category: 'Basics',
    eli5: 'A coin is one kind of crypto, like one kind of trading card. Bitcoin is one kind, Solana is another.',
    definition:
      'A single cryptocurrency, known by a name and a short symbol. Prices are for one whole coin, but you can buy a small fraction of one.',
    example: 'You can buy 0.001 BTC instead of a whole bitcoin.',
    related: ['symbol', 'crypto', 'price'],
  },
  {
    id: 'symbol',
    term: 'Symbol',
    category: 'Basics',
    eli5: 'A symbol is a coin’s nickname, a few letters long, so it’s quick to write.',
    definition: 'A short code for an asset. Different coins sometimes use the same symbol, so check the full name too.',
    example: 'ETH is the symbol for Ethereum’s coin, Ether.',
    related: ['coin', 'trading-pair'],
  },
  {
    id: 'exchange',
    term: 'Exchange',
    category: 'Basics',
    eli5: 'An exchange is a big market where people who want to buy meet people who want to sell. The exchange makes sure both sides get what they agreed.',
    definition:
      'A company that matches buyers and sellers, such as Coinbase or Kraken. Each exchange has its own prices, usually close to other exchanges’ but not identical.',
    example: 'BTC might trade at $65,000 on Coinbase and $65,010 on Kraken at the same moment.',
    related: ['trading-pair', 'price', 'cross-check'],
  },
  {
    id: 'trading-pair',
    term: 'Trading pair',
    category: 'Basics',
    eli5: 'A pair says what you swap for what. BTC-USD means trading bitcoin for dollars, like a price tag written in dollars.',
    definition:
      'The two assets in a market. The first is what’s bought or sold; the second is the currency the price is written in.',
    example: 'BTC-EUR shows the price of one bitcoin in euros.',
    related: ['symbol', 'exchange'],
  },
  {
    id: 'paper-trading',
    term: 'Paper trading',
    category: 'Basics',
    eli5: 'Paper trading is pretend trading with play money, so you can practice without losing real money.',
    definition:
      'Simulated trading with real prices and pretend money. Real trades can turn out differently because of fees, delays and your own order moving the price.',
    example: 'You start with $100,000 of play money and practice buying BTC.',
    related: ['price', 'spread'],
  },
  {
    id: 'price',
    term: 'Price',
    category: 'Prices & Charts',
    eli5: 'The price is what the most recent buyer paid the most recent seller. It changes every time someone trades.',
    definition: 'The price of the latest completed trade on an exchange, often called the last price.',
    example: 'If the last trade was 0.01 BTC for $650, the price is $65,000 per bitcoin.',
    related: ['bid', 'ask', 'live-data'],
  },
  {
    id: 'change-24h',
    term: '24-hour change',
    category: 'Prices & Charts',
    eli5: 'This tells you how much the price went up or down compared with exactly one day ago.',
    definition:
      'The percentage difference between the price now and 24 hours ago. Crypto trades all day, every day, so there’s no daily closing time like in stock markets.',
    example: 'If BTC was $64,000 this time yesterday and is $65,000 now, the change is +1.56%.',
    related: ['price', 'high-low'],
  },
  {
    id: 'high-low',
    term: '24-hour high and low',
    category: 'Prices & Charts',
    eli5: 'The high is the most anyone paid in the last day. The low is the least.',
    definition: 'The highest and lowest trade prices on one exchange over the last 24 hours.',
    example: 'A high of $66,300 and a low of $63,050 means every trade that day was between those two prices.',
    related: ['change-24h', 'candlestick'],
  },
  {
    id: 'volume',
    term: 'Volume',
    category: 'Prices & Charts',
    eli5: 'Volume is how much got traded. Lots of volume means a busy market, like a crowded shop.',
    definition:
      'The number of coins that changed hands during a period. On the coin page it’s the last 24 hours on one exchange.',
    example: 'A volume of 12,000 BTC means 12,000 bitcoins were bought and sold on that exchange in a day.',
    related: ['spread', 'price'],
  },
  {
    id: 'line-chart',
    term: 'Line chart',
    category: 'Prices & Charts',
    eli5: 'A line chart joins the prices over time with one line, so you can see if it went up or down.',
    definition: 'A chart with one price per time step, here the closing price, joined by a line.',
    example: 'A line that ends higher than it started means the price rose over that period.',
    related: ['candlestick'],
  },
  {
    id: 'candlestick',
    term: 'Candlestick',
    category: 'Prices & Charts',
    eli5: 'Each candle is one slice of time. Its thick body shows where the price started and ended. The thin lines show the highest and lowest it went.',
    definition:
      'A chart bar showing the open, high, low and close for one period. In this app, a green candle closed higher than it opened and a red one closed lower.',
    example: 'A daily candle from $100 to $110 with a thin line up to $115 hit $115 but ended the day at $110.',
    related: ['line-chart', 'high-low'],
  },
  {
    id: 'bid',
    term: 'Bid',
    category: 'Buying & Selling',
    eli5: 'The bid is the best offer from someone waiting to buy. If you sold right now, that’s about what you’d get.',
    definition: 'The highest price any buyer is currently offering on an exchange.',
    example: 'A bid of $64,999 means someone is ready to buy at $64,999.',
    related: ['ask', 'spread'],
  },
  {
    id: 'ask',
    term: 'Ask',
    category: 'Buying & Selling',
    eli5: 'The ask is the cheapest price a seller will take right now. If you bought right now, that’s about what you’d pay.',
    definition: 'The lowest price any seller is currently asking on an exchange. Also called the offer.',
    example: 'An ask of $65,001 means someone is ready to sell at $65,001.',
    related: ['bid', 'spread'],
  },
  {
    id: 'spread',
    term: 'Spread',
    category: 'Buying & Selling',
    eli5: 'The spread is the small gap between what buyers offer and what sellers want. It’s a hidden cost: buying and then selling straight away loses about this much.',
    definition:
      'The ask minus the bid. A small spread usually means a busy market that’s cheap to trade; a wide spread means trading costs more.',
    example: 'A bid of $64,999 and an ask of $65,001 make a $2 spread.',
    related: ['bid', 'ask', 'volume'],
  },
  {
    id: 'market-cap',
    term: 'Market cap',
    category: 'Coin Numbers',
    eli5: 'Market cap is the price of one coin times how many coins are out there. It shows how big a coin is overall, not how expensive one coin is.',
    definition:
      'Price × circulating supply. A coin with a low price can still have a huge market cap if there are billions of coins.',
    example: '19.9 million BTC × $65,000 ≈ $1.29 trillion.',
    related: ['circulating-supply', 'fdv', 'rank'],
  },
  {
    id: 'circulating-supply',
    term: 'Circulating supply',
    category: 'Coin Numbers',
    eli5: 'How many coins are out in the world right now that people can buy and sell.',
    definition:
      'The number of coins available to the public, not counting coins that are locked up or held back. Data providers estimate it, so numbers can differ a little.',
    example: 'About 19.9 million bitcoins are in circulation.',
    related: ['total-supply', 'max-supply', 'market-cap'],
  },
  {
    id: 'total-supply',
    term: 'Total supply',
    category: 'Coin Numbers',
    eli5: 'All the coins that exist today, including ones locked away that can’t be traded yet.',
    definition:
      'Coins created so far, minus coins permanently destroyed (“burned”). Includes coins that aren’t in circulation yet.',
    example:
      'If 1,000 coins exist and 200 are locked for the team, total supply is 1,000 and circulating supply is 800.',
    related: ['circulating-supply', 'max-supply'],
  },
  {
    id: 'max-supply',
    term: 'Max supply',
    category: 'Coin Numbers',
    eli5: 'The most coins that will ever exist. Some coins have a limit. Others can keep making new ones forever.',
    definition: 'The hard cap on how many coins can ever be created, if the coin’s rules set one.',
    example: 'Bitcoin’s max supply is 21 million. Ether has no max supply.',
    related: ['total-supply', 'fdv'],
  },
  {
    id: 'fdv',
    term: 'Fully diluted valuation',
    category: 'Coin Numbers',
    eli5: 'What the market cap would be if every coin that will ever exist were already out there, at today’s price.',
    definition:
      'Price × max supply, or × total supply when there’s no max. A big gap between this and market cap means many more coins are still to be released.',
    example: '21 million BTC × $65,000 = $1.365 trillion.',
    related: ['market-cap', 'max-supply'],
  },
  {
    id: 'rank',
    term: 'Market cap rank',
    category: 'Coin Numbers',
    eli5: 'The coin’s place in a list sorted by market cap. Number 1 is the biggest.',
    definition:
      'A coin’s position by market cap among all the coins a data provider tracks. Providers can rank slightly differently.',
    example: 'Rank 1 means the largest market cap on CoinGecko’s list.',
    related: ['market-cap'],
  },
  {
    id: 'ath',
    term: 'All-time high',
    category: 'Coin Numbers',
    eli5: 'The highest price the coin has ever reached.',
    definition:
      'The highest price a data provider has recorded since the coin started trading. Providers can report slightly different highs.',
    example: 'With an all-time high of $124,000 and a price of $65,000, the price is about 48% below its high.',
    related: ['price', 'high-low'],
  },
  {
    id: 'stablecoin',
    term: 'Stablecoin',
    category: 'Risk',
    eli5: 'A stablecoin tries to always be worth the same, usually one US dollar, like a digital dollar bill.',
    definition:
      'A cryptocurrency designed to hold a fixed value, usually $1, typically backed by cash and short-term government debt held by the company that issues it. Stable is the goal, not a guarantee.',
    example: 'USDC and USDT aim to be worth $1 each.',
    related: ['depeg', 'crypto'],
  },
  {
    id: 'depeg',
    term: 'Depeg',
    category: 'Risk',
    eli5: 'When a stablecoin stops being worth what it promised, like a $1 coin suddenly worth 90 cents.',
    definition:
      'When a stablecoin’s market price moves away from its target value. This app warns you when it’s more than 2% off.',
    example:
      'In March 2023, USDC briefly fell below $0.90 after its issuer said some of its cash was stuck at a failed bank.',
    related: ['stablecoin'],
  },
  {
    id: 'live-data',
    term: 'Live',
    category: 'Data & Sources',
    eli5: 'Live means the price comes from a trade that happened moments ago.',
    definition: 'In this app: the exchange reported a trade in the last 5 minutes.',
    example: 'Live · last trade 3 seconds ago.',
    related: ['stale-data', 'price'],
  },
  {
    id: 'stale-data',
    term: 'Stale',
    category: 'Data & Sources',
    eli5: 'Stale means the number is old, like yesterday’s bread. It might not be the price now.',
    definition:
      'In this app: the last trade is more than 5 minutes old, or the app couldn’t refresh and is showing an older number. The message says which.',
    example: 'Stale · last trade 12 minutes ago.',
    related: ['live-data', 'cross-check'],
  },
  {
    id: 'cross-check',
    term: 'Price check',
    category: 'Data & Sources',
    eli5: 'The app asks more than one exchange for the price and checks they roughly agree, like asking two people what time it is.',
    definition:
      'Comparing the main price with other exchanges. A difference above 0.5% gets a warning, because one source may be wrong or behind.',
    example: 'Coinbase at $65,000 and Kraken at $65,010 are 0.02% apart, so they match.',
    related: ['exchange', 'stale-data'],
  },
  {
    id: 'reference-rate',
    term: 'ECB reference rate',
    category: 'Data & Sources',
    eli5: 'Once a day, Europe’s central bank says how many dollars one euro is worth. The app uses it to turn dollar prices into euros.',
    definition:
      'The European Central Bank’s daily euro exchange rate, published around 16:00 Central European Time on working days. It’s for information; you can’t trade at it.',
    example: 'If 1 EUR = 1.08 USD, a $108 price is €100.',
    related: ['trading-pair'],
  },
  {
    id: 'aggregator',
    term: 'Data aggregator',
    category: 'Data & Sources',
    eli5: 'An aggregator collects prices from lots of exchanges and mixes them into one number.',
    definition:
      'A service like CoinGecko that combines data from many exchanges. Good for totals like market cap, but one step removed from the actual trades.',
    example: 'CoinGecko’s bitcoin price is an average across many exchanges, weighted by how much each one trades.',
    related: ['exchange', 'market-cap'],
  },
  {
    id: 'market-order',
    term: 'Market order',
    category: 'Buying & Selling',
    eli5: 'A market order says: buy (or sell) right now at whatever the price is. It’s fast, but you don’t pick the exact price.',
    definition:
      'An order that fills straight away at the best price available. You may pay a bit more, or get a bit less, than the last price you saw.',
    example: 'A market buy for 0.1 BTC fills at the current ask, for example $65,001.',
    related: ['limit-order', 'ask', 'slippage'],
  },
  {
    id: 'limit-order',
    term: 'Limit order',
    category: 'Buying & Selling',
    eli5: 'A limit order says: only buy if the price drops to my number, or only sell if it rises to my number. You pick the price, but it might never happen.',
    definition:
      'An order to buy at or below, or sell at or above, a price you set. It waits until the market reaches that price and may never fill. In this app, waiting orders are only checked while the app is open.',
    example: 'A limit buy at $60,000 waits until someone sells at $60,000 or less.',
    related: ['market-order', 'bid', 'ask'],
  },
  {
    id: 'slippage',
    term: 'Slippage',
    category: 'Buying & Selling',
    eli5: 'Slippage is when you pay a little more than the price you saw, because the price moved or there weren’t enough sellers at that price.',
    definition:
      'The difference between the price you expected and the price you actually get. This app adds a small slippage setting to every market order so practice results aren’t better than real life.',
    example: 'With 0.1% slippage, a $65,000 ask becomes a $65,065 fill.',
    related: ['market-order', 'spread', 'trading-fee'],
  },
  {
    id: 'trading-fee',
    term: 'Trading fee',
    category: 'Buying & Selling',
    eli5: 'The exchange charges a small fee every time you trade, like a ticket to get in.',
    definition:
      'A charge the exchange takes on each trade, usually a percentage of its value. Real fees depend on the exchange and on how much you trade.',
    example: 'A 0.5% fee on a $1,000 purchase costs $5.',
    related: ['slippage', 'spread'],
  },
  {
    id: 'portfolio',
    term: 'Portfolio',
    category: 'Basics',
    eli5: 'Your portfolio is everything you own, all together, like all the toys in your toy box.',
    definition: 'All your holdings plus your cash, and what they’re worth together.',
    example: '$60,000 in cash plus 0.5 BTC worth $32,500 is a $92,500 portfolio.',
    related: ['allocation', 'unrealized'],
  },
  {
    id: 'unrealized',
    term: 'Unrealized profit or loss',
    category: 'Risk',
    eli5: 'How much you’d win or lose if you sold now. It isn’t real yet, because you haven’t sold.',
    definition:
      'What a holding is worth now minus what you paid for it, including fees. It changes with the price until you sell.',
    example: 'Bought for $6,500 and now worth $7,000: $500 unrealized profit.',
    related: ['realized', 'average-cost'],
  },
  {
    id: 'realized',
    term: 'Realized profit or loss',
    category: 'Risk',
    eli5: 'Profit or loss that’s locked in because you sold.',
    definition: 'What you got for coins you sold, after fees, minus what those coins cost you.',
    example: 'You sell coins that cost you $6,500 and get $7,000 after fees: $500 realized profit.',
    related: ['unrealized', 'average-cost'],
  },
  {
    id: 'average-cost',
    term: 'Average cost',
    category: 'Buying & Selling',
    eli5: 'If you bought the same coin at different prices, the average cost is the in-between price you paid for each one.',
    definition: 'What you paid for the coins you still hold, including buy fees, divided by how many you hold.',
    example: 'Buying 1 BTC at $60,000 and 1 at $70,000 gives an average cost of $65,000, plus fees.',
    related: ['unrealized', 'realized'],
  },
  {
    id: 'allocation',
    term: 'Allocation',
    category: 'Risk',
    eli5: 'Allocation shows how your money is split up, like how many slices of a pizza go to each friend.',
    definition: 'Each holding’s share of your portfolio’s total value.',
    example: '$25,000 in BTC out of $100,000 in total is a 25% allocation.',
    related: ['portfolio'],
  },
  {
    id: 'trade-journal',
    term: 'Trade journal',
    category: 'Basics',
    eli5: 'A trade journal is a diary for your trades: why you made each one, and later, how it went.',
    definition: 'Notes you write when you trade and read again later, to learn which reasons worked.',
    example:
      'You write “bought because it fell 10% this week”, then a month later check whether that was a good reason.',
    related: ['paper-trading'],
  },
]

export const TERMS_BY_ID: Record<string, Term> = Object.fromEntries(TERMS.map((t) => [t.id, t]))
