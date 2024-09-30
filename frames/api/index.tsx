import { serveStatic } from '@hono/node-server/serve-static'
import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { neynar as neynarHub } from 'frog/hubs'
import { neynar } from "frog/middlewares"
import { createSystem } from 'frog/ui'
import { handle } from 'frog/vercel'
// import { questions } from '../questions'
import dotenv from 'dotenv'
dotenv.config()

const questions = [
  {
      question: 'Who is a co-founder of Scroll?',
      answers: ['Seung Yoon Lee', 'Sandy Peng', 'Jason Zhao', 'Cecilia Hsueh'],
      correctAnswer: 'Sandy Peng'
  },
  {
      question: 'Which is not EVM compatible?',
      answers: ['Aptos', 'BNB Chain', 'Scroll', 'Metis'],
      correctAnswer: 'Aptos'
  },
  {
      question: 'When was Scroll founded?',
      answers: ['2019', '2020', '2021', '2022'],
      correctAnswer: '2021'
  },
  {
      question: 'Who is a co-founder of Alchemy?',
      answers: ['Stani Kulechov', 'Anatoly Yakovenko', 'Raj Gokal', 'Nikil Viswanathan'],
      correctAnswer: 'Nikil Viswanathan'
  },
  {
      question: 'What is the native token of Ethereum?',
      answers: ['ETH', 'BTC', 'SOL', 'BNB'],
      correctAnswer: 'ETH'
  },
  {
      question: 'Which consensus algorithm does Ethereum use after "The Merge"?',
      answers: ['Proof of Work', 'Proof of Stake', 'Proof of History', 'Proof of Authority'],
      correctAnswer: 'Proof of Stake'
  },
  {
      question: 'What is a zk-Rollup?',
      answers: ['New consensus algorithm', 'L2 scaling solution', 'NFT platform', 'Cross-chain bridge'],
      correctAnswer: 'L2 scaling solution'
  },
  {
      question: 'Which of the following is a zk-Rollup project?',
      answers: ['StarkNet', 'Solana', 'Avalanche', 'Arbitrum'],
      correctAnswer: 'StarkNet'
  },
  {
      question: 'Which of the following is a decentralized oracle provider?',
      answers: ['Uniswap', 'Aave', 'Chainlink', 'Polygon'],
      correctAnswer: 'Chainlink'
  },
  {
      question: 'What is Ethereum’s programming language?',
      answers: ['Rust', 'Solidity', 'JavaScript', 'Go'],
      correctAnswer: 'Solidity'
  },
  {
      question: 'Which is a blockchain explorer for Ethereum?',
      answers: ['Etherscan', 'CoinMarketCap', 'Binance', 'CoinGecko'],
      correctAnswer: 'Etherscan'
  },
  {
      question: 'Which layer is Scroll categorized under?',
      answers: ['Layer 1', 'Layer 2', 'Layer 3', 'Layer 0'],
      correctAnswer: 'Layer 2'
  },
  {
      question: 'Which Ethereum upgrade introduced staking?',
      answers: ['The Merge', 'London Hard Fork', 'Constantinople', 'Beacon Chain'],
      correctAnswer: 'Beacon Chain'
  },
  {
      question: 'What does zk in zk-Rollup stand for?',
      answers: ['Zero Knowledge', 'Zonal Kernel', 'Zero Keys', 'Zone Keeper'],
      correctAnswer: 'Zero Knowledge'
  },
  {
      question: 'What is the block time on Ethereum after the merge?',
      answers: ['15 seconds', '10 minutes', '5 minutes', '1 second'],
      correctAnswer: '15 seconds'
  },
  {
      question: 'What is Uniswap?',
      answers: ['CEX', 'A Layer 2 solution', 'DEX', 'Ethereum wallet'],
      correctAnswer: 'DEX'
  },
  {
      question: 'What is MEV?',
      answers: ['Maximum Extractable Value', 'Minimum Exchange Volume', 'Medium Economic Volume', 'Maximized Ethereum Volatility'],
      correctAnswer: 'Maximum Extractable Value'
  },
  {
      question: 'What is the token standard for NFTs on Ethereum?',
      answers: ['ERC-20', 'ERC-1155', 'ERC-721', 'ERC-998'],
      correctAnswer: 'ERC-721'
  },
  {
      question: 'Who founded Ethereum?',
      answers: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Stani Kulechov', 'Hayden Adams'],
      correctAnswer: 'Vitalik Buterin'
  },
  {
      question: 'Which Ethereum Improvement Proposal (EIP) introduced fee burning?',
      answers: ['EIP-1559', 'EIP-721', 'EIP-20', 'EIP-2981'],
      correctAnswer: 'EIP-1559'
  },
  {
      question: 'What is ENS?',
      answers: ['Ethereum Name Service', 'Ether Network Switch', 'Ethereum Notification System', 'Enterprise Node Service'],
      correctAnswer: 'Ethereum Name Service'
  },
  {
      question: 'What does Solidity compile down to?',
      answers: ['Bytecode', 'Python', 'Rust', 'WebAssembly'],
      correctAnswer: 'Bytecode'
  },
  {
      question: 'Which blockchain uses a different virtual machine than Ethereum?',
      answers: ['Solana', 'Arbitrum', 'Optimism', 'Scroll'],
      correctAnswer: 'Solana'
  },
  {
      question: 'Which token standard is used for fungible tokens on Ethereum?',
      answers: ['ERC-20', 'ERC-721', 'ERC-1155', 'ERC-998'],
      correctAnswer: 'ERC-20'
  },
  {
      question: 'Which is a L1 blockchain?',
      answers: ['Aptos', 'Optimism', 'Scroll', 'Metis'],
      correctAnswer: 'Aptos'
  },
  {
      question: 'What is the main advantage of a zk-Rollup over an Optimistic Rollup?',
      answers: ['Lower fees', 'Faster finality', 'Higher throughput', 'Better security'],
      correctAnswer: 'Faster finality'
  },
  {
      question: 'What is gas in the context of Ethereum?',
      answers: ['A type of token', 'Transaction fee', 'Consensus mechanism', 'Smart contract language'],
      correctAnswer: 'Transaction fee'
  },
  {
      question: 'What is the purpose of a validator?',
      answers: ['To mine blocks', 'To process transactions', 'To validate transactions', 'To store data'],
      correctAnswer: 'To validate transactions'
  },
  {
      question: 'Which of the following is a Layer 2 solution?',
      answers: ['Ethereum', 'Aptos', 'BNB Chain', 'Scroll'],
      correctAnswer: 'Scroll'
  }
]

