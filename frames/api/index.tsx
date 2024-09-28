import { serveStatic } from '@hono/node-server/serve-static'
import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { neynar as neynarHub } from 'frog/hubs'
import { neynar } from "frog/middlewares"
import { createSystem } from 'frog/ui'
import { handle } from 'frog/vercel'
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

// Define the State type
type State = {
  currentQuestionIndex: number;
  points: number;
  counter: number;
  inARow: number;
}

// Initialize the Frog app with the State type and initial state
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

app.frame('/', (c) => {
  return c.res({
    action: '/q',
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
        <Image src='/landing.png'></Image>
      </div>
    ),
    intents: [
      <Button>Start!</Button>,
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
  }
  let mintNext = false;
  if (state.counter == 10) {
    mintNext = true;
    state.counter = 0;
  }

  return c.res({
    action: mintNext ? '/mint' : '/q',
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
        <div>{`${correctAnsewr ? 'Correct!' : 'Incorrect!'}`}</div>
        {!correctAnsewr && <div>{`Correct answer: ${questions[state.currentQuestionIndex].correctAnswer}`}</div>}
        <div>{`${state.points}`}</div>
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
        <Image src='/landing.png'></Image>
      </div>
    ),
    intents: [
      <Button.Link href='https://mint.scroll.io/endless-scroll'>Mint!</Button.Link>,
      <Button action='/q'>Skip</Button>,
    ],
  })
})

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
