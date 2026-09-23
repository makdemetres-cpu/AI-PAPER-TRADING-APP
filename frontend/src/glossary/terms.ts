export const CATEGORIES = [
  'Basics',
  'Blockchain & Wallets',
  'Buying & Selling',
  'Prices & Charts',
  'Coin Numbers',
  'Risk',
  'Stocks & Funds',
  'Copy Trading & Filings',
  'Market Times',
  'Data & Sources',
] as const

export type Category = (typeof CATEGORIES)[number]

export interface Term {
  id: string
  term: string
  category: Category
  eli5: string
  definition: string
  example: string
  related: string[]
}

// To add a word: add an entry here and a matching picture in pictures.tsx (tests/test_glossary.py checks both).
export const TERMS: Term[] = [
  // Basics
  {
    id: 'crypto',
    term: 'Cryptocurrency',
    category: 'Basics',
    eli5: 'Crypto is money that only exists on computers. Instead of a bank keeping track of who owns what, thousands of computers keep the same record book and check each other.',
    definition:
      'A digital asset whose ownership is recorded on a blockchain, a shared ledger kept by many computers, so it can move between people without a bank.',
    example: 'Bitcoin (BTC) and Ether (ETH) are the two largest cryptocurrencies by market cap.',
    related: ['coin', 'blockchain', 'exchange'],
  },
  {
    id: 'coin',
    term: 'Coin',
    category: 'Basics',
    eli5: 'A coin is one kind of crypto, like one kind of trading card. Bitcoin is one kind, Solana is another.',
    definition:
      'A cryptocurrency that runs on its own blockchain, known by a name and a short symbol. Prices are for one whole coin, but you can buy a small fraction of one.',
    example: 'You can buy 0.001 BTC instead of a whole bitcoin.',
    related: ['token', 'symbol', 'crypto'],
  },
  {
    id: 'token',
    term: 'Token',
    category: 'Basics',
    eli5: 'A token is crypto that lives on someone else’s blockchain, like a sticker you put in another person’s album.',
    definition:
      'A crypto asset created by a program running on an existing blockchain, instead of having its own. People often say “coin” for both.',
    example: 'USDC is a token that runs on Ethereum and several other blockchains.',
    related: ['coin', 'smart-contract', 'stablecoin'],
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
    id: 'asset',
    term: 'Asset',
    category: 'Basics',
    eli5: 'An asset is anything you own that’s worth money, like a bike, a house or a coin.',
    definition:
      'Something of value that you own and could sell. In investing it usually means coins, stocks, funds or cash.',
    example: 'Your portfolio’s assets might be 0.1 BTC, 2 ETH and $500 in cash.',
    related: ['portfolio', 'coin', 'stock'],
  },
  {
    id: 'fiat',
    term: 'Fiat money',
    category: 'Basics',
    eli5: 'Fiat money is the normal money a country prints, like dollars or euros.',
    definition:
      'Government-issued currency, like the US dollar or the euro. It’s what you pay with in shops and what crypto prices are usually written in.',
    example: 'In BTC-EUR, the euro is the fiat currency.',
    related: ['trading-pair', 'stablecoin', 'exchange-rate'],
  },
  {
    id: 'market',
    term: 'Market',
    category: 'Basics',
    eli5: 'A market is any place where people buy and sell things. For crypto, it’s mostly websites and apps.',
    definition:
      'All the buyers and sellers of an asset, and the prices they agree on. It can also mean one specific place to trade, like the BTC-USD market on Coinbase.',
    example: 'When people say “the market fell”, they mean prices of most assets went down.',
    related: ['exchange', 'trading-pair', 'price'],
  },
  {
    id: 'exchange',
    term: 'Exchange',
    category: 'Basics',
    eli5: 'An exchange is a big market where people who want to buy meet people who want to sell. The exchange makes sure both sides get what they agreed.',
    definition:
      'A company that matches buyers and sellers, such as Coinbase or Kraken. Each exchange has its own prices, usually close to other exchanges’ but not identical.',
    example: 'BTC might trade at $65,000 on Coinbase and $65,010 on Kraken at the same moment.',
    related: ['order-book', 'trading-pair', 'cross-check'],
  },
  {
    id: 'trading-pair',
    term: 'Trading pair',
    category: 'Basics',
    eli5: 'A pair says what you swap for what. BTC-USD means trading bitcoin for dollars, like a price tag written in dollars.',
    definition:
      'The two assets in a market. The first is what’s bought or sold; the second is the currency the price is written in.',
    example: 'BTC-EUR shows the price of one bitcoin in euros.',
    related: ['symbol', 'exchange', 'fiat'],
  },
  {
    id: 'investing',
    term: 'Investing',
    category: 'Basics',
    eli5: 'Investing is buying something and keeping it for a long time, hoping it grows, like planting a tree.',
    definition:
      'Putting money into assets you plan to hold for years, expecting their value to rise over time. The value can also fall, and you can lose money.',
    example: 'Buying a little bitcoin every month for five years is investing.',
    related: ['trading', 'dca', 'risk'],
  },
  {
    id: 'trading',
    term: 'Trading',
    category: 'Basics',
    eli5: 'Trading is buying and selling often, trying to profit from price moves, like swapping cards quickly when their value changes.',
    definition:
      'Buying and selling over short periods, from minutes to weeks, to profit from price changes. Frequent trading means more fees and more chances to be wrong.',
    example: 'Buying ETH in the morning and selling it that afternoon is trading.',
    related: ['investing', 'trading-fee', 'paper-trading'],
  },
  {
    id: 'portfolio',
    term: 'Portfolio',
    category: 'Basics',
    eli5: 'Your portfolio is everything you own, all together, like all the toys in your toy box.',
    definition: 'All your holdings plus your cash, and what they’re worth together.',
    example: '$60,000 in cash plus 0.5 BTC worth $32,500 is a $92,500 portfolio.',
    related: ['allocation', 'diversification', 'unrealized'],
  },
  {
    id: 'paper-trading',
    term: 'Paper trading',
    category: 'Basics',
    eli5: 'Paper trading is pretend trading with play money, so you can practice without losing real money.',
    definition:
      'Simulated trading with real prices and pretend money. Real trades can turn out differently because of fees, delays and your own order moving the price.',
    example: 'You start with $100,000 of play money and practice buying BTC.',
    related: ['slippage', 'trading-fee', 'trade-journal'],
  },
  {
    id: 'watchlist',
    term: 'Watchlist',
    category: 'Basics',
    eli5: 'A watchlist is a list of coins you want to keep an eye on, like a wish list.',
    definition: 'A saved list of assets you follow, so you can check their prices in one place without owning them.',
    example: 'A “To research” watchlist with SOL and LINK that you check each week.',
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
    related: ['paper-trading', 'fomo'],
  },
  {
    id: 'bull-market',
    term: 'Bull market',
    category: 'Basics',
    eli5: 'A bull market is when prices keep going up for a long time. A bull pushes its horns up.',
    definition:
      'A long period when prices rise and most people expect them to keep rising. There’s no exact rule for when one starts or ends.',
    example: 'Bitcoin rising for many months in a row is called a bull market.',
    related: ['bear-market', 'trend'],
  },
  {
    id: 'bear-market',
    term: 'Bear market',
    category: 'Basics',
    eli5: 'A bear market is when prices keep going down for a long time. A bear swipes its paws down.',
    definition:
      'A long period when prices fall and most people expect them to keep falling. For stocks it often means a drop of 20% or more from a recent high.',
    example: 'In 2022 many coins fell more than 70% from their highs.',
    related: ['bull-market', 'drawdown'],
  },

  // Blockchain & Wallets
  {
    id: 'blockchain',
    term: 'Blockchain',
    category: 'Blockchain & Wallets',
    eli5: 'A blockchain is a record book that thousands of computers keep copies of. New pages get added, but old pages can’t be torn out.',
    definition:
      'A shared ledger made of blocks of transactions, each linked to the one before. Many computers hold copies, so no single company controls it.',
    example: 'Every bitcoin payment ever made is written on the Bitcoin blockchain.',
    related: ['block', 'crypto', 'on-chain'],
  },
  {
    id: 'block',
    term: 'Block',
    category: 'Blockchain & Wallets',
    eli5: 'A block is one page in the blockchain’s record book, full of recent payments.',
    definition:
      'A batch of transactions added to a blockchain together. Each block points back to the previous one, forming the chain.',
    example: 'The Bitcoin network adds a new block about every 10 minutes.',
    related: ['blockchain', 'mining'],
  },
  {
    id: 'on-chain',
    term: 'On-chain',
    category: 'Blockchain & Wallets',
    eli5: 'On-chain means written into the blockchain’s record book, where anyone can look it up.',
    definition:
      'Activity recorded directly on a blockchain. Trades inside an exchange usually aren’t on-chain; moving coins to your own wallet is.',
    example: 'Sending BTC from an exchange to your wallet creates an on-chain transaction.',
    related: ['blockchain', 'gas-fee'],
  },
  {
    id: 'wallet',
    term: 'Wallet',
    category: 'Blockchain & Wallets',
    eli5: 'A crypto wallet doesn’t hold coins. It holds the keys that prove the coins on the blockchain are yours.',
    definition:
      'An app or device that stores your private keys and lets you send and receive crypto. It can be on your phone, a computer, or a small hardware device.',
    example: 'A hardware wallet is a USB-sized device that keeps your keys offline.',
    related: ['private-key', 'seed-phrase', 'self-custody'],
  },
  {
    id: 'public-address',
    term: 'Wallet address',
    category: 'Blockchain & Wallets',
    eli5: 'Your address is like your email address for crypto. You can share it so people can send you coins.',
    definition:
      'A string of letters and numbers that identifies where crypto can be sent. It’s safe to share, but double-check it: coins sent to a wrong address are usually lost.',
    example: 'Bitcoin addresses often start with “bc1”.',
    related: ['wallet', 'private-key'],
  },
  {
    id: 'private-key',
    term: 'Private key',
    category: 'Blockchain & Wallets',
    eli5: 'A private key is the secret password that lets you spend your coins. Whoever knows it can take them.',
    definition:
      'A secret number that signs transactions from your address. Never share it. If it’s lost, the coins can’t be recovered; if it’s stolen, they can be taken.',
    example: 'No real exchange or support person will ever ask for your private key.',
    related: ['seed-phrase', 'wallet', 'phishing'],
  },
  {
    id: 'seed-phrase',
    term: 'Seed phrase',
    category: 'Blockchain & Wallets',
    eli5: 'A seed phrase is 12 or 24 words that can rebuild your wallet, like a spare key hidden in a safe place.',
    definition:
      'A list of words that can recreate all the private keys in a wallet. Anyone with the phrase controls the coins, so write it down and store it offline.',
    example: 'If your phone breaks, typing your seed phrase into a new wallet app restores your coins.',
    related: ['private-key', 'wallet', 'self-custody'],
  },
  {
    id: 'custody',
    term: 'Custodial account',
    category: 'Blockchain & Wallets',
    eli5: 'Custodial means someone else holds the keys for you, like keeping your money in a bank.',
    definition:
      'An account where a company, usually an exchange, holds the private keys for your coins. It’s easier, but you depend on that company staying honest and solvent.',
    example: 'Coins you buy and leave on an exchange are in a custodial account.',
    related: ['self-custody', 'counterparty-risk'],
  },
  {
    id: 'self-custody',
    term: 'Self-custody',
    category: 'Blockchain & Wallets',
    eli5: 'Self-custody means you keep your own keys, like keeping cash in your own safe instead of a bank.',
    definition:
      'Holding your own private keys in your own wallet. No company can freeze your coins, but no one can help if you lose your keys.',
    example: 'Moving BTC from an exchange to your hardware wallet puts it in self-custody.',
    related: ['custody', 'seed-phrase', 'wallet'],
  },
  {
    id: 'gas-fee',
    term: 'Network fee (gas)',
    category: 'Blockchain & Wallets',
    eli5: 'The network fee is a small tip you pay the computers that write your payment into the blockchain.',
    definition:
      'A fee paid to a blockchain’s network to process a transaction. On Ethereum it’s called gas. It rises when the network is busy. It’s separate from exchange trading fees.',
    example: 'Sending ETH to a friend might cost a network fee of a few cents to a few dollars.',
    related: ['on-chain', 'trading-fee'],
  },
  {
    id: 'mining',
    term: 'Mining',
    category: 'Blockchain & Wallets',
    eli5: 'Miners are computers racing to solve a puzzle. The winner gets to add the next page to the record book and earns new coins.',
    definition:
      'Using computing power to add blocks to a proof-of-work blockchain like Bitcoin. Miners are paid with newly created coins plus the fees in the block.',
    example: 'Bitcoin miners run warehouses of special computers that use a lot of electricity.',
    related: ['block', 'halving', 'staking'],
  },
  {
    id: 'staking',
    term: 'Staking',
    category: 'Blockchain & Wallets',
    eli5: 'Staking is locking up some coins to help run a blockchain, and getting a few more coins as a thank-you.',
    definition:
      'Locking coins on a proof-of-stake blockchain, like Ethereum, to help validate transactions and earn rewards. Staked coins can lose value, and some can’t be sold right away.',
    example: 'Staking 32 ETH lets you run your own Ethereum validator.',
    related: ['mining', 'ether', 'risk'],
  },
  {
    id: 'halving',
    term: 'Halving',
    category: 'Blockchain & Wallets',
    eli5: 'Every few years, Bitcoin cuts the reward for miners in half, so new bitcoins appear more slowly.',
    definition:
      'An event built into Bitcoin’s rules, every 210,000 blocks (roughly four years), that halves the number of new coins miners receive per block.',
    example: 'After the April 2024 halving, miners get 3.125 BTC per block instead of 6.25.',
    related: ['mining', 'max-supply', 'bitcoin'],
  },
  {
    id: 'bitcoin',
    term: 'Bitcoin',
    category: 'Blockchain & Wallets',
    eli5: 'Bitcoin is the first and biggest cryptocurrency. There will only ever be 21 million.',
    definition:
      'A cryptocurrency launched in 2009. It runs on its own blockchain, secured by mining, with a fixed maximum supply of 21 million BTC.',
    example: 'One bitcoin can be split into 100 million pieces called satoshis.',
    related: ['crypto', 'halving', 'max-supply'],
  },
  {
    id: 'ether',
    term: 'Ethereum and Ether',
    category: 'Blockchain & Wallets',
    eli5: 'Ethereum is a blockchain that can run little programs. Ether (ETH) is the coin used to pay for them.',
    definition:
      'Ethereum is a blockchain for smart contracts, secured by staking since 2022. Ether is its coin, used for network fees and staking. It has no maximum supply.',
    example: 'Many tokens and stablecoins are built on Ethereum.',
    related: ['smart-contract', 'staking', 'gas-fee'],
  },
  {
    id: 'smart-contract',
    term: 'Smart contract',
    category: 'Blockchain & Wallets',
    eli5: 'A smart contract is a program on a blockchain that does what it says automatically, like a vending machine.',
    definition:
      'Code stored on a blockchain that runs exactly as written when conditions are met. Bugs in the code can’t easily be fixed and have led to large losses.',
    example: 'A lending app on Ethereum is a set of smart contracts.',
    related: ['ether', 'defi', 'token'],
  },
  {
    id: 'defi',
    term: 'DeFi',
    category: 'Blockchain & Wallets',
    eli5: 'DeFi means money apps with no bank behind them, just programs on a blockchain.',
    definition:
      'Short for decentralized finance: lending, borrowing and trading through smart contracts instead of companies. It can be risky because of code bugs and hacks.',
    example: 'Swapping one token for another on a decentralized exchange is DeFi.',
    related: ['smart-contract', 'rug-pull'],
  },
  {
    id: 'nft',
    term: 'NFT',
    category: 'Blockchain & Wallets',
    eli5: 'An NFT is a one-of-a-kind item on a blockchain, like a signed trading card that can’t be copied as the original.',
    definition:
      'A non-fungible token: a token that’s unique rather than interchangeable. It records who owns a specific item, often a piece of digital art.',
    example: 'One bitcoin is the same as any other bitcoin, but each NFT in a collection is different.',
    related: ['token', 'blockchain'],
  },

  // Buying & Selling
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
    related: ['market-order', 'open-order', 'stop-loss'],
  },
  {
    id: 'stop-loss',
    term: 'Stop-loss order',
    category: 'Buying & Selling',
    eli5: 'A stop-loss is a safety rope: “if the price falls to this number, sell for me so I don’t lose more.”',
    definition:
      'An order that becomes a sell order once the price falls to a level you choose. In a fast drop it can fill well below that level. This app doesn’t offer stop-loss orders yet.',
    example: 'You buy at $65,000 and set a stop at $60,000 to limit the loss to about 8%.',
    related: ['take-profit', 'limit-order', 'risk'],
  },
  {
    id: 'take-profit',
    term: 'Take-profit order',
    category: 'Buying & Selling',
    eli5: 'A take-profit order says: “when the price rises to this number, sell and keep my winnings.”',
    definition:
      'A sell order that triggers when the price rises to a level you choose, locking in a gain. A limit sell above the current price does the same job.',
    example: 'You buy at $65,000 and place a limit sell at $75,000.',
    related: ['stop-loss', 'limit-order', 'realized'],
  },
  {
    id: 'open-order',
    term: 'Open order',
    category: 'Buying & Selling',
    eli5: 'An open order is one that’s still waiting, like a note on the fridge that hasn’t been done yet.',
    definition:
      'An order that hasn’t filled or been cancelled. For limit buys the money is set aside; for limit sells the coins are set aside.',
    example: 'A limit buy at $60,000 stays open until the price gets there or you cancel it.',
    related: ['limit-order', 'fill'],
  },
  {
    id: 'fill',
    term: 'Fill',
    category: 'Buying & Selling',
    eli5: 'A fill is when your order actually happens and you get the coins (or the money).',
    definition:
      'The completed trade that results from an order, with its final price and amount. An order can fill all at once or in parts.',
    example: 'Your 0.1 BTC market order filled at $65,066.',
    related: ['market-order', 'open-order', 'slippage'],
  },
  {
    id: 'order-book',
    term: 'Order book',
    category: 'Buying & Selling',
    eli5: 'The order book is the list of everyone waiting to buy and everyone waiting to sell, and at what price.',
    definition:
      'An exchange’s live list of open buy orders (bids) and sell orders (asks). The best bid and best ask are at the top.',
    example: 'An order book might show buyers waiting at $64,999 and sellers waiting at $65,001.',
    related: ['bid', 'ask', 'liquidity'],
  },
  {
    id: 'bid',
    term: 'Bid',
    category: 'Buying & Selling',
    eli5: 'The bid is the best offer from someone waiting to buy. If you sold right now, that’s about what you’d get.',
    definition: 'The highest price any buyer is currently offering on an exchange.',
    example: 'A bid of $64,999 means someone is ready to buy at $64,999.',
    related: ['ask', 'spread', 'order-book'],
  },
  {
    id: 'ask',
    term: 'Ask',
    category: 'Buying & Selling',
    eli5: 'The ask is the cheapest price a seller will take right now. If you bought right now, that’s about what you’d pay.',
    definition: 'The lowest price any seller is currently asking on an exchange. Also called the offer.',
    example: 'An ask of $65,001 means someone is ready to sell at $65,001.',
    related: ['bid', 'spread', 'order-book'],
  },
  {
    id: 'spread',
    term: 'Spread',
    category: 'Buying & Selling',
    eli5: 'The spread is the small gap between what buyers offer and what sellers want. It’s a hidden cost: buying and then selling straight away loses about this much.',
    definition:
      'The ask minus the bid. A small spread usually means a busy market that’s cheap to trade; a wide spread means trading costs more.',
    example: 'A bid of $64,999 and an ask of $65,001 make a $2 spread.',
    related: ['bid', 'ask', 'liquidity'],
  },
  {
    id: 'liquidity',
    term: 'Liquidity',
    category: 'Buying & Selling',
    eli5: 'Liquidity is how easy it is to buy or sell without moving the price, like how easy it is to find a buyer for a popular toy.',
    definition:
      'How much can be traded quickly near the current price. High liquidity means small spreads and little slippage; low liquidity means the opposite.',
    example: 'BTC-USD on a big exchange is very liquid; a tiny new token may not be.',
    related: ['spread', 'slippage', 'volume'],
  },
  {
    id: 'slippage',
    term: 'Slippage',
    category: 'Buying & Selling',
    eli5: 'Slippage is when you pay a little more than the price you saw, because the price moved or there weren’t enough sellers at that price.',
    definition:
      'The difference between the price you expected and the price you actually get. This app adds a small slippage setting to every market order so practice results aren’t better than real life.',
    example: 'With 0.1% slippage, a $65,000 ask becomes a $65,065 fill.',
    related: ['market-order', 'liquidity', 'trading-fee'],
  },
  {
    id: 'trading-fee',
    term: 'Trading fee',
    category: 'Buying & Selling',
    eli5: 'The exchange charges a small fee every time you trade, like a ticket to get in.',
    definition:
      'A charge the exchange takes on each trade, usually a percentage of its value. Real fees depend on the exchange and on how much you trade.',
    example: 'A 0.5% fee on a $1,000 purchase costs $5.',
    related: ['maker-taker', 'slippage', 'gas-fee'],
  },
  {
    id: 'maker-taker',
    term: 'Maker and taker',
    category: 'Buying & Selling',
    eli5: 'A maker puts a new offer on the board and waits. A taker grabs an offer that’s already there. Takers usually pay a slightly bigger fee.',
    definition:
      'A maker order adds to the order book (like a limit order that waits); a taker order fills against it right away (like a market order). Exchanges often charge takers more.',
    example: 'An exchange might charge 0.25% for makers and 0.40% for takers.',
    related: ['trading-fee', 'order-book', 'limit-order'],
  },
  {
    id: 'position',
    term: 'Position',
    category: 'Buying & Selling',
    eli5: 'A position is how much of a coin you’re holding right now.',
    definition:
      'The amount of an asset you own (or owe, if you’re short). Opening a position means buying; closing it means selling.',
    example: 'Holding 0.3 BTC is a 0.3 BTC position.',
    related: ['long', 'short-selling', 'average-cost'],
  },
  {
    id: 'long',
    term: 'Going long',
    category: 'Buying & Selling',
    eli5: 'Going long means buying something because you think its price will go up.',
    definition:
      'Owning an asset so you gain if its price rises and lose if it falls. Everything you buy in this app is a long position.',
    example: 'Buying 1 ETH at $2,500 hoping it reaches $3,000 is going long.',
    related: ['short-selling', 'position'],
  },
  {
    id: 'short-selling',
    term: 'Short selling',
    category: 'Buying & Selling',
    eli5: 'Short selling is borrowing a coin, selling it, and hoping to buy it back cheaper later. You win if the price falls.',
    definition:
      'Selling a borrowed asset to profit if its price drops. Losses have no ceiling, because the price can keep rising. This app doesn’t allow short selling.',
    example: 'Borrow 1 ETH, sell at $2,500, buy back at $2,000, return it: $500 profit before fees and interest.',
    related: ['long', 'margin', 'leverage'],
  },
  {
    id: 'average-cost',
    term: 'Average cost',
    category: 'Buying & Selling',
    eli5: 'If you bought the same coin at different prices, the average cost is the in-between price you paid for each one.',
    definition: 'What you paid for the coins you still hold, including buy fees, divided by how many you hold.',
    example: 'Buying 1 BTC at $60,000 and 1 at $70,000 gives an average cost of $65,000, plus fees.',
    related: ['unrealized', 'realized', 'dca'],
  },
  {
    id: 'dca',
    term: 'Dollar-cost averaging',
    category: 'Buying & Selling',
    eli5: 'Dollar-cost averaging means buying a little bit on a regular schedule, instead of all at once, so you don’t have to guess the best day.',
    definition:
      'Investing a fixed amount at regular intervals no matter the price. It spreads out your buys but doesn’t guarantee a profit or protect against falling prices.',
    example: 'Buying $100 of BTC on the first day of every month.',
    related: ['investing', 'average-cost'],
  },
  {
    id: 'rebalancing',
    term: 'Rebalancing',
    category: 'Buying & Selling',
    eli5: 'Rebalancing is tidying your portfolio so each part is back to the size you planned.',
    definition: 'Buying and selling to bring your allocation back to your target mix after prices have moved.',
    example: 'You wanted 50% BTC and 50% cash. BTC rose to 60%, so you sell some to get back to 50%.',
    related: ['allocation', 'diversification'],
  },

  // Prices & Charts
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
    related: ['price', 'high-low', 'volatility'],
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
    related: ['liquidity', 'price'],
  },
  {
    id: 'line-chart',
    term: 'Line chart',
    category: 'Prices & Charts',
    eli5: 'A line chart joins the prices over time with one line, so you can see if it went up or down.',
    definition: 'A chart with one price per time step, here the closing price, joined by a line.',
    example: 'A line that ends higher than it started means the price rose over that period.',
    related: ['candlestick', 'time-frame'],
  },
  {
    id: 'candlestick',
    term: 'Candlestick',
    category: 'Prices & Charts',
    eli5: 'Each candle is one slice of time. Its thick body shows where the price started and ended. The thin lines show the highest and lowest it went.',
    definition:
      'A chart bar showing the open, high, low and close for one period. In this app, a green candle closed higher than it opened and a red one closed lower.',
    example: 'A daily candle from $100 to $110 with a thin line up to $115 hit $115 but ended the day at $110.',
    related: ['open-close', 'high-low', 'line-chart'],
  },
  {
    id: 'open-close',
    term: 'Open and close',
    category: 'Prices & Charts',
    eli5: 'The open is the price at the start of a time slice. The close is the price at the end.',
    definition:
      'The first and last trade prices in a period. Crypto never closes, so a daily “close” is just the price at the end of the day, usually midnight UTC.',
    example: 'A day that opened at $64,000 and closed at $65,000 was up $1,000.',
    related: ['candlestick', 'utc', 'end-of-day'],
  },
  {
    id: 'time-frame',
    term: 'Time frame',
    category: 'Prices & Charts',
    eli5: 'The time frame is how zoomed in the chart is: one day up close, or five years far away.',
    definition:
      'The period a chart covers and how long each point or candle lasts. Short time frames show more noise; long ones show the bigger trend.',
    example: 'The 1D chart uses 5-minute points; the 5Y chart uses daily points.',
    related: ['line-chart', 'trend'],
  },
  {
    id: 'trend',
    term: 'Trend',
    category: 'Prices & Charts',
    eli5: 'A trend is the general direction the price is heading, like walking up or down a hill with small bumps.',
    definition:
      'The overall direction of prices over a period: up, down, or sideways. A trend can reverse at any time.',
    example: 'Higher highs and higher lows over several months form an uptrend.',
    related: ['moving-average', 'support', 'bull-market'],
  },
  {
    id: 'support',
    term: 'Support',
    category: 'Prices & Charts',
    eli5: 'Support is a price floor where the price stopped falling before, like a trampoline it bounced off.',
    definition:
      'A price level where buying has stopped declines in the past. It’s a pattern people watch, not a guarantee; prices often break through.',
    example: 'If BTC bounced at $60,000 three times, traders call $60,000 support.',
    related: ['resistance', 'trend'],
  },
  {
    id: 'resistance',
    term: 'Resistance',
    category: 'Prices & Charts',
    eli5: 'Resistance is a price ceiling where the price stopped rising before, like bumping your head on a low shelf.',
    definition: 'A price level where selling has stopped rises in the past. Like support, it’s a pattern, not a rule.',
    example: 'If ETH turned down near $3,000 several times, $3,000 is resistance.',
    related: ['support', 'trend'],
  },
  {
    id: 'volatility',
    term: 'Volatility',
    category: 'Prices & Charts',
    eli5: 'Volatility is how wildly the price jumps around, like a bumpy roller coaster compared with a calm train ride.',
    definition:
      'How much and how fast a price moves up and down. Crypto is usually much more volatile than stocks or bonds, so gains and losses can be large.',
    example: 'A coin that moves 10% in a day is far more volatile than one that moves 1%.',
    related: ['risk', 'drawdown', 'change-24h'],
  },
  {
    id: 'moving-average',
    term: 'Moving average',
    category: 'Prices & Charts',
    eli5: 'A moving average smooths the wiggly price line by averaging the last few days, so you can see the direction more easily.',
    definition:
      'The average price over a set number of past periods, recalculated each period. A 50-day moving average averages the last 50 daily closes.',
    example: 'When the price is above its 200-day moving average, many people call the trend up.',
    related: ['trend', 'line-chart'],
  },
  {
    id: 'dip',
    term: 'Dip',
    category: 'Prices & Charts',
    eli5: 'A dip is a short drop in price. “Buying the dip” means buying after a drop, hoping it bounces back.',
    definition:
      'A short-term price decline within a longer trend. A dip can turn into a much bigger fall, so buying one is still a risk.',
    example: 'BTC falling from $65,000 to $61,000 in two days is a dip.',
    related: ['trend', 'drawdown', 'fomo'],
  },
  {
    id: 'correction',
    term: 'Correction',
    category: 'Prices & Charts',
    eli5: 'A correction is a bigger drop after prices went up a lot, like a ball coming back down after being thrown up.',
    definition:
      'A decline of about 10% or more from a recent high. For stocks, a correction is usually 10% to 20%; bigger falls are called a bear market.',
    example: 'ETH dropping from $3,000 to $2,600 would be a correction of about 13%.',
    related: ['dip', 'bear-market', 'drawdown'],
  },

  // Coin Numbers
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
      'Coins created so far, minus coins permanently destroyed. Includes coins that aren’t in circulation yet.',
    example:
      'If 1,000 coins exist and 200 are locked for the team, total supply is 1,000 and circulating supply is 800.',
    related: ['circulating-supply', 'max-supply', 'burn'],
  },
  {
    id: 'max-supply',
    term: 'Max supply',
    category: 'Coin Numbers',
    eli5: 'The most coins that will ever exist. Some coins have a limit. Others can keep making new ones forever.',
    definition: 'The hard cap on how many coins can ever be created, if the coin’s rules set one.',
    example: 'Bitcoin’s max supply is 21 million. Ether has no max supply.',
    related: ['total-supply', 'fdv', 'halving'],
  },
  {
    id: 'fdv',
    term: 'Fully diluted valuation',
    category: 'Coin Numbers',
    eli5: 'What the market cap would be if every coin that will ever exist were already out there, at today’s price.',
    definition:
      'Price × max supply, or × total supply when there’s no max. A big gap between this and market cap means many more coins are still to be released.',
    example: '21 million BTC × $65,000 = $1.365 trillion.',
    related: ['market-cap', 'max-supply', 'token-unlock'],
  },
  {
    id: 'rank',
    term: 'Market cap rank',
    category: 'Coin Numbers',
    eli5: 'The coin’s place in a list sorted by market cap. Number 1 is the biggest.',
    definition:
      'A coin’s position by market cap among all the coins a data provider tracks. Providers can rank slightly differently.',
    example: 'Rank 1 means the largest market cap on CoinGecko’s list.',
    related: ['market-cap', 'dominance'],
  },
  {
    id: 'dominance',
    term: 'Bitcoin dominance',
    category: 'Coin Numbers',
    eli5: 'Bitcoin dominance is how big Bitcoin’s slice is compared with the whole crypto pie.',
    definition:
      'Bitcoin’s market cap as a percentage of the total market cap of all cryptocurrencies. Each data provider calculates it from its own list of coins.',
    example: 'If all crypto is worth $2.5 trillion and bitcoin $1.3 trillion, dominance is 52%.',
    related: ['market-cap', 'rank', 'bitcoin'],
  },
  {
    id: 'ath',
    term: 'All-time high',
    category: 'Coin Numbers',
    eli5: 'The highest price the coin has ever reached.',
    definition:
      'The highest price a data provider has recorded since the coin started trading. Providers can report slightly different highs.',
    example: 'With an all-time high of $124,000 and a price of $65,000, the price is about 48% below its high.',
    related: ['drawdown', 'high-low'],
  },
  {
    id: 'burn',
    term: 'Token burn',
    category: 'Coin Numbers',
    eli5: 'Burning coins means sending them somewhere no one can ever use them again, so there are fewer left.',
    definition:
      'Permanently removing coins from supply, usually by sending them to an address no one controls. Fewer coins doesn’t by itself mean a higher price.',
    example: 'Ethereum burns part of every network fee.',
    related: ['total-supply', 'inflation'],
  },
  {
    id: 'inflation',
    term: 'Supply inflation',
    category: 'Coin Numbers',
    eli5: 'Supply inflation means new coins keep being made, so each coin is a slightly smaller slice of the pie.',
    definition:
      'The rate at which new coins are created, usually per year. New supply can push the price down if demand doesn’t grow as fast.',
    example: 'A coin with 5% yearly supply inflation has 5% more coins each year.',
    related: ['max-supply', 'burn', 'staking'],
  },
  {
    id: 'token-unlock',
    term: 'Token unlock',
    category: 'Coin Numbers',
    eli5: 'Some coins are kept in a locked box for the team and early buyers. An unlock is when the box opens and they can sell.',
    definition:
      'A scheduled release of coins that were locked for founders, investors or the project. Large unlocks add supply that may be sold.',
    example: 'A project that unlocks 10% of its supply next month could see extra selling.',
    related: ['circulating-supply', 'fdv'],
  },

  // Risk
  {
    id: 'risk',
    term: 'Risk',
    category: 'Risk',
    eli5: 'Risk is the chance that things go worse than you hoped, and you lose money.',
    definition:
      'The chance of losing some or all of your money, and how big the losses could be. Higher possible gains usually come with higher risk. Crypto is a high-risk asset.',
    example: 'A coin that could double could also halve.',
    related: ['volatility', 'diversification', 'drawdown'],
  },
  {
    id: 'diversification',
    term: 'Diversification',
    category: 'Risk',
    eli5: 'Don’t put all your eggs in one basket. If one basket falls, you still have eggs in the others.',
    definition:
      'Spreading money across different assets so one bad investment doesn’t sink everything. Crypto coins often move together, so owning several coins diversifies less than it seems.',
    example: 'Holding some BTC, some ETH and plenty of cash is more diversified than holding only one small coin.',
    related: ['allocation', 'risk', 'rebalancing'],
  },
  {
    id: 'allocation',
    term: 'Allocation',
    category: 'Risk',
    eli5: 'Allocation shows how your money is split up, like how many slices of a pizza go to each friend.',
    definition: 'Each holding’s share of your portfolio’s total value.',
    example: '$25,000 in BTC out of $100,000 in total is a 25% allocation.',
    related: ['portfolio', 'diversification', 'rebalancing'],
  },
  {
    id: 'drawdown',
    term: 'Drawdown',
    category: 'Risk',
    eli5: 'A drawdown is how far something has fallen from its highest point before it climbs back.',
    definition:
      'The drop from a peak value to a later low, usually as a percentage. It shows how much pain you’d have gone through holding it.',
    example: 'A portfolio that went from $100,000 down to $70,000 had a 30% drawdown.',
    related: ['volatility', 'ath', 'risk'],
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
    related: ['unrealized', 'average-cost', 'take-profit'],
  },
  {
    id: 'leverage',
    term: 'Leverage',
    category: 'Risk',
    eli5: 'Leverage is trading with borrowed money so your bet is bigger than your own money. Wins and losses both get bigger.',
    definition:
      'Using borrowed funds to control a larger position. With 10× leverage, a 10% move against you can wipe out your whole stake. This app doesn’t use leverage.',
    example: '$1,000 with 5× leverage controls $5,000 of BTC; a 20% drop loses all $1,000.',
    related: ['margin', 'liquidation', 'risk'],
  },
  {
    id: 'margin',
    term: 'Margin',
    category: 'Risk',
    eli5: 'Margin is the money you put down yourself when you borrow the rest to trade, like a deposit.',
    definition:
      'Your own money held as security for a leveraged trade. If losses eat into it, the exchange asks for more (a margin call) or closes your position.',
    example: 'A $5,000 position with $1,000 of margin is 5× leverage.',
    related: ['leverage', 'liquidation', 'short-selling'],
  },
  {
    id: 'liquidation',
    term: 'Liquidation',
    category: 'Risk',
    eli5: 'Liquidation is when the exchange sells your position for you because your losses got too big for the money you put down.',
    definition:
      'The forced closing of a leveraged position when your margin can no longer cover losses. You lose most or all of that margin.',
    example: 'At 10× leverage, roughly a 10% move against you can trigger liquidation.',
    related: ['leverage', 'margin'],
  },
  {
    id: 'hedge',
    term: 'Hedging',
    category: 'Risk',
    eli5: 'Hedging is carrying an umbrella: a second bet that helps if your first bet goes wrong.',
    definition:
      'Taking a position that tends to gain when your main position loses, to reduce risk. Hedges cost money and also reduce gains.',
    example: 'Holding cash or a stablecoin alongside BTC is a simple hedge against BTC falling.',
    related: ['risk', 'diversification'],
  },
  {
    id: 'stablecoin',
    term: 'Stablecoin',
    category: 'Risk',
    eli5: 'A stablecoin tries to always be worth the same, usually one US dollar, like a digital dollar bill.',
    definition:
      'A cryptocurrency designed to hold a fixed value, usually $1, typically backed by cash and short-term government debt held by the company that issues it. Stable is the goal, not a guarantee.',
    example: 'USDC and USDT aim to be worth $1 each.',
    related: ['depeg', 'token', 'fiat'],
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
    related: ['stablecoin', 'counterparty-risk'],
  },
  {
    id: 'counterparty-risk',
    term: 'Counterparty risk',
    category: 'Risk',
    eli5: 'Counterparty risk is the chance that the company holding your money can’t give it back.',
    definition:
      'The risk that the other side of a deal, such as an exchange or stablecoin issuer, fails or doesn’t pay. Crypto exchanges have collapsed before and customers lost money.',
    example: 'When the FTX exchange collapsed in 2022, many customers couldn’t withdraw their funds.',
    related: ['custody', 'self-custody', 'depeg'],
  },
  {
    id: 'rug-pull',
    term: 'Rug pull',
    category: 'Risk',
    eli5: 'A rug pull is when the people behind a coin suddenly run off with the money, like pulling a rug from under everyone’s feet.',
    definition:
      'A scam where a project’s creators drain its funds or sell all their coins, leaving buyers with a coin worth close to nothing.',
    example: 'A new token with anonymous founders and a locked website is a classic warning sign.',
    related: ['pump-and-dump', 'phishing', 'defi'],
  },
  {
    id: 'pump-and-dump',
    term: 'Pump and dump',
    category: 'Risk',
    eli5: 'A pump and dump is when a group hypes a coin so others buy, then the group sells at the top and the price crashes.',
    definition:
      'Market manipulation: pushing up a price with coordinated buying and hype, then selling to the people who bought late. It’s illegal in regulated markets.',
    example: 'A small coin that jumps 300% after a flood of social-media posts, then falls 80% the next day.',
    related: ['rug-pull', 'fomo', 'volatility'],
  },
  {
    id: 'phishing',
    term: 'Phishing',
    category: 'Risk',
    eli5: 'Phishing is a trick where someone pretends to be a company you trust so you hand over your password or keys.',
    definition:
      'Fake emails, messages, ads or websites that copy real ones to steal logins, seed phrases or money. Always type the address yourself instead of clicking links.',
    example: 'A message saying “Verify your wallet now” with a link to a look-alike site.',
    related: ['private-key', 'seed-phrase', 'rug-pull'],
  },
  {
    id: 'fomo',
    term: 'FOMO',
    category: 'Risk',
    eli5: 'FOMO means fear of missing out: wanting to buy just because everyone else is and the price is going up.',
    definition:
      'Buying on emotion after a big rise, afraid of missing more gains. It often leads to buying near the top.',
    example: 'Buying a coin because it rose 50% this week and everyone’s talking about it.',
    related: ['pump-and-dump', 'trade-journal', 'dip'],
  },

  // Stocks & Funds
  {
    id: 'stock',
    term: 'Stock',
    category: 'Stocks & Funds',
    eli5: 'A stock is a tiny slice of a company, like owning a slice of a pizza shop. If the shop does well, your slice is worth more.',
    definition: 'Ownership in a company, bought and sold in shares on a stock exchange.',
    example: 'Coinbase’s stock trades under the symbol COIN.',
    related: ['share', 'etf', 'dividend'],
  },
  {
    id: 'share',
    term: 'Share',
    category: 'Stocks & Funds',
    eli5: 'A share is one slice of a company. The more shares you have, the bigger your slice.',
    definition: 'One unit of ownership in a company or fund.',
    example: 'If a company has 1,000 shares and you own 10, you own 1% of it.',
    related: ['stock', 'etf'],
  },
  {
    id: 'etf',
    term: 'ETF',
    category: 'Stocks & Funds',
    eli5: 'An ETF is a basket of things you can buy in one go, like a fruit basket instead of buying each fruit.',
    definition:
      'An exchange-traded fund: a fund that holds assets and trades on a stock exchange like a stock. It charges a yearly fee.',
    example: 'An S&P 500 ETF holds shares of 500 large US companies.',
    related: ['spot-bitcoin-etf', 'expense-ratio', 'fund'],
  },
  {
    id: 'spot-bitcoin-etf',
    term: 'Spot bitcoin ETF',
    category: 'Stocks & Funds',
    eli5: 'A spot bitcoin ETF is a fund that owns real bitcoin, so you can own a piece of it through a normal stock account.',
    definition:
      'An ETF that holds actual bitcoin and tracks its price, minus fees. US spot bitcoin ETFs began trading in January 2024; spot ether ETFs followed in July 2024.',
    example: 'IBIT (iShares Bitcoin Trust) and FBTC (Fidelity Wise Origin Bitcoin Fund) are spot bitcoin ETFs.',
    related: ['etf', 'thirteen-f', 'expense-ratio'],
  },
  {
    id: 'fund',
    term: 'Fund',
    category: 'Stocks & Funds',
    eli5: 'A fund is a big pot of money from many people that a manager invests together.',
    definition:
      'A pool of money from many investors, managed as one portfolio. Mutual funds, ETFs and hedge funds are all types of funds.',
    example: 'You own a small part of everything the fund holds.',
    related: ['etf', 'hedge-fund', 'institutional-investor'],
  },
  {
    id: 'hedge-fund',
    term: 'Hedge fund',
    category: 'Stocks & Funds',
    eli5: 'A hedge fund is a private fund for rich people and big organizations that can use riskier tricks than normal funds.',
    definition:
      'A lightly regulated private fund, usually open only to wealthy or professional investors, that can use leverage, short selling and complex strategies.',
    example: 'Many large hedge funds file 13F reports that show their US-listed holdings.',
    related: ['fund', 'institutional-investor', 'thirteen-f'],
  },
  {
    id: 'institutional-investor',
    term: 'Institutional investor',
    category: 'Stocks & Funds',
    eli5: 'An institutional investor is a big organization that invests lots of money, like a pension fund or a bank.',
    definition:
      'An organization that invests on behalf of others, such as a pension fund, insurer, bank, asset manager or hedge fund.',
    example: 'A pension fund buying a spot bitcoin ETF is an institutional investor.',
    related: ['hedge-fund', 'thirteen-f'],
  },
  {
    id: 'expense-ratio',
    term: 'Expense ratio',
    category: 'Stocks & Funds',
    eli5: 'The expense ratio is the yearly fee a fund charges, taken out a tiny bit at a time.',
    definition:
      'A fund’s yearly cost as a percentage of the money invested. It’s deducted from the fund’s value, so you don’t get a separate bill.',
    example: 'A 0.25% expense ratio on $10,000 costs about $25 a year.',
    related: ['etf', 'spot-bitcoin-etf'],
  },
  {
    id: 'index',
    term: 'Index',
    category: 'Stocks & Funds',
    eli5: 'An index is a scoreboard that tracks a group of things, so one number shows how the whole group is doing.',
    definition:
      'A measure of the value of a group of assets, like the S&P 500 for large US companies. You can’t buy an index directly, but funds can track one.',
    example: 'When “the S&P 500 is up 1%”, the index rose 1%.',
    related: ['etf', 'fund'],
  },
  {
    id: 'dividend',
    term: 'Dividend',
    category: 'Stocks & Funds',
    eli5: 'A dividend is a small payment a company sends to its owners from its profits, like a thank-you share of the pizza shop’s earnings.',
    definition:
      'Cash (or shares) a company pays its shareholders, usually every quarter. Most coins don’t pay dividends.',
    example: 'A $0.50 dividend on 100 shares pays you $50.',
    related: ['stock', 'earnings'],
  },
  {
    id: 'revenue',
    term: 'Revenue',
    category: 'Stocks & Funds',
    eli5: 'Revenue is all the money a company takes in from selling things, before paying any bills.',
    definition:
      'The total money a company earns from sales in a period, before costs. Also called sales or the top line.',
    example: 'A pizza shop that sells 1,000 pizzas at $10 has $10,000 of revenue.',
    related: ['earnings', 'pe-ratio'],
  },
  {
    id: 'earnings',
    term: 'Earnings',
    category: 'Stocks & Funds',
    eli5: 'Earnings are what a company keeps after paying all its bills. It’s the profit.',
    definition: 'A company’s profit after all costs and taxes, often reported per share (EPS) every quarter.',
    example: 'Revenue of $10,000 with $8,000 of costs leaves $2,000 of earnings.',
    related: ['revenue', 'pe-ratio', 'dividend'],
  },
  {
    id: 'pe-ratio',
    term: 'P/E ratio',
    category: 'Stocks & Funds',
    eli5: 'The P/E ratio tells you how many dollars people pay for each dollar a company earns in a year.',
    definition:
      'Share price divided by earnings per share over a year. A high P/E means investors expect growth, or the stock is expensive. Coins don’t have earnings, so they have no P/E.',
    example: 'If a share costs $300 and the company earns $10 per share a year, the P/E is 30.',
    related: ['earnings', 'stock'],
  },

  // Copy Trading & Filings
  {
    id: 'copy-trading',
    term: 'Copy trading',
    category: 'Copy Trading & Filings',
    eli5: 'Copy trading means doing what a famous investor did. The catch: you usually find out weeks or months later.',
    definition:
      'Following the disclosed trades of other investors. Public filings arrive late, so by the time you see a move, prices may have changed a lot.',
    example: 'A fund bought a bitcoin ETF in March, but its report came out in May.',
    related: ['disclosure-delay', 'thirteen-f', 'ptr'],
  },
  {
    id: 'sec',
    term: 'SEC',
    category: 'Copy Trading & Filings',
    eli5: 'The SEC is the US government agency that makes rules for investing and checks that companies tell the truth.',
    definition:
      'The US Securities and Exchange Commission. It regulates securities markets and collects required reports from companies, funds and insiders.',
    example: 'Funds send their 13F reports to the SEC.',
    related: ['edgar', 'thirteen-f', 'form-4'],
  },
  {
    id: 'edgar',
    term: 'EDGAR',
    category: 'Copy Trading & Filings',
    eli5: 'EDGAR is the SEC’s free public library of company and fund reports, on the internet.',
    definition: 'The SEC’s online filing system and database. Anyone can search it for free.',
    example: 'You can look up a fund’s 13F reports on EDGAR.',
    related: ['sec', 'filing-date'],
  },
  {
    id: 'thirteen-f',
    term: 'Form 13F',
    category: 'Copy Trading & Filings',
    eli5: 'A 13F is a report card big investment managers must show every three months, listing what US-listed things they own.',
    definition:
      'A quarterly SEC report from investment managers with $100 million or more in certain US-listed securities. It lists long holdings on the last day of the quarter and is due within 45 days. It doesn’t show short positions or coins held directly.',
    example: 'A fund’s 13F for the quarter ending 31 March may only appear in mid-May.',
    related: ['disclosure-delay', 'quarter', 'hedge-fund'],
  },
  {
    id: 'form-4',
    term: 'Form 4',
    category: 'Copy Trading & Filings',
    eli5: 'A Form 4 is a note company insiders must send when they buy or sell their own company’s stock.',
    definition:
      'An SEC filing that officers, directors and owners of more than 10% of a company must file within two business days of trading its shares.',
    example: 'A company director sells shares on Monday; the Form 4 is due by Wednesday.',
    related: ['insider', 'sec'],
  },
  {
    id: 'insider',
    term: 'Insider',
    category: 'Copy Trading & Filings',
    eli5: 'An insider is someone important inside a company, like a boss or a big owner.',
    definition:
      'An officer, director or owner of more than 10% of a company. Insiders must report their trades, and trading on secret information is illegal.',
    example: 'The CEO of a public company is an insider.',
    related: ['form-4', 'stock'],
  },
  {
    id: 'quarter',
    term: 'Quarter',
    category: 'Copy Trading & Filings',
    eli5: 'A quarter is a quarter of a year: three months.',
    definition: 'A three-month period. Calendar quarters end on 31 March, 30 June, 30 September and 31 December.',
    example: 'Q1 is January to March.',
    related: ['thirteen-f', 'earnings'],
  },
  {
    id: 'filing-date',
    term: 'Filing date',
    category: 'Copy Trading & Filings',
    eli5: 'The filing date is the day a report was handed in, which can be long after the trade happened.',
    definition:
      'The date a report was submitted and became public. Copy-trading research should start from this date, because that’s when you could first have known.',
    example: 'A trade on 2 March disclosed on 15 April has a filing date of 15 April.',
    related: ['disclosure-delay', 'edgar'],
  },
  {
    id: 'disclosure-delay',
    term: 'Disclosure delay',
    category: 'Copy Trading & Filings',
    eli5: 'Disclosure delay is the waiting time between a trade and the day everyone finds out about it.',
    definition:
      'The gap between when a trade or holding happened and when it was publicly reported. For 13F it can be up to 45 days after the quarter ends; for Congress up to 45 days after the trade.',
    example: 'A fund that bought on 2 January might not report it until mid-May.',
    related: ['filing-date', 'thirteen-f', 'ptr'],
  },
  {
    id: 'stock-act',
    term: 'STOCK Act',
    category: 'Copy Trading & Filings',
    eli5: 'The STOCK Act is a US law that makes members of Congress tell the public about their trades.',
    definition:
      'A 2012 US law that requires members of Congress and senior staff to publicly report trades of stocks, bonds and similar assets over $1,000. The House and Senate ethics rules treat crypto trades as reportable too.',
    example: 'Because of the STOCK Act, a senator’s bitcoin sale shows up in a public report.',
    related: ['ptr', 'amount-range'],
  },
  {
    id: 'ptr',
    term: 'Periodic Transaction Report',
    category: 'Copy Trading & Filings',
    eli5: 'A PTR is the form a member of Congress fills in to tell everyone about a trade they made.',
    definition:
      'The STOCK Act disclosure a member of Congress files for a trade. It’s due within 30 days of learning about the trade and no later than 45 days after it.',
    example: 'A trade on 1 May could be reported as late as mid-June.',
    related: ['stock-act', 'amount-range', 'disclosure-delay'],
  },
  {
    id: 'amount-range',
    term: 'Amount range',
    category: 'Copy Trading & Filings',
    eli5: 'Congress reports don’t say the exact amount, just a range, like saying “between 5 and 10 candies”.',
    definition:
      'Congressional disclosures give trade sizes in ranges, such as $1,001–$15,000, not exact amounts. Any exact figure built from them is an estimate.',
    example: 'A “$15,001–$50,000” purchase could be $16,000 or $49,000.',
    related: ['ptr', 'stock-act'],
  },

  // Market Times
  {
    id: 'twenty-four-seven',
    term: '24/7 market',
    category: 'Market Times',
    eli5: 'Crypto markets never close, not at night, not at weekends, not on holidays.',
    definition:
      'Crypto trades every hour of every day. Prices can move a lot while you sleep, and trading can be thinner at quiet times.',
    example: 'Bitcoin can drop 5% on a Sunday at 3 a.m.',
    related: ['trading-hours', 'utc', 'maintenance'],
  },
  {
    id: 'trading-hours',
    term: 'Trading hours',
    category: 'Market Times',
    eli5: 'Stock markets have opening hours, like a shop. Crypto markets don’t.',
    definition:
      'The times an exchange is open. The main US stock exchanges are open 9:30 a.m. to 4:00 p.m. New York time on weekdays, so ETFs like IBIT only trade then.',
    example: 'You can buy BTC on Saturday, but not shares of a bitcoin ETF.',
    related: ['pre-market', 'after-hours', 'twenty-four-seven'],
  },
  {
    id: 'pre-market',
    term: 'Pre-market',
    category: 'Market Times',
    eli5: 'Pre-market is early-bird trading before the stock market’s doors officially open.',
    definition:
      'Stock trading before the regular session opens at 9:30 a.m. New York time. Brokers set their own start times, some as early as 4:00 a.m. Fewer people trade, so prices can jump and spreads are wider.',
    example: 'A company’s shares moving at 7 a.m. after overnight news.',
    related: ['after-hours', 'trading-hours'],
  },
  {
    id: 'after-hours',
    term: 'After-hours',
    category: 'Market Times',
    eli5: 'After-hours is late trading after the stock market’s doors officially close.',
    definition:
      'Stock trading after the regular session closes at 4:00 p.m. New York time, often until 8:00 p.m. depending on the broker. Like pre-market, it’s thinner and more jumpy.',
    example: 'Shares reacting to earnings released at 4:05 p.m.',
    related: ['pre-market', 'trading-hours'],
  },
  {
    id: 'market-holiday',
    term: 'Market holiday',
    category: 'Market Times',
    eli5: 'A market holiday is a day the stock market takes off, like a school holiday.',
    definition:
      'A weekday when stock exchanges are closed, such as Christmas Day in the US. Crypto keeps trading on these days.',
    example: 'Bitcoin trades on 25 December; bitcoin ETFs don’t.',
    related: ['trading-hours', 'twenty-four-seven'],
  },
  {
    id: 'utc',
    term: 'UTC',
    category: 'Market Times',
    eli5: 'UTC is one clock the whole world agrees on, so everyone means the same moment.',
    definition:
      'Coordinated Universal Time, the reference time zone with no daylight saving. Crypto daily charts usually start and end each day at midnight UTC.',
    example: 'Midnight UTC is 3 a.m. in Athens in summer and 2 a.m. in winter.',
    related: ['open-close', 'end-of-day'],
  },
  {
    id: 'maintenance',
    term: 'Exchange maintenance',
    category: 'Market Times',
    eli5: 'Sometimes an exchange closes for a short time to fix or upgrade things, like a shop closing to restock.',
    definition:
      'A planned or emergency pause when an exchange stops some or all trading. Prices elsewhere keep moving. The app shows exchange status on the Home page.',
    example: 'Kraken showing “cancel only” means you can cancel orders but not place new ones.',
    related: ['twenty-four-seven', 'stale-data'],
  },

  // Data & Sources
  {
    id: 'live-data',
    term: 'Live',
    category: 'Data & Sources',
    eli5: 'Live means the price comes from a trade that happened moments ago.',
    definition: 'In this app: the exchange reported a trade in the last 5 minutes.',
    example: 'Live · last trade 3 seconds ago.',
    related: ['stale-data', 'delayed-data', 'price'],
  },
  {
    id: 'delayed-data',
    term: 'Delayed',
    category: 'Data & Sources',
    eli5: 'Delayed means the price is on purpose a few minutes old, like watching a game a bit behind the live broadcast.',
    definition:
      'Data a provider deliberately releases late, often 15 minutes for free stock prices. The crypto exchanges this app uses give real-time prices, so you’ll rarely see it.',
    example: 'Delayed 15 minutes · last trade 14:02.',
    related: ['live-data', 'stale-data'],
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
    id: 'end-of-day',
    term: 'End of day',
    category: 'Data & Sources',
    eli5: 'End of day means one number per day, like a daily diary instead of a minute-by-minute diary.',
    definition:
      'Data with one point per day. In this app, long charts use daily points; past days are final and today’s point keeps changing until midnight UTC.',
    example: 'The 1Y chart shows 365 end-of-day points.',
    related: ['open-close', 'utc'],
  },
  {
    id: 'cross-check',
    term: 'Price check',
    category: 'Data & Sources',
    eli5: 'The app asks more than one exchange for the price and checks they roughly agree, like asking two people what time it is.',
    definition:
      'Comparing the main price with other exchanges. A difference above 0.5% gets a warning, because one source may be wrong or behind.',
    example: 'Coinbase at $65,000 and Kraken at $65,010 are 0.02% apart, so they match.',
    related: ['exchange', 'stale-data', 'primary-source'],
  },
  {
    id: 'primary-source',
    term: 'Primary source',
    category: 'Data & Sources',
    eli5: 'A primary source is where the information starts, like hearing news from the person it happened to instead of a friend of a friend.',
    definition:
      'The original origin of data: the exchange where trades happen, or the official filing itself. Each step away from it adds chances for errors.',
    example: 'A 13F on EDGAR is the primary source; a blog post about it isn’t.',
    related: ['aggregator', 'edgar', 'cross-check'],
  },
  {
    id: 'aggregator',
    term: 'Data aggregator',
    category: 'Data & Sources',
    eli5: 'An aggregator collects prices from lots of exchanges and mixes them into one number.',
    definition:
      'A service like CoinGecko that combines data from many exchanges. Good for totals like market cap, but one step removed from the actual trades.',
    example: 'CoinGecko’s bitcoin price is an average across many exchanges, weighted by how much each one trades.',
    related: ['primary-source', 'market-cap'],
  },
  {
    id: 'api',
    term: 'API',
    category: 'Data & Sources',
    eli5: 'An API is a door that lets one computer program ask another program for information.',
    definition:
      'Application programming interface: the way apps request data from a service. This app uses exchange APIs to get prices.',
    example: 'The app asks Coinbase’s API for the BTC-USD price.',
    related: ['primary-source'],
  },
  {
    id: 'exchange-rate',
    term: 'Exchange rate',
    category: 'Data & Sources',
    eli5: 'An exchange rate says how much of one money you get for another, like how many dollars one euro buys.',
    definition: 'The price of one currency in another. It changes all the time.',
    example: 'If 1 EUR = 1.08 USD, then $108 is €100.',
    related: ['reference-rate', 'fiat'],
  },
  {
    id: 'reference-rate',
    term: 'ECB reference rate',
    category: 'Data & Sources',
    eli5: 'Once a day, Europe’s central bank says how many dollars one euro is worth. The app uses it to turn dollar prices into euros.',
    definition:
      'The European Central Bank’s daily euro exchange rate, published around 16:00 Central European Time on working days. It’s for information; you can’t trade at it.',
    example: 'If 1 EUR = 1.08 USD, a $108 price is €100.',
    related: ['exchange-rate', 'fiat'],
  },
]

export const TERMS_BY_ID: Record<string, Term> = Object.fromEntries(TERMS.map((t) => [t.id, t]))
