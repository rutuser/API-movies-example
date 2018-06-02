import * as express from 'express';
import * as morgan from 'morgan';
import * as request from 'superagent';
import * as session from 'express-session';
import * as methodOverride from 'method-override';
import * as compression from 'compression';
import * as cors from 'cors';
import * as moviesRouter from './src/api/movies';

const app = express();


const sessionOptions = {
  secret: '1234'
};

function errorHandler(err, req, res, next) {
  if (!err) {
    return next();
  }
  const title = `Error in ${req.method} ${req.url}`;
  // notifier.notify({ title: 'Error', message: title });
  res.status(500).send('Algo se ha roto!');
}

function errorSlack(err, req, res, next) {
  if (!err) {
    return next();
  }
  const messageSlack = { text: `Error in ${req.method} ${req.url}` };
  request.post('SLACK_URL')
    .send(messageSlack)
    .end(error => {
      next(error);
    });
}

function decodeBase64(str) {
  return Buffer.from(str, 'base64').toString()
}

function authentication(req, res, next) {
  if (req.method === 'GET') {
    return next();
  }

  const basicAuth = req.headers.authorization.split(' ')[1];
  const userPassword = decodeBase64(basicAuth).split(':');
  if (userPassword[0] === 'Pepe' && userPassword[1] === 'juan') {
    return next();
  }
  res.status(500).send('Permiso denegado');
}

app.use(cors());
app.use(morgan('combined'));
app.use(compression());
app.use(authentication);
app.use(session(sessionOptions));
app.use(express.json());

app.use('/movies', moviesRouter);

app.get('/', (req: express.Request, res: express.Response) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
    console.log('Welcome');
  }
  console.log('VIEWS', req.session.views);
  res.json({ message: 'Hello world' });
});

if (process.env.NODE_ENV === 'development') {
  app.use(methodOverride());
  app.use(errorHandler);
} else {
  app.use(errorSlack);
}

app.listen(3000, () => {
  console.log('Ready on port 3000!');
});