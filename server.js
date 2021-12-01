const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment-timezone");

moment.tz.setDefault("Thailand/Bankok");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.all("/", ( req, res, next ) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true); 
	next();
});

app.all("/", ( req, res ) => {
	res.send("Forviz node");
})

const BookingData = [
	{
		"id": 1,
		"roomId": "A101",
		"startTime": "2019-09-28 13:00:00",
		"endTime": "2019-09-28 14:00:00",
		"title": "Lunch with Petr"
	},
	{
		"id": 2,
		"roomId": "A101",
		"startTime": "2019-09-28 14:00:00",
		"endTime": "2019-09-28 15:00:00",
		"title": "Sales Weekly Meeting"
	},
	{
		"id": 3,
		"roomId": "A101",
		"startTime": "2019-09-28 16:00:00",
		"endTime": "2019-09-28 18:00:00",
		"title": "Anastasia Website Warroom"
	},
	{
		"id": 4,
		"roomId": "A101",
		"startTime": "2019-09-29 13:00:00",
		"endTime": "2019-09-29 14:00:00",
		"title": "One-on-One Session"
	},
	{
		"id": 5,
		"roomId": "A101",
		"startTime": "2019-09-29 16:00:00",
		"endTime": "2019-09-29 18:00:00",
		"title": "UGC Sprint Planning"
	},
	{
		"id": 6,
		"roomId": "A102",
		"startTime": "2019-09-30 09:00:00",
		"endTime": "2019-10-04 18:00:00",
		"title": "5-Day Design Sprint Workshop"
	},
	{
		"id": 7,
		"roomId": "Auditorium",
		"startTime": "2019-09-19 09:00:00",
		"endTime": "2019-09-23 19:00:00",
		"title": "Thai Tech Innovation 2019"
	},
	{
		"id": 8,
		"roomId": "A101",
		"startTime": "2019-09-28 10:00:00",
		"endTime": "2019-09-28 13:00:00",
		"title": "Raimonland project"
	},
	{
		"id": 9,
		"roomId": "A102",
		"startTime": "2019-09-30 18:00:00",
		"endTime": "2019-09-30 20:00:00",
		"title": "Management Meetinng"
	},
	{
		"id": 10,
		"roomId": "A101",
		"startTime": "2019-10-04 14:00:00",
		"endTime": "2019-10-06 11:00:00",
		"title": "3-day workshop Corgi costume"
	}
]

app.all("/checkAvailability", ( req, res ) => {

	const a = req.body;

	let oStartTime = moment(a.startTime, 'YYYY-MM-DD hh:mm:ss')
	let oEndTime = moment(a.endTime, 'YYYY-MM-DD hh:mm:ss')

	// console.log(oStartTime)
	// console.log(oEndTime)

	let rs = BookingData.filter((r, i) => {
		let oBookStartTime = moment(r.startTime, 'YYYY-MM-DD hh:mm:ss')
		let oBookEndTime = moment(r.endTime, 'YYYY-MM-DD hh:mm:ss')
		return (
			r.roomId == a.room &&
			(
				oStartTime.isBetween(oBookStartTime, oBookEndTime) ||
				oEndTime.isBetween(oBookStartTime, oBookEndTime) ||
				oBookStartTime.isBetween(oStartTime, oEndTime) ||
				oBookEndTime.isBetween(oStartTime, oEndTime)
			)
		)
	})

	res.send(rs);

})

app.all("/getBookingsForWeek", ( req, res ) => {

	const a = req.body;

	let oToday = moment(a.today, 'YYYY-MM-DD')
	console.log("oToday",oToday)

	let d = {
		thisWeekStart: moment(a.today, 'YYYY-MM-DD').startOf('isoWeek').add(1, 'day'),
		thisWeekEnd: moment(a.today, 'YYYY-MM-DD').endOf('isoWeek'),
		nextWeekStart: moment(a.today, 'YYYY-MM-DD').add(1, 'weeks').startOf('isoWeek').add(1, 'day'),
		nextWeekEnd: moment(a.today, 'YYYY-MM-DD').add(1, 'weeks').endOf('isoWeek'),
		wholeMonthStart: moment(a.today, 'YYYY-MM-DD').startOf('month').add(1, 'day'),
		wholeMonthEnd: moment(a.today, 'YYYY-MM-DD').endOf('month'),
	}

	let BookingsToday = BookingData.filter((r, i) => {
		let oBookStartTime = moment(r.startTime, 'YYYY-MM-DD hh:mm:ss')
		let oBookEndTime = moment(r.endTime, 'YYYY-MM-DD hh:mm:ss')
		return (
			r.roomId == a.room &&
			(
				oBookStartTime.isBetween(oToday.format("YYYY-MM-DD 00:00:00"), oToday.format("YYYY-MM-DD 23:59:59")) ||
				oBookEndTime.isBetween(oToday.format("YYYY-MM-DD 00:00:00"), oToday.format("YYYY-MM-DD 23:59:59"))
			)
		)
	})

	let BookingsThisWeek = BookingData.filter((r, i) => {
		let oBookStartTime = moment(r.startTime, 'YYYY-MM-DD hh:mm:ss')
		let oBookEndTime = moment(r.endTime, 'YYYY-MM-DD hh:mm:ss')
		return (
			r.roomId == a.room &&
			(
				oBookStartTime.isBetween(d.thisWeekStart, d.thisWeekEnd) ||
				oBookEndTime.isBetween(d.thisWeekStart, d.thisWeekEnd)
			)
		)
	})

	let BookingsNextWeek = BookingData.filter((r, i) => {
		let oBookStartTime = moment(r.startTime, 'YYYY-MM-DD hh:mm:ss')
		let oBookEndTime = moment(r.endTime, 'YYYY-MM-DD hh:mm:ss')
		return (
			r.roomId == a.room &&
			(
				oBookStartTime.isBetween(d.nextWeekStart, d.nextWeekEnd) ||
				oBookEndTime.isBetween(d.nextWeekStart, d.nextWeekEnd)
			)
		)
	})

	let BookingsWholeMonth = BookingData.filter((r, i) => {
		let oBookStartTime = moment(r.startTime, 'YYYY-MM-DD hh:mm:ss')
		let oBookEndTime = moment(r.endTime, 'YYYY-MM-DD hh:mm:ss')
		return (
			r.roomId == a.room &&
			(
				oBookStartTime.isBetween(d.wholeMonthStart, d.wholeMonthEnd) ||
				oBookEndTime.isBetween(d.wholeMonthStart, d.wholeMonthEnd)
			)
		)
	})

	console.table(d)

	console.table(BookingsToday)
	console.table(BookingsThisWeek)
	console.table(BookingsNextWeek)
	console.table(BookingsWholeMonth)

	let rs = {
		BookingsToday: BookingsToday,
		BookingsThisWeek: BookingsThisWeek,
		BookingsNextWeek: BookingsNextWeek,
		BookingsWholeMonth: BookingsWholeMonth,
	}

	res.send(rs);

})


let port = 8888;
if( process.env.PORT ){
	port = process.env.PORT;
}

app.listen(port, () => {
    console.log(`Listening at ${port}`);
});