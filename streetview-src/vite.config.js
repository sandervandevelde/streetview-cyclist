import { defineConfig } from "vite";

import express from "express";
import * as dotevnv from "dotenv";
import cors from "cors";
import helmet from "helmet";

export const userRouter = express.Router();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr:
      process.env.CODESANDBOX_SSE || process.env.GITPOD_WORKSPACE_ID
        ? 443
        : undefined,
  },
});

dotevnv.config();

if (!process.env.PORT) {
    console.log(`No port value specified...`);
}

const PORT = parseInt(process.env.PORT , 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());
app.use(helmet());

app.use('/', userRouter);

app.listen(PORT, () => {
    console.log(`Locahost webserver is listening on port ${PORT}`);
})

let timestamp = -1;

// test coordinates
//let lat = 37.86926; 
//let lon = -122.254811;

// new york 5th avanue
//let lat = 40.74750521592752;
//let lon = -73.98526357003048;

// route 66
//let lat = 36.14417733187105;
//let lon = -96.00325431507174;

// arrizona
let lat = 33.68457960371;
let lon = -111.49962138054569;

app.get("/location", async (req , res ) => {

  // Timestamp Number must change to move the cycle to the next streetview panorama  
  // http://localhost:7000/location?lat=36.14417733187105&lon=-96.00325431507174

    lat = req.query['lat'];
    lon = req.query['lon'];

    console.log(`Location lat: ${lat}; lon: ${lon}`);

    try {
      return res.status(200).json({'lat' : lat, 'lon' : lon})
    } catch (error) {
      return res.status(501).json({error})
    }
});

app.get("/cycle", async (req , res ) => {

  // Timestamp Number must change to move the cycle to the next streetview panorama  
  // http://localhost:7000/cycle?timestamp=42

    timestamp = req.query['timestamp'];

    console.log(`Cycle ${timestamp}`);

    try {
      return res.status(200).json({'timestamp' : timestamp})
    } catch (error) {
      return res.status(501).json({error})
    }
});

app.get("/fetch", async (req , res ) => {

  //  http://localhost:7000/fetch

  console.log(`fetch timestamp ${timestamp}, lat ${lat}, lon ${lon}`);

  try {
    return res.status(200).json({'timestamp': timestamp, 'lat' : lat, 'lon' : lon});
  } catch (error) {
    return res.status(501).json({error});
  }
});