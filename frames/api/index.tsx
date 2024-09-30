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

// type State = {
//   currentQuestionIndex: number;
//   points: number;
//   counter: number;
//   inARow: number;
// }

export const app = new Frog({
  title: 'Endless Scroll',
  hub: neynarHub({ apiKey: 'NEYNAR_FROG_FM' }),
  ui: { vars },
  assetsPath: "/",
  basePath: "/api",
  // initialState: {
  //   currentQuestionIndex: 0,
  //   points: 0,
  //   counter: 0,
  //   inARow: 0,
  // }
}).use(
  neynar({
    apiKey: "NEYNAR_FROG_FM",
    features: ["interactor", "cast"],
  })
);

app.frame('/gm', (c) => {
  return c.res({
    action: '/q',
    image: (
      <div> 
        {`Hello`}
      </div>
    ),
    intents: [
      <Button>Start!</Button>,
    ],
  })
})




// app.frame('/', (c) => {
//   return c.res({
//     action: '/q',
//     image: (
//       <div style={{
//         display: 'flex',
//         backgroundColor: 'black',
//         color: 'white',
//         width: '100%',
//         height: '100%',
//         overflow: 'hidden',
//         justifyContent: 'center',
//         alignItems: 'center',
//         fontSize: '50px',
//         fontWeight: 500,
//         fontFamily: 'Poppins, sans-serif',
//       }}>
//         <Image src='/landing.png'></Image>
//       </div>
//     ),
//     intents: [
//       <Button>Start!</Button>,
//     ],
//   })
// })

// app.frame('/q', (c) => {
//   const { deriveState } = c;
//   const questionIndex = Math.floor(Math.random() * questions.length);
//   const question = questions[questionIndex];
//   const state = deriveState(() => { });
//   state.currentQuestionIndex = questionIndex;
//   state.counter += 1;

//   return c.res({
//     action: '/a',
//     image: (
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         backgroundColor: '#fef1dd',
//         color: 'black',
//         width: '100%',
//         height: '100%',
//         overflow: 'hidden',
//         fontSize: '50px',
//         fontWeight: 500,
//         fontFamily: 'Poppins, sans-serif',
//         padding: '70px',
//       }}>
//         <div style={{ fontWeight: 600, marginBottom: '30px' }}>{`${question.question}`}</div>
//         <div style={{
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '20px',
//           width: '100%',
//           marginLeft: '40px',
//         }}>
//           {question.answers.map((answer, index) => (
//             <div style={{ fontSize: '40px' }} key={index}>{`${String.fromCharCode(97 + index)}) ${answer}`}</div>
//           ))}
//         </div>
//       </div>
//     ),
//     intents: [
//       <Button value={question.answers[0]}>a</Button>,
//       <Button value={question.answers[1]}>b</Button>,
//       <Button value={question.answers[2]}>c</Button>,
//       <Button value={question.answers[3]}>d</Button>,
//     ],
//   })
// })

// app.frame('/a', (c) => {
//   const { buttonValue } = c;
//   const { deriveState } = c;
//   const state = deriveState(() => { });
//   const correctAnsewr = questions[state.currentQuestionIndex].correctAnswer == buttonValue;
//   if (correctAnsewr) {
//     state.points += 100;
//     state.inARow += 1;
//   } else {
//     state.inARow = 0;
//   }
//   let mintNext = false;
//   if (state.counter % 10 == 0) {
//     mintNext = true;
//     state.counter = 0;
//   }

//   return c.res({
//     action: state.inARow == 7 ? '/7' : mintNext ? '/mint' : '/q',
//     image: (
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         backgroundColor: '#fef1dd',
//         color: 'black',
//         width: '100%',
//         height: '100%',
//         overflow: 'hidden',
//         fontSize: '50px',
//         fontWeight: 500,
//         fontFamily: 'Poppins, sans-serif',
//         padding: '70px',
//         alignItems: 'center',
//       }}>
//         <div style={{ fontSize: '100px', fontWeight: 600, marginTop: '160px' }}>{`${correctAnsewr ? 'Correct!' : 'Incorrect'}`}</div>
//         {!correctAnsewr &&
//           <div style={{ display: 'flex', flexDirection: 'column', fontSize: '60px', alignItems: 'center' }}>
//             <div style={{ fontSize: '30px', marginTop: '-5px' }}>Correct answer:</div>
//             <div style={{ fontWeight: 600, marginTop: '-2px', fontSize: '50px' }}>{questions[state.currentQuestionIndex].correctAnswer}</div>
//           </div>
//         }
//         <div style={{ fontSize: '40px', marginTop: '10px' }}>{`Points: ${state.points}`}</div>
//       </div>
//     ),
//     intents: [
//       <Button>Next</Button>,
//     ],
//   })
// })

// app.frame('/mint', (c) => {
//   return c.res({
//     image: (
//       <div style={{
//         display: 'flex',
//         backgroundColor: 'black',
//         color: 'white',
//         width: '100%',
//         height: '100%',
//         overflow: 'hidden',
//         justifyContent: 'center',
//         alignItems: 'center',
//         fontSize: '50px',
//         fontWeight: 500,
//         fontFamily: 'Poppins, sans-serif',
//       }}>
//         <Image src='/mint.png'></Image>
//       </div>
//     ),
//     intents: [
//       <Button.Link href='https://mint.scroll.io/endless-scroll'>Mint!</Button.Link>,
//       <Button action='/q'>Next</Button>,
//     ],
//   })
// })

// app.frame('/7', (c) => {
//   return c.res({
//     image: (
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         backgroundColor: '#fef1dd',
//         color: 'black',
//         width: '100%',
//         height: '100%',
//         overflow: 'hidden',
//         justifyContent: 'center',
//         alignItems: 'center',
//         fontSize: '70px',
//         fontWeight: 600,
//         fontFamily: 'Poppins, sans-serif',
//       }}>
//         <div>{`You got 7 in a row!`}</div>
//         <div style={{ fontSize: '40px', fontWeight: 500 }}>{`Share this with your friends!`}</div>
//       </div>
//     ),
//     intents: [
//       <Button.Link href='https://warpcast.com/~/compose?text=I%20have%20a%207-question%20streak%20on%20Endless%20Scroll!%20%F0%9F%93%9C&embeds[]=https://farcaster.xyz'>Share</Button.Link>,
//       <Button action='/q'>Next</Button>,
//     ],
//   })
// })

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
