import {app} from "./src/app";
app.set('port', process.env.PORT || 8000);

app.listen(app.get('port'), () => {
	console.log(app.get('port'), '번 포트에서 대기중');

});