const { Image, vars } = createSystem({
  fonts: {
    default: [
      {
        name: 'Poppins',
        source: 'google',
        weight: 400,
      }
    ],
    manrope: [
      {
        name: 'Poppins',
        source: 'google',
        weight: 700,
      },
      {
        name: 'Poppins',
        source: 'google',
        weight: 500
      }
    ],
  },
  colors: {
    white: '#FFFFFF',
    green: '#58CC02',
    blue: '#2e6cbf',
    red: '#892827'
  }
})

type State = {
  currentQuestionIndex: number;
  points: number;
  counter: number;
  inARow: number;
}

export const app = new Frog<{ State: State }>({
  title: 'Endless Scroll',
  hub: neynarHub({ apiKey: 'NEYNAR_FROG_FM' }),
  ui: { vars },
  assetsPath: "/",
  basePath: "/api",
  initialState: {
    currentQuestionIndex: 0,
    points: 0,
    counter: 0,
    inARow: 0,
  }
}).use(
  neynar({
    apiKey: "NEYNAR_FROG_FM",
    features: ["interactor", "cast"],
  })
);

app.frame('/start', (c) => {
  return c.res({
    image: (
      <div style={{
        display: 'flex',
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Image src={`/landing.png`}></Image>
      </div>
    ),
    intents: [
      <Button action='/q'>Start!</Button>,
    ],
  })
})

app.frame('/q', (c) => {
  const { deriveState } = c;
  const questionIndex = Math.floor(Math.random() * questions.length);
  const question = questions[questionIndex];
  const state = deriveState(() => { });
  state.currentQuestionIndex = questionIndex;
  state.counter += 1;

  return c.res({
    action: '/a',
    image: (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fef1dd',
        color: 'black',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        fontSize: '50px',
        fontWeight: 500,
        fontFamily: 'Poppins, sans-serif',
        padding: '70px',
      }}>
        <div style={{ fontWeight: 600, marginBottom: '30px' }}>{`${question.question}`}</div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
          marginLeft: '40px',
        }}>
          {question.answers.map((answer, index) => (
            <div style={{ fontSize: '40px' }} key={index}>{`${String.fromCharCode(97 + index)}) ${answer}`}</div>
          ))}
        </div>
      </div>
    ),
    intents: [
      <Button value={question.answers[0]}>a</Button>,
      <Button value={question.answers[1]}>b</Button>,
      <Button value={question.answers[2]}>c</Button>,
      <Button value={question.answers[3]}>d</Button>,
    ],
  })
})

