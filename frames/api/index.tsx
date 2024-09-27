import { serveStatic } from '@hono/node-server/serve-static'
import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { neynar as neynarHub } from 'frog/hubs'
import { neynar } from "frog/middlewares"
import { createSystem } from 'frog/ui'
import { handle } from 'frog/vercel'
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

// Define the State type
type State = {
  openaiResponse: any | null;
  points: number;
}

// Initialize the Frog app with the State type and initial state
export const app = new Frog<{ State: State }>({
  title: 'Endless Scroll',
  hub: neynarHub({ apiKey: 'NEYNAR_FROG_FM' }),
  ui: { vars },
  assetsPath: "/",
  basePath: "/api",
  initialState: {
    openaiResponse: null,
    points: 0
  }
}).use(
  neynar({
    apiKey: "NEYNAR_FROG_FM",
    features: ["interactor", "cast"],
  })
);

app.frame('/', (c) => {
  return c.res({
    action: '/translation',
    image: (
      <div style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        <div>Endless Scroll</div>
      </div>
    ),
    intents: [
      <Button action="/translation">Start learning!</Button>,
    ],
  })
})

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
