require('./db/mongoose');
const cors = require('cors');
const express = require('express');
const userRouter = require('./router/user');
const driverRouter = require('./router/driver');
const taskRouter = require('./router/task');
const jobRouter = require('./router/jobs');

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [ 
	'http://localhost:3000',
	'https://www.000webhost.com/members/website/houtarou-angular'
];

// middleware
app.enable( 'trust proxy' );
// cross domain
app.use( cors( {
	origin: function( origin, callback ) {
	if ( !origin ) return callback( null, true );
		if ( allowedOrigins.indexOf( origin ) === -1 ) {
			var msg = 'The CORS policy for this site does not allow access from the specified Origin. (  ' + origin + '  )';
			return callback( new Error( msg ), false );
		}
		return callback( null, true );
	}
}));

app.use(express.json());
app.use(userRouter, driverRouter, taskRouter, jobRouter);

app.listen(port, () => {
    console.log("server is up on port", port);
})