app.frame('/a', (c) => {
  const { buttonValue } = c;
  const { deriveState } = c;
  const state = deriveState(() => { });
  const correctAnsewr = questions[state.currentQuestionIndex].correctAnswer == buttonValue;
  if (correctAnsewr) {
    state.points += 100;
    state.inARow += 1;
  } else {
    state.inARow = 0;
  }
  let mintNext = false;
  if (state.counter % 10 == 0) {
    mintNext = true;
    state.counter = 0;
  }

  return c.res({
    action: state.inARow == 7 ? '/7' : mintNext ? '/mint' : '/q',
    image: (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fef1dd',
        color: 'black',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        fontSize: '50px',
        fontWeight: 500,
        fontFamily: 'Poppins, sans-serif',
        padding: '70px',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '100px', fontWeight: 600, marginTop: '160px' }}>{`${correctAnsewr ? 'Correct!' : 'Incorrect'}`}</div>
        {!correctAnsewr &&
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '60px', alignItems: 'center' }}>
            <div style={{ fontSize: '30px', marginTop: '-5px' }}>Correct answer:</div>
            <div style={{ fontWeight: 600, marginTop: '-2px', fontSize: '50px' }}>{questions[state.currentQuestionIndex].correctAnswer}</div>
          </div>
        }
        <div style={{ fontSize: '40px', marginTop: '10px' }}>{`Points: ${state.points}`}</div>
      </div>
    ),
    intents: [
      <Button>Next</Button>,
    ],
  })
})

app.frame('/mint', (c) => {
  return c.res({
    image: (
      <div style={{
        display: 'flex',
        backgroundColor: 'black',
        color: 'white',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '50px',
        fontWeight: 500,
        fontFamily: 'Poppins, sans-serif',
      }}>
        <Image src='/mint.png'></Image>
      </div>
    ),
    intents: [
      <Button.Link href='https://mint.scroll.io/endless-scroll'>Mint!</Button.Link>,
      <Button action='/q'>Next</Button>,
    ],
  })
})

app.frame('/7', (c) => {
  return c.res({
    image: (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fef1dd',
        color: 'black',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '70px',
        fontWeight: 600,
        fontFamily: 'Poppins, sans-serif',
      }}>
        <div>{`You got 7 in a row!`}</div>
        <div style={{ fontSize: '40px', fontWeight: 500 }}>{`Share this with your friends!`}</div>
      </div>
    ),
    intents: [
      <Button.Link href='https://warpcast.com/~/compose?text=I%20have%20a%207-question%20streak%20on%20Endless%20Scroll!%20%F0%9F%93%9C&embeds[]=https://farcaster.xyz'>Share</Button.Link>,
      <Button action='/q'>Next</Button>,
    ],
  })
})

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
