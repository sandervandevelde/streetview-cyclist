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

app.get("/cycle", async (req , res ) => {

  // Timestamp Number must change to move the cycle to the next streetview panorama  
  // http://localhost:7000/cycle?timestamp=42

    timestamp = req.query['timestamp'];

    try {
      return res.status(200).json({'timestamp' : timestamp})
    } catch (error) {
      return res.status(501).json({error})
    }
});

app.get("/fetch", async (req , res ) => {

  //  http://localhost:7000/fetch

    console.log(`fetch timestamp ${timestamp}`);

    try {
      return res.status(200).json({'timestamp' : timestamp});
    } catch (error) {
      return res.status(501).json({error});
    }
});


