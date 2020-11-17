//CODE DEVELOPED FOLLOWING TUTORIAL LOCATED AT
//https://www.youtube.com/watch?v=l2wTSopPv0Q
//CREDIT KETAN MAYER-PATEL 

const exp = require('express');


const expressApp = exp();
const expressSession = require('express-session');
const cors = require('cors');

const meeting = require('./meeting.js');

const bParse = require('body-parser');
expressApp.use(bParse.urlencoded({
    extended: true
}));

expressApp.use(bParse.json());
expressApp.use(expressSession({
    secret: "superdupersecret",
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: false,
    name: "SessionCookie",
}));
expressApp.use(cors({credentials: true, origin: "http://localhost:3000"}));

const store = require('data-store')({ path: process.cwd() + '/data/logins.json' });

//SETUP ABOVE//

expressApp.get('/meeting', (req, res) => {
    if(req.session.user == undefined){
        res.status(403).send("No Login");
        return;
    }
    res.json(meeting.getIDS(req.session.user));
    return;
});

expressApp.get('/userInfo', (req, res) => {
    if(req.session.user == undefined){
        res.status(403).send("No Login");
        return;
    }
    res.json(store.get(req.session.user));
    return;
});


expressApp.get('/meeting/:id', (req, res) => {
    if(req.session.user == undefined){
        res.status(403).send("No Login");
        return;
    }
    
    let m = meeting.findByID(req.params.id);
    if (m == null) {
        res.status(404).send(`No Meeting with ID ${req.params.id}`);
        return;
    }

    res.json(m);
} );

expressApp.get('/meetingNames', (req, res) => {
    if(req.session.user == undefined){
        res.status(403).send("No Login");
        return;
    }
    
    let m = meeting.getNames();
    if (m == null) {
        res.status(404).send(`No Meetings`);
        return;
    }

    res.json(m);
} );

expressApp.post('/meeting', (req, res) => {
    if(req.session.user == undefined){
        res.status(403).send("No Login");
        return;
    }

    let {className, time, date, attendees, location, desc, comments} = req.body;
    let owner = req.session.user;

    let meet = meeting.create(className, time, date, attendees, location, owner, desc, comments);
    if(meet == null){
        res.status(400).send("Improper Request. Check Parameters.");
        return;
    }
    return res.json(meet);
})

expressApp.post('/meeting/join/:id', (req, res) => {
    if(req.session.user == undefined){
        res.status(403).send("No Login");
        return;
    }
    
    let m = meeting.findByID(req.params.id);

    if(m == null){
        res.status(404).send("Meeting not found");
        return;
    }

    if(m.attendees.find((person) => person == req.session.user) != null){
        res.status(403).send("Already Part of meeting.");
        return;
    } else {
        m.attendees.push(req.session.user);
        m.update();
        let p = store.get(req.session.user);
        p.meetings.push(m.id);
        store.set(req.session.user, p);
        res.json(true);
    }

})

expressApp.post('/meeting/comment/:id', (req, res) => {
    if(req.session.user == undefined){
        res.status(403).send("No Login");
        return;
    }
    
    let m = meeting.findByID(req.params.id);

    if(m == null){
        res.status(404).send("Meeting not found");
        return;
    }

    if(req.body.comment == undefined){
        res.status(404).send("No comment specified");
    }
        m.comments.push(req.body.comment);
        m.update();

        res.json(true);
})

expressApp.put('/meeting/:id', (req, res) => {
    if(req.session.user == undefined){
        res.status(403).send("No Login");
    }

    let m = meeting.findByID(req.params.id);
    if (m == null) {
        res.status(404).send(`No Meeting with ID ${req.params.id}`);
        return;
    }

    if (m.owner != req.session.user){
        res.status(403).send("Not owner of this Meeting");
        return;
    }

    let {className, time, date, attendees, location, desc, comments} = req.body;
    m.className = className;
    m.time = time;
    m.date = date;
    m.attendees = attendees;
    m.location = location;
    m.desc = desc;
    m.comments = comments;

    m.update();

    res.json(m);
})

expressApp.delete('/meeting/:id', (req, res) => {
    if(req.session.user == undefined){
        res.status(403).send("No Login");
        return;
    }
    let m = meeting.findByID(req.params.id);

    if (m.owner != req.session.user){
        res.status(403).send("Not owner of this Meeting");
        return;
    }
    
    if (m == null) {
        res.status(404).send(`No Meeting with id ${req.params.id}`);
        return;
    }
    m.delete();
    res.json(true);
})



expressApp.post('/login', (req, res) => {

    let user = req.body.user;
    let password = req.body.password;

    let USD = store.get(user);

    if (USD == null){
        res.status(404).send("No user by this name.")
        return;
    }
    if(USD.password == password){
        req.session.user = user;
        res.json(true);
        return;
    } else {
        res.status(403).send("Incorrect Password");
    }
})

expressApp.post('/signup', (req, res) => {
    let user = req.body.user;
    let password = req.body.password;
    let meetings = [];

    let USD = store.get(user);

    if (USD != null){
        res.status(404).send("User Already Exists!")
        return;
    } else {
        store.set(user, {user, password, meetings});
        res.json(true);
    }
})


expressApp.get('/logout', (req, res) => {
    delete req.session.user;
    res.json(true);
})

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3030;
}
expressApp.listen(port, function(){
    //console.log("Running on 3030.");
})